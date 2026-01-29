import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, FileText, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  status: "pending" | "submitted" | "evaluated" | "overdue";
  grade?: string;
}

interface AssignmentCardProps {
  assignment: Assignment;
  onView?: () => void;
  showGrade?: boolean;
}

const statusConfig = {
  pending: { label: "Pending", variant: "pending" as const },
  submitted: { label: "Submitted", variant: "submitted" as const },
  evaluated: { label: "Evaluated", variant: "evaluated" as const },
  overdue: { label: "Overdue", variant: "overdue" as const },
};

export function AssignmentCard({
  assignment,
  onView,
  showGrade = false,
}: AssignmentCardProps) {
  const status = statusConfig[assignment.status];

  return (
    <Card variant="interactive" className="group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold line-clamp-1">
              {assignment.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{assignment.course}</p>
          </div>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{assignment.dueDate}</span>
            </div>
            {showGrade && assignment.grade && (
              <div className="flex items-center gap-1.5 text-success font-medium">
                <FileText className="h-4 w-4" />
                <span>{assignment.grade}</span>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onView}
          >
            View
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface AssignmentListProps {
  assignments: Assignment[];
  title?: string;
  showGrade?: boolean;
  emptyMessage?: string;
}

export function AssignmentList({
  assignments,
  title,
  showGrade = false,
  emptyMessage = "No assignments found",
}: AssignmentListProps) {
  return (
    <div className="space-y-4">
      {title && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Button variant="ghost" size="sm">
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
      {assignments.length === 0 ? (
        <Card variant="outlined" className="p-8 text-center">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {assignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              showGrade={showGrade}
            />
          ))}
        </div>
      )}
    </div>
  );
}
