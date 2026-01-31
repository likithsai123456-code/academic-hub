-- Create semesters table
CREATE TABLE public.semesters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.semesters ENABLE ROW LEVEL SECURITY;

-- Everyone can view semesters
CREATE POLICY "Everyone can view semesters" ON public.semesters
  FOR SELECT USING (true);

-- Insert semester data
INSERT INTO public.semesters (name) VALUES
  ('1st Semester'),
  ('2nd Semester'),
  ('3rd Semester'),
  ('4th Semester'),
  ('5th Semester'),
  ('6th Semester'),
  ('7th Semester'),
  ('8th Semester');

-- Add semester_id column to profiles
ALTER TABLE public.profiles ADD COLUMN semester_id UUID REFERENCES public.semesters(id);

-- Drop the old RLS policy on subjects first
DROP POLICY IF EXISTS "Users can view subjects for their section and year" ON public.subjects;

-- Now update subjects table to use semester instead of section
ALTER TABLE public.subjects DROP COLUMN section_id;
ALTER TABLE public.subjects ADD COLUMN semester_id UUID REFERENCES public.semesters(id);

-- Create new RLS policy for subjects
CREATE POLICY "Users can view subjects for their year and semester" ON public.subjects
  FOR SELECT USING (
    (EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.year_id = subjects.year_id
        AND profiles.semester_id = subjects.semester_id
    ))
    OR has_role(auth.uid(), 'admin')
  );