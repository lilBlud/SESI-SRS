using System;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using mobile_backend.Models;

namespace mobile_backend.Services
{
    public static class SecurityHelper
    {
        public const string AdAuthSentinel = "__AD_AUTH__";
        private const string Pbkdf2Prefix = "PBKDF2$";
        private const int SaltSize = 16;
        private const int HashSize = 32;
        private const int Iterations = 100_000;
        private static readonly Lazy<byte[]> ProcessFallbackSecret = new(() => LoadOrCreateLocalKey());

        public static string HashPassword(string password)
        {
            if (string.IsNullOrEmpty(password))
                return string.Empty;

            var salt = RandomNumberGenerator.GetBytes(SaltSize);
            var hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, Iterations, HashAlgorithmName.SHA256, HashSize);
            return $"{Pbkdf2Prefix}{Convert.ToBase64String(salt)}${Convert.ToBase64String(hash)}";
        }

        public static bool VerifyPassword(string password, string storedHash, out bool needsRehash)
        {
            needsRehash = false;
            if (string.IsNullOrEmpty(password) || string.IsNullOrEmpty(storedHash))
                return false;

            if (storedHash == AdAuthSentinel)
                return false;

            if (!storedHash.StartsWith(Pbkdf2Prefix, StringComparison.Ordinal))
            {
                var matchesLegacy = CryptographicOperations.FixedTimeEquals(
                    Encoding.UTF8.GetBytes(password),
                    Encoding.UTF8.GetBytes(storedHash));
                if (matchesLegacy)
                    needsRehash = true;
                return matchesLegacy;
            }

            var parts = storedHash[Pbkdf2Prefix.Length..].Split('$');
            if (parts.Length != 2)
                return false;

            try
            {
                var salt = Convert.FromBase64String(parts[0]);
                var expectedHash = Convert.FromBase64String(parts[1]);
                var actualHash = Rfc2898DeriveBytes.Pbkdf2(password, salt, Iterations, HashAlgorithmName.SHA256, expectedHash.Length);
                return CryptographicOperations.FixedTimeEquals(actualHash, expectedHash);
            }
            catch
            {
                return false;
            }
        }

        public static string IssueToken(StaffUser user, IConfiguration? config)
        {
            var payloadObj = new TokenPayload(
                user.Id,
                user.Email ?? "",
                user.Role ?? "Staff",
                DateTimeOffset.UtcNow.AddDays(30).ToUnixTimeSeconds()
            );
            var jsonBytes = JsonSerializer.SerializeToUtf8Bytes(payloadObj);
            var payloadB64 = Base64UrlEncode(jsonBytes);
            var key = GetSigningKey(config);
            var sigBytes = HMACSHA256.HashData(key, Encoding.UTF8.GetBytes(payloadB64));
            return $"{payloadB64}.{Base64UrlEncode(sigBytes)}";
        }

        public static bool TryValidateAdminToken(HttpRequest request, IConfiguration? config)
        {
            var authHeader = request.Headers.Authorization.ToString();
            if (string.IsNullOrWhiteSpace(authHeader) || !authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                return false;

            var token = authHeader["Bearer ".Length..].Trim();
            var dotIdx = token.IndexOf('.');
            if (dotIdx <= 0 || dotIdx >= token.Length - 1)
                return false;

            var payloadB64 = token[..dotIdx];
            var sigB64 = token[(dotIdx + 1)..];

            try
            {
                var key = GetSigningKey(config);
                var expectedSig = HMACSHA256.HashData(key, Encoding.UTF8.GetBytes(payloadB64));
                var actualSig = Base64UrlDecode(sigB64);
                if (!CryptographicOperations.FixedTimeEquals(expectedSig, actualSig))
                    return false;

                var jsonBytes = Base64UrlDecode(payloadB64);
                var payload = JsonSerializer.Deserialize<TokenPayload>(jsonBytes);
                if (payload == null)
                    return false;

                if (payload.Exp < DateTimeOffset.UtcNow.ToUnixTimeSeconds())
                    return false;

                return string.Equals(payload.Role, "Admin", StringComparison.Ordinal);
            }
            catch
            {
                return false;
            }
        }

        public static async ValueTask<object?> RequireAdminFilter(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
        {
            var config = context.HttpContext.RequestServices.GetService(typeof(IConfiguration)) as IConfiguration;
            if (!TryValidateAdminToken(context.HttpContext.Request, config))
                return Results.Unauthorized();

            return await next(context);
        }

        private static byte[] GetSigningKey(IConfiguration? config)
        {
            var configured = config?["Auth:TokenSecret"] ?? Environment.GetEnvironmentVariable("SESI_AUTH_SECRET");
            if (!string.IsNullOrWhiteSpace(configured))
                return SHA256.HashData(Encoding.UTF8.GetBytes(configured));

            return ProcessFallbackSecret.Value;
        }

        private static byte[] LoadOrCreateLocalKey()
        {
            string[] candidates =
            [
                Path.Combine(AppContext.BaseDirectory, ".sesi-auth.key"),
                Path.Combine(Path.GetTempPath(), "sesi-srs-auth.key")
            ];

            foreach (var path in candidates)
            {
                try
                {
                    if (File.Exists(path))
                    {
                        var text = File.ReadAllText(path).Trim();
                        var existing = Convert.FromBase64String(text);
                        if (existing.Length >= 32)
                            return existing;
                    }

                    var created = RandomNumberGenerator.GetBytes(32);
                    File.WriteAllText(path, Convert.ToBase64String(created));
                    return created;
                }
                catch
                {
                    // Fall through to next candidate or in-memory secret
                }
            }

            return RandomNumberGenerator.GetBytes(32);
        }

        private static string Base64UrlEncode(byte[] bytes) =>
            Convert.ToBase64String(bytes).TrimEnd('=').Replace('+', '-').Replace('/', '_');

        private static byte[] Base64UrlDecode(string s)
        {
            var padded = s.Replace('-', '+').Replace('_', '/');
            switch (padded.Length % 4)
            {
                case 2: padded += "=="; break;
                case 3: padded += "="; break;
            }
            return Convert.FromBase64String(padded);
        }

        private sealed record TokenPayload(int Id, string Email, string Role, long Exp);
    }
}
