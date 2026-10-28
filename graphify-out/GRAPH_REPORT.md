# Graph Report - SESI SRS  (2026-10-28)

## Corpus Check
- 98 files · ~74,005 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 3, .drawio 2, .db 2)

## Summary
- 482 nodes · 894 edges · 40 communities (24 shown, 16 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `478536ab`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- supabaseClient.js
- DbInitializer.cs
- scripts/refactor.cjs
- HomeTab.jsx
- UserAnswer
- package.json
- FutureGenMapModal.jsx
- React + Vite
- http
- AppDbContext
- GlossaryTab.jsx
- StaffUser
- manifest.json
- mobile-backend.csproj
- Infographic
- VisitorLog
- DateTime
- AuthRequest
- EmployeeAward
- .oxlintrc.json
- scripts/README.md
- AppModels.cs
- GlossaryTerm
- scripts/update_db.js
- mockData.js
- QuizQuestion
- .Initialize
- RecordVisitRequest

## God Nodes (most connected - your core abstractions)
1. `react` - 45 edges
2. `AppDbContext` - 23 edges
3. `App()` - 18 edges
4. `UserAnswer` - 16 edges
5. `HomeTab()` - 16 edges
6. `ProfileTab()` - 16 edges
7. `extractUserTargets()` - 15 edges
8. `GlossaryTerm` - 14 edges
9. `StaffUser` - 13 edges
10. `AdminTab()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `AppDbContext` --references--> `EmployeeAward`  [EXTRACTED]
  mobile-backend/Data/AppDbContext.cs → mobile-backend/Models/AppModels.cs
- `AppDbContext` --references--> `GlossaryTerm`  [EXTRACTED]
  mobile-backend/Data/AppDbContext.cs → mobile-backend/Models/AppModels.cs
- `AppDbContext` --references--> `Infographic`  [EXTRACTED]
  mobile-backend/Data/AppDbContext.cs → mobile-backend/Models/AppModels.cs
- `AppDbContext` --references--> `QuizQuestion`  [EXTRACTED]
  mobile-backend/Data/AppDbContext.cs → mobile-backend/Models/AppModels.cs
- `AppDbContext` --references--> `SearchHistory`  [EXTRACTED]
  mobile-backend/Data/AppDbContext.cs → mobile-backend/Models/AppModels.cs

## Import Cycles
- None detected.

## Communities (40 total, 16 thin omitted)

### Community 0 - "supabaseClient.js"
Cohesion: 0.08
Nodes (38): AdminTab, App(), LoginPage(), PasscodeGate(), VALID_PASSCODES, AdminInfographicsSection(), AdminQuizSection(), AdminRoleModal() (+30 more)

### Community 1 - "DbInitializer.cs"
Cohesion: 0.21
Nodes (4): mobile_backend.Models, mobile_backend.Data, mobile_backend.Migrations, ReadActivityRequest

### Community 2 - "scripts/refactor.cjs"
Cohesion: 0.05
Nodes (35): assets, __dirname, __filename, publicAssetsDir, fs, path, publicDir, fs (+27 more)

### Community 3 - "HomeTab.jsx"
Cohesion: 0.10
Nodes (36): EditPreferredNameModal(), DEFAULT_MEDALS, FullLeaderboardModal(), ImageViewerModal(), HomeAdminTrafficCard(), HomeHeroBanner(), HomeLeaderboardPodium(), HomeTab() (+28 more)

### Community 4 - "UserAnswer"
Cohesion: 0.15
Nodes (13): UserAnswer, DateAnswered, Division, Id, IsCorrect, Month, PointsAwarded, PreferredName (+5 more)

### Community 5 - "package.json"
Cohesion: 0.07
Nodes (37): dependencies, react@^19.2.8, react-dom@^19.2.8, recharts@^3.10.1, @supabase/supabase-js@^2.118.0, devDependencies, autoprefixer@^10.6.1, oxlint@^1.81.0 (+29 more)

### Community 6 - "FutureGenMapModal.jsx"
Cohesion: 0.14
Nodes (21): BridgingCapacityView(), PipelineStagesView(), ProjectBreakdownCard(), SabahInteractiveMap(), FutureGenMapModal(), BRIDGING_CAPACITY, FUEL_TYPE_CONFIG, FUTURE_GEN_PROJECTS (+13 more)

### Community 7 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the Oxlint configuration, React Compiler, React + Vite

### Community 8 - "http"
Cohesion: 0.13
Nodes (15): ASPNETCORE_ENVIRONMENT, applicationUrl, commandName, dotnetRunMessages, environmentVariables, launchBrowser, applicationUrl, commandName (+7 more)

### Community 9 - "AppDbContext"
Cohesion: 0.15
Nodes (10): AppDbContext, EmployeeAwards, GlossaryTerms, Infographics, QuizQuestions, SearchHistories, StaffUsers, UserActivities (+2 more)

### Community 10 - "GlossaryTab.jsx"
Cohesion: 0.16
Nodes (17): AdminGlossarySection(), AdminGlossaryCardList(), AdminGlossaryForm(), GlossaryFlashcardView(), GlossaryFutureGenCard(), GlossaryTab(), BookmarksSection(), CorporatePerformanceChart() (+9 more)

### Community 11 - "StaffUser"
Cohesion: 0.18
Nodes (11): StaffUser, CreatedAt, Division, Email, FullName, Id, PasswordHash, PreferredName (+3 more)

### Community 12 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, orientation, short_name, start_url (+1 more)

### Community 13 - "mobile-backend.csproj"
Cohesion: 0.22
Nodes (8): net10.0, Microsoft.AspNetCore.OpenApi (10.0.12), Microsoft.EntityFrameworkCore.Design (10.0.12), Microsoft.EntityFrameworkCore.Sqlite (10.0.12), Microsoft.EntityFrameworkCore.SqlServer (10.0.12), Microsoft.EntityFrameworkCore.Tools (10.0.12), Npgsql.EntityFrameworkCore.PostgreSQL (10.0.3), Microsoft.NET.Sdk.Web

### Community 14 - "Infographic"
Cohesion: 0.25
Nodes (8): Infographic, AdditionalImages, Category, Description, Id, ImageUrl, PostedAt, Title

### Community 15 - "VisitorLog"
Cohesion: 0.25
Nodes (8): VisitorLog, Division, Id, Path, UserAgent, Username, VisitedAt, VisitorId

### Community 16 - "DateTime"
Cohesion: 0.21
Nodes (3): InitialCreateSqlite, AddChartData, AppDbContextModelSnapshot

### Community 17 - "AuthRequest"
Cohesion: 0.29
Nodes (7): AuthRequest, Division, Email, FullName, Password, PreferredName, StaffId

### Community 18 - "EmployeeAward"
Cohesion: 0.33
Nodes (6): EmployeeAward, AwardTitle, Id, Message, Month, Username

### Community 19 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 21 - "AppModels.cs"
Cohesion: 0.11
Nodes (18): AdminLoginRequest, Password, SearchHistory, Id, SearchDate, Term, UpdatePreferredNameRequest, PreferredName (+10 more)

### Community 22 - "GlossaryTerm"
Cohesion: 0.18
Nodes (11): GlossaryTerm, Category, ChartData, CreatedAt, Description, Formula, FormulaNotations, FormulaTermMeanings (+3 more)

### Community 37 - "QuizQuestion"
Cohesion: 0.22
Nodes (9): QuizQuestion, CorrectOption, Id, Month, OptionA, OptionB, OptionC, OptionD (+1 more)

### Community 39 - "RecordVisitRequest"
Cohesion: 0.40
Nodes (5): RecordVisitRequest, Division, Path, Username, VisitorId

## Knowledge Gaps
- **98 isolated node(s):** `UserAnswers`, `QuizQuestions`, `EmployeeAwards`, `UserActivities`, `SearchHistories` (+93 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 214 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `supabaseClient.js` to `GlossaryTab.jsx`, `HomeTab.jsx`, `package.json`, `FutureGenMapModal.jsx`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `App()` (e.g. with `BookIcon()` and `HomeIcon()`) actually correct?**
  _`App()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `UserAnswers`, `QuizQuestions`, `EmployeeAwards` to the rest of the system?**
  _98 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `supabaseClient.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07540983606557378 - nodes in this community are weakly interconnected._
- **Why does `AppDbContext` connect `AppDbContext` to `DbInitializer.cs`, `UserAnswer`, `QuizQuestion`, `.Initialize`, `StaffUser`, `Infographic`, `VisitorLog`, `EmployeeAward`, `AppModels.cs`, `GlossaryTerm`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Should `scripts/refactor.cjs` be split into smaller, more focused modules?**
  _Cohesion score 0.0507399577167019 - nodes in this community are weakly interconnected._
- **Why does `UserAnswer` connect `UserAnswer` to `DateTime`, `AppDbContext`, `AppModels.cs`, `.Initialize`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._