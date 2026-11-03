using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using mobile_backend.Data;
using mobile_backend.Models;

namespace mobile_backend.Endpoints
{
    public static class QuizEndpoints
    {
        public static WebApplication MapQuizEndpoints(this WebApplication app)
        {
            // ─── Quiz: Get Questions for Month ───
            app.MapGet("/api/quiz/{month}", async (string month, AppDbContext db) =>
            {
                var questions = await db.QuizQuestions.Where(q => q.Month == month).ToListAsync();
                var formatted = questions.Select(q => new
                {
                    q.Id,
                    Question = q.QuestionText,
                    Options = new[] { q.OptionA, q.OptionB, q.OptionC, q.OptionD },
                    CorrectIndex = q.CorrectOption switch { "A" => 0, "B" => 1, "C" => 2, "D" => 3, _ => 0 },
                });
                return Results.Ok(formatted);
            }).WithName("GetMonthlyQuiz");

            // ─── Quiz: Submit Answer ───
            app.MapPost("/api/submit-answer", async (UserAnswer answer, AppDbContext db) =>
            {
                answer.DateAnswered = DateTime.UtcNow;
                if (string.IsNullOrWhiteSpace(answer.PreferredName))
                {
                    var staff = await db.StaffUsers.FirstOrDefaultAsync(u => u.FullName == answer.Username || u.Email == answer.Username);
                    if (staff != null && !string.IsNullOrWhiteSpace(staff.PreferredName))
                    {
                        answer.PreferredName = staff.PreferredName;
                    }
                }
                db.UserAnswers.Add(answer);
                await db.SaveChangesAsync();
                return Results.Ok(answer);
            }).WithName("SubmitAnswer");

            // ─── Leaderboard: Total score per user for the month, sorted highest first ───
            app.MapGet("/api/leaderboard/{month}", async (string month, AppDbContext db) =>
            {
                var allAnswers = await db.UserAnswers
                    .Where(a => a.Month == month)
                    .ToListAsync();

                var allStaff = await db.StaffUsers.ToListAsync();

                var staffByName = allStaff
                    .Where(s => !string.IsNullOrWhiteSpace(s.FullName))
                    .GroupBy(s => s.FullName.Trim().ToLower())
                    .ToDictionary(g => g.Key, g => g.First());

                var staffByEmail = allStaff
                    .Where(s => !string.IsNullOrWhiteSpace(s.Email))
                    .GroupBy(s => s.Email.Trim().ToLower())
                    .ToDictionary(g => g.Key, g => g.First());

                var staffByPreferred = allStaff
                    .Where(s => !string.IsNullOrWhiteSpace(s.PreferredName))
                    .GroupBy(s => s.PreferredName.Trim().ToLower())
                    .ToDictionary(g => g.Key, g => g.First());

                var excludedMock = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
                {
                    "demo", "demo user", "demo-001", "ka", "evelien", "quizwiz", "coolcat", "cameron", "petrus"
                };

                var top = allAnswers
                    .Where(a =>
                    {
                        var u = (a.Username ?? "").Trim();
                        var p = (a.PreferredName ?? "").Trim();
                        if (excludedMock.Contains(u) || excludedMock.Contains(p) || u.Contains("demo", StringComparison.OrdinalIgnoreCase)) return false;
                        return true;
                    })
                    .GroupBy(a => a.Username)
                    .Select(g =>
                    {
                        var first = g.FirstOrDefault();
                        var preferred = g.FirstOrDefault(a => !string.IsNullOrWhiteSpace(a.PreferredName))?.PreferredName;

                        var key = (g.Key ?? "").Trim().ToLower();
                        StaffUser? staff = null;
                        if (staffByName.TryGetValue(key, out var s1)) staff = s1;
                        else if (staffByEmail.TryGetValue(key, out var s2)) staff = s2;
                        else if (!string.IsNullOrWhiteSpace(preferred) && staffByPreferred.TryGetValue(preferred.Trim().ToLower(), out var s3)) staff = s3;

                        var displayName = !string.IsNullOrWhiteSpace(preferred)
                            ? preferred
                            : (!string.IsNullOrWhiteSpace(staff?.PreferredName)
                                ? staff.PreferredName
                                : (!string.IsNullOrWhiteSpace(first?.PreferredName) ? first.PreferredName : g.Key));

                        return new
                        {
                            Username = g.Key,
                            DisplayName = displayName,
                            ProfilePicture = staff?.ProfilePicture ?? "",
                            Division = !string.IsNullOrWhiteSpace(staff?.Division)
                                ? staff.Division
                                : (string.IsNullOrWhiteSpace(first?.Division) ? "Strategic Planning Division" : first.Division),
                            Score = g.Sum(a => a.PointsAwarded),
                            TotalQuestions = g.Count(),
                            DateTaken = g.Max(a => a.DateAnswered)
                        };
                    })
                    .OrderByDescending(x => x.Score)
                    .ThenBy(x => x.DateTaken)
                    .Take(10)
                    .ToList();

                return Results.Ok(top);
            }).WithName("GetLeaderboard").RequireCors("AllowAll");

            return app;
        }
    }
}

