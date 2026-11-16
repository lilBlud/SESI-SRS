using System;
using System.Threading.Tasks;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using mobile_backend.Data;
using mobile_backend.Models;
using mobile_backend.Services;
using Xunit;

namespace mobile_backend.Tests
{
    public class QuizServiceTests : IDisposable
    {
        private readonly SqliteConnection _connection;
        private readonly AppDbContext _db;

        public QuizServiceTests()
        {
            _connection = new SqliteConnection("DataSource=:memory:");
            _connection.Open();
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseSqlite(_connection)
                .Options;
            _db = new AppDbContext(options);
            _db.Database.EnsureCreated();
        }

        public void Dispose()
        {
            _db.Dispose();
            _connection.Dispose();
        }

        [Fact]
        public async Task GetLeaderboardAsync_FiltersOutMockAccounts_AndRanksByScore()
        {
            var month = "2026-11";

            _db.StaffUsers.Add(new StaffUser
            {
                FullName = "real_user_1",
                PreferredName = "R1",
                Email = "r1@sesb.com.my",
                Division = "Information & Digital"
            });

            _db.UserAnswers.AddRange(
                new UserAnswer { Username = "real_user_1", Month = month, PointsAwarded = 100 },
                new UserAnswer { Username = "real_user_1", Month = month, PointsAwarded = 150 },
                new UserAnswer { Username = "real_user_2", Month = month, PointsAwarded = 400 },
                new UserAnswer { Username = "demo user", Month = month, PointsAwarded = 999 },
                new UserAnswer { Username = "cameron", Month = month, PointsAwarded = 888 }
            );
            await _db.SaveChangesAsync();

            var service = new QuizService(_db);
            var leaderboard = await service.GetLeaderboardAsync(month);

            Assert.Equal(2, leaderboard.Count);
            Assert.Equal("real_user_2", leaderboard[0].Username);
            Assert.Equal(400, leaderboard[0].Score);
            Assert.Equal("real_user_1", leaderboard[1].Username);
            Assert.Equal(250, leaderboard[1].Score);
            Assert.Equal("R1", leaderboard[1].DisplayName);
        }

        [Fact]
        public async Task SubmitAnswerAsync_ValidatesCorrectnessAndPreventsSpoofingAndDuplicates()
        {
            var q = new QuizQuestion
            {
                Month = "2026-11",
                QuestionText = "What does IBR stand for?",
                OptionA = "Incentive-Based Regulation",
                OptionB = "Wrong B",
                OptionC = "Wrong C",
                OptionD = "Wrong D",
                CorrectOption = "A"
            };
            _db.QuizQuestions.Add(q);
            await _db.SaveChangesAsync();

            var service = new QuizService(_db);

            // Attempt to spoof 999999 points on a WRONG option
            var wrongAttempt = await service.SubmitAnswerAsync(new UserAnswer
            {
                Username = "ali",
                Month = "2026-11",
                QuestionId = q.Id,
                SelectedOption = "Wrong B",
                IsCorrect = true,
                PointsAwarded = 999999,
                TimeTakenSeconds = 5
            });
            Assert.False(wrongAttempt.IsCorrect);
            Assert.Equal(0, wrongAttempt.PointsAwarded);

            // Second attempt by same user on same question does not double-score
            var duplicateAttempt = await service.SubmitAnswerAsync(new UserAnswer
            {
                Username = "ali",
                Month = "2026-11",
                QuestionId = q.Id,
                SelectedOption = "Incentive-Based Regulation",
                TimeTakenSeconds = 5
            });
            Assert.Equal(wrongAttempt.Id, duplicateAttempt.Id);
            Assert.Equal(0, duplicateAttempt.PointsAwarded);

            // Fresh user answering correctly gets server-calculated score
            var validAttempt = await service.SubmitAnswerAsync(new UserAnswer
            {
                Username = "siti",
                Month = "2026-11",
                QuestionId = q.Id,
                SelectedOption = "Incentive-Based Regulation",
                PointsAwarded = 999999,
                TimeTakenSeconds = 10
            });
            Assert.True(validAttempt.IsCorrect);
            Assert.Equal(900, validAttempt.PointsAwarded);
        }
    }
}
