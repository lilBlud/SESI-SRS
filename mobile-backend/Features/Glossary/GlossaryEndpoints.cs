using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using mobile_backend.Data;
using mobile_backend.Models;
using mobile_backend.Services;

namespace mobile_backend.Endpoints
{
    public static class GlossaryEndpoints
    {
        public static WebApplication MapGlossaryEndpoints(this WebApplication app)
        {
            // ─── Glossary: Get all terms (Public) ───
            app.MapGet("/api/glossary", async (IGlossaryService svc) =>
                Results.Ok(await svc.GetGlossaryAsync())).WithName("GetGlossary");

            // ─── Glossary: Admin Endpoints (Protected) ───
            var adminGlossary = app.MapGroup("/api/admin")
                .RequireCors("AllowAll")
                .AddEndpointFilter(SecurityHelper.RequireAdminFilter);

            adminGlossary.MapGet("/glossary", async (IGlossaryService svc) =>
                Results.Ok(await svc.GetGlossaryAsync())).WithName("AdminGetGlossary");

            adminGlossary.MapPost("/glossary", async (GlossaryTerm term, IGlossaryService svc) =>
                Results.Ok(await svc.AddGlossaryTermAsync(term))).WithName("AdminAddGlossaryTerm");

            adminGlossary.MapPut("/glossary/{id}", async (int id, GlossaryTerm updated, IGlossaryService svc) =>
            {
                var existing = await svc.UpdateGlossaryTermAsync(id, updated);
                return existing != null ? Results.Ok(existing) : Results.NotFound();
            }).WithName("AdminUpdateGlossaryTerm");

            adminGlossary.MapDelete("/glossary/{id}", async (int id, IGlossaryService svc) =>
            {
                await svc.DeleteGlossaryTermAsync(id);
                return Results.Ok();
            }).WithName("AdminDeleteGlossaryTerm");

            adminGlossary.MapPost("/reseed-performance", () =>
            {
                DbInitializer.Initialize(app);
                return Results.Ok(new { success = true, message = "Performance metrics reseeded successfully" });
            }).WithName("AdminReseedPerformance");

            return app;
        }
    }
}
