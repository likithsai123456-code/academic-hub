import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Upload, FileText, Clock, CheckCircle, XCircle, Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const submissions = [
  {
    id: "1",
    title: "Database Design Project",
    course: "CS302 - Database Systems",
    submittedDate: "Jan 30, 2026",
    status: "submitted",
    fileName: "database_project_v2.pdf",
    fileSize: "2.4 MB",
  },
  {
    id: "2",
    title: "Operating Systems Assignment 3",
    course: "CS303 - Operating Systems",
    submittedDate: "Jan 18, 2026",
    status: "evaluated",
    fileName: "os_assignment3.pdf",
    fileSize: "1.8 MB",
    grade: "A (92%)",
  },
  {
    id: "3",
    title: "Network Protocols Analysis",
    course: "CS402 - Computer Networks",
    submittedDate: "Jan 14, 2026",
    status: "evaluated",
    fileName: "network_analysis.docx",
    fileSize: "3.2 MB",
    grade: "A+ (98%)",
  },
  {
    id: "4",
    title: "Algorithm Complexity Report",
    course: "CS401 - Algorithms",
    submittedDate: "Jan 10, 2026",
    status: "evaluated",
    fileName: "algo_report.pdf",
    fileSize: "1.5 MB",
    grade: "B+ (88%)",
  },
  {
    id: "5",
    title: "Web Development Project",
    course: "CS305 - Web Technologies",
    submittedDate: "Jan 5, 2026",
    status: "late",
    fileName: "web_project.zip",
    fileSize: "15.4 MB",
    grade: "B (82%)",
  },
];

const statusConfig = {
  submitted: { label: "Submitted", icon: Clock, color: "text-primary" },
  evaluated: { label: "Evaluated", icon: CheckCircle, color: "text-success" },
  late: { label: "Late", icon: XCircle, color: "text-destructive" },
};

export default function StudentSubmissions() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSubmissions = submissions.filter((submission) =>
    submission.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    submission.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleView = (id: string) => {
    toast.info("Opening submission details...", {
      description: `Viewing submission #${id}`,
    });
  };

  const handleDownload = (fileName: string) => {
    toast.success("Download started", {
      description: `Downloading ${fileName}`,
    });
  };

  return (
    <DashboardLayout role="student" userName={user?.name}>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Submissions</h1>
          <p className="text-muted-foreground">
            Track all your submitted assignments and their status.
          </p>
        </div>
        <Button onClick={() => navigate("/student/assignments")}>
          <Upload className="h-4 w-4 mr-2" />
          New Submission
        </Button>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search submissions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No submissions found.</p>
          </Card>
        ) : (
          filteredSubmissions.map((submission) => {
            const status = statusConfig[submission.status as keyof typeof statusConfig];
            const StatusIcon = status.icon;

            return (
              <Card key={submission.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{submission.title}</h3>
                        <p className="text-sm text-muted-foreground">{submission.course}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="text-muted-foreground">
                            Submitted: {submission.submittedDate}
                          </span>
                          <span className="text-muted-foreground">
                            {submission.fileName} ({submission.fileSize})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`h-4 w-4 ${status.color}`} />
                        <span className={`text-sm font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      {submission.grade && (
                        <Badge variant="secondary" className="font-medium">
                          {submission.grade}
                        </Badge>
                      )}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(submission.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(submission.fileName)}
                        >
                          Download
                        </Button>
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
