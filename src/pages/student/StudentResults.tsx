import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Award, TrendingUp, Download, Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const results = [
  {
    id: "1",
    title: "Operating Systems Assignment 3",
    course: "CS303 - Operating Systems",
    dueDate: "Jan 20, 2026",
    submittedDate: "Jan 18, 2026",
    grade: "A",
    score: 92,
    maxScore: 100,
    feedback: "Excellent understanding of process scheduling algorithms.",
  },
  {
    id: "2",
    title: "Network Protocols Analysis",
    course: "CS402 - Computer Networks",
    dueDate: "Jan 15, 2026",
    submittedDate: "Jan 14, 2026",
    grade: "A+",
    score: 98,
    maxScore: 100,
    feedback: "Outstanding work on protocol analysis. Well-researched and clearly presented.",
  },
  {
    id: "3",
    title: "Algorithm Complexity Report",
    course: "CS401 - Algorithms",
    dueDate: "Jan 12, 2026",
    submittedDate: "Jan 10, 2026",
    grade: "B+",
    score: 88,
    maxScore: 100,
    feedback: "Good analysis but could improve on time complexity explanations.",
  },
  {
    id: "4",
    title: "Web Development Project",
    course: "CS305 - Web Technologies",
    dueDate: "Jan 5, 2026",
    submittedDate: "Jan 6, 2026",
    grade: "B",
    score: 82,
    maxScore: 100,
    feedback: "Good implementation. Late submission penalty applied (-3 points).",
    isLate: true,
  },
  {
    id: "5",
    title: "Data Structures Quiz 2",
    course: "CS301 - Data Structures",
    dueDate: "Dec 20, 2025",
    submittedDate: "Dec 20, 2025",
    grade: "A-",
    score: 90,
    maxScore: 100,
    feedback: "Great work on tree and graph problems.",
  },
];

const gradeColors: Record<string, string> = {
  "A+": "bg-success text-success-foreground",
  "A": "bg-success text-success-foreground",
  "A-": "bg-success/80 text-success-foreground",
  "B+": "bg-primary text-primary-foreground",
  "B": "bg-primary text-primary-foreground",
  "B-": "bg-primary/80 text-primary-foreground",
  "C+": "bg-warning text-warning-foreground",
  "C": "bg-warning text-warning-foreground",
  "C-": "bg-warning/80 text-warning-foreground",
  "D": "bg-destructive/60 text-destructive-foreground",
  "F": "bg-destructive text-destructive-foreground",
};

export default function StudentResults() {
  const { user } = useAuth();

  const averageScore = Math.round(
    results.reduce((sum, r) => sum + r.score, 0) / results.length
  );

  const handleViewDetails = (id: string) => {
    toast.info("Opening detailed feedback...", {
      description: `Viewing result #${id}`,
    });
  };

  const handleDownload = (title: string) => {
    toast.success("Download started", {
      description: `Downloading graded ${title}`,
    });
  };

  return (
    <DashboardLayout role="student" userName={user?.name}>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Results & Grades</h1>
        <p className="text-muted-foreground">
          View your evaluated assignments and feedback from faculty.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                <Award className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="text-2xl font-bold">{averageScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Evaluated</p>
                <p className="text-2xl font-bold">{results.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <Award className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current GPA</p>
                <p className="text-2xl font-bold">3.8</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {results.map((result) => (
          <Card key={result.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <Badge className={gradeColors[result.grade] || "bg-muted"}>
                      {result.grade}
                    </Badge>
                    <div>
                      <h3 className="font-semibold">{result.title}</h3>
                      <p className="text-sm text-muted-foreground">{result.course}</p>
                      {result.isLate && (
                        <Badge variant="destructive" className="mt-1 text-xs">
                          Late Submission
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Score</span>
                      <span className="font-medium">
                        {result.score}/{result.maxScore}
                      </span>
                    </div>
                    <Progress value={result.score} className="h-2" />
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground italic">
                    "{result.feedback}"
                  </p>
                </div>

                <div className="flex gap-2 lg:flex-col">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(result.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(result.title)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
