
-- Create assignments table (faculty creates these)
CREATE TABLE public.assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  instructions TEXT,
  subject_id UUID REFERENCES public.subjects(id),
  created_by UUID NOT NULL,
  year_id UUID REFERENCES public.years(id),
  semester_id UUID REFERENCES public.semesters(id),
  section_id UUID REFERENCES public.sections(id),
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  file_url TEXT,
  file_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- Faculty can create assignments
CREATE POLICY "Faculty can create assignments"
  ON public.assignments FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'faculty') AND auth.uid() = created_by);

-- Faculty can update their own assignments
CREATE POLICY "Faculty can update own assignments"
  ON public.assignments FOR UPDATE
  USING (has_role(auth.uid(), 'faculty') AND auth.uid() = created_by);

-- Faculty can delete their own assignments
CREATE POLICY "Faculty can delete own assignments"
  ON public.assignments FOR DELETE
  USING (has_role(auth.uid(), 'faculty') AND auth.uid() = created_by);

-- Students can view assignments for their year/semester, faculty & admin can view all they created or all
CREATE POLICY "Users can view relevant assignments"
  ON public.assignments FOR SELECT
  USING (
    -- Students see assignments matching their year/semester
    (EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.year_id = assignments.year_id
        AND profiles.semester_id = assignments.semester_id
    ))
    OR has_role(auth.uid(), 'faculty')
    OR has_role(auth.uid(), 'admin')
  );

-- Create submissions table
CREATE TABLE public.submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size TEXT,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'evaluated', 'late')),
  grade TEXT,
  feedback TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  evaluated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Students can submit
CREATE POLICY "Students can create submissions"
  ON public.submissions FOR INSERT
  WITH CHECK (auth.uid() = student_id AND has_role(auth.uid(), 'student'));

-- Students can view their own submissions
CREATE POLICY "Students can view own submissions"
  ON public.submissions FOR SELECT
  USING (auth.uid() = student_id);

-- Faculty can view submissions for their assignments
CREATE POLICY "Faculty can view submissions for their assignments"
  ON public.submissions FOR SELECT
  USING (
    has_role(auth.uid(), 'faculty') AND EXISTS (
      SELECT 1 FROM assignments WHERE assignments.id = submissions.assignment_id AND assignments.created_by = auth.uid()
    )
  );

-- Faculty can update submissions (for grading)
CREATE POLICY "Faculty can evaluate submissions"
  ON public.submissions FOR UPDATE
  USING (
    has_role(auth.uid(), 'faculty') AND EXISTS (
      SELECT 1 FROM assignments WHERE assignments.id = submissions.assignment_id AND assignments.created_by = auth.uid()
    )
  );

-- Admin can view all
CREATE POLICY "Admin can view all submissions"
  ON public.submissions FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_assignments_updated_at
  BEFORE UPDATE ON public.assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at
  BEFORE UPDATE ON public.submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage buckets for files
INSERT INTO storage.buckets (id, name, public) VALUES ('assignments', 'assignments', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('submissions', 'submissions', false);

-- Storage policies for assignments bucket (public read, faculty upload)
CREATE POLICY "Anyone can view assignment files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'assignments');

CREATE POLICY "Faculty can upload assignment files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'assignments' AND has_role(auth.uid(), 'faculty'));

CREATE POLICY "Faculty can delete assignment files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'assignments' AND has_role(auth.uid(), 'faculty'));

-- Storage policies for submissions bucket
CREATE POLICY "Students can upload submission files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'submissions' AND has_role(auth.uid(), 'student'));

CREATE POLICY "Students can view own submission files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'submissions' AND (has_role(auth.uid(), 'student') OR has_role(auth.uid(), 'faculty') OR has_role(auth.uid(), 'admin')));
