import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AssignmentList } from "@/components/dashboard/AssignmentCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const allAssignments = [
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
  {
    id: "7",
    title: "Machine Learning Project Proposal",
    course: "CS502 - Machine Learning",
    dueDate: "Feb 15, 2026",
    status: "pending" as const,
  },
  {
    id: "8",
    title: "Computer Graphics Lab",
    course: "CS404 - Computer Graphics",
    dueDate: "Feb 12, 2026",
    status: "pending" as const,
  },
];

export default function StudentAssignments() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredAssignments = allAssignments.filter((assignment) => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || assignment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout role="student" userName={user?.name}>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Assignments</h1>
        <p className="text-muted-foreground">
          View and manage all your assignments across courses.
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assignments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
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
      <AssignmentList
        assignments={filteredAssignments}
        showGrade
        emptyMessage="No assignments match your search criteria."
      />
    </DashboardLayout>
  );
}
