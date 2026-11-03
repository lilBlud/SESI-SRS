using System;
using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using mobile_backend.Data;
using mobile_backend.Models;

namespace mobile_backend.Endpoints
{
    public static class GlossaryEndpoints
    {
        public static WebApplication MapGlossaryEndpoints(this WebApplication app)
        {
            // ─── Glossary: Get all terms (Public) ───
            app.MapGet("/api/glossary", async (AppDbContext db) =>
            {
                var terms = await db.GlossaryTerms.OrderBy(g => g.Term).ToListAsync();
                var formatted = terms.Select(g => new
                {
                    id = g.Id,
                    term = g.Term,
                    full = g.FullName,
                    desc = g.Description,
                    formula = g.Formula,
                    formulaNotations = g.FormulaNotations,
                    formulaTermMeanings = g.FormulaTermMeanings,
                    cat = g.Category,
                    chartData = g.ChartData
                });
                return Results.Ok(formatted);
            }).WithName("GetGlossary");

            // ─── Glossary: Admin Endpoints ───
            app.MapGet("/api/admin/glossary", async (AppDbContext db) =>
            {
                var terms = await db.GlossaryTerms.OrderBy(g => g.Term).ToListAsync();
                return Results.Ok(terms);
            }).WithName("AdminGetGlossary");

            app.MapPost("/api/admin/glossary", async (GlossaryTerm term, AppDbContext db) =>
            {
                term.CreatedAt = DateTime.UtcNow;
                db.GlossaryTerms.Add(term);
                await db.SaveChangesAsync();
                return Results.Ok(term);
            }).WithName("AdminAddGlossaryTerm");

            app.MapPut("/api/admin/glossary/{id}", async (int id, GlossaryTerm updated, AppDbContext db) =>
            {
                var existing = await db.GlossaryTerms.FindAsync(id);
                if (existing == null) return Results.NotFound();
                existing.Term = updated.Term;
                existing.FullName = updated.FullName;
                existing.Description = updated.Description;
                existing.Formula = updated.Formula;
                existing.FormulaNotations = updated.FormulaNotations;
                existing.FormulaTermMeanings = updated.FormulaTermMeanings;
                existing.Category = updated.Category;
                existing.ChartData = updated.ChartData;
                await db.SaveChangesAsync();
                return Results.Ok(existing);
            }).WithName("AdminUpdateGlossaryTerm");

            app.MapDelete("/api/admin/glossary/{id}", async (int id, AppDbContext db) =>
            {
                var t = await db.GlossaryTerms.FindAsync(id);
                if (t != null) { db.GlossaryTerms.Remove(t); await db.SaveChangesAsync(); }
                return Results.Ok();
            }).WithName("AdminDeleteGlossaryTerm");

            app.MapPost("/api/admin/reseed-performance", (AppDbContext db) =>
            {
                DbInitializer.Initialize(app);
                return Results.Ok(new { success = true, message = "Performance metrics reseeded successfully" });
            }).WithName("AdminReseedPerformance");

            return app;
        }
    }
}

