using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using mobile_backend.Data;
using mobile_backend.Models;

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

builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = 52428800; // 50MB
});
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

// ═══════════════════════════════════════════
//  AUTH ENDPOINTS
// ═══════════════════════════════════════════

app.MapPost("/api/auth/signup", async (AuthRequest req, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
        return Results.BadRequest(new { error = "Email and password required" });
        
    if (await db.StaffUsers.AnyAsync(u => u.Email == req.Email))
        return Results.BadRequest(new { error = "Email already exists" });

    var prefName = (req.PreferredName ?? "").Trim();
    if (prefName.Length > 10) prefName = prefName.Substring(0, 10);

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
    
    return Results.Ok(new { id = user.Id, fullName = user.FullName, preferredName = user.PreferredName, email = user.Email, division = user.Division, staffId = user.StaffId, profilePicture = user.ProfilePicture, role = user.Role });
}).RequireCors("AllowAll");

app.MapMethods("/api/auth/login", new[] { "OPTIONS" }, () => Results.Ok()).RequireCors("AllowAll");
app.MapPost("/api/auth/login", async (AuthRequest req, AppDbContext db) =>
{
    var user = await db.StaffUsers.FirstOrDefaultAsync(u => u.Email == req.Email && u.PasswordHash == req.Password);
    if (user == null)
        return Results.Unauthorized();
        
    return Results.Ok(new { id = user.Id, fullName = user.FullName, preferredName = user.PreferredName, email = user.Email, division = user.Division, staffId = user.StaffId, profilePicture = user.ProfilePicture, role = user.Role });
}).RequireCors("AllowAll");

// ═══════════════════════════════════════════
//  DIAGNOSTICS & SEEDING ENDPOINTS
// ═══════════════════════════════════════════

app.MapGet("/api/seed", async (AppDbContext db) =>
{
    var seedMonth = DateTime.UtcNow.ToString("yyyy-MM");
    if (!db.UserAnswers.Any(a => a.Username == "Cameron" && a.Month == seedMonth))
    {
        var usernames = new[] { "Cameron", "Ka", "Evelien", "QuizWiz", "CoolCat" };
        var scores = new[] { 4201, 3912, 2926, 2800, 2500 };
        for (int i = 0; i < usernames.Length; i++)
        {
            db.UserAnswers.Add(new UserAnswer 
            { 
                Username = usernames[i], 
                Division = "Sales Division", 
                Month = seedMonth, 
                QuestionId = 1, 
                QuestionText = "Mock Question", 
                SelectedOption = "A", 
                IsCorrect = true, 
                TimeTakenSeconds = 10, 
                PointsAwarded = scores[i], 
                DateAnswered = DateTime.UtcNow.AddMinutes(-i) 
            });
        }
        await db.SaveChangesAsync();
    }
    return Results.Ok("Seeded");
});









// ═══════════════════════════════════════════
//  PUBLIC API ENDPOINTS
// ═══════════════════════════════════════════

