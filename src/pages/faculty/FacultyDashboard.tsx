import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Upload,
  CheckSquare,
  Clock,
  PlusCircle,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";

export default function FacultyDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch faculty's assignments
  const { data: assignments } = useQuery({
    queryKey: ["faculty-dash-assignments", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assignments")
        .select("*, subjects(name)")
        .eq("created_by", user!.id)
        .order("due_date", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch submissions for faculty's assignments
  const { data: submissions } = useQuery({
    queryKey: ["faculty-dash-submissions", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("submissions")
        .select("*, assignments(title, subjects(name))")
        .order("submitted_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const totalAssignments = assignments?.length || 0;
  const totalSubmissions = submissions?.length || 0;
  const pendingEvaluation = submissions?.filter((s: any) => s.status !== "evaluated").length || 0;
  const evaluatedCount = submissions?.filter((s: any) => s.status === "evaluated").length || 0;

  const stats = [
    {
      title: "Total Assignments",
      value: totalAssignments,
      icon: FileText,
      description: "Created by you",
    },
    {
      title: "Submissions",
      value: totalSubmissions,
      icon: Upload,
      description: "Received submissions",
    },
    {
      title: "Pending Evaluation",
      value: pendingEvaluation,
      icon: Clock,
      description: "Awaiting your review",
    },
    {
      title: "Evaluated",
      value: evaluatedCount,
      icon: CheckSquare,
      description: "Graded submissions",
    },
  ];

  const recentSubmissions = (submissions || []).slice(0, 4);

  // Active assignments with submission counts
  const activeAssignments = (assignments || []).slice(0, 3).map((a: any) => {
    const assignSubs = (submissions || []).filter((s: any) => s.assignment_id === a.id);
    const evalCount = assignSubs.filter((s: any) => s.status === "evaluated").length;
    return {
      id: a.id,
      title: a.title,
      course: a.subjects?.name || "General",
      dueDate: format(new Date(a.due_date), "MMM d, yyyy"),
      submissions: assignSubs.length,
      evaluated: evalCount,
    };
  });

  const evalPct = totalSubmissions > 0 ? Math.round((evaluatedCount / totalSubmissions) * 100) : 0;

  return (
    <DashboardLayout role="faculty" userName={user?.name}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Faculty Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your assignments and evaluate student submissions.
          </p>
        </div>
        <Button size="lg" onClick={() => navigate("/faculty/assignments")}>
          <PlusCircle className="h-5 w-5 mr-2" />
          Create Assignment
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Submissions */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Submissions</CardTitle>
                <CardDescription>Latest student submissions awaiting review</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/faculty/assignments")}>
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              {recentSubmissions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No submissions yet.</p>
              ) : (
                <div className="space-y-4">
                  {recentSubmissions.map((submission: any) => (
                    <div
                      key={submission.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                          <Upload className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{submission.assignments?.title || "Assignment"}</p>
                          <p className="text-sm text-muted-foreground">
                            {submission.assignments?.subjects?.name || ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(submission.submitted_at), { addSuffix: true })}
                        </span>
                        <Badge variant={submission.status === "evaluated" ? "evaluated" : "pending"}>
                          {submission.status === "evaluated" ? "Evaluated" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Assignments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Active Assignments</CardTitle>
                <CardDescription>Track submission and evaluation progress</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/faculty/assignments")}>
                Manage
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              {activeAssignments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No assignments created yet.</p>
              ) : (
                <div className="space-y-6">
                  {activeAssignments.map((assignment: any) => (
                    <div key={assignment.id} className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{assignment.title}</p>
                          <p className="text-sm text-muted-foreground">{assignment.course}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{assignment.dueDate}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Submissions</span>
                          <span className="font-medium">{assignment.submissions}</span>
                        </div>
                        <Progress
                          value={assignment.submissions > 0 ? 100 : 0}
                          className="h-2"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant={assignment.evaluated > 0 ? "submitted" : "pending"}>
                          {assignment.evaluated} Evaluated
                        </Badge>
                        <Button variant="outline" size="sm" onClick={() => navigate("/faculty/assignments")}>
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/faculty/assignments")}>
                <PlusCircle className="h-4 w-4 mr-2" />
                New Assignment
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/faculty/assignments")}>
                <CheckSquare className="h-4 w-4 mr-2" />
                View Submissions
              </Button>
            </CardContent>
          </Card>

          {/* Evaluation Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-success" />
                Evaluation Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Evaluations Completed</span>
                  <span className="font-medium">{evalPct}%</span>
                </div>
                <Progress value={evalPct} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-center pt-4 border-t">
                <div>
                  <p className="text-2xl font-bold text-success">{evaluatedCount}</p>
                  <p className="text-xs text-muted-foreground">Evaluated</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-warning">{pendingEvaluation}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
