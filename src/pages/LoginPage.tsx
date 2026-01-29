import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Demo login - redirect based on email pattern
    setTimeout(() => {
      setIsLoading(false);
      
      if (email.includes("admin")) {
        navigate("/admin");
      } else if (email.includes("faculty")) {
        navigate("/faculty");
      } else {
        navigate("/student");
      }
      
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">EduPortal</span>
          </Link>

          <Card variant="outlined" className="border-0 shadow-none bg-transparent">
            <CardHeader className="px-0">
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@institution.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                  {!isLoading && <ArrowRight className="h-5 w-5 ml-2" />}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-primary font-medium hover:underline">
                    Create account
                  </Link>
                </p>
              </div>

              {/* Demo Accounts */}
              <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm font-medium mb-2">Demo Accounts</p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>• Student: <span className="font-mono">student@edu.com</span></p>
                  <p>• Faculty: <span className="font-mono">faculty@edu.com</span></p>
                  <p>• Admin: <span className="font-mono">admin@edu.com</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center gradient-hero p-12">
        <div className="max-w-md text-primary-foreground text-center">
          <div className="mb-8">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm mb-6">
              <GraduationCap className="h-10 w-10" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Streamline Your Academic Journey
            </h2>
            <p className="text-lg text-primary-foreground/80">
              Access your assignments, track submissions, and stay on top of your
              academic progress all in one place.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
              <p className="text-2xl font-bold">50K+</p>
              <p className="text-sm text-primary-foreground/70">Students</p>
            </div>
            <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
              <p className="text-2xl font-bold">2K+</p>
              <p className="text-sm text-primary-foreground/70">Faculty</p>
            </div>
            <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
              <p className="text-2xl font-bold">100+</p>
              <p className="text-sm text-primary-foreground/70">Institutions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
