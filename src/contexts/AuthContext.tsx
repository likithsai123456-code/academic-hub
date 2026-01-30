import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

interface Profile {
  id: string;
  name: string;
  section_id: string | null;
  year_id: string | null;
}

interface UserRole {
  role: "student" | "faculty" | "admin";
}

interface User {
  id: string;
  email: string;
  name: string;
  role: "student" | "faculty" | "admin";
  sectionId: string | null;
  yearId: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async (supabaseUser: SupabaseUser) => {
    try {
      // Fetch profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, name, section_id, year_id")
        .eq("user_id", supabaseUser.id)
        .maybeSingle();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        return null;
      }

      // Fetch role
      const { data: userRole, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", supabaseUser.id)
        .maybeSingle();

      if (roleError) {
        console.error("Error fetching role:", roleError);
      }

      const role = (userRole?.role as "student" | "faculty" | "admin") || "student";

      return {
        id: supabaseUser.id,
        email: supabaseUser.email || "",
        name: profile?.name || "User",
        role,
        sectionId: profile?.section_id || null,
        yearId: profile?.year_id || null,
      };
    } catch (error) {
      console.error("Error in fetchUserData:", error);
      return null;
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Use setTimeout to avoid race conditions with Supabase
          setTimeout(async () => {
            const userData = await fetchUserData(currentSession.user);
            setUser(userData);
            setIsLoading(false);
          }, 0);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // THEN get initial session
    supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      setSession(initialSession);
      
      if (initialSession?.user) {
        const userData = await fetchUserData(initialSession.user);
        setUser(userData);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ error: string | null }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        const userData = await fetchUserData(data.user);
        setUser(userData);
      }

      return { error: null };
    } catch (error) {
      console.error("Login error:", error);
      return { error: "An unexpected error occurred" };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        session,
        login, 
        logout, 
        isAuthenticated: !!user,
        isLoading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