// ─── Glossary: Get all terms (from database) ───
app.MapGet("/api/glossary", async (AppDbContext db) =>
{
    var terms = await db.GlossaryTerms.OrderBy(g => g.Term).ToListAsync();
    var formatted = terms.Select(g => new {
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

// ─── Streak: Record a dictionary reading ───
app.MapPost("/api/streak/record", async (ReadActivityRequest req, AppDbContext db) =>
{
    var today = DateTime.UtcNow.AddHours(8).Date;
    var alreadyRecorded = await db.UserActivities
        .AnyAsync(a => a.Username == req.Username && a.ActivityDate == today);
    if (!alreadyRecorded)
    {
        db.UserActivities.Add(new UserActivity
        {
            Username = req.Username,
            ActivityDate = today
        });
        await db.SaveChangesAsync();
    }
    var streak = await CalculateStreak(req.Username, db);
    return Results.Ok(new { streak, recorded = !alreadyRecorded });
}).WithName("RecordReadActivity");

// ─── Streak: Get current consecutive daily streak ───
app.MapGet("/api/streak/{username}", async (string username, AppDbContext db) =>
{
    var dates = await db.UserActivities
        .Where(a => a.Username == username)
        .OrderByDescending(a => a.ActivityDate)
        .Select(a => a.ActivityDate)
        .ToListAsync();
    var streak = await CalculateStreak(username, db);
    return Results.Ok(new { streak, dates = dates.Select(d => d.ToString("yyyy-MM-dd")).ToList() });
}).WithName("GetStreak");

// ─── Quiz: Get Questions for Month ───
app.MapGet("/api/quiz/{month}", async (string month, AppDbContext db) =>
{
    var questions = await db.QuizQuestions.Where(q => q.Month == month).ToListAsync();
    var formatted = questions.Select(q => new {
        Id = q.Id,
        Question = q.QuestionText,
        Options = new[] { q.OptionA, q.OptionB, q.OptionC, q.OptionD },
        CorrectIndex = q.CorrectOption switch { "A" => 0, "B" => 1, "C" => 2, "D" => 3, _ => 0 },
    });
    return Results.Ok(formatted);
}).WithName("GetMonthlyQuiz");

// ─── Quiz: Submit Answer ───
app.MapPost("/api/submit-answer", async (UserAnswer answer, AppDbContext db) =>
{
    answer.DateAnswered = DateTime.UtcNow;
    if (string.IsNullOrWhiteSpace(answer.PreferredName))
    {
        var staff = await db.StaffUsers.FirstOrDefaultAsync(u => u.FullName == answer.Username || u.Email == answer.Username);
        if (staff != null && !string.IsNullOrWhiteSpace(staff.PreferredName))
        {
            answer.PreferredName = staff.PreferredName;
        }
    }
    db.UserAnswers.Add(answer);
    await db.SaveChangesAsync();
    return Results.Ok(answer);
}).WithName("SubmitAnswer");

// ─── User: Update Preferred/Display Name for Leaderboard ───
app.MapPost("/api/user/preferred-name", async (UpdatePreferredNameRequest req, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(req.Username) || string.IsNullOrWhiteSpace(req.PreferredName))
        return Results.BadRequest(new { error = "Username and PreferredName are required" });

    var trimmed = req.PreferredName.Trim();
    if (trimmed.Length > 10) trimmed = trimmed.Substring(0, 10);

    // Update in StaffUsers
    var staff = await db.StaffUsers.FirstOrDefaultAsync(u => u.FullName == req.Username || u.Email == req.Username);
    if (staff != null)
    {
        staff.PreferredName = trimmed;
    }

    // Update in all UserAnswers for this user
    var answers = await db.UserAnswers.Where(a => a.Username == req.Username).ToListAsync();
    foreach (var ans in answers)
    {
        ans.PreferredName = trimmed;
    }

    await db.SaveChangesAsync();
    return Results.Ok(new { success = true, preferredName = trimmed });
}).WithName("UpdatePreferredName").RequireCors("AllowAll");

// ─── User: Update Profile Picture (Base64 data URI or image URL) ───
app.MapMethods("/api/user/profile-picture", new[] { "OPTIONS" }, () => Results.Ok()).RequireCors("AllowAll");
app.MapPost("/api/user/profile-picture", async (UpdateProfilePictureRequest req, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(req.Username))
        return Results.BadRequest(new { error = "Username is required" });

    var target = req.Username.Trim().ToLower();
    var staff = await db.StaffUsers.FirstOrDefaultAsync(u => u.Email.ToLower() == target || u.FullName.ToLower() == target);
    if (staff == null)
        return Results.NotFound(new { error = "User not found" });

    staff.ProfilePicture = req.ProfilePicture ?? "";
    await db.SaveChangesAsync();
    return Results.Ok(new { success = true, profilePicture = staff.ProfilePicture });
}).WithName("UpdateProfilePicture").RequireCors("AllowAll");

// ─── User: Get User Profile ───
app.MapMethods("/api/user/profile/{username}", new[] { "OPTIONS" }, () => Results.Ok()).RequireCors("AllowAll");
app.MapGet("/api/user/profile/{username}", async (string username, AppDbContext db) =>
{
    var target = (username ?? "").Trim().ToLower();
    var staff = await db.StaffUsers.FirstOrDefaultAsync(u => u.Email.ToLower() == target || u.FullName.ToLower() == target);
    if (staff == null)
        return Results.NotFound(new { error = "User not found" });

    return Results.Ok(new 
    { 
        id = staff.Id, 
        fullName = staff.FullName, 
        preferredName = staff.PreferredName, 
        email = staff.Email, 
        division = staff.Division, 
        staffId = staff.StaffId,
        profilePicture = staff.ProfilePicture
    });
}).WithName("GetUserProfile").RequireCors("AllowAll");


// ─── Leaderboard: Total score per user for the month, sorted highest first ───
app.MapGet("/api/leaderboard/{month}", async (string month, AppDbContext db) =>
{
    var allAnswers = await db.UserAnswers
        .Where(a => a.Month == month)
        .ToListAsync();

    var allStaff = await db.StaffUsers.ToListAsync();

    var staffByName = allStaff
        .Where(s => !string.IsNullOrWhiteSpace(s.FullName))
        .GroupBy(s => s.FullName.Trim().ToLower())
        .ToDictionary(g => g.Key, g => g.First());

    var staffByEmail = allStaff
        .Where(s => !string.IsNullOrWhiteSpace(s.Email))
        .GroupBy(s => s.Email.Trim().ToLower())
        .ToDictionary(g => g.Key, g => g.First());

    var staffByPreferred = allStaff
        .Where(s => !string.IsNullOrWhiteSpace(s.PreferredName))
        .GroupBy(s => s.PreferredName.Trim().ToLower())
        .ToDictionary(g => g.Key, g => g.First());

    var top = allAnswers
        .GroupBy(a => a.Username)
        .Select(g =>
        {
            var first = g.FirstOrDefault();
            var preferred = g.FirstOrDefault(a => !string.IsNullOrWhiteSpace(a.PreferredName))?.PreferredName;
            
            var key = (g.Key ?? "").Trim().ToLower();
            StaffUser? staff = null;
            if (staffByName.TryGetValue(key, out var s1)) staff = s1;
            else if (staffByEmail.TryGetValue(key, out var s2)) staff = s2;
            else if (!string.IsNullOrWhiteSpace(preferred) && staffByPreferred.TryGetValue(preferred.Trim().ToLower(), out var s3)) staff = s3;

            var displayName = !string.IsNullOrWhiteSpace(preferred)
                ? preferred
                : (!string.IsNullOrWhiteSpace(staff?.PreferredName) 
                    ? staff.PreferredName 
                    : (!string.IsNullOrWhiteSpace(first?.PreferredName) ? first.PreferredName : g.Key));

            return new
            {
                Username = g.Key,
                DisplayName = displayName,
                ProfilePicture = staff?.ProfilePicture ?? "",
                Division = !string.IsNullOrWhiteSpace(staff?.Division) 
                    ? staff.Division 
                    : (string.IsNullOrWhiteSpace(first?.Division) ? "Strategic Planning Division" : first.Division),
                Score = g.Sum(a => a.PointsAwarded),
                TotalQuestions = g.Count(), // how many they answered
                DateTaken = g.Max(a => a.DateAnswered)
            };
        })
        .OrderByDescending(x => x.Score)
        .ThenBy(x => x.DateTaken)
        .Take(10)
        .ToList();

    return Results.Ok(top);
}).WithName("GetLeaderboard").RequireCors("AllowAll");

// ─── Profile: Recent Answers ───
app.MapGet("/api/profile/{username}/recent-answers", async (string username, string? month, AppDbContext db) =>
{
    var query = db.UserAnswers.Where(a => a.Username == username);
    if (!string.IsNullOrEmpty(month)) {
        query = query.Where(a => a.Month == month);
    }
    
    var history = await query
        .OrderByDescending(a => a.DateAnswered)
        .Take(50)
        .ToListAsync();
    return Results.Ok(history);
}).WithName("GetUserRecentAnswers");

// ─── Profile: Active Months ───
app.MapGet("/api/profile/{username}/active-months", async (string username, AppDbContext db) =>
{
    var months = await db.UserAnswers
        .Where(a => a.Username == username)
        .Select(a => a.Month)
        .Distinct()
        .OrderByDescending(m => m)
        .ToListAsync();
    return Results.Ok(months);
}).WithName("GetUserActiveMonths");

// ─── Infographics: Get all (public) ───
app.MapGet("/api/infographics", async (AppDbContext db) =>
{
    var items = await db.Infographics.OrderByDescending(i => i.PostedAt).ToListAsync();
    return Results.Ok(items);
}).WithName("GetInfographics");

// ─── Monthly Awards ───
app.MapGet("/api/awards/{month}", async (string month, AppDbContext db) =>
{
    var awards = await db.EmployeeAwards.Where(a => a.Month == month).ToListAsync();
    return Results.Ok(awards);
}).WithName("GetAwards");

// ═══════════════════════════════════════════
//  VISITOR & TRAFFIC TRACKING
// ═══════════════════════════════════════════

app.MapPost("/api/visitors/record", async (RecordVisitRequest req, HttpContext context, AppDbContext db) =>
{
    var visitorId = (req.VisitorId ?? "").Trim();
    if (string.IsNullOrWhiteSpace(visitorId))
    {
        visitorId = context.Connection.RemoteIpAddress?.ToString() ?? Guid.NewGuid().ToString("N");
    }

    var userAgent = context.Request.Headers["User-Agent"].ToString();
    if (userAgent.Length > 200) userAgent = userAgent.Substring(0, 200);

    // Debounce: check if same visitor was recorded within the last 5 minutes to prevent spam
    var fiveMinutesAgo = DateTime.UtcNow.AddMinutes(-5);
    var recentVisit = await db.VisitorLogs
        .AnyAsync(v => v.VisitorId == visitorId && v.VisitedAt >= fiveMinutesAgo);

    if (!recentVisit)
    {
        var log = new VisitorLog
        {
            VisitorId = visitorId,
            Username = req.Username ?? "",
            Division = req.Division ?? "",
            Path = req.Path ?? "/",
            UserAgent = userAgent,
            VisitedAt = DateTime.UtcNow
        };
        db.VisitorLogs.Add(log);
        await db.SaveChangesAsync();
    }

    var baseQuery = db.VisitorLogs.Where(v => !v.VisitorId.StartsWith("v_seed_"));
    var todayStart = DateTime.UtcNow.AddHours(8).Date.AddHours(-8);
    var totalVisits = await baseQuery.CountAsync();
    var todayVisits = await baseQuery.CountAsync(v => v.VisitedAt >= todayStart);
    var uniqueVisitors = await baseQuery.Select(v => v.VisitorId).Distinct().CountAsync();

    return Results.Ok(new
    {
        totalVisits,
        todayVisits,
        uniqueVisitors
    });
}).WithName("RecordVisit").RequireCors("AllowAll");

app.MapGet("/api/visitors/stats", async (AppDbContext db) =>
{
    var baseQuery = db.VisitorLogs.Where(v => !v.VisitorId.StartsWith("v_seed_"));
    var todayStart = DateTime.UtcNow.AddHours(8).Date.AddHours(-8);
    var totalVisits = await baseQuery.CountAsync();
    var todayVisits = await baseQuery.CountAsync(v => v.VisitedAt >= todayStart);
    var uniqueVisitors = await baseQuery.Select(v => v.VisitorId).Distinct().CountAsync();

    var divisionBreakdown = await baseQuery
        .Where(v => !string.IsNullOrEmpty(v.Division) && v.Division != "General")
        .GroupBy(v => v.Division)
        .Select(g => new { division = g.Key, count = g.Count() })
        .OrderByDescending(x => x.count)
        .Take(8)
        .ToListAsync();

    var recentVisits = await baseQuery
        .OrderByDescending(v => v.VisitedAt)
        .Take(25)
        .Select(v => new
        {
            id = v.Id,
            visitorId = v.VisitorId,
            username = string.IsNullOrWhiteSpace(v.Username) ? "Anonymous Visitor" : v.Username,
            division = string.IsNullOrWhiteSpace(v.Division) ? "General" : v.Division,
            visitedAt = v.VisitedAt
        })
        .ToListAsync();

    return Results.Ok(new
    {
        totalVisits,
        todayVisits,
        uniqueVisitors,
        divisionBreakdown,
        recentVisits
    });
}).WithName("GetVisitorStats").RequireCors("AllowAll");

// ═══════════════════════════════════════════
//  ADMIN API ENDPOINTS
// ═══════════════════════════════════════════



app.MapPost("/api/admin/login", (AdminLoginRequest req, IConfiguration config) =>
{
    var expected = config["AdminPassword"] ?? Environment.GetEnvironmentVariable("ADMIN_PASSWORD") ?? "admin123";
    if (req.Password == expected)
        return Results.Ok(new { token = "sesi-admin-secure-token" });
    return Results.Unauthorized();
}).WithName("AdminLogin");

// ──────── USER MANAGEMENT & RBAC ────────

app.MapGet("/api/admin/users", async (AppDbContext db) =>
{
    var users = await db.StaffUsers
        .OrderBy(u => u.FullName)
        .Select(u => new {
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

    // Safeguard: Check if demoting the last remaining Admin
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

// ──────── QUIZ QUESTIONS ────────

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

// ──────── GLOSSARY / DICTIONARY ────────

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

// ──────── INFOGRAPHICS / POSTERS ────────

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

// ──────── AWARDS ────────

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

app.Run();

// ─── Helper: Calculate streak ───
async Task<int> CalculateStreak(string username, AppDbContext db)
{
    var dates = await db.UserActivities
        .Where(a => a.Username == username)
        .OrderByDescending(a => a.ActivityDate)
        .Select(a => a.ActivityDate)
        .ToListAsync();

    if (dates.Count == 0) return 0;

    var today = DateTime.UtcNow.AddHours(8).Date;
    if (dates[0] < today.AddDays(-1)) return 0;

    int streak = 0;
    var expected = dates[0];
    foreach (var date in dates)
    {
        if (date == expected)
        {
            streak++;
            expected = expected.AddDays(-1);
        }
        else break;
    }
    return streak;
}

// ─── Request Records ───
record ReadActivityRequest(string Username);

public class AuthRequest
{
    public string? FullName { get; set; }
    public string? PreferredName { get; set; }
    public string? Email { get; set; }
    public string? Password { get; set; }
    public string? Division { get; set; }
    public string? StaffId { get; set; }
}
