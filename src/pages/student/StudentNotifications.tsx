import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle, AlertCircle, Info, Clock, Check, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { toast } from "sonner";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "alert";
  timestamp: string;
  isRead: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "Assignment Graded",
    message: "Your 'Operating Systems Assignment 3' has been graded. You scored A (92%).",
    type: "success",
    timestamp: "2 hours ago",
    isRead: false,
  },
  {
    id: "2",
    title: "Deadline Reminder",
    message: "Your 'Data Structures Lab Report' is due in 2 days.",
    type: "warning",
    timestamp: "5 hours ago",
    isRead: false,
  },
  {
    id: "3",
    title: "New Assignment Posted",
    message: "A new assignment 'Machine Learning Project Proposal' has been posted for CS502.",
    type: "info",
    timestamp: "1 day ago",
    isRead: false,
  },
  {
    id: "4",
    title: "Submission Received",
    message: "Your submission for 'Database Design Project' has been received successfully.",
    type: "success",
    timestamp: "2 days ago",
    isRead: true,
  },
  {
    id: "5",
    title: "Overdue Assignment",
    message: "Your 'Software Engineering Case Study' is overdue. Please submit as soon as possible.",
    type: "alert",
    timestamp: "3 days ago",
    isRead: true,
  },
  {
    id: "6",
    title: "Course Announcement",
    message: "CS401 class on Friday has been rescheduled to 2 PM.",
    type: "info",
    timestamp: "4 days ago",
    isRead: true,
  },
];

const typeConfig = {
  info: { icon: Info, color: "text-primary", bg: "bg-primary/10" },
  success: { icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
  warning: { icon: Clock, color: "text-warning", bg: "bg-warning/10" },
  alert: { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10" },
};

export default function StudentNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    toast.success("Marked as read");
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success("All notifications marked as read");
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notification deleted");
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success("All notifications cleared");
  };

  return (
    <DashboardLayout role="student" userName={user?.name}>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with your assignments, grades, and announcements.
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="ghost" onClick={clearAll}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Unread Count */}
      {unreadCount > 0 && (
        <Card className="mb-6 bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-primary" />
              <span className="font-medium">
                You have {unreadCount} unread notification{unreadCount > 1 ? "s" : ""}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card className="p-12 text-center">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No notifications</p>
            <p className="text-muted-foreground">You're all caught up!</p>
          </Card>
        ) : (
          notifications.map((notification) => {
            const config = typeConfig[notification.type];
            const Icon = config.icon;

            return (
              <Card
                key={notification.id}
                className={`hover:shadow-md transition-shadow ${
                  !notification.isRead ? "border-l-4 border-l-primary" : ""
                }`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${config.bg}`}>
                      <Icon className={`h-5 w-5 ${config.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold">
                            {notification.title}
                            {!notification.isRead && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                New
                              </Badge>
                            )}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {notification.timestamp}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </DashboardLayout>
  );
}
