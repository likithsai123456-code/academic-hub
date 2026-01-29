import { Link } from "react-router-dom";
import { GraduationCap, Github, Twitter, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      <div className="container py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
                <GraduationCap className="h-6 w-6 text-sidebar-primary-foreground" />
              </div>
              <span className="text-xl font-bold">EduPortal</span>
            </Link>
            <p className="text-sm text-sidebar-foreground/70 leading-relaxed">
              Streamline your academic workflow with our comprehensive assignment
              evaluation platform designed for modern educational institutions.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sidebar-foreground">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                  Integrations
                </a>
              </li>
              <li>
                <a href="#" className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                  Updates
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sidebar-foreground">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#contact" className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sidebar-foreground">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                  Status
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-sidebar-border">
          <p className="text-sm text-sidebar-foreground/70 text-center">
            © {new Date().getFullYear()} EduPortal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
