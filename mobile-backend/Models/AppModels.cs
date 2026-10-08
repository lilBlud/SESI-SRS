using System;

namespace mobile_backend.Models
{
    public class StaffUser
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty; // Store plain text for MVP or hashed
        public string Division { get; set; } = string.Empty;
        public string StaffId { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class UserAnswer
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Division { get; set; } = string.Empty;
        public string Month { get; set; } = string.Empty;
        public int QuestionId { get; set; }
        public string QuestionText { get; set; } = string.Empty;
        public string SelectedOption { get; set; } = string.Empty;
        public bool IsCorrect { get; set; }
        public int TimeTakenSeconds { get; set; }
        public int PointsAwarded { get; set; }
        public DateTime DateAnswered { get; set; } = DateTime.UtcNow;
    }

    public class QuizQuestion
    {
        public int Id { get; set; }
        public string Month { get; set; } = string.Empty; // e.g. "2026-10"
        public string QuestionText { get; set; } = string.Empty;
        public string OptionA { get; set; } = string.Empty;
        public string OptionB { get; set; } = string.Empty;
        public string OptionC { get; set; } = string.Empty;
        public string OptionD { get; set; } = string.Empty;
        public string CorrectOption { get; set; } = string.Empty; // "A", "B", "C", or "D"
    }

    public class EmployeeAward
    {
        public int Id { get; set; }
        public string Month { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string AwardTitle { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }

    public class AdminLoginRequest
    {
        public string Password { get; set; } = string.Empty;
    }

    // Tracks daily DICTIONARY reading activity per user for streak (like Duolingo)
    public class UserActivity
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public DateTime ActivityDate { get; set; } // Date (no time) of dictionary term read
    }

    // Dictionary/Glossary terms — managed by admin
    public class GlossaryTerm
    {
        public int Id { get; set; }
        public string Term { get; set; } = string.Empty;       // e.g. "IBR"
        public string FullName { get; set; } = string.Empty;    // e.g. "Incentive-Based Regulation"
        public string Description { get; set; } = string.Empty; // Full explanation
        public string Formula { get; set; } = string.Empty;     // e.g. "Revenue = OPEX + Dep + (RAB × WACC) + Tax"
        public string FormulaNotations { get; set; } = string.Empty;
        public string FormulaTermMeanings { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;    // e.g. "IBR Framework", "ESG", "EPSB", "BDV", etc.
        public string ChartData { get; set; } = string.Empty;   // JSON array for line charts
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    // Infographics / Posters — managed by admin
    public class Infographic
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;    // URL or base64 data URI (primary image)
        public string AdditionalImages { get; set; } = string.Empty; // JSON array of additional image URLs/base64
        public string Category { get; set; } = string.Empty;    // e.g. "IBR", "ESG", "General"
        public DateTime PostedAt { get; set; } = DateTime.UtcNow;
    }

    public class SearchHistory
    {
        public int Id { get; set; }
        public string Term { get; set; } = string.Empty;
        public DateTime SearchDate { get; set; }
    }
}
