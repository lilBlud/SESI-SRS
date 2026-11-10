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
    public class QuizService(AppDbContext db) : IQuizService
    {
        public async Task<List<QuizQuestionDto>> GetQuizQuestionsAsync(string month)
        {
            var questions = await db.QuizQuestions.Where(q => q.Month == month).ToListAsync();
            return [.. questions.Select(q => new QuizQuestionDto(
                q.Id,
                q.QuestionText,
                [q.OptionA, q.OptionB, q.OptionC, q.OptionD],
                q.CorrectOption switch { "A" => 0, "B" => 1, "C" => 2, "D" => 3, _ => 0 }
            ))];
        }

        public async Task<List<QuizSummaryDto>> GetQuizSummaryAsync()
        {
            var questions = await db.QuizQuestions.Select(q => new { q.Id, q.Month }).ToListAsync();
            return questions.Select(q => new QuizSummaryDto(q.Id, q.Month)).ToList();
        }

        public async Task<List<LeaderboardEntryDto>> GetLeaderboardAsync(string month)
        {
            var allAnswers = await db.UserAnswers.Where(a => a.Month == month).ToListAsync();
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
                    return !excludedMock.Contains(u) && !excludedMock.Contains(p) && !u.Contains("demo", StringComparison.OrdinalIgnoreCase);
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

                    return new LeaderboardEntryDto(
                        key,
                        g.Key ?? "Anonymous",
                        displayName ?? g.Key ?? "Anonymous",
                        g.Sum(a => a.PointsAwarded),
                        staff?.Division ?? first?.Division ?? "General",
                        first?.DateAnswered,
                        0,
                        staff?.ProfilePicture,
                        staff?.Id
                    );
                })
                .OrderByDescending(x => x.Score)
                .Take(10)
                .ToList();

            return top;
        }

        public async Task<UserAnswer> SubmitAnswerAsync(UserAnswer answer)
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
            return answer;
        }

        public async Task<List<UserAnswerDto>> GetUserRecentAnswersAsync(string username, string? month)
        {
            var u = (username ?? "").Trim();
            var query = db.UserAnswers.Where(a => string.Equals(a.Username, u, StringComparison.OrdinalIgnoreCase));
            if (!string.IsNullOrEmpty(month))
            {
                query = query.Where(a => a.Month == month);
            }

            var history = await query
                .OrderByDescending(a => a.DateAnswered)
                .Take(50)
                .ToListAsync();

            return history.Select(a => new UserAnswerDto(
                a.Id,
                a.Month,
                a.QuestionId,
                a.QuestionText,
                a.SelectedOption,
                a.IsCorrect,
                a.TimeTakenSeconds,
                a.PointsAwarded,
                a.DateAnswered,
                a.Username,
                a.PreferredName,
                a.Division
            )).ToList();
        }

        public async Task<List<string>> GetUserActiveMonthsAsync(string username)
        {
            var u = (username ?? "").Trim();
            return await db.UserAnswers
                .Where(a => string.Equals(a.Username, u, StringComparison.OrdinalIgnoreCase))
                .Select(a => a.Month)
                .Distinct()
                .OrderByDescending(m => m)
                .ToListAsync();
        }
    }
}
