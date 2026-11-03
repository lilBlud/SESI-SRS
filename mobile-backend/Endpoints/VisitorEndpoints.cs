using System;
using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using mobile_backend.Data;
using mobile_backend.Models;

namespace mobile_backend.Endpoints
{
    public static class VisitorEndpoints
    {
        public static WebApplication MapVisitorEndpoints(this WebApplication app)
        {
            app.MapPost("/api/visitors/record", async (RecordVisitRequest req, HttpContext context, AppDbContext db) =>
            {
                var visitorId = (req.VisitorId ?? "").Trim();
                if (string.IsNullOrWhiteSpace(visitorId))
                {
                    visitorId = context.Connection.RemoteIpAddress?.ToString() ?? Guid.NewGuid().ToString("N");
                }

                var userAgent = context.Request.Headers.UserAgent.ToString();
                if (userAgent.Length > 200) userAgent = userAgent[..200];

                // Debounce: check if same visitor was recorded within the last 5 minutes to prevent spam
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

                return Results.Ok(new
                {
                    totalVisits,
                    todayVisits,
                    uniqueVisitors
                });
            }).WithName("RecordVisit").RequireCors("AllowAll");

            app.MapGet("/api/visitors/stats", async (AppDbContext db) =>
            {
                var baseQuery = db.VisitorLogs.Where(v => !v.VisitorId.StartsWith("v_seed_"));
                var todayStart = DateTime.UtcNow.AddHours(8).Date.AddHours(-8);
                var totalVisits = await baseQuery.CountAsync();
                var todayVisits = await baseQuery.CountAsync(v => v.VisitedAt >= todayStart);
                var uniqueVisitors = await baseQuery.Select(v => v.VisitorId).Distinct().CountAsync();

                var divisionBreakdown = await baseQuery
                    .Where(v => !string.IsNullOrEmpty(v.Division) && v.Division != "General")
                    .GroupBy(v => v.Division)
                    .Select(g => new { division = g.Key, count = g.Count() })
                    .OrderByDescending(x => x.count)
                    .Take(8)
                    .ToListAsync();

                var recentVisits = await baseQuery
                    .OrderByDescending(v => v.VisitedAt)
                    .Take(25)
                    .Select(v => new
                    {
                        id = v.Id,
                        visitorId = v.VisitorId,
                        username = string.IsNullOrWhiteSpace(v.Username) ? "Anonymous Visitor" : v.Username,
                        division = string.IsNullOrWhiteSpace(v.Division) ? "General" : v.Division,
                        visitedAt = v.VisitedAt
                    })
                    .ToListAsync();

                return Results.Ok(new
                {
                    totalVisits,
                    todayVisits,
                    uniqueVisitors,
                    divisionBreakdown,
                    recentVisits
                });
            }).WithName("GetVisitorStats").RequireCors("AllowAll");

            return app;
        }
    }
}

