using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using mobile_backend.Data;
using mobile_backend.DTOs;
using mobile_backend.Models;

namespace mobile_backend.Services
{
    public class VisitorService(AppDbContext db) : IVisitorService
    {
        private IQueryable<VisitorLog> GetAuthenticatedLogsQuery() =>
            db.VisitorLogs.Where(v =>
                !v.VisitorId.StartsWith("v_seed_") &&
                !string.IsNullOrEmpty(v.Username) &&
                v.Username != "Anonymous Visitor" &&
                v.Username != "Demo User" &&
                v.Username != "Test User" &&
                v.Username != "test_admin_user" &&
                v.Username != "test_role_probe" &&
                v.Username != "Cameron");

        public async Task<VisitorStatsDto> GetVisitorStatsAsync()
        {
            var baseQuery = GetAuthenticatedLogsQuery();
            var todayStart = DateTime.UtcNow.AddHours(8).Date.AddHours(-8);

            var totalVisits = await baseQuery.CountAsync();
            var todayVisits = await baseQuery
                .Where(v => v.VisitedAt >= todayStart)
                .Select(v => v.Username)
                .Distinct()
                .CountAsync();

            var uniqueVisitors = await db.StaffUsers.CountAsync();
            if (uniqueVisitors == 0)
            {
                uniqueVisitors = await baseQuery.Select(v => v.Username).Distinct().CountAsync();
            }

            var rawBreakdown = await baseQuery
                .Where(v => !string.IsNullOrEmpty(v.Division) && v.Division != "General" && v.Division != "IDD")
                .GroupBy(v => v.Division)
                .Select(g => new { Division = g.Key, Count = g.Count() })
                .OrderByDescending(x => x.Count)
                .Take(8)
                .ToListAsync();

            var divisionBreakdown = rawBreakdown
                .Select(x => new DivisionBreakdownDto(x.Division, x.Count))
                .ToList();

            var rawRecent = await baseQuery
                .OrderByDescending(v => v.VisitedAt)
                .Take(25)
                .Select(v => new {
                    v.Id,
                    v.VisitorId,
                    Username = v.Username,
                    Division = string.IsNullOrWhiteSpace(v.Division) ? "General" : v.Division,
                    v.VisitedAt
                })
                .ToListAsync();

            var recentVisits = rawRecent
                .Select(v => new RecentVisitDto(
                    v.Id,
                    v.VisitorId,
                    v.Username,
                    v.Division,
                    DateTime.SpecifyKind(v.VisitedAt, DateTimeKind.Utc)
                ))
                .ToList();

            return new VisitorStatsDto(
                totalVisits,
                todayVisits,
                uniqueVisitors,
                divisionBreakdown,
                recentVisits
            );
        }

        public async Task<RecordVisitorResultDto> RecordVisitAsync(RecordVisitRequest req, string remoteIp, string userAgent)
        {
            var cleanUsername = (req.Username ?? "").Trim();
            var isAuthenticatedStaff =
                !string.IsNullOrWhiteSpace(cleanUsername) &&
                !string.Equals(cleanUsername, "Anonymous Visitor", StringComparison.OrdinalIgnoreCase) &&
                !string.Equals(cleanUsername, "Demo User", StringComparison.OrdinalIgnoreCase);

            if (isAuthenticatedStaff)
            {
                var visitorId = (req.VisitorId ?? "").Trim();
                if (string.IsNullOrWhiteSpace(visitorId))
                {
                    visitorId = !string.IsNullOrEmpty(remoteIp) ? remoteIp : Guid.NewGuid().ToString("N");
                }

                if (userAgent.Length > 200) userAgent = userAgent[..200];

                var fifteenMinutesAgo = DateTime.UtcNow.AddMinutes(-15);
                var recentVisit = await db.VisitorLogs
                    .AnyAsync(v => v.Username == cleanUsername && v.VisitedAt >= fifteenMinutesAgo);

                if (!recentVisit)
                {
                    var log = new VisitorLog
                    {
                        VisitorId = visitorId,
                        Username = cleanUsername,
                        Division = (req.Division ?? "").Trim(),
                        Path = req.Path ?? "/",
                        UserAgent = userAgent,
                        VisitedAt = DateTime.UtcNow
                    };
                    db.VisitorLogs.Add(log);
                    await db.SaveChangesAsync();
                }
            }

            var baseQuery = GetAuthenticatedLogsQuery();
            var todayStart = DateTime.UtcNow.AddHours(8).Date.AddHours(-8);
            var totalVisits = await baseQuery.CountAsync();
            var todayVisits = await baseQuery
                .Where(v => v.VisitedAt >= todayStart)
                .Select(v => v.Username)
                .Distinct()
                .CountAsync();
            var uniqueVisitors = await db.StaffUsers.CountAsync();
            if (uniqueVisitors == 0)
            {
                uniqueVisitors = await baseQuery.Select(v => v.Username).Distinct().CountAsync();
            }

            return new RecordVisitorResultDto(totalVisits, todayVisits, uniqueVisitors);
        }
    }
}
