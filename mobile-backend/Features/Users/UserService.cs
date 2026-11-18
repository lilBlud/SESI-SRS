using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using mobile_backend.Data;
using mobile_backend.DTOs;
using mobile_backend.Models;

namespace mobile_backend.Services
{
    public class UserService(AppDbContext db, IConfiguration? config = null) : IUserService
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

            return [.. users
                .Where(u => !AccountExclusionPolicy.IsDeleted(u))
                .Select(ToUserProfileDto)];
        }

        public async Task<UserProfileDto?> GetUserProfileAsync(string username)
        {
            var staff = await FindStaffUserAsync(username);
            return staff == null ? null : ToUserProfileDto(staff);
        }

        public async Task<bool> UpdatePreferredNameAsync(string username, string preferredName)
        {
            var trimmed = (preferredName ?? "").Trim();
            if (trimmed.Length > 10) trimmed = trimmed[..10];

            var staff = await FindStaffUserAsync(username);
            var targetSet = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            if (!string.IsNullOrWhiteSpace(username)) targetSet.Add(username.Trim());
            if (staff != null)
            {
                if (!string.IsNullOrWhiteSpace(staff.FullName)) targetSet.Add(staff.FullName.Trim());
                if (!string.IsNullOrWhiteSpace(staff.PreferredName)) targetSet.Add(staff.PreferredName.Trim());
                if (!string.IsNullOrWhiteSpace(staff.Email)) targetSet.Add(staff.Email.Trim());
                if (!string.IsNullOrWhiteSpace(staff.StaffId)) targetSet.Add(staff.StaffId.Trim());
                staff.PreferredName = trimmed;
            }

            if (targetSet.Count > 0)
            {
                var targets = targetSet.ToList();
                var answers = await db.UserAnswers
                    .Where(a => targets.Contains(a.Username) || targets.Contains(a.PreferredName))
                    .ToListAsync();
                foreach (var ans in answers)
                {
                    ans.PreferredName = trimmed;
                }
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
            if (user == null || AccountExclusionPolicy.IsDeleted(user)) return false;

            if (AccountExclusionPolicy.IsProtectedAdmin(user.Email) && role != "Admin")
                return false;

            if (user.Role == "Admin" && role == "Staff")
            {
                var adminCount = await db.StaffUsers.CountAsync(u => u.Role == "Admin" && u.Division != "DELETED");
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

            if (AccountExclusionPolicy.IsProtectedAdmin(user.Email))
                return false;

            user.Division = "DELETED";
            user.Email = $"deleted_{DateTime.UtcNow.Ticks}_{user.Email}";
            user.FullName = user.FullName.StartsWith("[deleted user]", StringComparison.OrdinalIgnoreCase)
                ? user.FullName
                : $"[deleted user] {user.FullName}";
            user.PreferredName = "";
            await db.SaveChangesAsync();
            return true;
        }

        public async Task<AuthResponseDto?> LoginAsync(string email, string password)
        {
            var identifier = (email ?? "").Trim();
            if (string.IsNullOrWhiteSpace(identifier) || string.IsNullOrEmpty(password))
                return null;

            var adProfile = ActiveDirectoryService.TryAuthenticate(identifier, password);
            if (adProfile != null)
            {
                return await UpsertActiveDirectoryUserAsync(adProfile, identifier);
            }

            return await LoginLocalUserAsync(identifier, password);
        }

        public async Task<AuthResponseDto?> SignupAsync(StaffUser newUser)
        {
            if (await db.StaffUsers.AnyAsync(u => u.Email == newUser.Email))
                return null;

            newUser.PasswordHash = SecurityHelper.HashPassword(newUser.PasswordHash);
            db.StaffUsers.Add(newUser);
            await db.SaveChangesAsync();

            return ToAuthResponse(newUser);
        }

        public static string ResolveAdDivision(
            string? adDivision,
            string? adDepartment,
            string? distinguishedName,
            string? office,
            string? company) =>
            ActiveDirectoryService.ResolveDivision(adDivision, adDepartment, distinguishedName, office, company);

        public static string? NormalizeSesbDivision(string? rawValue) =>
            SesbDivisionNormalizer.Normalize(rawValue);

        private async Task<AuthResponseDto> UpsertActiveDirectoryUserAsync(AdUserProfile adProfile, string identifier)
        {
            var existing = await db.StaffUsers.FirstOrDefaultAsync(u =>
                u.Division != "DELETED" &&
                ((!string.IsNullOrEmpty(adProfile.StaffId) && u.StaffId == adProfile.StaffId) ||
                 (!string.IsNullOrEmpty(adProfile.Email) && u.Email == adProfile.Email) ||
                 u.Email == identifier ||
                 u.StaffId == identifier));

            if (existing != null)
            {
                if (!string.IsNullOrWhiteSpace(adProfile.FullName))
                    existing.FullName = adProfile.FullName;
                if (!string.IsNullOrWhiteSpace(adProfile.StaffId))
                    existing.StaffId = adProfile.StaffId;
                if (!string.IsNullOrWhiteSpace(adProfile.Division) && (adProfile.Division != "General" || string.IsNullOrWhiteSpace(existing.Division)))
                    existing.Division = adProfile.Division;
                else if (!string.IsNullOrWhiteSpace(existing.Division))
                    existing.Division = SesbDivisionNormalizer.Normalize(existing.Division) ?? existing.Division;

                if (string.IsNullOrWhiteSpace(existing.Email) && !string.IsNullOrWhiteSpace(adProfile.Email))
                    existing.Email = adProfile.Email;
                if (AccountExclusionPolicy.IsProtectedAdmin(existing.Email))
                    existing.Role = "Admin";

                existing.PasswordHash = SecurityHelper.AdAuthSentinel;
                await db.SaveChangesAsync();
                return ToAuthResponse(existing);
            }

            var firstWord = (adProfile.FullName.Split(' ', StringSplitOptions.RemoveEmptyEntries).FirstOrDefault() ?? adProfile.StaffId).Trim();
            if (firstWord.Length > 10) firstWord = firstWord[..10];

            var created = new StaffUser
            {
                FullName = adProfile.FullName,
                PreferredName = firstWord,
                Email = !string.IsNullOrWhiteSpace(adProfile.Email) ? adProfile.Email : $"{adProfile.StaffId}@sesb.com.my",
                PasswordHash = SecurityHelper.AdAuthSentinel,
                Division = !string.IsNullOrWhiteSpace(adProfile.Division) ? adProfile.Division : "General",
                StaffId = adProfile.StaffId,
                ProfilePicture = "",
                Role = AccountExclusionPolicy.IsProtectedAdmin(adProfile.Email) ? "Admin" : "Staff",
                CreatedAt = DateTime.UtcNow
            };

            db.StaffUsers.Add(created);
            await db.SaveChangesAsync();
            return ToAuthResponse(created);
        }

        private async Task<AuthResponseDto?> LoginLocalUserAsync(string identifier, string password)
        {
            var existingUser = await db.StaffUsers.FirstOrDefaultAsync(u =>
                u.Division != "DELETED" &&
                (u.Email == identifier || u.StaffId == identifier || u.PreferredName == identifier));

            if (existingUser == null || !SecurityHelper.VerifyPassword(password, existingUser.PasswordHash, out var needsRehash))
                return null;

            var changed = false;
            if (needsRehash)
            {
                existingUser.PasswordHash = SecurityHelper.HashPassword(password);
                changed = true;
            }

            if (AccountExclusionPolicy.IsProtectedAdmin(existingUser.Email) && existingUser.Role != "Admin")
            {
                existingUser.Role = "Admin";
                changed = true;
            }

            var normalizedDiv = SesbDivisionNormalizer.Normalize(existingUser.Division);
            if (!string.IsNullOrWhiteSpace(normalizedDiv) && existingUser.Division != normalizedDiv)
            {
                existingUser.Division = normalizedDiv;
                changed = true;
            }

            if (changed)
            {
                await db.SaveChangesAsync();
            }

            return ToAuthResponse(existingUser);
        }

        private static UserProfileDto ToUserProfileDto(StaffUser u) => new(
            u.Id,
            u.FullName,
            u.PreferredName,
            u.Email,
            u.Division,
            u.StaffId,
            u.ProfilePicture,
            u.Role,
            u.CreatedAt
        );

        private AuthResponseDto ToAuthResponse(StaffUser user) => new(
            user.Id,
            user.FullName,
            user.PreferredName,
            user.Email,
            user.Division,
            user.StaffId,
            user.ProfilePicture,
            user.Role,
            SecurityHelper.IssueToken(user, config)
        );

        private async Task<StaffUser?> FindStaffUserAsync(string? target)
        {
            var key = (target ?? "").Trim();
            if (string.IsNullOrEmpty(key)) return null;

            return await db.StaffUsers.FirstOrDefaultAsync(u =>
                       u.Division != "DELETED" &&
                       (u.Email == key || u.FullName == key || u.StaffId == key))
                   ?? await db.StaffUsers.FirstOrDefaultAsync(u =>
                       u.Division != "DELETED" && u.PreferredName == key);
        }
    }
}
