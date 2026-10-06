using Microsoft.EntityFrameworkCore;
using mobile_backend.Models;

namespace mobile_backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<UserAnswer> UserAnswers { get; set; }
        public DbSet<QuizQuestion> QuizQuestions { get; set; }
        public DbSet<EmployeeAward> EmployeeAwards { get; set; }
        public DbSet<UserActivity> UserActivities { get; set; }
        public DbSet<SearchHistory> SearchHistories { get; set; }
        public DbSet<GlossaryTerm> GlossaryTerms { get; set; }
        public DbSet<Infographic> Infographics { get; set; }
    }
}
