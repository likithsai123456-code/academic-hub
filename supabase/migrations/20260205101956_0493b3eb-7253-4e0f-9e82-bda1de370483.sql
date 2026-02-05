-- Fix RLS policies so public lookup tables are actually selectable by unauthenticated users.
-- The existing policies were created as RESTRICTIVE, which can result in no rows being visible.

BEGIN;

-- years
DROP POLICY IF EXISTS "Everyone can view years" ON public.years;
CREATE POLICY "Everyone can view years"
ON public.years
FOR SELECT
USING (true);

-- semesters
DROP POLICY IF EXISTS "Everyone can view semesters" ON public.semesters;
CREATE POLICY "Everyone can view semesters"
ON public.semesters
FOR SELECT
USING (true);

COMMIT;