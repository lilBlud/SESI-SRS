# SESI SRS — System Architecture & Developer Guide

## 1. System Topology & Dual-Target Isolation

SESI SRS operates on a **Strict Dual-Target Architecture**:

```
                       ┌──────────────────────────────────────────┐
                       │            mobile-frontend               │
                       │           (React 19 + Vite)              │
                       └────────────────────┬─────────────────────┘
                                            │
                                  dataProvider.js
                               (Provider Pattern)
                                            │
                   ┌────────────────────────┴────────────────────────┐
                   │                                                 │
          [import.meta.env.DEV]                           [!import.meta.env.DEV]
                   │                                                 │
                   ▼                                                 ▼
        ┌───────────────────────┐                         ┌───────────────────────┐
        │     ssmsProvider      │                         │   supabaseProvider    │
        │   (Local REST API)    │                         │  (@supabase/supabase) │
        └──────────┬────────────┘                         └──────────┬────────────┘
                   │                                                 │
       http://localhost:5195                                 HTTPS REST / WSS
                   │                                                 │
                   ▼                                                 ▼
        ┌───────────────────────┐                         ┌───────────────────────┐
        │    mobile-backend     │                         │    Supabase Cloud     │
        │  (ASP.NET Core 10)    │                         │  (Managed PostgreSQL) │
        └──────────┬────────────┘                         └───────────────────────┘
                   │
         ADO.NET / EF Core
                   │
                   ▼
        ┌───────────────────────┐
        │    Microsoft SQL      │
        │      Server 2019      │
        │   Database: SesiSrs   │
        └───────────────────────┘
```

### Invariant Rules for Developers & Agents:
1. **Local Folder Isolation:**
   - In local development (`npm run dev`), the frontend communicates **only** with `mobile-backend` (`http://localhost:5195`), targeting local Microsoft SQL Server 2019 (`SesiSrs`).
   - If `mobile-backend` is offline, `BackendContext` surfaces an offline banner. It **never** silently falls back to mutate production Supabase data.
2. **Git Repo / Cloudflare Isolation:**
   - The production build (`npm run build`) deployed to Cloudflare Pages uses `supabaseProvider`, communicating directly with Supabase Cloud 24/7 without dependency on any local machine.
3. **Facade Backward Compatibility:**
   - [`src/utils/supabaseClient.js`](mobile-frontend/src/utils/supabaseClient.js) serves as a facade re-exporting methods from [`src/services/`](mobile-frontend/src/services/). Never break exports here.

---

## 2. Directory Structure

```
SESI SRS/
├── ARCHITECTURE.md                             # This file (AI system map & rules)
├── mobile-backend/                             # ASP.NET Core 10 Web API
│   ├── DTOs/                                   # Typed record request/response models
│   │   ├── GlossaryDtos.cs
│   │   ├── QuizDtos.cs
│   │   ├── UserDtos.cs
│   │   └── VisitorDtos.cs
│   ├── Services/                               # Domain services & business rules
│   │   ├── IGlossaryService.cs / GlossaryService.cs
│   │   ├── IQuizService.cs / QuizService.cs
│   │   ├── IUserService.cs / UserService.cs
│   │   ├── IVisitorService.cs / VisitorService.cs
│   │   └── StreakService.cs
│   ├── Endpoints/                              # Thin minimal HTTP routers
│   │   ├── GlossaryEndpoints.cs
│   │   ├── QuizEndpoints.cs
│   │   ├── UserEndpoints.cs
│   │   ├── VisitorEndpoints.cs
│   │   ├── AuthEndpoints.cs
│   │   └── AdminEndpoints.cs
│   ├── Data/                                   # AppDbContext & DbInitializer
│   └── Models/                                 # EF Core Database Entities
├── mobile-backend.Tests/                       # xUnit Automated Test Suite
│   ├── StreakServiceTests.cs                   # Consecutive days, timezone, broken streak tests
│   └── QuizServiceTests.cs                     # Leaderboard scoring & mock exclusions
└── mobile-frontend/                            # React 19 PWA
    ├── src/
    │   ├── services/                           # High-level domain service layer
    │   │   ├── apiConfig.js                    # Base URLs & environment constants
    │   │   ├── dataProvider.js                 # Provider factory (ssms vs supabase)
    │   │   ├── glossaryService.js
    │   │   ├── quizService.js
    │   │   ├── userService.js
    │   │   ├── visitorService.js
    │   │   ├── authService.js
    │   │   └── providers/
    │   │       ├── ssms/                       # Local SQL Server REST client
    │   │       │   └── ssmsProvider.js
    │   │       └── supabase/                   # Production Supabase client
    │   │           └── supabaseProvider.js
    │   ├── context/                            # React Context Providers
    │   │   ├── AuthContext.jsx                 # User state, profile sync, passcode gate
    │   │   ├── ThemeContext.jsx                # Dark mode & view transitions
    │   │   ├── BackendContext.jsx              # Connection monitoring & offline alert
    │   │   └── index.js                        # Barrel re-export
    │   ├── utils/
    │   │   ├── supabaseClient.js               # Backward-compatible facade
    │   │   ├── rbac.js                         # Role resolution & normalization rules
    │   │   └── constants.js                    # Colors, categories, UTC+8 dates
    │   ├── tests/                              # Vitest Unit Test Suite
    │   │   ├── provider.test.js                # Provider interface parity test
    │   │   ├── streak.test.js                  # Streak calculation & UTC+8 rules
    │   │   └── rbac.test.js                    # Role resolution & mock exclusions
    │   ├── components/                         # UI Components & Tabs
    │   │   ├── tabs/                           # HomeTab, GlossaryTab, QuizTab, etc.
    │   │   ├── modals/                         # Edit modals, full leaderboard modal
    │   │   └── ui/                             # Buttons, cards, ErrorBoundary
    │   ├── App.jsx                             # Streamlined layout shell
    │   └── main.jsx                            # Root mount with Context Providers
```

---

## 3. Essential Commands

### Frontend
```bash
# Start Vite local development server (port 5196)
npm run dev --prefix mobile-frontend

# Run Vitest test suite
npm test --prefix mobile-frontend

# Build for Cloudflare Pages production
npm run build --prefix mobile-frontend
```

### Backend
```bash
# Run local C# backend connected to SQL Server (port 5195)
dotnet run --project mobile-backend/mobile-backend.csproj --urls "http://localhost:5195"

# Run xUnit test suite
dotnet test mobile-backend.Tests/mobile-backend.Tests.csproj

# Build backend assembly
dotnet build mobile-backend/mobile-backend.csproj
```

