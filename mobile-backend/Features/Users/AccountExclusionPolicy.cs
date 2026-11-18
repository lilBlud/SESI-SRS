using System;
using System.Collections.Generic;
using mobile_backend.Models;

namespace mobile_backend.Services
{
    /// <summary>
    /// Centralized exclusion rules for mock/seed/deleted accounts across leaderboard,
    /// visitor analytics, and user directory queries.
    /// </summary>
    public static class AccountExclusionPolicy
    {
        public const string ProtectedAdminEmail = "azibdanish66@gmail.com";

        private static readonly HashSet<string> ExcludedMockAccounts = new(StringComparer.OrdinalIgnoreCase)
        {
            "demo",
            "demo user",
            "demo-001",
            "ka",
            "evelien",
            "quizwiz",
            "coolcat",
            "cameron",
            "petrus"
        };

        // Lowercase array kept EF Core LINQ-to-SQL friendly for VisitorLogs queries
        public static readonly string[] ExcludedVisitorUsernamesLower =
        [
            "anonymous visitor",
            "demo user",
            "test user",
            "test_admin_user",
            "test_role_probe",
            "cameron"
        ];

        public static bool IsProtectedAdmin(string? email) =>
            !string.IsNullOrWhiteSpace(email) &&
            string.Equals(email.Trim(), ProtectedAdminEmail, StringComparison.OrdinalIgnoreCase);

        public static bool IsDeleted(string? division, string? email, string? fullName)
        {
            var div = (division ?? "").Trim();
            var mail = (email ?? "").Trim();
            var name = (fullName ?? "").Trim();
            return string.Equals(div, "DELETED", StringComparison.OrdinalIgnoreCase) ||
                   mail.StartsWith("deleted_", StringComparison.OrdinalIgnoreCase) ||
                   name.StartsWith("[deleted user]", StringComparison.OrdinalIgnoreCase);
        }

        public static bool IsDeleted(StaffUser? user) =>
            user != null && IsDeleted(user.Division, user.Email, user.FullName);

        public static bool IsExcludedQuizAccount(string? username, string? preferredName)
        {
            var u = (username ?? "").Trim();
            var p = (preferredName ?? "").Trim();
            return ExcludedMockAccounts.Contains(u) ||
                   ExcludedMockAccounts.Contains(p) ||
                   u.Contains("demo", StringComparison.OrdinalIgnoreCase);
        }
    }
}
