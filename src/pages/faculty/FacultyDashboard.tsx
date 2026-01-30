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
  Users,
  PlusCircle,
  BarChart3,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const stats = [
  {
    title: "Total Assignments",
    value: 24,
    icon: FileText,
    description: "Created this semester",
    trend: { value: 12, isPositive: true },
  },
  {
    title: "Submissions",
    value: 156,
    icon: Upload,
    description: "Received submissions",
  },
  {
    title: "Pending Evaluation",
    value: 32,
    icon: Clock,
    description: "Awaiting your review",
  },
  {
    title: "Students",
    value: 128,
    icon: Users,
    description: "Enrolled in your courses",
  },
];

const recentSubmissions = [
  {
    id: "1",
    student: "Emily Chen",
    assignment: "Data Structures Lab Report",
    course: "CS301",
    submittedAt: "2 hours ago",
    status: "pending",
  },
  {
    id: "2",
    student: "Michael Brown",
    assignment: "Algorithm Analysis Paper",
    course: "CS401",
    submittedAt: "4 hours ago",
    status: "pending",
  },
  {
    id: "3",
    student: "Sarah Wilson",
    assignment: "Database Design Project",
    course: "CS302",
    submittedAt: "6 hours ago",
    status: "pending",
  },
  {
    id: "4",
    student: "David Lee",
    assignment: "Data Structures Lab Report",
    course: "CS301",
    submittedAt: "8 hours ago",
    status: "pending",
  },
];

const assignments = [
  {
    id: "1",
    title: "Data Structures Lab Report",
    course: "CS301 - Data Structures",
    dueDate: "Feb 2, 2026",
    submissions: 45,
    total: 52,
    evaluated: 12,
  },
  {
    id: "2",
    title: "Algorithm Analysis Paper",
    course: "CS401 - Algorithms",
    dueDate: "Feb 5, 2026",
    submissions: 38,
    total: 48,
    evaluated: 0,
  },
  {
    id: "3",
    title: "Database Design Project",
    course: "CS302 - Database Systems",
    dueDate: "Feb 10, 2026",
    submissions: 28,
    total: 50,
    evaluated: 0,
  },
];

export default function FacultyDashboard() {
  const { user } = useAuth();

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
        <Button size="lg">
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
              <Button variant="ghost" size="sm">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                        {submission.student.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-medium">{submission.student}</p>
                        <p className="text-sm text-muted-foreground">
                          {submission.assignment} • {submission.course}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">{submission.submittedAt}</span>
                      <Button size="sm">Evaluate</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Assignments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Active Assignments</CardTitle>
                <CardDescription>Track submission and evaluation progress</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                Manage
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {assignments.map((assignment) => (
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
                        <span className="font-medium">
                          {assignment.submissions}/{assignment.total}
                        </span>
                      </div>
                      <Progress
                        value={(assignment.submissions / assignment.total) * 100}
                        className="h-2"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant={assignment.evaluated > 0 ? "submitted" : "pending"}>
                        {assignment.evaluated} Evaluated
                      </Badge>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
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
              <Button variant="outline" className="w-full justify-start">
                <PlusCircle className="h-4 w-4 mr-2" />
                New Assignment
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CheckSquare className="h-4 w-4 mr-2" />
                Bulk Evaluate
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>

          {/* Evaluation Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-success" />
                This Week's Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Evaluations Completed</span>
                  <span className="font-medium">68%</span>
                </div>
                <Progress value={68} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-center pt-4 border-t">
                <div>
                  <p className="text-2xl font-bold text-success">124</p>
                  <p className="text-xs text-muted-foreground">Evaluated</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-warning">32</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium text-sm">CS301</p>
                    <p className="text-xs text-muted-foreground">Data Structures</p>
                  </div>
                  <Badge variant="secondary">52 students</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium text-sm">CS401</p>
                    <p className="text-xs text-muted-foreground">Algorithms</p>
                  </div>
                  <Badge variant="secondary">48 students</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium text-sm">CS302</p>
                    <p className="text-xs text-muted-foreground">Databases</p>
                  </div>
                  <Badge variant="secondary">50 students</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
