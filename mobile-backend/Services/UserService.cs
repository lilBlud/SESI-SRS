using System;
using System.Collections.Generic;
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
            return new StreakDto(streak, dates.Select(d => d.ToString("yyyy-MM-dd")).ToList());
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
                .Where(u => u.Division != "DELETED" && !u.Email.StartsWith("deleted_"))
                .OrderBy(u => u.FullName)
                .ToListAsync();

            return users.Select(u => new UserProfileDto(
                u.Id,
                u.FullName,
                u.PreferredName,
                u.Email,
                u.Division,
                u.StaffId,
                u.ProfilePicture,
                u.Role,
                u.CreatedAt
            )).ToList();
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

            user.Division = "DELETED";
            user.Email = $"deleted_{DateTime.UtcNow.Ticks}_{user.Email}";
            user.FullName = user.FullName.StartsWith("[deleted user]") ? user.FullName : $"[deleted user] {user.FullName}";
            user.PreferredName = "";
            await db.SaveChangesAsync();
            return true;
        }

        public async Task<AuthResponseDto?> LoginAsync(string email, string password)
        {
            var user = await db.StaffUsers.FirstOrDefaultAsync(u => u.Email == email && u.PasswordHash == password);
            if (user == null) return null;

            return new AuthResponseDto(
                user.Id,
                user.FullName,
                user.PreferredName,
                user.Email,
                user.Division,
                user.StaffId,
                user.ProfilePicture,
                user.Role
            );
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
            var key = (target ?? "").Trim().ToLower();
            return db.StaffUsers.FirstOrDefaultAsync(u =>
                u.Email.ToLower() == key ||
                u.FullName.ToLower() == key);
        }
    }
}
