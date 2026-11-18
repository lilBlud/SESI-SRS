using System;

namespace mobile_backend.Services
{
    /// <summary>
    /// Maps raw Active Directory / signup department codes and names into canonical
    /// SESB division names.
    /// </summary>
    public static class SesbDivisionNormalizer
    {
        private sealed record DivisionRule(string Canonical, string[] ExactAliases, string[] Substrings);

        private static readonly DivisionRule[] Rules =
        [
            new(
                "Information & Digital",
                ["IDD", "IT", "ICT", "ITD"],
                ["INFORMATION & DIGITAL", "INFORMATION AND DIGITAL", "INFORMATION TECHNOLOGY", "DIGITAL", "ICT", "IDD"]),
            new(
                "Strategy & Sustainability",
                ["S&S", "S & S", "SSD", "CS&S"],
                ["STRATEGY & SUSTAINABILITY", "STRATEGY AND SUSTAINABILITY", "SUSTAINABILITY", "CORPORATE STRATEGY"]),
            new(
                "Chief Executive Officer (CEO) Office",
                ["CEO", "OCEO", "MD"],
                ["CHIEF EXECUTIVE", "CEO OFFICE"]),
            new("Single Buyer", ["SB", "SBD"], ["SINGLE BUYER"]),
            new("Grid System Operator", ["GSO", "GSOD"], ["GRID SYSTEM OPERATOR", "SYSTEM OPERATOR"]),
            new("Major Project", ["MP", "MPD"], ["MAJOR PROJECT"]),
            new("Operating", ["COO", "OD"], ["OPERATING"]),
            new("Generation", ["GEN", "GD"], ["GENERATION", "PENJANAAN"]),
            new("Transmission", ["TX", "TD"], ["TRANSMISSION", "PENGHANTARAN"]),
            new("Distribution", ["DX", "DD"], ["DISTRIBUTION", "PEMBAHAGIAN"]),
            new("Retail", ["RTD"], ["RETAIL", "COMMERCIAL", "CUSTOMER SERVICE"]),
            new("Corporate Services", ["CS", "CSD"], ["CORPORATE SERVICES", "CORPORATE SERVICE"]),
            new("Corporate Communication", ["CC", "CCD", "CORP COMM"], ["CORPORATE COMMUNICATION"]),
            new("Finance", ["FIN", "FD", "CFO"], ["FINANCE", "KEWANGAN"]),
            new("Human Resources", ["HR", "HRD", "HCM"], ["HUMAN RESOURCE", "SUMBER MANUSIA"]),
            new("Procurement", ["PROC", "PD"], ["PROCUREMENT", "PEROLEHAN", "PURCHASING"]),
        ];

        public static string? Normalize(string? rawValue)
        {
            if (string.IsNullOrWhiteSpace(rawValue))
                return null;

            var upper = rawValue.Trim().ToUpperInvariant();

            foreach (var rule in Rules)
            {
                if (Array.IndexOf(rule.ExactAliases, upper) >= 0)
                    return rule.Canonical;

                foreach (var token in rule.Substrings)
                {
                    if (upper.Contains(token, StringComparison.Ordinal))
                        return rule.Canonical;
                }
            }

            return null;
        }
    }
}
