var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");

var glossary = new[]
{
    new GlossaryItem("IBR", "Incentive-Based Regulation", "Sets 3-year allowable revenue while rewarding cost efficiency & reliability.", "IBR"),
    new GlossaryItem("RAB", "Regulated Asset Base", "Total approved physical asset infrastructure used to calculate return on capital.", "IBR"),
    new GlossaryItem("WACC", "Weighted Average Cost of Capital", "Allowed return rate balancing cost of debt and expected shareholder return.", "IBR"),
    new GlossaryItem("ICPT", "Imbalance Cost Pass-Through", "6-month adjustment reconciling uncontrollable global fuel price swings.", "IBR"),
    new GlossaryItem("ESG", "Environmental, Social, Governance", "Framework for assessing sustainability and ethical impact of a company.", "ESG"),
    new GlossaryItem("Net Zero", "Net Zero Carbon Emissions", "Balancing the amount of emitted greenhouse gases with equivalent emissions offset.", "ESG"),
    new GlossaryItem("SAIDI", "System Avg Interruption Duration", "Average power outage duration in minutes per customer per year.", "IBR")
};

app.MapGet("/api/glossary", () =>
{
    return Results.Ok(glossary);
})
.WithName("GetGlossary");

app.Run();

record GlossaryItem(string Term, string Full, string Desc, string Cat);
