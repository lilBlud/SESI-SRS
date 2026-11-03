using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using mobile_backend.Data;
using mobile_backend.Models;

namespace mobile_backend.Endpoints
{
    public static class AuthEndpoints
    {
        public static WebApplication MapAuthEndpoints(this WebApplication app)
        {
            app.MapPost("/api/auth/signup", async (AuthRequest req, AppDbContext db) =>
            {
                if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
                    return Results.BadRequest(new { error = "Email and password required" });

                if (await db.StaffUsers.AnyAsync(u => u.Email == req.Email))
                    return Results.BadRequest(new { error = "Email already exists" });

                var prefName = (req.PreferredName ?? "").Trim();
                if (prefName.Length > 10) prefName = prefName[..10];

                var user = new StaffUser
                {
                    FullName = req.FullName ?? "",
                    PreferredName = prefName,
                    Email = req.Email,
                    PasswordHash = req.Password, // For MVP. Real apps should hash this!
                    Division = req.Division ?? "",
                    StaffId = req.StaffId ?? "",
                    Role = "Staff"
                };
                db.StaffUsers.Add(user);
                await db.SaveChangesAsync();

                return Results.Ok(new
                {
                    id = user.Id,
                    fullName = user.FullName,
                    preferredName = user.PreferredName,
                    email = user.Email,
                    division = user.Division,
                    staffId = user.StaffId,
                    profilePicture = user.ProfilePicture,
                    role = user.Role
                });
            }).RequireCors("AllowAll");

            app.MapMethods("/api/auth/login", HttpMethodConstants.Options, () => Results.Ok()).RequireCors("AllowAll");
            app.MapPost("/api/auth/login", async (AuthRequest req, AppDbContext db) =>
            {
                var user = await db.StaffUsers.FirstOrDefaultAsync(u => u.Email == req.Email && u.PasswordHash == req.Password);
                if (user == null)
                    return Results.Unauthorized();

                return Results.Ok(new
                {
                    id = user.Id,
                    fullName = user.FullName,
                    preferredName = user.PreferredName,
                    email = user.Email,
                    division = user.Division,
                    staffId = user.StaffId,
                    profilePicture = user.ProfilePicture,
                    role = user.Role
                });
            }).RequireCors("AllowAll");

            return app;
        }
    }
}

