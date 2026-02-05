import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GraduationCap, Mail, Lock, User, Eye, EyeOff, ArrowRight, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Semester {
  id: string;
  name: string;
}

interface Year {
  id: string;
  name: string;
}

// Maps year name to valid semester numbers
const YEAR_SEMESTER_MAP: Record<string, number[]> = {
  "1st Year": [1, 2],
  "2nd Year": [3, 4],
  "3rd Year": [5, 6],
  "4th Year": [7, 8],
};

// Helper to extract semester number from name like "1st Semester" -> 1
const getSemesterNumber = (name: string): number => {
  const match = name.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    semesterId: "",
    yearId: "",
  });
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [years, setYears] = useState<Year[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Fetch semesters and years for selection
    const fetchData = async () => {
      const [semestersRes, yearsRes] = await Promise.all([
        supabase.from("semesters").select("id, name").order("name"),
        supabase.from("years").select("id, name").order("name"),
      ]);

      if (semestersRes.data) setSemesters(semestersRes.data);
      if (yearsRes.data) setYears(yearsRes.data);
    };

    fetchData();
  }, []);

  // Get valid semesters based on selected year
  const getFilteredSemesters = () => {
    if (!formData.yearId) return [];
    
    const selectedYear = years.find((y) => y.id === formData.yearId);
    if (!selectedYear) return [];
    
    const validSemesterNumbers = YEAR_SEMESTER_MAP[selectedYear.name] || [];
    return semesters.filter((s) => validSemesterNumbers.includes(getSemesterNumber(s.name)));
  };

  const filteredSemesters = getFilteredSemesters();

  // Reset semester when year changes
  const handleYearChange = (value: string) => {
    setFormData((prev) => ({ ...prev, yearId: value, semesterId: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submissions
    if (isLoading) return;

    // Validation
    if (!formData.name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.role) {
      toast({
        title: "Role required",
        description: "Please select your role.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.semesterId || !formData.yearId) {
      toast({
        title: "Semester and Year required",
        description: "Please select your semester and year.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (authError) {
        // Handle rate limit errors
        if (authError.message.includes("rate limit") || authError.status === 429) {
          toast({
            title: "Too many attempts",
            description: "Please wait a minute before trying again. If you already registered, check your email for a confirmation link.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        // Handle existing user
        if (authError.message.includes("already registered") || authError.message.includes("User already registered")) {
          toast({
            title: "Account exists",
            description: "This email is already registered. Please log in or check your email for a confirmation link.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        toast({
          title: "Registration failed",
          description: authError.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase.from("profiles").insert({
          user_id: authData.user.id,
          name: formData.name.trim(),
          semester_id: formData.semesterId,
          year_id: formData.yearId,
        });

        if (profileError) {
          console.error("Profile creation error:", profileError);
          toast({
            title: "Profile creation failed",
            description: "Account created but profile setup failed. Please contact support.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        // Create user role
        const { error: roleError } = await supabase.from("user_roles").insert({
          user_id: authData.user.id,
          role: formData.role as "student" | "faculty" | "admin",
        });

        if (roleError) {
          console.error("Role creation error:", roleError);
        }

        toast({
          title: "Account created!",
          description: "Please check your email to verify your account, then log in.",
        });
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center gradient-hero p-12">
        <div className="max-w-md text-primary-foreground text-center">
          <div className="mb-8">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm mb-6">
              <GraduationCap className="h-10 w-10" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Join Our Academic Community
            </h2>
            <p className="text-lg text-primary-foreground/80">
              Create your account and start experiencing seamless assignment
              management tailored for modern education.
            </p>
          </div>
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-white/10 backdrop-blur-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Email Verification</p>
                <p className="text-sm text-primary-foreground/70">Secure account activation</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-white/10 backdrop-blur-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Encrypted Storage</p>
                <p className="text-sm text-primary-foreground/70">Your data is always protected</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-white/10 backdrop-blur-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                <Building className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Institution Integration</p>
                <p className="text-sm text-primary-foreground/70">Connect with your school</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">EduPortal</span>
          </Link>

          <Card variant="outlined" className="border-0 shadow-none bg-transparent">
            <CardHeader className="px-0">
              <CardTitle className="text-2xl">Create an account</CardTitle>
              <CardDescription>
                Enter your details to get started with EduPortal
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => updateFormData("name", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@institution.edu"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => updateFormData("role", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="faculty">Faculty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Select
                      value={formData.yearId}
                      onValueChange={handleYearChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year.id} value={year.id}>
                            {year.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="semester">Semester</Label>
                    <Select
                      value={formData.semesterId}
                      onValueChange={(value) => updateFormData("semesterId", value)}
                      disabled={!formData.yearId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={formData.yearId ? "Select semester" : "Select year first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredSemesters.map((semester) => (
                          <SelectItem key={semester.id} value={semester.id}>
                            {semester.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => updateFormData("password", e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                  {!isLoading && <ArrowRight className="h-5 w-5 ml-2" />}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Already registered? Check your email for a confirmation link, then{" "}
                  <Link to="/login" className="text-primary hover:underline">
                    sign in
                  </Link>
                  .
                </p>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary font-medium hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
