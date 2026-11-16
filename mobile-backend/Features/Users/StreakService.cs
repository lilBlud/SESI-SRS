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
            var dates = await db.UserActivities
                .Where(a => a.Username == username)
                .OrderByDescending(a => a.ActivityDate)
                .Select(a => a.ActivityDate)
                .ToListAsync();

            if (dates.Count == 0) return 0;

            var today = DateTime.UtcNow.AddHours(8).Date;
            if (dates[0] < today.AddDays(-1)) return 0;

            int streak = 0;
            var expected = dates[0];
            foreach (var date in dates)
            {
                if (date == expected)
                {
                    streak++;
                    expected = expected.AddDays(-1);
                }
                else break;
            }
            return streak;
        }
    }
}

