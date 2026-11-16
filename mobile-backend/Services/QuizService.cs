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
            var questions = await db.QuizQuestions.AsNoTracking().Where(q => q.Month == month).ToListAsync();
            return [.. questions.Select(q => new QuizQuestionDto(
                q.Id,
                q.QuestionText,
                [q.OptionA, q.OptionB, q.OptionC, q.OptionD],
                q.CorrectOption switch { "A" => 0, "B" => 1, "C" => 2, "D" => 3, _ => 0 }
            ))];
        }

        public async Task<List<QuizSummaryDto>> GetQuizSummaryAsync()
        {
            var questions = await db.QuizQuestions.AsNoTracking().Select(q => new { q.Id, q.Month }).ToListAsync();
            return [.. questions.Select(q => new QuizSummaryDto(q.Id, q.Month))];
        }

        public async Task<List<LeaderboardEntryDto>> GetLeaderboardAsync(string month)
        {
            var allAnswers = await db.UserAnswers
                .AsNoTracking()
                .Where(a => a.Month == month)
                .Select(a => new
                {
                    a.Username,
                    a.PreferredName,
                    a.Division,
                    a.PointsAwarded,
                    a.DateAnswered
                })
                .ToListAsync();

            var excludedMock = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
            {
                "demo", "demo user", "demo-001", "ka", "evelien", "quizwiz", "coolcat", "cameron", "petrus"
            };

            var groupedTop = allAnswers
                .Where(a =>
                {
                    var u = (a.Username ?? "").Trim();
                    var p = (a.PreferredName ?? "").Trim();
                    return !excludedMock.Contains(u) && !excludedMock.Contains(p) && !u.Contains("demo", StringComparison.OrdinalIgnoreCase);
                })
                .GroupBy(a => a.Username)
                .Select(g => new
                {
                    RawUsername = g.Key,
                    Key = (g.Key ?? "").Trim().ToLower(),
                    Preferred = g.FirstOrDefault(a => !string.IsNullOrWhiteSpace(a.PreferredName))?.PreferredName,
                    First = g.FirstOrDefault(),
                    Score = g.Sum(a => a.PointsAwarded)
                })
                .OrderByDescending(x => x.Score)
                .Take(10)
                .ToList();

            if (groupedTop.Count == 0)
                return [];

            var matchKeys = groupedTop
                .SelectMany(x => new[] { x.Key, (x.Preferred ?? "").Trim().ToLower() })
                .Where(k => !string.IsNullOrEmpty(k))
                .Distinct()
                .ToList();

            var candidateStaff = await db.StaffUsers
                .AsNoTracking()
                .Where(s =>
                    (!string.IsNullOrEmpty(s.FullName) && matchKeys.Contains(s.FullName.Trim().ToLower())) ||
                    (!string.IsNullOrEmpty(s.Email) && matchKeys.Contains(s.Email.Trim().ToLower())) ||
                    (!string.IsNullOrEmpty(s.PreferredName) && matchKeys.Contains(s.PreferredName.Trim().ToLower())))
                .Select(s => new
                {
                    s.Id,
                    s.FullName,
                    s.PreferredName,
                    s.Email,
                    s.Division,
                    s.ProfilePicture
                })
                .ToListAsync();

            return [.. groupedTop.Select(g =>
            {
                var prefLower = (g.Preferred ?? "").Trim().ToLower();
                var staff = candidateStaff.FirstOrDefault(s =>
                    (!string.IsNullOrWhiteSpace(s.FullName) && string.Equals(s.FullName.Trim(), g.Key, StringComparison.OrdinalIgnoreCase)) ||
                    (!string.IsNullOrWhiteSpace(s.Email) && string.Equals(s.Email.Trim(), g.Key, StringComparison.OrdinalIgnoreCase)) ||
                    (!string.IsNullOrWhiteSpace(prefLower) && !string.IsNullOrWhiteSpace(s.PreferredName) && string.Equals(s.PreferredName.Trim(), prefLower, StringComparison.OrdinalIgnoreCase)));

                var displayName = !string.IsNullOrWhiteSpace(g.Preferred)
                    ? g.Preferred
                    : (!string.IsNullOrWhiteSpace(staff?.PreferredName)
                        ? staff.PreferredName
                        : (!string.IsNullOrWhiteSpace(g.First?.PreferredName) ? g.First.PreferredName : g.RawUsername));

                return new LeaderboardEntryDto(
                    g.Key,
                    g.RawUsername ?? "Anonymous",
                    displayName ?? g.RawUsername ?? "Anonymous",
                    g.Score,
                    staff?.Division ?? g.First?.Division ?? "General",
                    g.First?.DateAnswered,
                    0,
                    staff?.ProfilePicture,
                    staff?.Id
                );
            })];
        }

        public async Task<UserAnswer> SubmitAnswerAsync(UserAnswer answer)
        {
            answer.DateAnswered = DateTime.UtcNow;
            answer.Username = (answer.Username ?? "").Trim();
            answer.Month = (answer.Month ?? "").Trim();
            answer.TimeTakenSeconds = Math.Clamp(answer.TimeTakenSeconds, 0, 3600);

            if (answer.QuestionId > 0)
            {
                var existing = await db.UserAnswers.FirstOrDefaultAsync(a =>
                    a.Username == answer.Username &&
                    a.Month == answer.Month &&
                    a.QuestionId == answer.QuestionId);
                if (existing != null)
                    return existing;

                var question = await db.QuizQuestions.AsNoTracking()
                    .FirstOrDefaultAsync(q => q.Id == answer.QuestionId);
                if (question != null)
                {
                    var optKey = (question.CorrectOption ?? "").Trim().ToUpperInvariant();
                    var correctText = optKey switch
                    {
                        "A" => question.OptionA,
                        "B" => question.OptionB,
                        "C" => question.OptionC,
                        "D" => question.OptionD,
                        _ => ""
                    };
                    var chosen = (answer.SelectedOption ?? "").Trim();
                    var serverCorrect =
                        string.Equals(chosen, (correctText ?? "").Trim(), StringComparison.OrdinalIgnoreCase) ||
                        string.Equals(chosen, optKey, StringComparison.OrdinalIgnoreCase);

                    answer.IsCorrect = serverCorrect;
                    answer.PointsAwarded = serverCorrect ? Math.Max(500, 1000 - (answer.TimeTakenSeconds * 10)) : 0;
                    if (string.IsNullOrWhiteSpace(answer.QuestionText))
                        answer.QuestionText = question.QuestionText;
                }
                else
                {
                    answer.IsCorrect = false;
                    answer.PointsAwarded = 0;
                }
            }
            else
            {
                answer.PointsAwarded = answer.IsCorrect ? Math.Max(500, 1000 - (answer.TimeTakenSeconds * 10)) : 0;
            }

            if (string.IsNullOrWhiteSpace(answer.PreferredName))
            {
                var staff = await db.StaffUsers.AsNoTracking().FirstOrDefaultAsync(u => u.FullName == answer.Username || u.Email == answer.Username);
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
            var staff = await db.StaffUsers.AsNoTracking().FirstOrDefaultAsync(s =>
                s.FullName == u ||
                s.PreferredName == u ||
                s.Email == u);

            var targets = new List<string> { u };
            if (staff != null)
            {
                if (!string.IsNullOrWhiteSpace(staff.FullName)) targets.Add(staff.FullName.Trim());
                if (!string.IsNullOrWhiteSpace(staff.PreferredName)) targets.Add(staff.PreferredName.Trim());
                if (!string.IsNullOrWhiteSpace(staff.Email)) targets.Add(staff.Email.Trim());
            }

            var query = db.UserAnswers.AsNoTracking().Where(a =>
                targets.Contains(a.Username) ||
                targets.Contains(a.PreferredName));
            if (!string.IsNullOrEmpty(month))
            {
                query = query.Where(a => a.Month == month);
            }

            var history = await query
                .OrderByDescending(a => a.DateAnswered)
                .Take(50)
                .ToListAsync();

            return [.. history.Select(a => new UserAnswerDto(
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
            ))];
        }

        public async Task<List<string>> GetUserActiveMonthsAsync(string username)
        {
            var u = (username ?? "").Trim();
            var staff = await db.StaffUsers.AsNoTracking().FirstOrDefaultAsync(s =>
                s.FullName == u ||
                s.PreferredName == u ||
                s.Email == u);

            var targets = new List<string> { u };
            if (staff != null)
            {
                if (!string.IsNullOrWhiteSpace(staff.FullName)) targets.Add(staff.FullName.Trim());
                if (!string.IsNullOrWhiteSpace(staff.PreferredName)) targets.Add(staff.PreferredName.Trim());
                if (!string.IsNullOrWhiteSpace(staff.Email)) targets.Add(staff.Email.Trim());
            }

            return await db.UserAnswers.AsNoTracking()
                .Where(a => targets.Contains(a.Username) || targets.Contains(a.PreferredName))
                .Select(a => a.Month)
                .Distinct()
                .OrderByDescending(m => m)
                .ToListAsync();
        }
    }
}
