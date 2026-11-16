using System;
using System.Collections.Generic;
using System.DirectoryServices;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using mobile_backend.Data;
using mobile_backend.DTOs;
using mobile_backend.Models;

namespace mobile_backend.Services
{
    public class UserService(AppDbContext db) : IUserService
    {
        public async Task<StreakDto> GetUserStreakAsync(string username)
        {
            var dates = await db.UserActivities
                .Where(a => a.Username == username)
                .OrderByDescending(a => a.ActivityDate)
                .Select(a => a.ActivityDate)
                .ToListAsync();

            var streak = await StreakService.CalculateStreakAsync(username, db);
            return new StreakDto(streak, [.. dates.Select(d => d.ToString("yyyy-MM-dd"))]);
        }

        public async Task<ReadActivityDto> RecordActivityAsync(string username)
        {
            var today = DateTime.UtcNow.AddHours(8).Date;
            var alreadyRecorded = await db.UserActivities
                .AnyAsync(a => a.Username == username && a.ActivityDate == today);

            if (!alreadyRecorded)
            {
                db.UserActivities.Add(new UserActivity
                {
                    Username = username,
                    ActivityDate = today
                });
                await db.SaveChangesAsync();
            }

            var streak = await StreakService.CalculateStreakAsync(username, db);
            return new ReadActivityDto(streak, !alreadyRecorded);
        }

        public async Task<List<UserProfileDto>> GetAllUsersAsync()
        {
            var users = await db.StaffUsers
                .AsNoTracking()
                .Where(u => u.Division != "DELETED" && !u.Email.StartsWith("deleted_"))
                .OrderBy(u => u.FullName)
                .ToListAsync();

            return [.. users.Select(u => new UserProfileDto(
                u.Id,
                u.FullName,
                u.PreferredName,
                u.Email,
                u.Division,
                u.StaffId,
                u.ProfilePicture,
                u.Role,
                u.CreatedAt
            ))];
        }

        public async Task<UserProfileDto?> GetUserProfileAsync(string username)
        {
            var staff = await FindStaffUserAsync(username);
            if (staff == null) return null;

            return new UserProfileDto(
                staff.Id,
                staff.FullName,
                staff.PreferredName,
                staff.Email,
                staff.Division,
                staff.StaffId,
                staff.ProfilePicture,
                staff.Role,
                staff.CreatedAt
            );
        }

