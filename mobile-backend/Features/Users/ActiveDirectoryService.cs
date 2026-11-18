using System;
using System.DirectoryServices;
using System.Linq;

namespace mobile_backend.Services
{
    public sealed record AdUserProfile(string StaffId, string FullName, string Email, string Division);

    /// <summary>
    /// Encapsulates LDAP authentication and directory attribute resolution for SESB Active Directory.
    /// </summary>
    public static class ActiveDirectoryService
    {
        public static AdUserProfile? TryAuthenticate(string loginId, string password)
        {
            if (!OperatingSystem.IsWindows())
                return null;

            const string domainName = "sesb.internal";
            var trimmedLogin = loginId.Trim();
            if (trimmedLogin.Contains('@') &&
                !trimmedLogin.EndsWith("@sesb.com.my", StringComparison.OrdinalIgnoreCase) &&
                !trimmedLogin.EndsWith($"@{domainName}", StringComparison.OrdinalIgnoreCase))
            {
                return null;
            }

            var cleanAccount = trimmedLogin;
            if (cleanAccount.Contains('\\'))
                cleanAccount = cleanAccount.Split('\\').Last();
            else if (cleanAccount.Contains('@'))
                cleanAccount = cleanAccount.Split('@').First();

            // Single canonical bind avoids multiple failed attempts against AD lockout policies
            var bindUser = loginId.Contains('\\') || loginId.EndsWith($"@{domainName}", StringComparison.OrdinalIgnoreCase)
                ? trimmedLogin
                : $"{cleanAccount}@{domainName}";

            try
            {
                using var entry = new DirectoryEntry($"LDAP://{domainName}", bindUser, password, AuthenticationTypes.Secure);
                _ = entry.NativeObject;

                var escapedAccount = EscapeLdapFilterValue(cleanAccount);
                var escapedLogin = EscapeLdapFilterValue(trimmedLogin);

                using var searcher = new DirectorySearcher(entry)
                {
                    Filter = $"(&(objectCategory=user)(|(sAMAccountName={escapedAccount})(userPrincipalName={escapedLogin})(mail={escapedLogin})))",
                    PageSize = 1
                };
                searcher.PropertiesToLoad.AddRange([
                    "cn",
                    "displayName",
                    "mail",
                    "userPrincipalName",
                    "division",
                    "department",
                    "company",
                    "physicalDeliveryOfficeName",
                    "distinguishedName",
                    "sAMAccountName",
                    "employeeID"
                ]);

                var result = searcher.FindOne();
                var staffId = GetAdProp(result, "sAMAccountName") ?? GetAdProp(result, "employeeID") ?? cleanAccount;
                var fullName = GetAdProp(result, "displayName") ?? GetAdProp(result, "cn") ?? staffId;
                var email = GetAdProp(result, "mail") ?? GetAdProp(result, "userPrincipalName") ?? (loginId.Contains('@') ? loginId : $"{staffId}@sesb.com.my");
                var division = ResolveDivision(
                    GetAdProp(result, "division"),
                    GetAdProp(result, "department"),
                    GetAdProp(result, "distinguishedName"),
                    GetAdProp(result, "physicalDeliveryOfficeName"),
                    GetAdProp(result, "company")
                );

                return new AdUserProfile(staffId.Trim(), fullName.Trim(), email.Trim().ToLowerInvariant(), division);
            }
            catch
            {
                return null;
            }
        }

        public static string ResolveDivision(
            string? adDivision,
            string? adDepartment,
            string? distinguishedName,
            string? office,
            string? company)
        {
            string?[] rawCandidates = [adDivision, adDepartment, office];
            foreach (var raw in rawCandidates)
            {
                var mapped = SesbDivisionNormalizer.Normalize(raw);
                if (!string.IsNullOrWhiteSpace(mapped))
                    return mapped;
            }

            if (!string.IsNullOrWhiteSpace(distinguishedName))
            {
                var parts = distinguishedName.Split(',', StringSplitOptions.RemoveEmptyEntries);
                foreach (var part in parts)
                {
                    var trimmed = part.Trim();
                    if (trimmed.StartsWith("OU=", StringComparison.OrdinalIgnoreCase))
                    {
                        var mappedOu = SesbDivisionNormalizer.Normalize(trimmed[3..].Trim());
                        if (!string.IsNullOrWhiteSpace(mappedOu))
                            return mappedOu;
                    }
                }
            }

            foreach (var raw in rawCandidates)
            {
                if (!string.IsNullOrWhiteSpace(raw))
                    return raw.Trim();
            }

            var mappedCompany = SesbDivisionNormalizer.Normalize(company);
            return !string.IsNullOrWhiteSpace(mappedCompany) ? mappedCompany : "General";
        }

        [System.Runtime.Versioning.SupportedOSPlatform("windows")]
        private static string? GetAdProp(SearchResult? result, string propName)
        {
            if (result == null || !result.Properties.Contains(propName))
                return null;
            var col = result.Properties[propName];
            if (col == null || col.Count == 0 || col[0] == null)
                return null;
            var val = col[0]?.ToString()?.Trim();
            return string.IsNullOrWhiteSpace(val) ? null : val;
        }

        private static string EscapeLdapFilterValue(string value)
        {
            return value
                .Replace("\\", "\\5c")
                .Replace("*", "\\2a")
                .Replace("(", "\\28")
                .Replace(")", "\\29")
                .Replace("\0", "\\00");
        }
    }
}
