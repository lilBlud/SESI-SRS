using System;
using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using mobile_backend.Data;
using mobile_backend.Models;

namespace mobile_backend.Endpoints
{
    public static class AdminEndpoints
    {
        public static WebApplication MapAdminEndpoints(this WebApplication app)
        {
            // ─── Diagnostic / Seeding ───
            app.MapGet("/api/seed", async (AppDbContext db) =>
            {
                var seedMonth = DateTime.UtcNow.ToString("yyyy-MM");
                if (!await db.UserAnswers.AnyAsync(a => a.Username == "Cameron" && a.Month == seedMonth))
                {
                    // Seed mock accounts disabled to keep leaderboard authentic
                }
                return Results.Ok("Seeded");
            });

            // ─── Admin Login ───
            app.MapPost("/api/admin/login", (AdminLoginRequest req, IConfiguration config) =>
            {
                var expected = config["AdminPassword"] ?? Environment.GetEnvironmentVariable("ADMIN_PASSWORD") ?? "admin123";
                if (req.Password == expected)
                    return Results.Ok(new { token = "sesi-admin-secure-token" });
                return Results.Unauthorized();
            }).WithName("AdminLogin");

            // ─── User Management & RBAC ───
            app.MapGet("/api/admin/users", async (AppDbContext db) =>
            {
                var users = await db.StaffUsers
                    .OrderBy(u => u.FullName)
                    .Select(u => new
                    {
                        id = u.Id,
                        fullName = u.FullName,
                        preferredName = u.PreferredName,
                        email = u.Email,
                        division = u.Division,
                        staffId = u.StaffId,
                        role = u.Role,
                        profilePicture = u.ProfilePicture,
                        createdAt = u.CreatedAt
                    })
                    .ToListAsync();
                return Results.Ok(users);
            }).WithName("AdminGetUsers");

            app.MapPut("/api/admin/users/{id}/role", async (int id, UpdateUserRoleRequest req, AppDbContext db) =>
            {
                if (req.Role != "Admin" && req.Role != "Staff")
                    return Results.BadRequest(new { error = "Role must be 'Admin' or 'Staff'" });

                var user = await db.StaffUsers.FindAsync(id);
                if (user == null) return Results.NotFound(new { error = "User not found" });

                if (user.Role == "Admin" && req.Role == "Staff")
                {
                    var adminCount = await db.StaffUsers.CountAsync(u => u.Role == "Admin");
                    if (adminCount <= 1)
                    {
                        return Results.BadRequest(new { error = "Cannot demote the last remaining Administrator." });
                    }
                }

                user.Role = req.Role;
                await db.SaveChangesAsync();
                return Results.Ok(new { id = user.Id, role = user.Role, fullName = user.FullName });
            }).WithName("AdminUpdateUserRole");

            // ─── Quiz Questions ───
            app.MapGet("/api/admin/questions/{month}", async (string month, AppDbContext db) =>
            {
                var questions = await db.QuizQuestions.Where(q => q.Month == month).ToListAsync();
                return Results.Ok(new { questions, count = questions.Count });
            }).WithName("AdminGetQuestions");

            app.MapPost("/api/admin/questions", async (QuizQuestion q, AppDbContext db) =>
            {
                db.QuizQuestions.Add(q);
                await db.SaveChangesAsync();
                return Results.Ok(q);
            }).WithName("AdminAddQuestion");

            app.MapDelete("/api/admin/questions/{id}", async (int id, AppDbContext db) =>
            {
                var q = await db.QuizQuestions.FindAsync(id);
                if (q != null) { db.QuizQuestions.Remove(q); await db.SaveChangesAsync(); }
                return Results.Ok();
            }).WithName("AdminDeleteQuestion");

            // ─── Infographics / Posters ───
            app.MapGet("/api/infographics", async (AppDbContext db) =>
            {
                var items = await db.Infographics.OrderByDescending(i => i.PostedAt).ToListAsync();
                return Results.Ok(items);
            }).WithName("GetInfographics");

            app.MapGet("/api/admin/infographics", async (AppDbContext db) =>
            {
                var items = await db.Infographics.OrderByDescending(i => i.PostedAt).ToListAsync();
                return Results.Ok(items);
            }).WithName("AdminGetInfographics");

            app.MapPost("/api/admin/infographics", async (Infographic info, AppDbContext db) =>
            {
                info.PostedAt = DateTime.UtcNow;
                db.Infographics.Add(info);
                await db.SaveChangesAsync();
                return Results.Ok(info);
            }).WithName("AdminAddInfographic");

            app.MapPut("/api/admin/infographics/{id}", async (int id, Infographic update, AppDbContext db) =>
            {
                var i = await db.Infographics.FindAsync(id);
                if (i == null) return Results.NotFound();
                i.Title = update.Title;
                i.Description = update.Description;
                i.ImageUrl = update.ImageUrl;
                i.AdditionalImages = update.AdditionalImages;
                i.Category = update.Category;
                await db.SaveChangesAsync();
                return Results.Ok(i);
            }).WithName("AdminUpdateInfographic");

            app.MapDelete("/api/admin/infographics/{id}", async (int id, AppDbContext db) =>
            {
                var i = await db.Infographics.FindAsync(id);
                if (i != null) { db.Infographics.Remove(i); await db.SaveChangesAsync(); }
                return Results.Ok();
            }).WithName("AdminDeleteInfographic");

            // ─── Awards ───
            app.MapGet("/api/awards/{month}", async (string month, AppDbContext db) =>
            {
                var awards = await db.EmployeeAwards.Where(a => a.Month == month).ToListAsync();
                return Results.Ok(awards);
            }).WithName("GetAwards");

            app.MapPost("/api/admin/awards", async (EmployeeAward award, AppDbContext db) =>
            {
                db.EmployeeAwards.Add(award);
                await db.SaveChangesAsync();
                return Results.Ok(award);
            }).WithName("AdminAddAward");

            app.MapDelete("/api/admin/awards/{id}", async (int id, AppDbContext db) =>
            {
                var a = await db.EmployeeAwards.FindAsync(id);
                if (a != null) { db.EmployeeAwards.Remove(a); await db.SaveChangesAsync(); }
                return Results.Ok();
            }).WithName("AdminDeleteAward");

            return app;
        }
    }
}

