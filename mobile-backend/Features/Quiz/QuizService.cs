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
        private sealed record StaffIndexRow(
            int Id,
            string FullName,
            string PreferredName,
            string Email,
            string Division,
            string StaffId,
            string ProfilePicture
        );

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

            if (allAnswers.Count == 0)
                return [];

            var allStaff = await db.StaffUsers
                .AsNoTracking()
                .Select(s => new StaffIndexRow(
                    s.Id,
                    s.FullName,
                    s.PreferredName,
                    s.Email,
                    s.Division,
                    s.StaffId,
                    s.ProfilePicture
                ))
                .ToListAsync();

            var deletedIdentifiers = BuildDeletedIdentifierSet(allStaff);
            var activeStaff = allStaff
                .Where(s => !AccountExclusionPolicy.IsDeleted(s.Division, s.Email, s.FullName))
                .ToList();

            var activeEntries = allAnswers
                .Select(a =>
                {
                    var u = (a.Username ?? "").Trim();
                    var p = (a.PreferredName ?? "").Trim();
                    if (AccountExclusionPolicy.IsExcludedQuizAccount(u, p) ||
                        AccountExclusionPolicy.IsDeleted("", u, u) ||
                        AccountExclusionPolicy.IsDeleted("", "", p))
                    {
                        return null;
                    }

                    var staff = FindActiveStaff(activeStaff, u, p);
                    if (staff == null && (deletedIdentifiers.Contains(u) || (!string.IsNullOrEmpty(p) && deletedIdentifiers.Contains(p))))
                    {
                        return null;
                    }

                    var groupKey = staff != null
                        ? $"staff:{staff.Id}"
                        : $"raw:{u.ToLowerInvariant()}";

                    return new
                    {
                        GroupKey = groupKey,
                        Staff = staff,
                        Answer = a
                    };
                })
                .Where(x => x != null)
                .ToList();

            var groupedTop = activeEntries
                .GroupBy(x => x!.GroupKey)
                .Select(g =>
                {
                    var first = g.First()!;
                    var staff = g.Select(x => x!.Staff).FirstOrDefault(s => s != null);
                    var rawUsername = !string.IsNullOrWhiteSpace(staff?.FullName)
                        ? staff.FullName
                        : first.Answer.Username;
                    var preferred = g.Select(x => x!.Answer.PreferredName).FirstOrDefault(p => !string.IsNullOrWhiteSpace(p))
                                    ?? staff?.PreferredName;
                    var key = (rawUsername ?? "").Trim().ToLowerInvariant();
                    var displayName = !string.IsNullOrWhiteSpace(staff?.PreferredName)
                        ? staff.PreferredName
                        : (!string.IsNullOrWhiteSpace(preferred) ? preferred : rawUsername);

                    return new LeaderboardEntryDto(
                        key,
                        rawUsername ?? "Anonymous",
                        displayName ?? rawUsername ?? "Anonymous",
                        g.Sum(x => x!.Answer.PointsAwarded),
                        !string.IsNullOrWhiteSpace(staff?.Division) ? staff.Division : (first.Answer.Division ?? "General"),
                        g.Max(x => x!.Answer.DateAnswered),
                        0,
                        staff?.ProfilePicture,
                        staff?.Id
                    );
                })
                .OrderByDescending(x => x.Score)
                .Take(10)
                .ToList();

            return groupedTop;
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
                answer.IsCorrect = false;
                answer.PointsAwarded = 0;
            }

            if (string.IsNullOrWhiteSpace(answer.PreferredName))
            {
                var staff = await db.StaffUsers.AsNoTracking()
                    .FirstOrDefaultAsync(u => u.Division != "DELETED" && (u.FullName == answer.Username || u.Email == answer.Username));
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
            var targets = await ResolveUserTargetIdentifiersAsync(username);

            var query = db.UserAnswers.AsNoTracking().Where(a =>
                targets.Contains(a.Username) ||
                targets.Contains(a.PreferredName));
            if (!string.IsNullOrEmpty(month))
            {
                query = query.Where(a => a.Month == month);
            }

            var history = await query
                .OrderByDescending(a => a.DateAnswered)
                .Take(200)
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
            var targets = await ResolveUserTargetIdentifiersAsync(username);

            return await db.UserAnswers.AsNoTracking()
                .Where(a => targets.Contains(a.Username) || targets.Contains(a.PreferredName))
                .Select(a => a.Month)
                .Distinct()
                .OrderByDescending(m => m)
                .ToListAsync();
        }

        private async Task<List<string>> ResolveUserTargetIdentifiersAsync(string? username)
        {
            var u = (username ?? "").Trim();
            if (string.IsNullOrEmpty(u))
                return [];

            var staff = await db.StaffUsers.AsNoTracking().FirstOrDefaultAsync(s =>
                s.Division != "DELETED" &&
                (s.FullName == u || s.Email == u || s.StaffId == u))
                ?? await db.StaffUsers.AsNoTracking().FirstOrDefaultAsync(s =>
                    s.Division != "DELETED" && s.PreferredName == u);

            var targets = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { u };
            if (staff != null)
            {
                if (!string.IsNullOrWhiteSpace(staff.FullName)) targets.Add(staff.FullName.Trim());
                if (!string.IsNullOrWhiteSpace(staff.PreferredName)) targets.Add(staff.PreferredName.Trim());
                if (!string.IsNullOrWhiteSpace(staff.Email)) targets.Add(staff.Email.Trim());
                if (!string.IsNullOrWhiteSpace(staff.StaffId)) targets.Add(staff.StaffId.Trim());
            }

            return [.. targets];
        }

        private static StaffIndexRow? FindActiveStaff(List<StaffIndexRow> activeStaff, string username, string preferredName)
        {
            if (!string.IsNullOrWhiteSpace(username))
            {
                var exactMatch = activeStaff.FirstOrDefault(s =>
                    string.Equals(s.FullName.Trim(), username, StringComparison.OrdinalIgnoreCase) ||
                    string.Equals(s.Email.Trim(), username, StringComparison.OrdinalIgnoreCase) ||
                    (!string.IsNullOrWhiteSpace(s.StaffId) && string.Equals(s.StaffId.Trim(), username, StringComparison.OrdinalIgnoreCase)));
                if (exactMatch != null) return exactMatch;
            }

            if (!string.IsNullOrWhiteSpace(preferredName))
            {
                return activeStaff.FirstOrDefault(s =>
                    !string.IsNullOrWhiteSpace(s.PreferredName) &&
                    string.Equals(s.PreferredName.Trim(), preferredName, StringComparison.OrdinalIgnoreCase));
            }

            return null;
        }

        private static HashSet<string> BuildDeletedIdentifierSet(IEnumerable<StaffIndexRow> allStaff)
        {
            var deleted = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            foreach (var s in allStaff.Where(row => AccountExclusionPolicy.IsDeleted(row.Division, row.Email, row.FullName)))
            {
                var rawFull = (s.FullName ?? "").Trim();
                if (!string.IsNullOrEmpty(rawFull))
                {
                    deleted.Add(rawFull);
                    const string deletedPrefix = "[deleted user]";
                    if (rawFull.StartsWith(deletedPrefix, StringComparison.OrdinalIgnoreCase))
                    {
                        var originalName = rawFull[deletedPrefix.Length..].Trim();
                        if (!string.IsNullOrEmpty(originalName)) deleted.Add(originalName);
                    }
                }

                var rawEmail = (s.Email ?? "").Trim();
                if (!string.IsNullOrEmpty(rawEmail))
                {
                    deleted.Add(rawEmail);
                    if (rawEmail.StartsWith("deleted_", StringComparison.OrdinalIgnoreCase))
                    {
                        var firstUnderscore = rawEmail.IndexOf('_');
                        var secondUnderscore = firstUnderscore >= 0 ? rawEmail.IndexOf('_', firstUnderscore + 1) : -1;
                        if (secondUnderscore > firstUnderscore)
                        {
                            var originalEmail = rawEmail[(secondUnderscore + 1)..].Trim();
                            if (!string.IsNullOrEmpty(originalEmail)) deleted.Add(originalEmail);
                        }
                    }
                }

                if (!string.IsNullOrWhiteSpace(s.StaffId))
                    deleted.Add(s.StaffId.Trim());
            }

            return deleted;
        }
    }
}
