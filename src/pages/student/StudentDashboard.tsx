import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, Upload, CheckSquare, Clock, Calendar, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format, differenceInDays } from "date-fns";

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.name?.split(" ")[0] || "Student";

  // Fetch assignments
  const { data: assignments } = useQuery({
    queryKey: ["student-assignments-dash", user?.id],
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

  // Fetch submissions
  const { data: submissions } = useQuery({
    queryKey: ["student-submissions-dash", user?.id],
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

  const totalAssignments = assignments?.length || 0;
  const totalSubmissions = submissions?.length || 0;
  const evaluated = submissions?.filter((s: any) => s.status === "evaluated").length || 0;
  const pendingCount = totalAssignments - totalSubmissions;

  const stats = [
    { title: "Active Assignments", value: totalAssignments, icon: FileText, description: "Available assignments" },
    { title: "Submissions", value: totalSubmissions, icon: Upload, description: "Total submissions" },
    { title: "Evaluated", value: evaluated, icon: CheckSquare, description: "Assignments graded" },
    { title: "Pending", value: Math.max(0, pendingCount), icon: Clock, description: "Awaiting submission" },
  ];

  // Pending assignments (not yet submitted)
  const submittedIds = new Set(submissions?.map((s: any) => s.assignment_id) || []);
  const pendingAssignments = (assignments || [])
    .filter((a: any) => !submittedIds.has(a.id))
    .slice(0, 4)
    .map((a: any) => ({
      id: a.id,
      title: a.title,
      course: a.subjects?.name || "General",
      dueDate: format(new Date(a.due_date), "MMM d, yyyy"),
      status: (new Date(a.due_date) < new Date() ? "overdue" : "pending") as "pending" | "overdue",
    }));

  // Recent evaluated
  const recentResults = (submissions || [])
    .filter((s: any) => s.status === "evaluated")
    .slice(0, 4)
    .map((s: any) => ({
      id: s.id,
      title: s.assignments?.title || "Unknown",
      course: s.assignments?.subjects?.name || "General",
      dueDate: format(new Date(s.submitted_at), "MMM d, yyyy"),
      status: "evaluated" as const,
      grade: s.grade || "N/A",
    }));

  // Upcoming deadlines
  const upcomingDeadlines = (assignments || [])
    .filter((a: any) => new Date(a.due_date) > new Date() && !submittedIds.has(a.id))
    .slice(0, 3)
    .map((a: any) => ({
      title: a.title,
      date: format(new Date(a.due_date), "MMM d"),
      daysLeft: differenceInDays(new Date(a.due_date), new Date()),
    }));

  const completionPct = totalAssignments > 0 ? Math.round((totalSubmissions / totalAssignments) * 100) : 0;

  return (
    <DashboardLayout role="student" userName={user?.name}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {firstName}!</h1>
        <p className="text-muted-foreground">Here's an overview of your academic progress and upcoming assignments.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Assignments */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Pending Assignments</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate("/student/assignments")}>View All</Button>
            </div>
            {pendingAssignments.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No pending assignments. Great job!</p>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {pendingAssignments.map((a) => (
                  <Card key={a.id} variant="interactive" className="cursor-pointer" onClick={() => navigate("/student/assignments")}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold text-sm line-clamp-1">{a.title}</h4>
                        <Badge variant={a.status === "overdue" ? "overdue" : "pending"}>
                          {a.status === "overdue" ? "Overdue" : "Pending"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{a.course}</p>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                        <Calendar className="h-3.5 w-3.5" />
                        {a.dueDate}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Recent Results */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Recent Results</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate("/student/results")}>View All</Button>
            </div>
            {recentResults.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No evaluated assignments yet.</p>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {recentResults.map((r) => (
                  <Card key={r.id} variant="interactive">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold text-sm line-clamp-1">{r.title}</h4>
                        <Badge variant="evaluated">Evaluated</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{r.course}</p>
                      <p className="text-sm font-medium text-success mt-2">{r.grade}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Semester Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Completed</span>
                  <span className="font-medium">{completionPct}%</span>
                </div>
                <Progress value={completionPct} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-center pt-4 border-t">
                <div>
                  <p className="text-2xl font-bold text-primary">{totalSubmissions}</p>
                  <p className="text-xs text-muted-foreground">Submitted</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-success">{evaluated}</p>
                  <p className="text-xs text-muted-foreground">Evaluated</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-5 w-5 text-warning" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingDeadlines.length === 0 ? (
                <p className="text-sm text-muted-foreground">No upcoming deadlines.</p>
              ) : (
                <div className="space-y-4">
                  {upcomingDeadlines.map((d) => (
                    <div key={d.title} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors" onClick={() => navigate("/student/assignments")}>
                      <div>
                        <p className="font-medium text-sm">{d.title}</p>
                        <p className="text-xs text-muted-foreground">{d.date}</p>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded ${d.daysLeft <= 3 ? "bg-destructive/10 text-destructive" : d.daysLeft <= 7 ? "bg-warning/10 text-warning" : "bg-success/10 text-success"}`}>
                        {d.daysLeft}d left
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <Button variant="ghost" className="w-full mt-4" onClick={() => navigate("/student/assignments")}>
                View All Deadlines
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
