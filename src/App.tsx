import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentAssignments from "./pages/student/StudentAssignments";
import StudentSubmissions from "./pages/student/StudentSubmissions";
import StudentResults from "./pages/student/StudentResults";
import StudentNotifications from "./pages/student/StudentNotifications";
import StudentProfile from "./pages/student/StudentProfile";
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import FacultyAssignments from "./pages/faculty/FacultyAssignments";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Student Routes */}
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/assignments" element={<StudentAssignments />} />
            <Route path="/student/submissions" element={<StudentSubmissions />} />
            <Route path="/student/results" element={<StudentResults />} />
            <Route path="/student/notifications" element={<StudentNotifications />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            
            {/* Faculty Routes */}
            <Route path="/faculty" element={<FacultyDashboard />} />
            <Route path="/faculty/assignments" element={<FacultyAssignments />} />
            <Route path="/faculty/submissions" element={<FacultyDashboard />} />
            <Route path="/faculty/evaluate" element={<FacultyDashboard />} />
            <Route path="/faculty/reports" element={<FacultyDashboard />} />
            <Route path="/faculty/profile" element={<FacultyDashboard />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminDashboard />} />
            <Route path="/admin/departments" element={<AdminDashboard />} />
            <Route path="/admin/courses" element={<AdminDashboard />} />
            <Route path="/admin/reports" element={<AdminDashboard />} />
            <Route path="/admin/settings" element={<AdminDashboard />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
