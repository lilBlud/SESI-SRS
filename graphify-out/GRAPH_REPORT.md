# Graph Report - SESI SRS  (2026-11-12)

## Corpus Check
- 130 files · ~84,091 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: (none) 3, .drawio 2, .bat 2)

## Summary
- 647 nodes · 1541 edges · 31 communities (28 shown, 3 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 76 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5fe79d73`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- react
- mobile_backend.Models
- HomeTab.jsx
- GlossaryTerm
- AppDbContext
- package.json
- FutureGenMapModal.jsx
- React + Vite
- http
- UserAnswer
- Task
- DateTime
- manifest.json
- mobile-backend.csproj
- List
- Infographic
- VisitorLog
- UserService
- skills/index.ts
- .oxlintrc.json
- AppModels.cs
- supabaseClient.js
- QuizQuestion
- SESI SRS — System Architecture & Developer Guide
- RecordVisitRequest
- AuthRequest
- DbInitializer
- UpdateProfilePictureRequest
- AdminTab.jsx

## God Nodes (most connected - your core abstractions)
1. `react` - 57 edges
2. `AppDbContext` - 30 edges
3. `App()` - 23 edges
4. `mobile_backend.Models` - 19 edges
5. `UserAnswer` - 18 edges
6. `mobile_backend.Services` - 18 edges
7. `StaffUser` - 17 edges
8. `GlossaryTerm` - 17 edges
9. `HomeTab()` - 16 edges
10. `ProfileTab()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `QuizServiceTests` --references--> `AppDbContext`  [EXTRACTED]
  mobile-backend.Tests/QuizServiceTests.cs → mobile-backend/Data/AppDbContext.cs
- `StreakServiceTests` --references--> `AppDbContext`  [EXTRACTED]
  mobile-backend.Tests/StreakServiceTests.cs → mobile-backend/Data/AppDbContext.cs
- `AppDbContext` --references--> `EmployeeAward`  [EXTRACTED]
  mobile-backend/Data/AppDbContext.cs → mobile-backend/Models/AppModels.cs
- `AppDbContext` --references--> `GlossaryTerm`  [EXTRACTED]
  mobile-backend/Data/AppDbContext.cs → mobile-backend/Models/AppModels.cs
- `AppDbContext` --references--> `Infographic`  [EXTRACTED]
  mobile-backend/Data/AppDbContext.cs → mobile-backend/Models/AppModels.cs

## Import Cycles
- None detected.

## Communities (31 total, 3 thin omitted)

### Community 0 - "react"
Cohesion: 0.08
Nodes (26): AdminTab, App(), DesktopHeader(), DesktopSidebar(), CONTOUR_PATHS, PasscodeGate(), VALID_PASSCODES, ErrorBoundary (+18 more)

### Community 1 - "mobile_backend.Models"
Cohesion: 0.11
Nodes (13): mobile_backend.Endpoints, mobile_backend.Models, mobile_backend.Services, mobile_backend.Data, mobile_backend.Migrations, mobile_backend.Tests, mobile_backend.DTOs, DivisionBreakdownDto (+5 more)

### Community 2 - "HomeTab.jsx"
Cohesion: 0.07
Nodes (44): EditPreferredNameModal(), DEFAULT_MEDALS, FullLeaderboardModal(), ImageViewerModal(), AdminGlossarySection(), AdminInfographicsSection(), compressImage(), ensureCompressed() (+36 more)

### Community 3 - "GlossaryTerm"
Cohesion: 0.18
Nodes (11): GlossaryTerm, Category, ChartData, CreatedAt, Description, Formula, FormulaNotations, FormulaTermMeanings (+3 more)

### Community 4 - "AppDbContext"
Cohesion: 0.09
Nodes (17): AppDbContext, EmployeeAwards, GlossaryTerms, Infographics, QuizQuestions, SearchHistories, StaffUsers, UserActivities (+9 more)

### Community 5 - "package.json"
Cohesion: 0.06
Nodes (39): dependencies, react@^19.2.8, react-dom@^19.2.8, recharts@^3.10.1, @supabase/supabase-js@^2.118.0, devDependencies, autoprefixer@^10.6.1, oxlint@^1.81.0 (+31 more)

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
Cohesion: 0.14
Nodes (13): UserAnswer, DateAnswered, Division, Id, IsCorrect, Month, PointsAwarded, PreferredName (+5 more)

### Community 10 - "Task"
Cohesion: 0.14
Nodes (6): GlossaryTermDto, InfographicDto, AdminEndpoints, GlossaryEndpoints, GlossaryService, IGlossaryService

### Community 11 - "DateTime"
Cohesion: 0.07
Nodes (20): AuthResponseDto, AuthEndpoints, InitialCreateSqlite, AddChartData, AppDbContextModelSnapshot, SearchHistory, Id, SearchDate (+12 more)

### Community 12 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, orientation, short_name, start_url (+1 more)

### Community 13 - "mobile-backend.csproj"
Cohesion: 0.12
Nodes (15): net10.0, net10.0, coverlet.collector (6.0.4), Microsoft.AspNetCore.OpenApi (10.0.12), Microsoft.EntityFrameworkCore.Design (10.0.12), Microsoft.EntityFrameworkCore.Sqlite (10.0.12), Microsoft.EntityFrameworkCore.SqlServer (10.0.12), Microsoft.EntityFrameworkCore.Tools (10.0.12) (+7 more)

### Community 14 - "List"
Cohesion: 0.22
Nodes (7): LeaderboardEntryDto, QuizQuestionDto, QuizSummaryDto, UserAnswerDto, QuizEndpoints, IQuizService, QuizService

### Community 15 - "Infographic"
Cohesion: 0.25
Nodes (8): Infographic, AdditionalImages, Category, Description, Id, ImageUrl, PostedAt, Title

### Community 16 - "VisitorLog"
Cohesion: 0.25
Nodes (8): VisitorLog, Division, Id, Path, UserAgent, Username, VisitedAt, VisitorId

### Community 17 - "UserService"
Cohesion: 0.19
Nodes (6): ReadActivityDto, StreakDto, UserProfileDto, UserEndpoints, IUserService, UserService

### Community 18 - "skills/index.ts"
Cohesion: 0.33
Nodes (6): EmployeeAward, AwardTitle, Id, Message, Month, Username

### Community 19 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 20 - "AppModels.cs"
Cohesion: 0.20
Nodes (9): AdminLoginRequest, Password, HttpMethodConstants, ReadActivityRequest, UpdatePreferredNameRequest, PreferredName, Username, UpdateUserRoleRequest (+1 more)

### Community 21 - "supabaseClient.js"
Cohesion: 0.12
Nodes (29): LoginPage(), ProfileHeroCard(), ProfilePhotoPickerModal(), ProfileStatsBadges(), formatMonth(), RecentQuestionsCarousel(), ProfileTab(), QuizActiveView() (+21 more)

### Community 22 - "QuizQuestion"
Cohesion: 0.22
Nodes (9): QuizQuestion, CorrectOption, Id, Month, OptionA, OptionB, OptionC, OptionD (+1 more)

### Community 23 - "SESI SRS — System Architecture & Developer Guide"
Cohesion: 0.25
Nodes (7): 1. System Topology & Dual-Target Isolation, 2. Directory Structure, 3. Essential Commands, Backend, Frontend, Invariant Rules for Developers & Agents:, SESI SRS — System Architecture & Developer Guide

### Community 24 - "RecordVisitRequest"
Cohesion: 0.32
Nodes (6): RecordVisitorResultDto, RecordVisitRequest, Division, Path, Username, VisitorId

### Community 25 - "AuthRequest"
Cohesion: 0.29
Nodes (7): AuthRequest, Division, Email, FullName, Password, PreferredName, StaffId

### Community 28 - "UpdateProfilePictureRequest"
Cohesion: 0.67
Nodes (3): UpdateProfilePictureRequest, ProfilePicture, Username

### Community 56 - "AdminTab.jsx"
Cohesion: 0.08
Nodes (35): AdminQuizSection(), AdminRoleModal(), AdminTrafficSection(), formatTimestampMY(), AdminUserCard(), AdminUsersSection(), AdminTab(), currentMonth (+27 more)

## Knowledge Gaps
- **105 isolated node(s):** `net10.0`, `coverlet.collector (6.0.4)`, `Microsoft.NET.Test.Sdk (17.14.1)`, `xunit (2.9.3)`, `xunit.runner.visualstudio (3.1.4)` (+100 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 186 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `HomeTab.jsx`, `package.json`, `FutureGenMapModal.jsx`, `supabaseClient.js`, `AdminTab.jsx`?**
  _High betweenness centrality (0.114) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `App()` (e.g. with `BookIcon()` and `HomeIcon()`) actually correct?**
  _`App()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `net10.0`, `coverlet.collector (6.0.4)`, `Microsoft.NET.Test.Sdk (17.14.1)` to the rest of the system?**
  _105 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.08470588235294117 - nodes in this community are weakly interconnected._
- **Why does `AppDbContext` connect `AppDbContext` to `mobile_backend.Models`, `GlossaryTerm`, `UserAnswer`, `Task`, `DateTime`, `List`, `Infographic`, `VisitorLog`, `UserService`, `skills/index.ts`, `QuizQuestion`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Should `mobile_backend.Models` be split into smaller, more focused modules?**
  _Cohesion score 0.10621468926553672 - nodes in this community are weakly interconnected._
- **Why does `UserAnswer` connect `UserAnswer` to `DateTime`, `AppDbContext`, `AppModels.cs`, `List`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._