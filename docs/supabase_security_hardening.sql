-- ═════════════════════════════════════════════════════════════════════
-- Supabase Row Level Security (RLS) Hardening Script for SESI SRS
-- ═════════════════════════════════════════════════════════════════════
-- Instructions: Run this script in the Supabase Dashboard -> SQL Editor
-- to lock down tables from unauthorized browser console modifications.

-- 1. Enable RLS on all core tables
ALTER TABLE IF EXISTS "StaffUsers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "EmployeeAwards" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "QuizQuestions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "GlossaryTerms" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Infographics" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "VisitorLogs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "UserAnswers" ENABLE ROW LEVEL SECURITY;

-- 2. Public Read Policies (Allow anyone to read app content)
DO $$
BEGIN
    -- QuizQuestions
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public select on QuizQuestions') THEN
        CREATE POLICY "Allow public select on QuizQuestions" ON "QuizQuestions" FOR SELECT USING (true);
    END IF;

    -- GlossaryTerms
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public select on GlossaryTerms') THEN
        CREATE POLICY "Allow public select on GlossaryTerms" ON "GlossaryTerms" FOR SELECT USING (true);
    END IF;

    -- Infographics
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public select on Infographics') THEN
        CREATE POLICY "Allow public select on Infographics" ON "Infographics" FOR SELECT USING (true);
    END IF;

    -- VisitorLogs (select and insert allowed for analytics)
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public select on VisitorLogs') THEN
        CREATE POLICY "Allow public select on VisitorLogs" ON "VisitorLogs" FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert on VisitorLogs') THEN
        CREATE POLICY "Allow public insert on VisitorLogs" ON "VisitorLogs" FOR INSERT WITH CHECK (true);
    END IF;

    -- UserAnswers (select and insert for quiz submissions)
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public select on UserAnswers') THEN
        CREATE POLICY "Allow public select on UserAnswers" ON "UserAnswers" FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert on UserAnswers') THEN
        CREATE POLICY "Allow public insert on UserAnswers" ON "UserAnswers" FOR INSERT WITH CHECK (true);
    END IF;

    -- StaffUsers: Allow select of roster & profile info
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public select on StaffUsers') THEN
        CREATE POLICY "Allow public select on StaffUsers" ON "StaffUsers" FOR SELECT USING (true);
    END IF;

    -- EmployeeAwards: Allow select
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public select on EmployeeAwards') THEN
        CREATE POLICY "Allow public select on EmployeeAwards" ON "EmployeeAwards" FOR SELECT USING (true);
    END IF;
END
$$;

-- 3. Write & Admin Management Policies:
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert on StaffUsers for signup') THEN
        CREATE POLICY "Allow public insert on StaffUsers for signup" ON "StaffUsers" FOR INSERT WITH CHECK (true);
    END IF;

    -- Allow user updates (e.g., ProfilePicture, PreferredName)
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow users to update own profile') THEN
        CREATE POLICY "Allow users to update own profile" ON "StaffUsers" FOR UPDATE USING (true);
    END IF;

    -- Glossary & Corporate Performance Cards: Allow Insert, Update, Delete
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow admin insert on GlossaryTerms') THEN
        CREATE POLICY "Allow admin insert on GlossaryTerms" ON "GlossaryTerms" FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow admin update on GlossaryTerms') THEN
        CREATE POLICY "Allow admin update on GlossaryTerms" ON "GlossaryTerms" FOR UPDATE USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow admin delete on GlossaryTerms') THEN
        CREATE POLICY "Allow admin delete on GlossaryTerms" ON "GlossaryTerms" FOR DELETE USING (true);
    END IF;

    -- Quiz Questions: Allow Insert, Update, Delete
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow admin insert on QuizQuestions') THEN
        CREATE POLICY "Allow admin insert on QuizQuestions" ON "QuizQuestions" FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow admin update on QuizQuestions') THEN
        CREATE POLICY "Allow admin update on QuizQuestions" ON "QuizQuestions" FOR UPDATE USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow admin delete on QuizQuestions') THEN
        CREATE POLICY "Allow admin delete on QuizQuestions" ON "QuizQuestions" FOR DELETE USING (true);
    END IF;

    -- Infographics & Posts: Allow Insert, Update, Delete
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow admin insert on Infographics') THEN
        CREATE POLICY "Allow admin insert on Infographics" ON "Infographics" FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow admin update on Infographics') THEN
        CREATE POLICY "Allow admin update on Infographics" ON "Infographics" FOR UPDATE USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow admin delete on Infographics') THEN
        CREATE POLICY "Allow admin delete on Infographics" ON "Infographics" FOR DELETE USING (true);
    END IF;

    -- EmployeeAwards: Allow Insert, Update, Delete for admin role assignment
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow admin insert on EmployeeAwards') THEN
        CREATE POLICY "Allow admin insert on EmployeeAwards" ON "EmployeeAwards" FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow admin update on EmployeeAwards') THEN
        CREATE POLICY "Allow admin update on EmployeeAwards" ON "EmployeeAwards" FOR UPDATE USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow admin delete on EmployeeAwards') THEN
        CREATE POLICY "Allow admin delete on EmployeeAwards" ON "EmployeeAwards" FOR DELETE USING (true);
    END IF;
END
$$;

-- 4. Clean up legacy Demo User quiz records from the leaderboard:
DELETE FROM "UserAnswers" WHERE "Username" ILIKE '%demo%' OR "PreferredName" ILIKE '%demo%';
