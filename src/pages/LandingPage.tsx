import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Upload,
  CheckSquare,
  Users,
  Shield,
  BarChart3,
  Clock,
  FileText,
  ArrowRight,
  Star,
  Zap,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Easy Submissions",
    description:
      "Students can upload assignments in multiple formats including PDF, DOCX, and ZIP files with just a few clicks.",
  },
  {
    icon: CheckSquare,
    title: "Smart Evaluation",
    description:
      "Faculty can evaluate submissions with detailed feedback, marks, and comments all in one intuitive interface.",
  },
  {
    icon: Clock,
    title: "Deadline Tracking",
    description:
      "Automatic deadline reminders and late submission detection keep everyone on schedule.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Enterprise-grade security with encrypted data storage and role-based access control.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Comprehensive reports and analytics for administrators to monitor performance and progress.",
  },
  {
    icon: Users,
    title: "Multi-Role Support",
    description:
      "Dedicated portals for students, faculty, and administrators with tailored features for each.",
  },
];

const stats = [
  { value: "50K+", label: "Active Students" },
  { value: "2K+", label: "Faculty Members" },
  { value: "100K+", label: "Assignments Evaluated" },
  { value: "99.9%", label: "Uptime" },
];

const steps = [
  {
    step: "01",
    title: "Create Account",
    description: "Register as a student, faculty member, or administrator with your institutional email.",
  },
  {
    step: "02",
    title: "Access Dashboard",
    description: "Log in to your personalized dashboard with all relevant courses and assignments.",
  },
  {
    step: "03",
    title: "Submit & Evaluate",
    description: "Students submit work, faculty evaluates, and results are delivered instantly.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-hero-pattern opacity-50" />
        <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-br from-primary/5 via-accent/5 to-transparent" />

        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-1.5">
              <Zap className="h-3.5 w-3.5 mr-1" />
              Trusted by 100+ Institutions
            </Badge>
            <h1 className="mb-6 animate-fade-in">
              Transform Your Academic
              <span className="block text-primary">Assignment Workflow</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              A comprehensive online portal for assignment submission, evaluation, and
              feedback. Streamline academic workflows for students, faculty, and
              administrators.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "200ms" }}>
              <Button size="xl" asChild>
                <Link to="/register">
                  Get Started Free
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center animate-fade-in-up"
                style={{ animationDelay: `${300 + index * 100}ms` }}
              >
                <p className="text-4xl font-bold text-primary mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-muted/30">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="mb-4">Everything You Need for Academic Excellence</h2>
            <p className="text-lg text-muted-foreground">
              Our platform provides all the tools necessary for seamless assignment
              management and evaluation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                variant="interactive"
                className="group animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">How It Works</Badge>
            <h2 className="mb-4">Simple Steps to Get Started</h2>
            <p className="text-lg text-muted-foreground">
              Our intuitive platform makes assignment management effortless for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div
                key={step.step}
                className="relative text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full gradient-primary text-primary-foreground text-2xl font-bold mb-6">
                  {step.step}
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-border" />
                )}
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Cards Section */}
      <section className="py-24 bg-muted/30">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">Portals</Badge>
            <h2 className="mb-4">Tailored Experience for Every Role</h2>
            <p className="text-lg text-muted-foreground">
              Dedicated dashboards designed for the specific needs of each user type.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Student Card */}
            <Card variant="elevated" className="overflow-hidden group">
              <div className="h-2 bg-gradient-to-r from-primary to-primary/70" />
              <CardHeader>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <GraduationCap className="h-7 w-7" />
                </div>
                <CardTitle>Student Portal</CardTitle>
                <CardDescription>
                  Access assignments, submit work, and track your academic progress.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-primary" />
                  <span>View & submit assignments</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Track deadlines & status</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <span>View grades & feedback</span>
                </div>
              </CardContent>
            </Card>

            {/* Faculty Card */}
            <Card variant="elevated" className="overflow-hidden group">
              <div className="h-2 bg-gradient-to-r from-accent to-accent/70" />
              <CardHeader>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent mb-4">
                  <Users className="h-7 w-7" />
                </div>
                <CardTitle>Faculty Portal</CardTitle>
                <CardDescription>
                  Create assignments, evaluate submissions, and manage courses.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-accent" />
                  <span>Create & manage assignments</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckSquare className="h-4 w-4 text-accent" />
                  <span>Evaluate student work</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BarChart3 className="h-4 w-4 text-accent" />
                  <span>Generate reports</span>
                </div>
              </CardContent>
            </Card>

            {/* Admin Card */}
            <Card variant="elevated" className="overflow-hidden group">
              <div className="h-2 bg-gradient-to-r from-success to-success/70" />
              <CardHeader>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-success/10 text-success mb-4">
                  <Shield className="h-7 w-7" />
                </div>
                <CardTitle>Admin Portal</CardTitle>
                <CardDescription>
                  Full system control with user management and analytics.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-success" />
                  <span>Manage users & roles</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-success" />
                  <span>Configure departments</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BarChart3 className="h-4 w-4 text-success" />
                  <span>System-wide analytics</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-24">
        <div className="container">
          <Card variant="glass" className="max-w-4xl mx-auto overflow-hidden">
            <div className="p-8 md:p-12 text-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent" />
              <div className="relative">
                <Badge variant="secondary" className="mb-4">Get Started Today</Badge>
                <h2 className="mb-4">Ready to Transform Your Institution?</h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join hundreds of institutions already using EduPortal to streamline
                  their academic workflows. Start your free trial today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <Link to="/register">
                      Create Free Account
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="mailto:contact@eduportal.com">Contact Sales</a>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
