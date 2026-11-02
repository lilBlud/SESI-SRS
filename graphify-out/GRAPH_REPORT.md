# Graph Report - SESI SRS  (2026-10-30)

## Corpus Check
- 78 files · ~73,608 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 3, .drawio 2, .http 1)

## Summary
- 423 nodes · 853 edges · 24 communities (22 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d99aef61`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App.jsx
- AppModels.cs
- AdminGlossarySection.jsx
- GlossaryTerm
- AppDbContext
- package.json
- FutureGenMapModal.jsx
- React + Vite
- http
- UserAnswer
- react
- StaffUser
- manifest.json
- mobile-backend.csproj
- DateTime
- Infographic
- VisitorLog
- AuthRequest
- EmployeeAward
- .oxlintrc.json
- UserActivity
- react

## God Nodes (most connected - your core abstractions)
1. `react` - 44 edges
2. `AppDbContext` - 23 edges
3. `App()` - 18 edges
4. `HomeTab()` - 16 edges
5. `ProfileTab()` - 16 edges
6. `UserAnswer` - 15 edges
7. `extractUserTargets()` - 15 edges
8. `GlossaryTerm` - 14 edges
9. `StaffUser` - 13 edges
10. `AdminTab()` - 13 edges

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

## Communities (24 total, 2 thin omitted)

### Community 0 - "App.jsx"
Cohesion: 0.12
Nodes (19): AdminTab, App(), LoginPage(), PasscodeGate(), VALID_PASSCODES, BookIcon(), HomeIcon(), ProfileIcon() (+11 more)

### Community 1 - "AppModels.cs"
Cohesion: 0.07
Nodes (22): mobile_backend.Models, mobile_backend.Data, mobile_backend.Migrations, InitialCreateSqlite, AddChartData, AppDbContextModelSnapshot, AdminLoginRequest, Password (+14 more)

### Community 2 - "AdminGlossarySection.jsx"
Cohesion: 0.28
Nodes (8): AdminGlossarySection(), AdminGlossaryCardList(), AdminGlossaryForm(), ProfilePhotoPickerModal(), InstagramPhotoCropper(), CorporatePerformanceChart(), getYAxisUnit(), DEFAULT_HISTORICAL_METRICS

### Community 3 - "GlossaryTerm"
Cohesion: 0.08
Nodes (21): DbInitializer, GlossaryTerm, Category, ChartData, CreatedAt, Description, Formula, FormulaNotations (+13 more)

### Community 4 - "AppDbContext"
Cohesion: 0.15
Nodes (10): AppDbContext, EmployeeAwards, GlossaryTerms, Infographics, QuizQuestions, SearchHistories, StaffUsers, UserActivities (+2 more)

### Community 5 - "package.json"
Cohesion: 0.07
Nodes (38): dependencies, react@^19.2.8, react-dom@^19.2.8, recharts@^3.10.1, @supabase/supabase-js@^2.118.0, devDependencies, autoprefixer@^10.6.1, oxlint@^1.81.0 (+30 more)

### Community 6 - "FutureGenMapModal.jsx"
Cohesion: 0.14
Nodes (21): BridgingCapacityView(), PipelineStagesView(), ProjectBreakdownCard(), SabahInteractiveMap(), FutureGenMapModal(), BRIDGING_CAPACITY, FUEL_TYPE_CONFIG, FUTURE_GEN_PROJECTS (+13 more)

### Community 7 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the Oxlint configuration, React Compiler, React + Vite

### Community 8 - "http"
Cohesion: 0.13
Nodes (15): ASPNETCORE_ENVIRONMENT, applicationUrl, commandName, dotnetRunMessages, environmentVariables, launchBrowser, applicationUrl, commandName (+7 more)

### Community 9 - "UserAnswer"
Cohesion: 0.15
Nodes (13): UserAnswer, DateAnswered, Division, Id, IsCorrect, Month, PointsAwarded, PreferredName (+5 more)

### Community 10 - "react"
Cohesion: 0.08
Nodes (40): EditPreferredNameModal(), DEFAULT_MEDALS, FullLeaderboardModal(), ImageViewerModal(), GlossaryFlashcardView(), GlossaryFutureGenCard(), GlossaryTab(), HomeAdminTrafficCard() (+32 more)

### Community 11 - "StaffUser"
Cohesion: 0.18
Nodes (11): StaffUser, CreatedAt, Division, Email, FullName, Id, PasswordHash, PreferredName (+3 more)

### Community 12 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, orientation, short_name, start_url (+1 more)

### Community 13 - "mobile-backend.csproj"
Cohesion: 0.22
Nodes (8): net10.0, Microsoft.AspNetCore.OpenApi (10.0.12), Microsoft.EntityFrameworkCore.Design (10.0.12), Microsoft.EntityFrameworkCore.Sqlite (10.0.12), Microsoft.EntityFrameworkCore.SqlServer (10.0.12), Microsoft.EntityFrameworkCore.Tools (10.0.12), Npgsql.EntityFrameworkCore.PostgreSQL (10.0.3), Microsoft.NET.Sdk.Web

### Community 14 - "DateTime"
Cohesion: 0.28
Nodes (4): SearchHistory, Id, SearchDate, Term

### Community 15 - "Infographic"
Cohesion: 0.25
Nodes (8): Infographic, AdditionalImages, Category, Description, Id, ImageUrl, PostedAt, Title

### Community 16 - "VisitorLog"
Cohesion: 0.25
Nodes (8): VisitorLog, Division, Id, Path, UserAgent, Username, VisitedAt, VisitorId

### Community 17 - "AuthRequest"
Cohesion: 0.29
Nodes (7): AuthRequest, Division, Email, FullName, Password, PreferredName, StaffId

### Community 18 - "EmployeeAward"
Cohesion: 0.33
Nodes (6): EmployeeAward, AwardTitle, Id, Message, Month, Username

### Community 19 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 20 - "UserActivity"
Cohesion: 0.50
Nodes (4): UserActivity, ActivityDate, Id, Username

### Community 22 - "react"
Cohesion: 0.12
Nodes (29): AdminInfographicsSection(), AdminQuizSection(), AdminRoleModal(), AdminTrafficSection(), AdminUserCard(), AdminUsersSection(), AdminTab(), currentMonth (+21 more)

## Knowledge Gaps
- **98 isolated node(s):** `UserAnswers`, `QuizQuestions`, `EmployeeAwards`, `UserActivities`, `SearchHistories` (+93 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 162 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App.jsx` to `AdminGlossarySection.jsx`, `package.json`, `FutureGenMapModal.jsx`, `react`, `react`?**
  _High betweenness centrality (0.141) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `App()` (e.g. with `BookIcon()` and `HomeIcon()`) actually correct?**
  _`App()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `UserAnswers`, `QuizQuestions`, `EmployeeAwards` to the rest of the system?**
  _98 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12473118279569892 - nodes in this community are weakly interconnected._
- **Why does `AppDbContext` connect `AppDbContext` to `AppModels.cs`, `GlossaryTerm`, `UserAnswer`, `StaffUser`, `DateTime`, `Infographic`, `VisitorLog`, `EmployeeAward`, `UserActivity`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Should `AppModels.cs` be split into smaller, more focused modules?**
  _Cohesion score 0.07215541165587419 - nodes in this community are weakly interconnected._
- **Why does `UserAnswer` connect `UserAnswer` to `AppModels.cs`, `AppDbContext`, `DateTime`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._