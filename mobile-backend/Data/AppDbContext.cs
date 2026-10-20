using Microsoft.EntityFrameworkCore;
using mobile_backend.Models;

namespace mobile_backend.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {

        public DbSet<UserAnswer> UserAnswers { get; set; } = null!;
        public DbSet<QuizQuestion> QuizQuestions { get; set; } = null!;
        public DbSet<EmployeeAward> EmployeeAwards { get; set; } = null!;
        public DbSet<UserActivity> UserActivities { get; set; } = null!;
        public DbSet<SearchHistory> SearchHistories { get; set; } = null!;
        public DbSet<GlossaryTerm> GlossaryTerms { get; set; } = null!;
        public DbSet<Infographic> Infographics { get; set; } = null!;
        public DbSet<StaffUser> StaffUsers { get; set; } = null!;
        public DbSet<VisitorLog> VisitorLogs { get; set; } = null!;
    }
}
