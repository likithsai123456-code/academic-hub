import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Search, Filter, Calendar, FileText, BookOpen, Download } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";

export default function StudentAssignments() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);

  // Fetch assignments from DB (RLS filters by student's year/semester)
  const { data: assignments, isLoading } = useQuery({
    queryKey: ["student-assignments", user?.id],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("assignments")
        .select("*, subjects(name)")
        .order("due_date", { ascending: true });
      if (error) throw error;
      return data as any[];
    },
    enabled: !!user?.id,
  });

  // Fetch student's submissions to determine assignment status
  const { data: mySubmissions } = useQuery({
    queryKey: ["my-submissions", user?.id],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("submissions")
        .select("assignment_id, status, grade")
        .eq("student_id", user!.id);
      if (error) throw error;
      return data as any[];
    },
    enabled: !!user?.id,
  });

  const getAssignmentStatus = (assignment: any) => {
    const submission = mySubmissions?.find((s: any) => s.assignment_id === assignment.id);
    if (submission) {
      if (submission.status === "evaluated") return { status: "evaluated", grade: submission.grade };
      return { status: "submitted", grade: null };
    }
    if (new Date(assignment.due_date) < new Date()) return { status: "overdue", grade: null };
    return { status: "pending", grade: null };
  };

  const statusConfig: Record<string, { label: string; variant: any }> = {
    pending: { label: "Pending", variant: "pending" },
    submitted: { label: "Submitted", variant: "submitted" },
    evaluated: { label: "Evaluated", variant: "evaluated" },
    overdue: { label: "Overdue", variant: "overdue" },
  };

  const enrichedAssignments = assignments?.map((a: any) => {
    const { status, grade } = getAssignmentStatus(a);
    return { ...a, computedStatus: status, grade };
  }) || [];

  const filteredAssignments = enrichedAssignments.filter((a: any) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.subjects?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || a.computedStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDownload = (assignment: any) => {
    if (assignment.file_url) {
      window.open(assignment.file_url, "_blank");
    } else {
      toast.info("No file attached to this assignment");
    }
  };

  return (
    <DashboardLayout role="student" userName={user?.name}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Assignments</h1>
        <p className="text-muted-foreground">View and manage all your assignments across courses.</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search assignments..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="evaluated">Evaluated</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Assignments Grid */}
      {isLoading ? (
        <p className="text-muted-foreground">Loading assignments...</p>
      ) : filteredAssignments.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            {assignments?.length === 0 ? "No assignments have been uploaded by faculty yet." : "No assignments match your search criteria."}
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredAssignments.map((a: any) => {
            const sc = statusConfig[a.computedStatus];
            return (
              <Card key={a.id} variant="interactive" className="group">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="space-y-1">
                      <h3 className="font-semibold line-clamp-1">{a.title}</h3>
                      <p className="text-sm text-muted-foreground">{a.subjects?.name || "General"}</p>
                    </div>
                    <Badge variant={sc.variant}>{sc.label}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(a.due_date), "MMM d, yyyy")}</span>
                      </div>
                      {a.grade && (
                        <span className="text-success font-medium">{a.grade}</span>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedAssignment(a)}>
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Assignment Detail Dialog */}
      <Dialog open={!!selectedAssignment} onOpenChange={() => setSelectedAssignment(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              {selectedAssignment?.title}
            </DialogTitle>
            <DialogDescription>{selectedAssignment?.subjects?.name || "General"}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Due:</span>
                <span className="font-medium">
                  {selectedAssignment && format(new Date(selectedAssignment.due_date), "MMM d, yyyy h:mm a")}
                </span>
              </div>
              {selectedAssignment && (
                <Badge variant={statusConfig[getAssignmentStatus(selectedAssignment).status]?.variant}>
                  {statusConfig[getAssignmentStatus(selectedAssignment).status]?.label}
                </Badge>
              )}
            </div>
            {selectedAssignment?.description && (
              <div>
                <h4 className="text-sm font-medium mb-1">Description</h4>
                <p className="text-sm text-muted-foreground">{selectedAssignment.description}</p>
              </div>
            )}
            {selectedAssignment?.instructions && (
              <div>
                <h4 className="text-sm font-medium mb-1">Instructions</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{selectedAssignment.instructions}</p>
              </div>
            )}
            {selectedAssignment?.file_name && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-sm flex-1">{selectedAssignment.file_name}</span>
              </div>
            )}
          </div>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setSelectedAssignment(null)}>Close</Button>
            {selectedAssignment?.file_url && (
              <Button variant="secondary" onClick={() => handleDownload(selectedAssignment)}>
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            )}
            {selectedAssignment && (getAssignmentStatus(selectedAssignment).status === "pending" || getAssignmentStatus(selectedAssignment).status === "overdue") && (
              <Button onClick={() => { setSelectedAssignment(null); navigate("/student/submissions"); }}>
                Submit Assignment
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
