using Microsoft.EntityFrameworkCore;
using mobile_backend.Data;
using mobile_backend.Endpoints;
using mobile_backend.Services;

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
var connString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "";
var configuredProvider = builder.Configuration["DatabaseProvider"] ?? builder.Configuration["Database:Provider"];

bool isSqlServer = string.Equals(configuredProvider, "SqlServer", StringComparison.OrdinalIgnoreCase) ||
                   connString.Contains("Trusted_Connection=", StringComparison.OrdinalIgnoreCase) ||
                   connString.Contains("TrustServerCertificate=", StringComparison.OrdinalIgnoreCase) ||
                   connString.Contains("Initial Catalog=", StringComparison.OrdinalIgnoreCase) ||
                   (connString.Contains("Server=", StringComparison.OrdinalIgnoreCase) && !connString.Contains("Host=", StringComparison.OrdinalIgnoreCase) && !connString.Contains("Port=", StringComparison.OrdinalIgnoreCase));

builder.Services.AddDbContext<AppDbContext>(options =>
{
    if (isSqlServer)
    {
        options.UseSqlServer(connString, sqlOptions =>
            sqlOptions.EnableRetryOnFailure(5, TimeSpan.FromSeconds(30), null));
    }
    else
    {
        options.UseNpgsql(connString, sqlOptions =>
            sqlOptions.EnableRetryOnFailure(5, TimeSpan.FromSeconds(30), null));
    }
});

// ─── Domain Services (Clean Architecture) ───
builder.Services.AddScoped<IGlossaryService, GlossaryService>();
builder.Services.AddScoped<IQuizService, QuizService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IVisitorService, VisitorService>();

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
            origin.EndsWith(".workers.dev") ||
            origin.EndsWith(".trycloudflare.com"))
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

var app = builder.Build();

try
{
    if (!app.Urls.IsReadOnly)
    {
        app.Urls.Add("http://127.0.0.1:5195");
    }
}
catch (NotSupportedException)
{
    // Running inside IIS in-process; IIS manages port bindings automatically
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowAll");
app.UseDefaultFiles();
app.UseStaticFiles();

// ─── Ensure DB is created + seed initial data ───
DbInitializer.Initialize(app);

// ─── Domain Endpoints ───
app.MapGet("/api/health", () => Results.Ok(new { status = "online", timestamp = DateTime.UtcNow }));
app.MapAuthEndpoints();
app.MapUserEndpoints();
app.MapQuizEndpoints();
app.MapGlossaryEndpoints();
app.MapVisitorEndpoints();
app.MapAdminEndpoints();

app.MapFallbackToFile("index.html");

app.Run();
