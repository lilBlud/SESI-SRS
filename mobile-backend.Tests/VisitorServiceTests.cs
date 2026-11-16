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
    public class VisitorServiceTests : IDisposable
    {
        private readonly SqliteConnection _connection;
        private readonly AppDbContext _db;

        public VisitorServiceTests()
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
        public async Task GetVisitorStatsAsync_ExcludesAnonDemoAndIdd_AndCountsDistinctTodayAndRegisteredStaff()
        {
            _db.StaffUsers.AddRange(
                new StaffUser { FullName = "Ali", Email = "ali@sesb.com.my", Division = "Information & Digital" },
                new StaffUser { FullName = "Siti", Email = "siti@sesb.com.my", Division = "Strategy & Sustainability" }
            );

            var nowUtc = DateTime.UtcNow;
            _db.VisitorLogs.AddRange(
                new VisitorLog { VisitorId = "v1", Username = "Ali", Division = "Information & Digital", VisitedAt = nowUtc },
                new VisitorLog { VisitorId = "v1", Username = "Ali", Division = "Information & Digital", VisitedAt = nowUtc.AddMinutes(-20) },
                new VisitorLog { VisitorId = "v2", Username = "", Division = "", VisitedAt = nowUtc },
                new VisitorLog { VisitorId = "v3", Username = "Demo User", Division = "Information & Digital", VisitedAt = nowUtc },
                new VisitorLog { VisitorId = "v4", Username = "Siti", Division = "IDD", VisitedAt = nowUtc.AddDays(-2) }
            );
            await _db.SaveChangesAsync();

            var svc = new VisitorService(_db);
            var stats = await svc.GetVisitorStatsAsync();

            Assert.Equal(3, stats.TotalVisits); // Ali x2 + Siti x1
            Assert.Equal(1, stats.TodayVisits); // Distinct staff active today = Ali
            Assert.Equal(2, stats.UniqueVisitors); // StaffUsers count = 2
            Assert.DoesNotContain(stats.DivisionBreakdown, d => d.Division == "IDD");
        }

        [Fact]
        public async Task RecordVisitAsync_IgnoresDemoAndAnonymous_AndThrottles15Min()
        {
            var svc = new VisitorService(_db);

            await svc.RecordVisitAsync(new RecordVisitRequest { VisitorId = "anon1", Username = "" }, "127.0.0.1", "ua");
            await svc.RecordVisitAsync(new RecordVisitRequest { VisitorId = "demo1", Username = "Demo User" }, "127.0.0.1", "ua");
            await svc.RecordVisitAsync(new RecordVisitRequest { VisitorId = "s1", Username = "Ali", Division = "Finance" }, "127.0.0.1", "ua");
            await svc.RecordVisitAsync(new RecordVisitRequest { VisitorId = "s1", Username = "Ali", Division = "Finance" }, "127.0.0.1", "ua");

            var count = await _db.VisitorLogs.CountAsync();
            Assert.Equal(1, count);
        }
    }
}
