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

// ─── Glossary Data ───
var glossary = new[]
{
    new GlossaryItem("IBR", "Incentive-Based Regulation", "Sets 3-year allowable revenue while rewarding cost efficiency & reliability.", "IBR"),
    new GlossaryItem("RAB", "Regulated Asset Base", "Total approved physical asset infrastructure used to calculate return on capital.", "IBR"),
    new GlossaryItem("WACC", "Weighted Average Cost of Capital", "Allowed return rate balancing cost of debt and expected shareholder return.", "IBR"),
    new GlossaryItem("ICPT", "Imbalance Cost Pass-Through", "6-month adjustment reconciling uncontrollable global fuel price swings.", "IBR"),
    new GlossaryItem("OPEX", "Operating Expenditure", "The day-to-day costs incurred by the utility to maintain and operate the network.", "IBR"),
    new GlossaryItem("CAPEX", "Capital Expenditure", "Investment in new assets or upgrades to existing infrastructure within the regulated network.", "IBR"),
    new GlossaryItem("SAIDI", "System Avg Interruption Duration", "Average power outage duration in minutes per customer per year.", "IBR"),
    new GlossaryItem("SAIFI", "System Avg Interruption Frequency", "Average number of sustained interruptions per customer per year.", "IBR"),
    new GlossaryItem("RP", "Regulatory Period", "The fixed time frame (usually 3 years) for which tariffs and revenue caps are set under IBR.", "IBR"),
    new GlossaryItem("BBM", "Building Block Model", "The methodology used to calculate the total allowed revenue from individual cost components.", "IBR"),
    new GlossaryItem("ESG", "Environmental, Social, Governance", "Framework for assessing sustainability and ethical impact of a company.", "ESG"),
    new GlossaryItem("Net Zero", "Net Zero Carbon Emissions", "Balancing the amount of emitted greenhouse gases with equivalent emissions offset.", "ESG"),
    new GlossaryItem("RE", "Renewable Energy", "Energy generated from naturally replenishing sources like solar, wind, hydro, and biomass.", "ESG"),
    new GlossaryItem("TCFD", "Task Force on Climate-related Financial Disclosures", "Framework for companies to disclose climate-related financial risks and opportunities.", "ESG"),
    new GlossaryItem("GHG", "Greenhouse Gas", "Gases that trap heat in the atmosphere, contributing to global warming (CO₂, methane, etc.).", "ESG"),
    new GlossaryItem("SDG", "Sustainable Development Goals", "17 global goals set by the United Nations for sustainable development by 2030.", "ESG")
};

// ─── Quiz Data ───
var quizQuestions = new[]
{
    new QuizQuestion(1, "What does IBR stand for?",
        new[] { "Incentive-Based Regulation", "International Business Report", "Internal Budget Review", "Integrated Balance Ratio" },
        0, "IBR stands for Incentive-Based Regulation — a framework that sets allowable revenue over a regulatory period while rewarding efficiency."),

    new QuizQuestion(2, "What is the Building Block Model used for?",
        new[] { "Constructing physical buildings", "Calculating total allowed revenue", "Managing employee schedules", "Designing software architecture" },
        1, "The Building Block Model calculates total allowed revenue by summing OPEX, Depreciation, Return on RAB, and Taxes."),

    new QuizQuestion(3, "The formula for Revenue Requirement is:",
        new[] { "Revenue = RAB × WACC", "Revenue = OPEX + Depreciation + (RAB × WACC) + Taxes", "Revenue = CAPEX + OPEX", "Revenue = SAIDI × SAIFI" },
        1, "The complete Revenue Requirement formula includes all four building blocks: OPEX, Depreciation, Return on Capital (RAB × WACC), and Taxes."),

    new QuizQuestion(4, "What does WACC represent?",
        new[] { "World Average Carbon Credit", "Weighted Average Cost of Capital", "Weekly Asset Compliance Check", "Wholesale Actual Cost Calculator" },
        1, "WACC is the Weighted Average Cost of Capital — the allowed return rate that balances the cost of debt and expected shareholder return."),

    new QuizQuestion(5, "How often is ICPT typically adjusted?",
        new[] { "Every month", "Every 6 months", "Every year", "Every 3 years" },
        1, "ICPT (Imbalance Cost Pass-Through) is adjusted every 6 months to reconcile uncontrollable global fuel price swings."),

    new QuizQuestion(6, "What does RAB stand for?",
        new[] { "Revenue Allocation Board", "Regulated Asset Base", "Risk Assessment Benchmark", "Regional Authority Budget" },
        1, "RAB is the Regulated Asset Base — the total approved physical asset infrastructure used to calculate return on capital."),

    new QuizQuestion(7, "What does SAIDI measure?",
        new[] { "System average interruption duration", "Standard annual investment depreciation", "Sustainable asset impact disclosure", "System automated incident detection" },
        0, "SAIDI measures the System Average Interruption Duration — the average power outage duration in minutes per customer per year."),

    new QuizQuestion(8, "What is the typical duration of a Regulatory Period (RP) under IBR?",
        new[] { "1 year", "2 years", "3 years", "5 years" },
        2, "Under IBR, a Regulatory Period typically spans 3 years, during which tariffs and revenue caps remain fixed."),

    new QuizQuestion(9, "What does ESG stand for?",
        new[] { "Energy Supply Governance", "Environmental, Social, Governance", "Economic Stability Growth", "Efficiency Standards Guide" },
        1, "ESG stands for Environmental, Social, and Governance — a framework for assessing sustainability and ethical impact."),

    new QuizQuestion(10, "What is the goal of 'Net Zero'?",
        new[] { "Zero profit margin", "Zero customer complaints", "Balancing emitted greenhouse gases with offsets", "Zero network downtime" },
        2, "Net Zero means balancing the amount of emitted greenhouse gases with equivalent emissions offsets to achieve carbon neutrality.")
};

// ─── API Endpoints ───
app.MapGet("/api/glossary", () => Results.Ok(glossary))
   .WithName("GetGlossary");

app.MapGet("/api/quiz", () => Results.Ok(quizQuestions))
   .WithName("GetQuiz");

app.Run();

// ─── Records ───
record GlossaryItem(string Term, string Full, string Desc, string Cat);
record QuizQuestion(int Id, string Question, string[] Options, int CorrectIndex, string Explanation);
