import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  GraduationCap,
  LayoutDashboard,
  FileText,
  Upload,
  CheckSquare,
  Users,
  Settings,
  BookOpen,
  Building,
  BarChart3,
  Bell,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SidebarProps {
  role: "student" | "faculty" | "admin";
}

const studentNavItems = [
  { name: "Dashboard", href: "/student", icon: LayoutDashboard },
  { name: "Assignments", href: "/student/assignments", icon: FileText },
  { name: "Submissions", href: "/student/submissions", icon: Upload },
  { name: "Results", href: "/student/results", icon: CheckSquare },
  { name: "Notifications", href: "/student/notifications", icon: Bell },
  { name: "Profile", href: "/student/profile", icon: Settings },
];

const facultyNavItems = [
  { name: "Dashboard", href: "/faculty", icon: LayoutDashboard },
  { name: "Assignments", href: "/faculty/assignments", icon: FileText },
  { name: "Submissions", href: "/faculty/submissions", icon: Upload },
  { name: "Evaluate", href: "/faculty/evaluate", icon: CheckSquare },
  { name: "Reports", href: "/faculty/reports", icon: BarChart3 },
  { name: "Profile", href: "/faculty/profile", icon: Settings },
];

const adminNavItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Departments", href: "/admin/departments", icon: Building },
  { name: "Courses", href: "/admin/courses", icon: BookOpen },
  { name: "Reports", href: "/admin/reports", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function DashboardSidebar({ role }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const navItems =
    role === "student"
      ? studentNavItems
      : role === "faculty"
      ? facultyNavItems
      : adminNavItems;

  const roleLabel =
    role === "student" ? "Student" : role === "faculty" ? "Faculty" : "Administrator";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-sidebar text-sidebar-foreground shadow-lg"
        onClick={() => setCollapsed(!collapsed)}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col",
          collapsed ? "-translate-x-full lg:translate-x-0 lg:w-20" : "w-64"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <Link to="/" className={cn("flex items-center gap-2", collapsed && "lg:justify-center")}>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary shrink-0">
              <GraduationCap className="h-6 w-6 text-sidebar-primary-foreground" />
            </div>
            {!collapsed && <span className="text-lg font-bold">EduPortal</span>}
          </Link>
          <button
            className="hidden lg:block p-1 rounded hover:bg-sidebar-accent transition-colors"
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronLeft
              className={cn(
                "h-5 w-5 transition-transform",
                collapsed && "rotate-180"
              )}
            />
          </button>
        </div>

        {/* Role Badge */}
        {!collapsed && (
          <div className="px-4 py-3 border-b border-sidebar-border">
            <span className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider">
              {roleLabel} Portal
            </span>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                      collapsed && "lg:justify-center lg:px-2"
                    )}
                    title={collapsed ? item.name : undefined}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
              collapsed && "lg:justify-center lg:px-2"
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="ml-3">Sign Out</span>}
          </Button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {!collapsed && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-background/80 backdrop-blur-sm"
          onClick={() => setCollapsed(true)}
        />
      )}
    </>
  );
}
