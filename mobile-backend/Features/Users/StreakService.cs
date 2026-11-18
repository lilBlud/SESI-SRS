using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using mobile_backend.Data;

namespace mobile_backend.Services
{
    public static class StreakService
    {
        public static async Task<int> CalculateStreakAsync(string username, AppDbContext db)
        {
            var rawDates = await db.UserActivities
                .AsNoTracking()
                .Where(a => a.Username == username)
                .Select(a => a.ActivityDate)
                .ToListAsync();

            var dates = rawDates
                .Select(d => d.Date)
                .Distinct()
                .OrderByDescending(d => d)
                .ToList();

            if (dates.Count == 0)
                return 0;

            var today = DateTime.UtcNow.AddHours(8).Date;
            var latest = dates[0];

            // Active streak requires activity today or yesterday (UTC+8)
            if (latest != today && latest != today.AddDays(-1))
                return 0;

            int streak = 0;
            var expectedDate = latest;

            foreach (var date in dates)
            {
                if (date == expectedDate)
                {
                    streak++;
                    expectedDate = expectedDate.AddDays(-1);
                }
                else
                {
                    break;
                }
            }

            return streak;
        }
    }
}
