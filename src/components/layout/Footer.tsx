import { Link } from "react-router-dom";
import { GraduationCap, Github, Twitter, Linkedin, Mail } from "lucide-react";
import { toast } from "sonner";

const handleExternalLink = (name: string) => {
  toast.info(`${name} page coming soon!`);
};

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
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="mailto:contact@eduportal.com"
                className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
              >
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
                <a href="#how-it-works" className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <button 
                  onClick={() => handleExternalLink("Integrations")}
                  className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
                >
                  Integrations
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleExternalLink("Updates")}
                  className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
                >
                  Updates
                </button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sidebar-foreground">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => handleExternalLink("About")}
                  className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
                >
                  About
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleExternalLink("Blog")}
                  className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
                >
                  Blog
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleExternalLink("Careers")}
                  className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
                >
                  Careers
                </button>
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
                <button 
                  onClick={() => handleExternalLink("Help Center")}
                  className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
                >
                  Help Center
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleExternalLink("Privacy Policy")}
                  className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleExternalLink("Terms of Service")}
                  className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleExternalLink("Status")}
                  className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
                >
                  Status
                </button>
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
