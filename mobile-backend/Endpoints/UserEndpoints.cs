using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using mobile_backend.Data;
using mobile_backend.Models;
using mobile_backend.Services;

namespace mobile_backend.Endpoints
{
    public static class UserEndpoints
    {
        public static WebApplication MapUserEndpoints(this WebApplication app)
        {
            // ─── Streak: Record a dictionary reading ───
            app.MapPost("/api/streak/record", async (ReadActivityRequest req, AppDbContext db) =>
            {
                var today = DateTime.UtcNow.AddHours(8).Date;
                var alreadyRecorded = await db.UserActivities
                    .AnyAsync(a => a.Username == req.Username && a.ActivityDate == today);
                if (!alreadyRecorded)
                {
                    db.UserActivities.Add(new UserActivity
                    {
                        Username = req.Username,
                        ActivityDate = today
                    });
                    await db.SaveChangesAsync();
                }
                var streak = await StreakService.CalculateStreakAsync(req.Username, db);
                return Results.Ok(new { streak, recorded = !alreadyRecorded });
            }).WithName("RecordReadActivity");

            // ─── Streak: Get current consecutive daily streak ───
            app.MapGet("/api/streak/{username}", async (string username, AppDbContext db) =>
            {
                var dates = await db.UserActivities
                    .Where(a => a.Username == username)
                    .OrderByDescending(a => a.ActivityDate)
                    .Select(a => a.ActivityDate)
                    .ToListAsync();
                var streak = await StreakService.CalculateStreakAsync(username, db);
                return Results.Ok(new { streak, dates = dates.Select(d => d.ToString("yyyy-MM-dd")).ToList() });
            }).WithName("GetStreak");

            // ─── User: Update Preferred/Display Name for Leaderboard ───
            app.MapPost("/api/user/preferred-name", async (UpdatePreferredNameRequest req, AppDbContext db) =>
            {
                if (string.IsNullOrWhiteSpace(req.Username) || string.IsNullOrWhiteSpace(req.PreferredName))
                    return Results.BadRequest(new { error = "Username and PreferredName are required" });

                var trimmed = req.PreferredName.Trim();
                if (trimmed.Length > 10) trimmed = trimmed[..10];

                var staff = await FindStaffUserAsync(db, req.Username);
                if (staff != null)
                {
                    staff.PreferredName = trimmed;
                }

                var answers = await db.UserAnswers.Where(a => a.Username == req.Username).ToListAsync();
                foreach (var ans in answers)
                {
                    ans.PreferredName = trimmed;
                }

                await db.SaveChangesAsync();
                return Results.Ok(new { success = true, preferredName = trimmed });
            }).WithName("UpdatePreferredName").RequireCors("AllowAll");

            // ─── User: Update Profile Picture ───
            app.MapMethods("/api/user/profile-picture", HttpMethodConstants.Options, () => Results.Ok()).RequireCors("AllowAll");
            app.MapPost("/api/user/profile-picture", async (UpdateProfilePictureRequest req, AppDbContext db) =>
            {
                if (string.IsNullOrWhiteSpace(req.Username))
                    return Results.BadRequest(new { error = "Username is required" });

                var staff = await FindStaffUserAsync(db, req.Username);
                if (staff == null)
                    return Results.NotFound(new { error = "User not found" });

                staff.ProfilePicture = req.ProfilePicture ?? "";
                await db.SaveChangesAsync();
                return Results.Ok(new { success = true, profilePicture = staff.ProfilePicture });
            }).WithName("UpdateProfilePicture").RequireCors("AllowAll");

            // ─── User: Get User Profile ───
            app.MapMethods("/api/user/profile/{username}", HttpMethodConstants.Options, (string? username) => Results.Ok()).RequireCors("AllowAll");
            app.MapGet("/api/user/profile/{username}", async (string username, AppDbContext db) =>
            {
                var staff = await FindStaffUserAsync(db, username);
                if (staff == null)
                    return Results.NotFound(new { error = "User not found" });

                return Results.Ok(new
                {
                    id = staff.Id,
                    fullName = staff.FullName,
                    preferredName = staff.PreferredName,
                    email = staff.Email,
                    division = staff.Division,
                    staffId = staff.StaffId,
                    profilePicture = staff.ProfilePicture
                });
            }).WithName("GetUserProfile").RequireCors("AllowAll");

            // ─── Profile: Recent Answers ───
            app.MapGet("/api/profile/{username}/recent-answers", async (string username, string? month, AppDbContext db) =>
            {
                var query = db.UserAnswers.Where(a => a.Username == username);
                if (!string.IsNullOrEmpty(month))
                {
                    query = query.Where(a => a.Month == month);
                }

                var history = await query
                    .OrderByDescending(a => a.DateAnswered)
                    .Take(50)
                    .ToListAsync();
                return Results.Ok(history);
            }).WithName("GetUserRecentAnswers");

            // ─── Profile: Active Months ───
            app.MapGet("/api/profile/{username}/active-months", async (string username, AppDbContext db) =>
            {
                var months = await db.UserAnswers
                    .Where(a => a.Username == username)
                    .Select(a => a.Month)
                    .Distinct()
                    .OrderByDescending(m => m)
                    .ToListAsync();
                return Results.Ok(months);
            }).WithName("GetUserActiveMonths");

            return app;
        }

        private static Task<StaffUser?> FindStaffUserAsync(AppDbContext db, string? target)
        {
            var key = (target ?? "").Trim();
            return db.StaffUsers.FirstOrDefaultAsync(u =>
                string.Equals(u.Email, key, StringComparison.OrdinalIgnoreCase) ||
                string.Equals(u.FullName, key, StringComparison.OrdinalIgnoreCase));
        }
    }
}
