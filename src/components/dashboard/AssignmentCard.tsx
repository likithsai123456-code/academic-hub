import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, ChevronRight, BookOpen, User, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  status: "pending" | "submitted" | "evaluated" | "overdue";
  grade?: string;
  description?: string;
  instructions?: string;
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
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleView = () => {
    if (onView) {
      onView();
    } else {
      setIsDialogOpen(true);
    }
  };

  const handleDownload = () => {
    toast.success("Download started", {
      description: `Downloading assignment: ${assignment.title}`,
    });
  };

  const handleSubmit = () => {
    setIsDialogOpen(false);
    navigate("/student/submissions");
  };

  return (
    <>
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
              onClick={handleView}
            >
              View
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Assignment Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              {assignment.title}
            </DialogTitle>
            <DialogDescription>
              {assignment.course}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Due Date:</span>
                <span className="font-medium">{assignment.dueDate}</span>
              </div>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>

            {showGrade && assignment.grade && (
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-success" />
                <span className="text-muted-foreground">Grade:</span>
                <span className="font-medium text-success">{assignment.grade}</span>
              </div>
            )}

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Description</h4>
              <p className="text-sm text-muted-foreground">
                {assignment.description || "Complete the assignment as per the course guidelines. Make sure to follow the submission format and include all required components."}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Instructions</h4>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>Submit your work in PDF or DOCX format</li>
                <li>Include your name and roll number</li>
                <li>Follow the assignment rubric</li>
                <li>Late submissions may incur penalties</li>
              </ul>
            </div>
          </div>

          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
            <Button variant="secondary" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
            {assignment.status === "pending" || assignment.status === "overdue" ? (
              <Button onClick={handleSubmit}>
                Submit Assignment
              </Button>
            ) : null}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface AssignmentListProps {
  assignments: Assignment[];
  title?: string;
  showGrade?: boolean;
  emptyMessage?: string;
  onViewAll?: () => void;
}

export function AssignmentList({
  assignments,
  title,
  showGrade = false,
  emptyMessage = "No assignments found",
  onViewAll,
}: AssignmentListProps) {
  const navigate = useNavigate();

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      navigate("/student/assignments");
    }
  };

  return (
    <div className="space-y-4">
      {title && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Button variant="ghost" size="sm" onClick={handleViewAll}>
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
