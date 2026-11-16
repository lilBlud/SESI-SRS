# Feature-Module Workspace Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize root docs, `mobile-backend`, and `mobile-frontend/src` into clean, self-contained feature modules without altering runtime behavior, API routes, or test coverage.

**Architecture:** Preserve all C# namespaces (`mobile_backend.*`) during file moves so EF Core migrations, DI registrations, and unit tests stay intact with zero namespace churn, while grouping files on disk under `Features/<Domain>/` in `mobile-backend` and `features/<domain>/` + `shared/` in `mobile-frontend/src`. Keep `supabaseClient.js` and `components/tabs/index.js` facades intact where needed so existing imports and lazy routes continue working cleanly.

**Tech Stack:** .NET 10 ASP.NET Core, xUnit, React 19, Vite 8, Vitest.

## Global Constraints
- Zero API URL changes (`/api/*` routes remain identical).
- Zero database schema or migration changes (`AppDbContext` + `Migrations/` remain untouched in place).
- Every task ends with passing `dotnet test mobile-backend.Tests\mobile-backend.Tests.csproj` (19/19), `npm test --prefix mobile-frontend` (12/12), and `npm run build --prefix mobile-frontend`.
- Deploy scripts (`start-all.bat`, `deploy-cloudflare.bat`) and `publish-backend/` stay runnable from repo root.

## Review Focus
1. Broken relative imports in `mobile-frontend/src` after moving files from `components/tabs/*` and `components/pages/*` into `features/*`.
2. Vite lazy-chunk imports in `App.jsx` pointing to updated `features/*` paths.
3. CSS / Tailwind `content` globs in `mobile-frontend/tailwind.config.js` still scanning `src/**/*.{js,jsx}` so no utility classes get purged.
4. `mobile-backend.csproj` compiling all `.cs` files under `Features/**` with no duplicate compile entries.
5. `mobile-backend.Tests` referencing moved services cleanly.

---

### Task 1: Organize Root Documentation into `docs/`

**Files:**
- Move: `ARCHITECTURE.md` -> `docs/ARCHITECTURE.md`
- Move: `SESI_App_Flow.drawio` -> `docs/SESI_App_Flow.drawio`
- Move: `SESI_App_Flow_Viewer.html` -> `docs/SESI_App_Flow_Viewer.html`
- Move: `SESI_Corporate_Risk_Process_Flow.drawio` -> `docs/SESI_Corporate_Risk_Process_Flow.drawio`
- Move: `supabase_security_hardening.sql` -> `docs/supabase_security_hardening.sql`

- [ ] **Step 1: Move root docs/diagrams into `docs/`**
  Run `git mv` for the 5 root documentation/diagram/SQL reference files into `docs/`.
- [ ] **Step 2: Verify `git status` and commit**
  ```bash
  git status --short
  git commit -m "chore(docs): move architecture, flow diagrams, and SQL script into docs/"
  ```

---

### Task 2: Group `mobile-backend` by Feature Module (`Features/<Module>/`)

**Files:**
- Move into `mobile-backend/Features/Auth/`:
  - `Endpoints/AuthEndpoints.cs` -> `Features/Auth/AuthEndpoints.cs`
  - `Services/SecurityHelper.cs` -> `Features/Auth/SecurityHelper.cs`
- Move into `mobile-backend/Features/Users/`:
  - `Endpoints/UserEndpoints.cs` -> `Features/Users/UserEndpoints.cs`
  - `Services/IUserService.cs` -> `Features/Users/IUserService.cs`
  - `Services/UserService.cs` -> `Features/Users/UserService.cs`
  - `Services/StreakService.cs` -> `Features/Users/StreakService.cs`
  - `DTOs/UserDtos.cs` -> `Features/Users/UserDtos.cs`
- Move into `mobile-backend/Features/Glossary/`:
  - `Endpoints/GlossaryEndpoints.cs` -> `Features/Glossary/GlossaryEndpoints.cs`
  - `Services/IGlossaryService.cs` -> `Features/Glossary/IGlossaryService.cs`
  - `Services/GlossaryService.cs` -> `Features/Glossary/GlossaryService.cs`
  - `DTOs/GlossaryDtos.cs` -> `Features/Glossary/GlossaryDtos.cs`
- Move into `mobile-backend/Features/Quiz/`:
  - `Endpoints/QuizEndpoints.cs` -> `Features/Quiz/QuizEndpoints.cs`
  - `Services/IQuizService.cs` -> `Features/Quiz/IQuizService.cs`
  - `Services/QuizService.cs` -> `Features/Quiz/QuizService.cs`
  - `DTOs/QuizDtos.cs` -> `Features/Quiz/QuizDtos.cs`
