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
    public class StreakServiceTests : IDisposable
    {
        private readonly SqliteConnection _connection;
        private readonly AppDbContext _db;

        public StreakServiceTests()
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
        public async Task CalculateStreakAsync_ReturnsZero_WhenNoActivity()
        {
            var streak = await StreakService.CalculateStreakAsync("alice", _db);
            Assert.Equal(0, streak);
        }

        [Fact]
        public async Task CalculateStreakAsync_ReturnsOne_WhenActivityToday()
        {
            var today = DateTime.UtcNow.AddHours(8).Date;
            _db.UserActivities.Add(new UserActivity { Username = "bob", ActivityDate = today });
            await _db.SaveChangesAsync();

            var streak = await StreakService.CalculateStreakAsync("bob", _db);
            Assert.Equal(1, streak);
        }

        [Fact]
        public async Task CalculateStreakAsync_ReturnsConsecutiveDays()
        {
            var today = DateTime.UtcNow.AddHours(8).Date;
            _db.UserActivities.AddRange(
                new UserActivity { Username = "charlie", ActivityDate = today },
                new UserActivity { Username = "charlie", ActivityDate = today.AddDays(-1) },
                new UserActivity { Username = "charlie", ActivityDate = today.AddDays(-2) }
            );
            await _db.SaveChangesAsync();

            var streak = await StreakService.CalculateStreakAsync("charlie", _db);
            Assert.Equal(3, streak);
        }

        [Fact]
        public async Task CalculateStreakAsync_BreaksWhenDayMissed()
        {
            var today = DateTime.UtcNow.AddHours(8).Date;
            _db.UserActivities.Add(new UserActivity { Username = "dave", ActivityDate = today.AddDays(-2) });
            await _db.SaveChangesAsync();

            var streak = await StreakService.CalculateStreakAsync("dave", _db);
            Assert.Equal(0, streak);
        }
    }
}
