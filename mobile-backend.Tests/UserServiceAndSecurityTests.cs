using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using mobile_backend.Data;
using mobile_backend.Models;
using mobile_backend.Services;
using Xunit;

namespace mobile_backend.Tests
{
    public class UserServiceAndSecurityTests : IDisposable
    {
        private readonly SqliteConnection _connection;
        private readonly AppDbContext _db;
        private readonly IConfiguration _config;

        public UserServiceAndSecurityTests()
        {
            _connection = new SqliteConnection("DataSource=:memory:");
            _connection.Open();
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseSqlite(_connection)
                .Options;
            _db = new AppDbContext(options);
            _db.Database.EnsureCreated();

            _config = new ConfigurationBuilder()
                .AddInMemoryCollection(new Dictionary<string, string?>
                {
                    ["Auth:TokenSecret"] = "unit-test-super-secret-signing-key-2026"
                })
                .Build();
        }

        public void Dispose()
        {
            _db.Dispose();
            _connection.Dispose();
            GC.SuppressFinalize(this);
        }

        [Fact]
        public void PasswordHashing_VerifiesAndUpgradesLegacyPlaintext_AndBlocksAdSentinel()
        {
            var hash = SecurityHelper.HashPassword("Secret#123");
            Assert.StartsWith("PBKDF2$", hash);
            Assert.NotEqual("Secret#123", hash);

            Assert.True(SecurityHelper.VerifyPassword("Secret#123", hash, out var needsRehash));
            Assert.False(needsRehash);

            Assert.False(SecurityHelper.VerifyPassword("wrong", hash, out _));

            // Legacy plaintext row triggers rehash flag
            Assert.True(SecurityHelper.VerifyPassword("legacyPass", "legacyPass", out var legacyRehash));
            Assert.True(legacyRehash);

            // AD sentinel never authenticates via local password check
            Assert.False(SecurityHelper.VerifyPassword(SecurityHelper.AdAuthSentinel, SecurityHelper.AdAuthSentinel, out _));
        }

        [Fact]
        public void AdminToken_ValidatesAdminAndRejectsStaffOrTamperedTokens()
        {
            var admin = new StaffUser { Id = 1, Email = "azibdanish66@gmail.com", Role = "Admin" };
            var staff = new StaffUser { Id = 2, Email = "staff@sesb.com.my", Role = "Staff" };

            var adminToken = SecurityHelper.IssueToken(admin, _config);
            var staffToken = SecurityHelper.IssueToken(staff, _config);

            var adminCtx = new DefaultHttpContext();
            adminCtx.Request.Headers.Authorization = $"Bearer {adminToken}";
            Assert.True(SecurityHelper.TryValidateAdminToken(adminCtx.Request, _config));

            var staffCtx = new DefaultHttpContext();
            staffCtx.Request.Headers.Authorization = $"Bearer {staffToken}";
            Assert.False(SecurityHelper.TryValidateAdminToken(staffCtx.Request, _config));

            var tamperedCtx = new DefaultHttpContext();
            tamperedCtx.Request.Headers.Authorization = $"Bearer {adminToken}x";
            Assert.False(SecurityHelper.TryValidateAdminToken(tamperedCtx.Request, _config));
        }

        [Theory]
        [InlineData("IDD", "Information & Digital")]
        [InlineData("ICT Department", "Information & Digital")]
        [InlineData("S&S", "Strategy & Sustainability")]
        [InlineData("SSD", "Strategy & Sustainability")]
        [InlineData("GSO", "Grid System Operator")]
        [InlineData("Penjanaan", "Generation")]
        public void NormalizeSesbDivision_MapsAbbreviationsToCanonicalDivisions(string raw, string expected)
        {
            Assert.Equal(expected, UserService.NormalizeSesbDivision(raw));
        }

        [Fact]
        public void ResolveAdDivision_ExtractsFromOrganizationalUnit_WhenDepartmentEmpty()
        {
            var resolved = UserService.ResolveAdDivision(
                adDivision: null,
                adDepartment: null,
                distinguishedName: "CN=Ali,OU=IDD,OU=Staff,DC=sesb,DC=internal",
                office: null,
                company: "Sabah Electricity"
            );
            Assert.Equal("Information & Digital", resolved);
        }

        [Fact]
        public async Task ProtectedAdmin_CannotBeDemotedOrDeleted()
        {
            var admin = new StaffUser
            {
                FullName = "Azib",
                Email = "azibdanish66@gmail.com",
                PasswordHash = SecurityHelper.HashPassword("pw"),
                Role = "Admin",
                Division = "Information & Digital"
            };
            var secondAdmin = new StaffUser
            {
                FullName = "Other Admin",
                Email = "other@sesb.com.my",
                PasswordHash = SecurityHelper.HashPassword("pw"),
                Role = "Admin",
                Division = "Finance"
            };
            _db.StaffUsers.AddRange(admin, secondAdmin);
            await _db.SaveChangesAsync();

            var svc = new UserService(_db, _config);

            Assert.False(await svc.UpdateUserRoleAsync(admin.Id, "Staff"));
            Assert.False(await svc.DeleteUserAsync(admin.Id));
            Assert.True(await svc.UpdateUserRoleAsync(secondAdmin.Id, "Staff"));
        }

        [Fact]
        public async Task LoginAsync_UpgradesLegacyPasswordToPbkdf2_AndIssuesToken()
        {
            var user = new StaffUser
            {
                FullName = "Azib",
                Email = "azibdanish66@gmail.com",
                PasswordHash = "oldPlaintext",
                Role = "Staff",
                Division = "IDD"
            };
            _db.StaffUsers.Add(user);
            await _db.SaveChangesAsync();

            var svc = new UserService(_db, _config);
            var res = await svc.LoginAsync("azibdanish66@gmail.com", "oldPlaintext");

            Assert.NotNull(res);
            Assert.Equal("Admin", res.Role);
            Assert.Equal("Information & Digital", res.Division);
            Assert.False(string.IsNullOrWhiteSpace(res.Token));

            var updated = await _db.StaffUsers.FindAsync(user.Id);
            Assert.StartsWith("PBKDF2$", updated!.PasswordHash);
        }
    }
}
