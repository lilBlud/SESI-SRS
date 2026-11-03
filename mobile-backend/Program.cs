using Microsoft.EntityFrameworkCore;
using mobile_backend.Data;
using mobile_backend.Endpoints;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = 100 * 1024 * 1024;
});
builder.Services.Configure<Microsoft.AspNetCore.Http.Features.FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 100 * 1024 * 1024;
});

// ─── Database Configuration ───
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"),
        npgsqlOptionsAction: sqlOptions =>
        {
            sqlOptions.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(30),
                errorCodesToAdd: null);
        }));

builder.Services.Configure<Microsoft.AspNetCore.Http.Json.JsonOptions>(options =>
{
    options.SerializerOptions.MaxDepth = 128;
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.SetIsOriginAllowed(origin =>
            origin.StartsWith("http://localhost:") ||
            origin.StartsWith("http://127.0.0.1:") ||
            origin.StartsWith("https://localhost:") ||
            origin.EndsWith(".sesb.com.my") ||
            origin.EndsWith(".pages.dev") ||
            origin.EndsWith(".vercel.app")
        )
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});
builder.Services.AddOpenApi();

var app = builder.Build();
app.Urls.Add("http://127.0.0.1:5195");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowAll");

// Serve uploaded images from /uploads
app.UseStaticFiles();

// ─── Ensure DB is created + seed initial data ───
DbInitializer.Initialize(app);

// ─── Domain Endpoints ───
app.MapAuthEndpoints();
app.MapUserEndpoints();
app.MapQuizEndpoints();
app.MapGlossaryEndpoints();
app.MapVisitorEndpoints();
app.MapAdminEndpoints();

app.Run();