        public async Task<bool> UpdatePreferredNameAsync(string username, string preferredName)
        {
            var trimmed = (preferredName ?? "").Trim();
            if (trimmed.Length > 10) trimmed = trimmed[..10];

            var staff = await FindStaffUserAsync(username);
            if (staff != null)
            {
                staff.PreferredName = trimmed;
            }

            var answers = await db.UserAnswers.Where(a => a.Username == username).ToListAsync();
            foreach (var ans in answers)
            {
                ans.PreferredName = trimmed;
            }

            await db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateProfilePictureAsync(string username, string profilePicture)
        {
            var staff = await FindStaffUserAsync(username);
            if (staff == null) return false;

            staff.ProfilePicture = profilePicture ?? "";
            await db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateUserRoleAsync(int id, string role)
        {
            var user = await db.StaffUsers.FindAsync(id);
            if (user == null) return false;

            if (string.Equals(user.Email, "azibdanish66@gmail.com", StringComparison.OrdinalIgnoreCase) && role != "Admin")
                return false;

            if (user.Role == "Admin" && role == "Staff")
            {
                var adminCount = await db.StaffUsers.CountAsync(u => u.Role == "Admin");
                if (adminCount <= 1) return false;
            }

            user.Role = role;
            await db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = await db.StaffUsers.FindAsync(id);
            if (user == null) return false;

            if (string.Equals(user.Email, "azibdanish66@gmail.com", StringComparison.OrdinalIgnoreCase))
                return false;

            user.Division = "DELETED";
            user.Email = $"deleted_{DateTime.UtcNow.Ticks}_{user.Email}";
            user.FullName = user.FullName.StartsWith("[deleted user]") ? user.FullName : $"[deleted user] {user.FullName}";
            user.PreferredName = "";
            await db.SaveChangesAsync();
            return true;
        }

        public async Task<AuthResponseDto?> LoginAsync(string email, string password)
        {
            var identifier = (email ?? "").Trim();
            if (string.IsNullOrWhiteSpace(identifier) || string.IsNullOrEmpty(password))
                return null;

            // 1. Fast path: check existing StaffUsers record by Email, StaffId, or PreferredName
            var existingUser = await db.StaffUsers.FirstOrDefaultAsync(u =>
                u.Division != "DELETED" &&
                (u.Email == identifier || u.StaffId == identifier || u.PreferredName == identifier) &&
                u.PasswordHash == password);

            if (existingUser != null)
            {
                if (string.Equals(existingUser.Email, "azibdanish66@gmail.com", StringComparison.OrdinalIgnoreCase) && existingUser.Role != "Admin")
                {
                    existingUser.Role = "Admin";
                    await db.SaveChangesAsync();
                }

                return new AuthResponseDto(
                    existingUser.Id,
                    existingUser.FullName,
                    existingUser.PreferredName,
                    existingUser.Email,
                    existingUser.Division,
                    existingUser.StaffId,
                    existingUser.ProfilePicture,
                    existingUser.Role
                );
            }

            // 2. Active Directory (LDAP://sesb.internal) authentication & auto-provisioning
            var adProfile = TryAuthenticateActiveDirectory(identifier, password);
            if (adProfile == null)
                return null;

            var adStaffId = adProfile.Value.StaffId;
            var adEmail = adProfile.Value.Email;
            var adFullName = adProfile.Value.FullName;
            var adDivision = adProfile.Value.Division;

            var existing = await db.StaffUsers.FirstOrDefaultAsync(u =>
                u.Division != "DELETED" &&
                ((!string.IsNullOrEmpty(adStaffId) && u.StaffId == adStaffId) ||
                 (!string.IsNullOrEmpty(adEmail) && u.Email == adEmail) ||
                 u.Email == identifier ||
                 u.StaffId == identifier));

            if (existing != null)
            {
                if (string.IsNullOrWhiteSpace(existing.FullName) && !string.IsNullOrWhiteSpace(adFullName))
                    existing.FullName = adFullName;
                if (string.IsNullOrWhiteSpace(existing.StaffId) && !string.IsNullOrWhiteSpace(adStaffId))
                    existing.StaffId = adStaffId;
                if (string.IsNullOrWhiteSpace(existing.Division) && !string.IsNullOrWhiteSpace(adDivision))
                    existing.Division = adDivision;
                if (string.IsNullOrWhiteSpace(existing.Email) && !string.IsNullOrWhiteSpace(adEmail))
                    existing.Email = adEmail;
                existing.PasswordHash = password;
                await db.SaveChangesAsync();

                return new AuthResponseDto(
                    existing.Id,
                    existing.FullName,
                    existing.PreferredName,
                    existing.Email,
                    existing.Division,
                    existing.StaffId,
                    existing.ProfilePicture,
                    existing.Role
                );
            }

            var firstWord = (adFullName.Split(' ', StringSplitOptions.RemoveEmptyEntries).FirstOrDefault() ?? adStaffId).Trim();
            if (firstWord.Length > 10) firstWord = firstWord[..10];

            var created = new StaffUser
            {
                FullName = adFullName,
                PreferredName = firstWord,
                Email = !string.IsNullOrWhiteSpace(adEmail) ? adEmail : $"{adStaffId}@sesb.com.my",
                PasswordHash = password,
                Division = !string.IsNullOrWhiteSpace(adDivision) ? adDivision : "General",
                StaffId = adStaffId,
                ProfilePicture = "",
                Role = "Staff",
                CreatedAt = DateTime.UtcNow
            };

            db.StaffUsers.Add(created);
            await db.SaveChangesAsync();

            return new AuthResponseDto(
                created.Id,
                created.FullName,
                created.PreferredName,
                created.Email,
                created.Division,
                created.StaffId,
                created.ProfilePicture,
                created.Role
            );
        }

        private static (string StaffId, string FullName, string Email, string Division)? TryAuthenticateActiveDirectory(string loginId, string password)
        {
            if (!OperatingSystem.IsWindows())
                return null;

            const string domainName = "sesb.internal";
            var cleanAccount = loginId.Trim();
            if (cleanAccount.Contains('\\'))
                cleanAccount = cleanAccount.Split('\\').Last();
            else if (cleanAccount.Contains('@'))
                cleanAccount = cleanAccount.Split('@').First();

            // Single canonical bind to avoid multiple failed attempts against AD lockout policies
            var bindUser = loginId.Contains('\\') || loginId.EndsWith($"@{domainName}", StringComparison.OrdinalIgnoreCase)
                ? loginId.Trim()
                : $"{cleanAccount}@{domainName}";

            try
            {
                using var entry = new DirectoryEntry($"LDAP://{domainName}", bindUser, password, AuthenticationTypes.Secure);
                // Force LDAP bind check (mirrors adConn.Open "DS Query" in login.asp)
                _ = entry.NativeObject;

                var escapedAccount = EscapeLdapFilterValue(cleanAccount);
                var escapedLogin = EscapeLdapFilterValue(loginId.Trim());

                using var searcher = new DirectorySearcher(entry)
                {
                    Filter = $"(&(objectCategory=user)(|(sAMAccountName={escapedAccount})(userPrincipalName={escapedLogin})(mail={escapedLogin})))",
                    PageSize = 1
                };
                searcher.PropertiesToLoad.AddRange(["cn", "displayName", "mail", "userPrincipalName", "department", "company", "sAMAccountName", "employeeID"]);

                var result = searcher.FindOne();
                var staffId = GetAdProp(result, "sAMAccountName") ?? GetAdProp(result, "employeeID") ?? cleanAccount;
                var fullName = GetAdProp(result, "displayName") ?? GetAdProp(result, "cn") ?? staffId;
                var email = GetAdProp(result, "mail") ?? GetAdProp(result, "userPrincipalName") ?? (loginId.Contains('@') ? loginId : $"{staffId}@sesb.com.my");
                var division = GetAdProp(result, "department") ?? GetAdProp(result, "company") ?? "General";

                return (staffId.Trim(), fullName.Trim(), email.Trim().ToLowerInvariant(), division.Trim());
            }
            catch
            {
                return null;
            }
        }

        [System.Runtime.Versioning.SupportedOSPlatform("windows")]
        private static string? GetAdProp(SearchResult? result, string propName)
        {
            if (result == null || !result.Properties.Contains(propName))
                return null;
            var col = result.Properties[propName];
            if (col == null || col.Count == 0 || col[0] == null)
                return null;
            var val = col[0].ToString()?.Trim();
            return string.IsNullOrWhiteSpace(val) ? null : val;
        }

        private static string EscapeLdapFilterValue(string value)
        {
            return value
                .Replace("\\", "\\5c")
                .Replace("*", "\\2a")
                .Replace("(", "\\28")
                .Replace(")", "\\29")
                .Replace("\0", "\\00");
        }

        public async Task<AuthResponseDto?> SignupAsync(StaffUser newUser)
        {
            if (await db.StaffUsers.AnyAsync(u => u.Email == newUser.Email))
                return null;

            db.StaffUsers.Add(newUser);
            await db.SaveChangesAsync();

            return new AuthResponseDto(
                newUser.Id,
                newUser.FullName,
                newUser.PreferredName,
                newUser.Email,
                newUser.Division,
                newUser.StaffId,
                newUser.ProfilePicture,
                newUser.Role
            );
        }

        private Task<StaffUser?> FindStaffUserAsync(string? target)
        {
            var key = (target ?? "").Trim();
            return db.StaffUsers.FirstOrDefaultAsync(u =>
                u.Email == key ||
                u.FullName == key);
        }
    }
}