- Move into `mobile-backend/Features/Visitors/`:
  - `Endpoints/VisitorEndpoints.cs` -> `Features/Visitors/VisitorEndpoints.cs`
  - `Services/IVisitorService.cs` -> `Features/Visitors/IVisitorService.cs`
  - `Services/VisitorService.cs` -> `Features/Visitors/VisitorService.cs`
  - `DTOs/VisitorDtos.cs` -> `Features/Visitors/VisitorDtos.cs`
- Move into `mobile-backend/Features/Admin/`:
  - `Endpoints/AdminEndpoints.cs` -> `Features/Admin/AdminEndpoints.cs`
- Keep `Data/`, `Models/`, `Migrations/`, `Program.cs` at `mobile-backend/` root.

- [ ] **Step 1: Move files into `mobile-backend/Features/<Domain>/` preserving C# namespaces**
  Use `git mv` for each file above and remove now-empty `Endpoints/`, `Services/`, `DTOs/` folders.
- [ ] **Step 2: Run backend build & unit tests**
  ```bash
  dotnet build mobile-backend.Tests\mobile-backend.Tests.csproj --no-incremental
  dotnet test mobile-backend.Tests\mobile-backend.Tests.csproj --no-build
  ```
  Expected: `Build succeeded. 0 Warning(s), 0 Error(s)`, `Passed: 19, Failed: 0`.
- [ ] **Step 3: Commit backend module restructure**
  ```bash
  git add -A
  git commit -m "refactor(backend): group endpoints, services, and DTOs into Features/ modules"
  ```

---

### Task 3: Group `mobile-frontend/src` by Feature Module (`features/<domain>/` + `shared/`)

**Files:**
- `mobile-frontend/src/features/auth/`:
  - `components/pages/PasscodeGate.jsx` -> `features/auth/PasscodeGate.jsx`
  - `components/pages/LoginPage.jsx` -> `features/auth/LoginPage.jsx`
  - `services/authService.js` -> `features/auth/authService.js`
- `mobile-frontend/src/features/home/`:
  - `components/tabs/HomeTab.jsx` -> `features/home/HomeTab.jsx`
  - `components/tabs/home/*` -> `features/home/components/*`
- `mobile-frontend/src/features/glossary/`:
  - `components/tabs/GlossaryTab.jsx` -> `features/glossary/GlossaryTab.jsx`
  - `components/tabs/glossary/*` -> `features/glossary/components/*`
  - `services/glossaryService.js` -> `features/glossary/glossaryService.js`
- `mobile-frontend/src/features/quiz/`:
  - `components/tabs/QuizTab.jsx` -> `features/quiz/QuizTab.jsx`
  - `components/tabs/quiz/*` -> `features/quiz/components/*`
  - `services/quizService.js` -> `features/quiz/quizService.js`
- `mobile-frontend/src/features/profile/`:
  - `components/tabs/ProfileTab.jsx` -> `features/profile/ProfileTab.jsx`
  - `components/tabs/profile/*` -> `features/profile/components/*`
- `mobile-frontend/src/features/admin/`:
  - `components/tabs/AdminTab.jsx` -> `features/admin/AdminTab.jsx`
  - `components/tabs/admin/*` -> `features/admin/components/*`
- Update imports in:
  - `src/App.jsx`
  - `src/utils/supabaseClient.js`
  - `src/components/tabs/index.js` (or remove if `App.jsx` lazy-loads directly from `features/*`)
  - Moved feature files referencing `context/`, `services/`, `utils/`, `components/ui`, `components/modals`

- [ ] **Step 1: Move frontend domain folders into `mobile-frontend/src/features/<domain>/`**
  Move each domain group and update relative imports cleanly.
- [ ] **Step 2: Run frontend tests and production build**
  ```bash
  npm test --prefix mobile-frontend
  npm run build --prefix mobile-frontend
  ```
  Expected: `Test Files 3 passed (3)`, `Tests 12 passed (12)`, `vite build` succeeds with 0 errors.
- [ ] **Step 3: Sync `dist/` to IIS `wwwroot/`, publish backend, and deploy to Cloudflare Pages**
  ```bash
  dotnet publish mobile-backend\mobile-backend.csproj -c Release -o publish-backend
  npx --prefix mobile-frontend wrangler pages deploy mobile-frontend/dist --project-name sesi--srs --commit-dirty=true
  git add -A
  git commit -m "refactor(frontend): organize src into domain features/ modules"
  git push origin main
  ```
