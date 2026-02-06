import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { AssignmentList } from "@/components/dashboard/AssignmentCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileText, Upload, CheckSquare, Clock, Calendar, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const stats = [
  {
    title: "Active Assignments",
    value: 8,
    icon: FileText,
    description: "Assignments due this week",
  },
  {
    title: "Submissions",
    value: 24,
    icon: Upload,
    description: "Total submissions this semester",
  },
  {
    title: "Evaluated",
    value: 18,
    icon: CheckSquare,
    description: "Assignments graded",
    trend: { value: 15, isPositive: true },
  },
  {
    title: "Pending",
    value: 6,
    icon: Clock,
    description: "Awaiting evaluation",
  },
];

const pendingAssignments = [
  {
    id: "1",
    title: "Data Structures Lab Report",
    course: "CS301 - Data Structures",
    dueDate: "Feb 2, 2026",
    status: "pending" as const,
  },
  {
    id: "2",
    title: "Algorithm Analysis Paper",
    course: "CS401 - Algorithms",
    dueDate: "Feb 5, 2026",
    status: "pending" as const,
  },
  {
    id: "3",
    title: "Database Design Project",
    course: "CS302 - Database Systems",
    dueDate: "Feb 10, 2026",
    status: "submitted" as const,
  },
  {
    id: "4",
    title: "Software Engineering Case Study",
    course: "CS501 - Software Engineering",
    dueDate: "Jan 28, 2026",
    status: "overdue" as const,
  },
];

const recentResults = [
  {
    id: "5",
    title: "Operating Systems Assignment 3",
    course: "CS303 - Operating Systems",
    dueDate: "Jan 20, 2026",
    status: "evaluated" as const,
    grade: "A (92%)",
  },
  {
    id: "6",
    title: "Network Protocols Analysis",
    course: "CS402 - Computer Networks",
    dueDate: "Jan 15, 2026",
    status: "evaluated" as const,
    grade: "A+ (98%)",
  },
];

const upcomingDeadlines = [
  { title: "Data Structures Lab", date: "Feb 2", daysLeft: 4 },
  { title: "Algorithm Analysis", date: "Feb 5", daysLeft: 7 },
  { title: "Database Project", date: "Feb 10", daysLeft: 12 },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.name?.split(" ")[0] || "Student";

  return (
    <DashboardLayout role="student" userName={user?.name}>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {firstName}!</h1>
        <p className="text-muted-foreground">
          Here's an overview of your academic progress and upcoming assignments.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Assignments Section */}
        <div className="lg:col-span-2 space-y-6">
          <AssignmentList
            title="Pending Assignments"
            assignments={pendingAssignments}
            emptyMessage="No pending assignments. Great job!"
            onViewAll={() => navigate("/student/assignments")}
          />

          <AssignmentList
            title="Recent Results"
            assignments={recentResults}
            showGrade
            emptyMessage="No evaluated assignments yet."
            onViewAll={() => navigate("/student/results")}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress Overview */}
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
                  <span className="font-medium">75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-center pt-4 border-t">
                <div>
                  <p className="text-2xl font-bold text-primary">18</p>
                  <p className="text-xs text-muted-foreground">Submitted</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-success">3.8</p>
                  <p className="text-xs text-muted-foreground">GPA</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-5 w-5 text-warning" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingDeadlines.map((deadline) => (
                  <div
                    key={deadline.title}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => navigate("/student/assignments")}
                  >
                    <div>
                      <p className="font-medium text-sm">{deadline.title}</p>
                      <p className="text-xs text-muted-foreground">{deadline.date}</p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        deadline.daysLeft <= 3
                          ? "bg-destructive/10 text-destructive"
                          : deadline.daysLeft <= 7
                          ? "bg-warning/10 text-warning"
                          : "bg-success/10 text-success"
                      }`}
                    >
                      {deadline.daysLeft}d left
                    </span>
                  </div>
                ))}
              </div>
              <Button 
                variant="ghost" 
                className="w-full mt-4"
                onClick={() => navigate("/student/assignments")}
              >
                View All Deadlines
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
