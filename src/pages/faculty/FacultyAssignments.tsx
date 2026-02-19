import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, FileText, Calendar, Trash2, Upload, Download } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function FacultyAssignments() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [dueDatePart, setDueDatePart] = useState("");
  const [dueTimePart, setDueTimePart] = useState("23:59");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch years
  const { data: years } = useQuery({
    queryKey: ["years"],
    queryFn: async () => {
      const { data, error } = await supabase.from("years").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  // Fetch semesters
  const { data: semesters } = useQuery({
    queryKey: ["semesters"],
    queryFn: async () => {
      const { data, error } = await supabase.from("semesters").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  // Fetch subjects based on selected year/semester
  const { data: subjects } = useQuery({
    queryKey: ["subjects", selectedYear, selectedSemester],
    queryFn: async () => {
      let query = supabase.from("subjects").select("*");
      if (selectedYear) query = query.eq("year_id", selectedYear);
      if (selectedSemester) query = query.eq("semester_id", selectedSemester);
      const { data, error } = await query.order("name");
      if (error) throw error;
      return data;
    },
    enabled: !!selectedYear || !!selectedSemester,
  });

  // Fetch assignments created by this faculty
  const { data: assignments, isLoading } = useQuery({
    queryKey: ["faculty-assignments", user?.id],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("assignments")
        .select("*, subjects(name), years(name), semesters(name)")
        .eq("created_by", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
    enabled: !!user?.id,
  });

  const handleCreate = async () => {
    if (!title || !dueDatePart || !selectedYear || !selectedSemester) {
      toast.error("Please fill all required fields");
      return;
    }
    setIsSubmitting(true);

    try {
      let fileUrl = null;
      let fileName = null;

      // Upload file if provided
      if (file) {
        const fileExt = file.name.split(".").pop();
        const filePath = `${user!.id}/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("assignments")
          .upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("assignments")
          .getPublicUrl(filePath);
        fileUrl = urlData.publicUrl;
        fileName = file.name;
      }

      const { error } = await (supabase as any).from("assignments").insert({
        title,
        description,
        instructions,
        subject_id: selectedSubject || null,
        created_by: user!.id,
        year_id: selectedYear,
        semester_id: selectedSemester,
        due_date: new Date(`${dueDatePart}T${dueTimePart}`).toISOString(),
        file_url: fileUrl,
        file_name: fileName,
      });

      if (error) throw error;

      toast.success("Assignment created successfully!");
      setIsCreateOpen(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["faculty-assignments"] });
    } catch (error: any) {
      toast.error("Failed to create assignment", { description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await (supabase as any).from("assignments").delete().eq("id", id);
      if (error) throw error;
      toast.success("Assignment deleted");
      queryClient.invalidateQueries({ queryKey: ["faculty-assignments"] });
    } catch (error: any) {
      toast.error("Failed to delete", { description: error.message });
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setInstructions("");
    setDueDatePart("");
    setDueTimePart("23:59");
    setSelectedSubject("");
    setSelectedYear("");
    setSelectedSemester("");
    setFile(null);
  };

  return (
    <DashboardLayout role="faculty" userName={user?.name}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Assignments</h1>
          <p className="text-muted-foreground">Create and manage assignments for your students.</p>
        </div>
        <Button size="lg" onClick={() => setIsCreateOpen(true)}>
          <PlusCircle className="h-5 w-5 mr-2" />
          Create Assignment
        </Button>
      </div>

      {/* Assignments List */}
      {isLoading ? (
        <p className="text-muted-foreground">Loading assignments...</p>
      ) : !assignments?.length ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No assignments yet. Create your first assignment!</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {assignments.map((a: any) => (
            <Card key={a.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{a.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {a.subjects?.name || "No subject"} • {a.years?.name} • {a.semesters?.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        Due: {format(new Date(a.due_date), "MMM d, yyyy")}
                      </div>
                      {a.file_name && (
                        <p className="text-xs text-muted-foreground mt-1">📎 {a.file_name}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {a.file_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={a.file_url} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </a>
                      </Button>
                    )}
                    <Badge variant={new Date(a.due_date) > new Date() ? "pending" : "overdue"}>
                      {new Date(a.due_date) > new Date() ? "Active" : "Past Due"}
                    </Badge>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(a.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Assignment Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Assignment</DialogTitle>
            <DialogDescription>Fill in the details to create a new assignment for students.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Title *</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Assignment title" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description" />
            </div>
            <div>
              <Label>Instructions</Label>
              <Textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Submission instructions" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Year *</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
                  <SelectContent>
                    {years?.map((y) => (
                      <SelectItem key={y.id} value={y.id}>{y.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Semester *</Label>
                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger><SelectValue placeholder="Select semester" /></SelectTrigger>
                  <SelectContent>
                    {semesters?.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Subject</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                <SelectContent>
                  {subjects?.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Due Date *</Label>
                <Input type="date" value={dueDatePart} onChange={(e) => setDueDatePart(e.target.value)} />
              </div>
              <div>
                <Label>Due Time *</Label>
                <Input type="time" value={dueTimePart} onChange={(e) => setDueTimePart(e.target.value)} />
              </div>
            </div>
            <div>
              <Label>Attachment (optional)</Label>
              <Input type="file" accept=".pdf,.docx,.doc,.zip,.pptx,.xlsx,.png,.jpg" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Assignment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
