using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using mobile_backend.Models;
using mobile_backend.Services;

namespace mobile_backend.Endpoints
{
    public static class VisitorEndpoints
    {
        public static WebApplication MapVisitorEndpoints(this WebApplication app)
        {
            app.MapPost("/api/visitors/record", async (RecordVisitRequest req, HttpContext context, IVisitorService svc) =>
            {
                var ip = context.Connection.RemoteIpAddress?.ToString() ?? "";
                var ua = context.Request.Headers.UserAgent.ToString();
                var result = await svc.RecordVisitAsync(req, ip, ua);
                return Results.Ok(result);
            }).WithName("RecordVisit").RequireCors("AllowAll");

            app.MapGet("/api/visitors/stats", async (IVisitorService svc) =>
                Results.Ok(await svc.GetVisitorStatsAsync())).WithName("GetVisitorStats").RequireCors("AllowAll");

            return app;
        }
    }
}
