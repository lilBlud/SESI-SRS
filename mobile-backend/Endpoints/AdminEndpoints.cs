using System;
using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using mobile_backend.Data;
using mobile_backend.Models;
using mobile_backend.Services;

namespace mobile_backend.Endpoints
{
    public static class AdminEndpoints
    {
        public static WebApplication MapAdminEndpoints(this WebApplication app)
        {
            // ─── Diagnostic / Seeding ───
            app.MapGet("/api/seed", () => Results.Ok("Seeded"));

            // ─── Admin Login ───
            app.MapPost("/api/admin/login", (AdminLoginRequest req, IConfiguration config) =>
            {
                var expected = config["AdminPassword"] ?? Environment.GetEnvironmentVariable("ADMIN_PASSWORD") ?? "admin123";
                if (req.Password == expected)
                    return Results.Ok(new { token = "sesi-admin-secure-token" });
                return Results.Unauthorized();
            }).WithName("AdminLogin");

            // ─── User Management & RBAC ───
            app.MapGet("/api/admin/users", async (IUserService svc) =>
                Results.Ok(await svc.GetAllUsersAsync())).WithName("AdminGetUsers");

            app.MapPut("/api/admin/users/{id}/role", async (int id, UpdateUserRoleRequest req, IUserService svc) =>
            {
                if (req.Role != "Admin" && req.Role != "Staff")
                    return Results.BadRequest(new { error = "Role must be 'Admin' or 'Staff'" });

                var ok = await svc.UpdateUserRoleAsync(id, req.Role);
                return ok ? Results.Ok(new { id, role = req.Role }) : Results.BadRequest(new { error = "User not found or cannot demote the last remaining Administrator." });
            }).WithName("AdminUpdateUserRole");

            app.MapDelete("/api/admin/users/{id}", async (int id, IUserService svc) =>
            {
                var ok = await svc.DeleteUserAsync(id);
                return ok ? Results.Ok(new { success = true }) : Results.NotFound(new { error = "User not found" });
            }).WithName("AdminDeleteUser");

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
            app.MapGet("/api/infographics", async (IGlossaryService svc) =>
                Results.Ok(await svc.GetInfographicsAsync())).WithName("GetInfographics");

            app.MapGet("/api/admin/infographics", async (IGlossaryService svc) =>
                Results.Ok(await svc.GetInfographicsAsync())).WithName("AdminGetInfographics");

            app.MapPost("/api/admin/infographics", async (Infographic info, IGlossaryService svc) =>
                Results.Ok(await svc.AddInfographicAsync(info))).WithName("AdminAddInfographic");

            app.MapPut("/api/admin/infographics/{id}", async (int id, Infographic update, IGlossaryService svc) =>
            {
                var item = await svc.UpdateInfographicAsync(id, update);
                return item != null ? Results.Ok(item) : Results.NotFound();
            }).WithName("AdminUpdateInfographic");

            app.MapDelete("/api/admin/infographics/{id}", async (int id, IGlossaryService svc) =>
            {
                await svc.DeleteInfographicAsync(id);
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
