using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using mobile_backend.Models;
using mobile_backend.Services;

namespace mobile_backend.Endpoints
{
    public static class AuthEndpoints
    {
        public static WebApplication MapAuthEndpoints(this WebApplication app)
        {
            app.MapPost("/api/auth/signup", async (AuthRequest req, IUserService svc) =>
            {
                if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
                    return Results.BadRequest(new { error = "Email and password required" });

                var prefName = (req.PreferredName ?? "").Trim();
                if (prefName.Length > 10) prefName = prefName[..10];

                var user = new StaffUser
                {
                    FullName = req.FullName ?? "",
                    PreferredName = prefName,
                    Email = req.Email,
                    PasswordHash = req.Password,
                    Division = req.Division ?? "",
                    StaffId = req.StaffId ?? "",
                    Role = "Staff"
                };

                var res = await svc.SignupAsync(user);
                return res != null ? Results.Ok(res) : Results.BadRequest(new { error = "Email already exists" });
            }).RequireCors("AllowAll");

            app.MapMethods("/api/auth/login", HttpMethodConstants.Options, () => Results.Ok()).RequireCors("AllowAll");
            app.MapPost("/api/auth/login", async (AuthRequest req, IUserService svc) =>
            {
                var res = await svc.LoginAsync(req.Email ?? "", req.Password ?? "");
                return res != null ? Results.Ok(res) : Results.Unauthorized();
            }).RequireCors("AllowAll");

            return app;
        }
    }
}
