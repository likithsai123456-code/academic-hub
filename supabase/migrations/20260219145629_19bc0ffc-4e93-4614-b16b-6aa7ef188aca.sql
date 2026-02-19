
-- Fix: Allow faculty to view all subjects (needed for creating assignments)
CREATE POLICY "Faculty can view all subjects"
ON public.subjects
FOR SELECT
USING (has_role(auth.uid(), 'faculty'::app_role));
