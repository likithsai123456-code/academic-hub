# Make the portal usable end to end

## User-facing changes
- Protect student, faculty, and admin pages so users must sign in with the matching account type.
- Make Year/Semester selection work across registration and assignment creation, including filtering valid semesters and resetting stale selections when the year changes.
- Connect faculty submission/evaluation navigation to real student submissions, with file download and grade/feedback saving.
- Replace fabricated student results and profile values with the signed-in user's saved data; make profile-name edits save.
- Remove or correct visible controls that currently do nothing or lead to unrelated pages, and show clear database loading/error states.

## Technical details
- Add shared role-aware route protection and semantic year/semester parsing with a focused test for the user's year-to-semester rule.
- Reuse existing Supabase tables and storage; do not introduce schema changes while Lovable Cloud reports the database is unavailable.
- Verify the UI flows in the preview and check the current build diagnostics. Database-backed actions remain limited by backend availability.
