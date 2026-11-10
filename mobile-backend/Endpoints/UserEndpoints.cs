using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using mobile_backend.Models;
using mobile_backend.Services;

namespace mobile_backend.Endpoints
{
    public static class UserEndpoints
    {
        public static WebApplication MapUserEndpoints(this WebApplication app)
        {
            // ─── Streak: Record a dictionary reading ───
            app.MapPost("/api/streak/record", async (ReadActivityRequest req, IUserService svc) =>
                Results.Ok(await svc.RecordActivityAsync(req.Username))).WithName("RecordReadActivity");

            // ─── Streak: Get current consecutive daily streak ───
            app.MapGet("/api/streak/{username}", async (string username, IUserService svc) =>
                Results.Ok(await svc.GetUserStreakAsync(username))).WithName("GetStreak");

            // ─── User: Update Preferred/Display Name for Leaderboard ───
            app.MapPost("/api/user/preferred-name", async (UpdatePreferredNameRequest req, IUserService svc) =>
            {
                if (string.IsNullOrWhiteSpace(req.Username) || string.IsNullOrWhiteSpace(req.PreferredName))
                    return Results.BadRequest(new { error = "Username and PreferredName are required" });

                await svc.UpdatePreferredNameAsync(req.Username, req.PreferredName);
                return Results.Ok(new { success = true, preferredName = req.PreferredName });
            }).WithName("UpdatePreferredName").RequireCors("AllowAll");

            // ─── User: Update Profile Picture ───
            app.MapMethods("/api/user/profile-picture", HttpMethodConstants.Options, () => Results.Ok()).RequireCors("AllowAll");
            app.MapPost("/api/user/profile-picture", async (UpdateProfilePictureRequest req, IUserService svc) =>
            {
                if (string.IsNullOrWhiteSpace(req.Username))
                    return Results.BadRequest(new { error = "Username is required" });

                var ok = await svc.UpdateProfilePictureAsync(req.Username, req.ProfilePicture ?? "");
                return ok ? Results.Ok(new { success = true, profilePicture = req.ProfilePicture }) : Results.NotFound(new { error = "User not found" });
            }).WithName("UpdateProfilePicture").RequireCors("AllowAll");

            // ─── User: Get User Profile ───
            app.MapMethods("/api/user/profile/{username}", HttpMethodConstants.Options, (string? username) => Results.Ok()).RequireCors("AllowAll");
            app.MapGet("/api/user/profile/{username}", async (string username, IUserService svc) =>
            {
                var profile = await svc.GetUserProfileAsync(username);
                return profile != null ? Results.Ok(profile) : Results.NotFound(new { error = "User not found" });
            }).WithName("GetUserProfile").RequireCors("AllowAll");

            // ─── Profile: Recent Answers ───
            app.MapGet("/api/profile/{username}/recent-answers", async (string username, string? month, IQuizService quizSvc) =>
                Results.Ok(await quizSvc.GetUserRecentAnswersAsync(username, month))).WithName("GetUserRecentAnswers");

            // ─── Profile: Active Months ───
            app.MapGet("/api/profile/{username}/active-months", async (string username, IQuizService quizSvc) =>
                Results.Ok(await quizSvc.GetUserActiveMonthsAsync(username))).WithName("GetUserActiveMonths");

            return app;
        }
    }
}
