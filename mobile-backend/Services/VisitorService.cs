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
        public async Task<VisitorStatsDto> GetVisitorStatsAsync()
        {
            var baseQuery = db.VisitorLogs.Where(v => !v.VisitorId.StartsWith("v_seed_"));
            var todayStart = DateTime.UtcNow.AddHours(8).Date.AddHours(-8);
            var totalVisits = await baseQuery.CountAsync();
            var todayVisits = await baseQuery.CountAsync(v => v.VisitedAt >= todayStart);
            var uniqueVisitors = await baseQuery.Select(v => v.VisitorId).Distinct().CountAsync();

            var rawBreakdown = await baseQuery
                .Where(v => !string.IsNullOrEmpty(v.Division) && v.Division != "General")
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
                    Username = string.IsNullOrWhiteSpace(v.Username) ? "Anonymous Visitor" : v.Username,
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
            var visitorId = (req.VisitorId ?? "").Trim();
            if (string.IsNullOrWhiteSpace(visitorId))
            {
                visitorId = !string.IsNullOrEmpty(remoteIp) ? remoteIp : Guid.NewGuid().ToString("N");
            }

            if (userAgent.Length > 200) userAgent = userAgent[..200];

            var fiveMinutesAgo = DateTime.UtcNow.AddMinutes(-5);
            var recentVisit = await db.VisitorLogs
                .AnyAsync(v => v.VisitorId == visitorId && v.VisitedAt >= fiveMinutesAgo);

            if (!recentVisit)
            {
                var log = new VisitorLog
                {
                    VisitorId = visitorId,
                    Username = req.Username ?? "",
                    Division = req.Division ?? "",
                    Path = req.Path ?? "/",
                    UserAgent = userAgent,
                    VisitedAt = DateTime.UtcNow
                };
                db.VisitorLogs.Add(log);
                await db.SaveChangesAsync();
            }

            var baseQuery = db.VisitorLogs.Where(v => !v.VisitorId.StartsWith("v_seed_"));
            var todayStart = DateTime.UtcNow.AddHours(8).Date.AddHours(-8);
            var totalVisits = await baseQuery.CountAsync();
            var todayVisits = await baseQuery.CountAsync(v => v.VisitedAt >= todayStart);
            var uniqueVisitors = await baseQuery.Select(v => v.VisitorId).Distinct().CountAsync();

            return new RecordVisitorResultDto(totalVisits, todayVisits, uniqueVisitors);
        }
    }
}

