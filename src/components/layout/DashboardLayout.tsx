import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardSidebar } from "./DashboardSidebar";
import { cn } from "@/lib/utils";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface DashboardLayoutProps {
  children: ReactNode;
  role: "student" | "faculty" | "admin";
  userName?: string;
  userAvatar?: string;
}

export function DashboardLayout({
  children,
  role,
  userName = "John Doe",
  userAvatar,
}: DashboardLayoutProps) {
  const navigate = useNavigate();
  
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleNotifications = () => {
    navigate(`/${role}/notifications`);
  };

  const handleProfile = () => {
    navigate(`/${role}/profile`);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search") as string;
    if (query.trim()) {
      toast.info(`Searching for "${query}"...`);
      navigate(`/${role}/assignments`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar role={role} />
      
      <div className="lg:pl-64 min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-20 glass border-b border-border/50">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  name="search"
                  placeholder="Search assignments, courses..."
                  className="pl-10 bg-background/50"
                />
              </div>
            </form>

            {/* Right Side */}
            <div className="flex items-center gap-4 ml-auto">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={handleNotifications}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
              </Button>
              
              <div 
                className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={handleProfile}
              >
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs text-muted-foreground capitalize">{role}</p>
                </div>
                <Avatar className="h-9 w-9">
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
