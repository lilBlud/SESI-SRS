using System;
using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using mobile_backend.Data;
using mobile_backend.Models;
using mobile_backend.Services;

namespace mobile_backend.Endpoints
{
    public static class AdminEndpoints
    {
        public static WebApplication MapAdminEndpoints(this WebApplication app)
        {
            var admin = app.MapGroup("/api/admin")
                .RequireCors("AllowAll")
                .AddEndpointFilter(SecurityHelper.RequireAdminFilter);

            // ─── User Management & RBAC ───
            admin.MapGet("/users", async (IUserService svc) =>
                Results.Ok(await svc.GetAllUsersAsync())).WithName("AdminGetUsers");

            admin.MapPut("/users/{id}/role", async (int id, UpdateUserRoleRequest req, IUserService svc) =>
            {
                if (req.Role != "Admin" && req.Role != "Staff")
                    return Results.BadRequest(new { error = "Role must be 'Admin' or 'Staff'" });

                var ok = await svc.UpdateUserRoleAsync(id, req.Role);
                return ok ? Results.Ok(new { id, role = req.Role }) : Results.BadRequest(new { error = "User not found or cannot demote the last remaining Administrator." });
            }).WithName("AdminUpdateUserRole");

            admin.MapDelete("/users/{id}", async (int id, IUserService svc) =>
            {
                var ok = await svc.DeleteUserAsync(id);
                return ok ? Results.Ok(new { success = true }) : Results.NotFound(new { error = "User not found" });
            }).WithName("AdminDeleteUser");

            // ─── Quiz Questions ───
            admin.MapGet("/questions/{month}", async (string month, AppDbContext db) =>
            {
                var questions = await db.QuizQuestions.Where(q => q.Month == month).ToListAsync();
                return Results.Ok(new { questions, count = questions.Count });
            }).WithName("AdminGetQuestions");

            admin.MapPost("/questions", async (QuizQuestion q, AppDbContext db) =>
            {
                db.QuizQuestions.Add(q);
                await db.SaveChangesAsync();
                return Results.Ok(q);
            }).WithName("AdminAddQuestion");

            admin.MapPut("/questions/{id}", async (int id, QuizQuestion update, AppDbContext db) =>
            {
                var q = await db.QuizQuestions.FindAsync(id);
                if (q == null) return Results.NotFound();

                q.Month = string.IsNullOrWhiteSpace(update.Month) ? q.Month : update.Month;
                q.QuestionText = update.QuestionText;
                q.OptionA = update.OptionA;
                q.OptionB = update.OptionB;
                q.OptionC = update.OptionC;
                q.OptionD = update.OptionD;
                q.CorrectOption = update.CorrectOption;
                await db.SaveChangesAsync();
                return Results.Ok(q);
            }).WithName("AdminUpdateQuestion");

            admin.MapDelete("/questions/{id}", async (int id, AppDbContext db) =>
            {
                var q = await db.QuizQuestions.FindAsync(id);
                if (q != null) { db.QuizQuestions.Remove(q); await db.SaveChangesAsync(); }
                return Results.Ok();
            }).WithName("AdminDeleteQuestion");

            // ─── Infographics / Posters ───
            app.MapGet("/api/infographics", async (IGlossaryService svc) =>
                Results.Ok(await svc.GetInfographicsAsync())).WithName("GetInfographics");

            admin.MapGet("/infographics", async (IGlossaryService svc) =>
                Results.Ok(await svc.GetInfographicsAsync())).WithName("AdminGetInfographics");

            admin.MapPost("/infographics", async (Infographic info, IGlossaryService svc) =>
                Results.Ok(await svc.AddInfographicAsync(info))).WithName("AdminAddInfographic");

            admin.MapPut("/infographics/{id}", async (int id, Infographic update, IGlossaryService svc) =>
            {
                var item = await svc.UpdateInfographicAsync(id, update);
                return item != null ? Results.Ok(item) : Results.NotFound();
            }).WithName("AdminUpdateInfographic");

            admin.MapDelete("/infographics/{id}", async (int id, IGlossaryService svc) =>
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

            admin.MapPost("/awards", async (EmployeeAward award, AppDbContext db) =>
            {
                db.EmployeeAwards.Add(award);
                await db.SaveChangesAsync();
                return Results.Ok(award);
            }).WithName("AdminAddAward");

            admin.MapDelete("/awards/{id}", async (int id, AppDbContext db) =>
            {
                var a = await db.EmployeeAwards.FindAsync(id);
                if (a != null) { db.EmployeeAwards.Remove(a); await db.SaveChangesAsync(); }
                return Results.Ok();
            }).WithName("AdminDeleteAward");

            return app;
        }
    }
}
