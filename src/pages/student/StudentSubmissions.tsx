import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Search, Upload, FileText, Clock, CheckCircle, XCircle, Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";

const statusConfig = {
  submitted: { label: "Submitted", icon: Clock, color: "text-primary" },
  evaluated: { label: "Evaluated", icon: CheckCircle, color: "text-success" },
  late: { label: "Late", icon: XCircle, color: "text-destructive" },
};

export default function StudentSubmissions() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch submissions
  const { data: submissions, isLoading } = useQuery({
    queryKey: ["student-submissions", user?.id],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("submissions")
        .select("*, assignments(title, subjects(name))")
        .eq("student_id", user!.id)
        .order("submitted_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
    enabled: !!user?.id,
  });

  // Fetch available assignments for submission (pending ones)
  const { data: availableAssignments } = useQuery({
    queryKey: ["available-assignments", user?.id],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("assignments")
        .select("id, title, subjects(name), due_date")
        .order("due_date", { ascending: true });
      if (error) throw error;
      return data as any[];
    },
    enabled: !!user?.id,
  });

  // Filter out already-submitted assignments
  const unsubmittedAssignments = availableAssignments?.filter(
    (a: any) => !submissions?.some((s: any) => s.assignment_id === a.id)
  ) || [];

  const filteredSubmissions = (submissions || []).filter((s: any) =>
    s.assignments?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.assignments?.subjects?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!selectedAssignmentId || !file) {
      toast.error("Please select an assignment and upload a file");
      return;
    }
    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${user!.id}/${selectedAssignmentId}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("submissions")
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      // Get URL (submissions bucket is private, use signed URL approach or just store path)
      const fileUrl = filePath; // Store path, generate signed URL when needed

      const assignment = availableAssignments?.find((a: any) => a.id === selectedAssignmentId);
      const isLate = assignment && new Date(assignment.due_date) < new Date();

      const { error } = await (supabase as any).from("submissions").insert({
        assignment_id: selectedAssignmentId,
        student_id: user!.id,
        file_url: fileUrl,
        file_name: file.name,
        file_size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        status: isLate ? "late" : "submitted",
      });
      if (error) throw error;

      toast.success("Submission uploaded successfully!");
      setIsSubmitOpen(false);
      setSelectedAssignmentId("");
      setFile(null);
      queryClient.invalidateQueries({ queryKey: ["student-submissions"] });
      queryClient.invalidateQueries({ queryKey: ["my-submissions"] });
    } catch (error: any) {
      toast.error("Failed to submit", { description: error.message });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (submission: any) => {
    try {
      const { data, error } = await supabase.storage
        .from("submissions")
        .createSignedUrl(submission.file_url, 3600);
      if (error) throw error;
      window.open(data.signedUrl, "_blank");
    } catch (error: any) {
      toast.error("Failed to download", { description: error.message });
    }
  };

  return (
    <DashboardLayout role="student" userName={user?.name}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Submissions</h1>
          <p className="text-muted-foreground">Track all your submitted assignments and their status.</p>
        </div>
        <Button onClick={() => setIsSubmitOpen(true)} disabled={unsubmittedAssignments.length === 0}>
          <Upload className="h-4 w-4 mr-2" />
          New Submission
        </Button>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search submissions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
        </CardContent>
      </Card>

      {/* Submissions List */}
      {isLoading ? (
        <p className="text-muted-foreground">Loading submissions...</p>
      ) : filteredSubmissions.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            {submissions?.length === 0 ? "You haven't submitted any assignments yet." : "No submissions found."}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredSubmissions.map((submission: any) => {
            const status = statusConfig[submission.status as keyof typeof statusConfig];
            const StatusIcon = status?.icon || Clock;
            return (
              <Card key={submission.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{submission.assignments?.title}</h3>
                        <p className="text-sm text-muted-foreground">{submission.assignments?.subjects?.name || "General"}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="text-muted-foreground">
                            Submitted: {format(new Date(submission.submitted_at), "MMM d, yyyy")}
                          </span>
                          <span className="text-muted-foreground">
                            {submission.file_name} ({submission.file_size})
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`h-4 w-4 ${status?.color}`} />
                        <span className={`text-sm font-medium ${status?.color}`}>{status?.label}</span>
                      </div>
                      {submission.grade && (
                        <Badge variant="secondary" className="font-medium">{submission.grade}</Badge>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => handleDownload(submission)}>
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* New Submission Dialog */}
      <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Assignment</DialogTitle>
            <DialogDescription>Select an assignment and upload your work.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Assignment *</Label>
              <Select value={selectedAssignmentId} onValueChange={setSelectedAssignmentId}>
                <SelectTrigger><SelectValue placeholder="Select assignment" /></SelectTrigger>
                <SelectContent>
                  {unsubmittedAssignments.map((a: any) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.title} - {a.subjects?.name || "General"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Upload File *</Label>
              <Input type="file" accept=".pdf,.docx,.doc,.zip,.png,.jpg,.jpeg" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              <p className="text-xs text-muted-foreground mt-1">Accepted: PDF, DOCX, ZIP, Images</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubmitOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isUploading}>
              {isUploading ? "Uploading..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
