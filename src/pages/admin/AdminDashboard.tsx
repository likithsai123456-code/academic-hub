import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Building,
  BookOpen,
  FileText,
  UserPlus,
  Settings,
  ChevronRight,
  TrendingUp,
  Activity,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const stats = [
  {
    title: "Total Users",
    value: "2,847",
    icon: Users,
    description: "Active users on platform",
    trend: { value: 8, isPositive: true },
  },
  {
    title: "Departments",
    value: 12,
    icon: Building,
    description: "Academic departments",
  },
  {
    title: "Courses",
    value: 156,
    icon: BookOpen,
    description: "Active courses",
  },
  {
    title: "Assignments",
    value: 892,
    icon: FileText,
    description: "Total assignments",
    trend: { value: 15, isPositive: true },
  },
];

const chartData = [
  { name: "Mon", submissions: 45, evaluations: 38 },
  { name: "Tue", submissions: 52, evaluations: 42 },
  { name: "Wed", submissions: 49, evaluations: 51 },
  { name: "Thu", submissions: 63, evaluations: 48 },
  { name: "Fri", submissions: 58, evaluations: 55 },
  { name: "Sat", submissions: 24, evaluations: 32 },
  { name: "Sun", submissions: 18, evaluations: 21 },
];

const recentRegistrations = [
  { id: "1", name: "Jennifer Martinez", email: "j.martinez@edu.com", role: "student", status: "pending" },
  { id: "2", name: "Prof. James Anderson", email: "j.anderson@edu.com", role: "faculty", status: "pending" },
  { id: "3", name: "Kevin Thompson", email: "k.thompson@edu.com", role: "student", status: "approved" },
  { id: "4", name: "Dr. Lisa Brown", email: "l.brown@edu.com", role: "faculty", status: "approved" },
];

const systemAlerts = [
  { type: "warning", message: "High server load detected (85%)", time: "10 min ago" },
  { type: "info", message: "Database backup completed successfully", time: "1 hour ago" },
  { type: "success", message: "System update deployed", time: "3 hours ago" },
];

export default function AdminDashboard() {
  return (
    <DashboardLayout role="admin" userName="Sarah Admin">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage your institution's academic portal.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Settings className="h-5 w-5 mr-2" />
            Settings
          </Button>
          <Button>
            <UserPlus className="h-5 w-5 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Activity Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Weekly Activity
            </CardTitle>
            <CardDescription>Submissions and evaluations over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(217, 91%, 35%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(217, 91%, 35%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorEvaluations" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(168, 76%, 36%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(168, 76%, 36%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} 
                  />
                  <Area
                    type="monotone"
                    dataKey="submissions"
                    stroke="hsl(217, 91%, 35%)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorSubmissions)"
                  />
                  <Area
                    type="monotone"
                    dataKey="evaluations"
                    stroke="hsl(168, 76%, 36%)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorEvaluations)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">Submissions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-accent" />
                <span className="text-sm text-muted-foreground">Evaluations</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-5 w-5 text-success" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Server Health</span>
                <span className="font-medium text-warning">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Database</span>
                <span className="font-medium text-success">98%</span>
              </div>
              <Progress value={98} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Storage</span>
                <span className="font-medium text-primary">62%</span>
              </div>
              <Progress value={62} className="h-2" />
            </div>
            <div className="pt-4 border-t space-y-3">
              {systemAlerts.map((alert, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-2 rounded-lg text-sm ${
                    alert.type === "warning"
                      ? "bg-warning/10"
                      : alert.type === "success"
                      ? "bg-success/10"
                      : "bg-muted/50"
                  }`}
                >
                  <AlertTriangle
                    className={`h-4 w-4 mt-0.5 shrink-0 ${
                      alert.type === "warning"
                        ? "text-warning"
                        : alert.type === "success"
                        ? "text-success"
                        : "text-muted-foreground"
                    }`}
                  />
                  <div>
                    <p className="font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Registrations */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Registrations</CardTitle>
              <CardDescription>New user registration requests</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRegistrations.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                      {user.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="capitalize">
                      {user.role}
                    </Badge>
                    {user.status === "pending" ? (
                      <div className="flex gap-2">
                        <Button size="sm" variant="success">Approve</Button>
                        <Button size="sm" variant="outline">Reject</Button>
                      </div>
                    ) : (
                      <Badge variant="evaluated">Approved</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Platform Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="text-sm font-medium">Students</p>
                <p className="text-xs text-muted-foreground">Active learners</p>
              </div>
              <p className="text-2xl font-bold text-primary">2,456</p>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="text-sm font-medium">Faculty</p>
                <p className="text-xs text-muted-foreground">Teaching staff</p>
              </div>
              <p className="text-2xl font-bold text-accent">156</p>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="text-sm font-medium">Administrators</p>
                <p className="text-xs text-muted-foreground">System admins</p>
              </div>
              <p className="text-2xl font-bold text-success">12</p>
            </div>
            <Button variant="outline" className="w-full">
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
