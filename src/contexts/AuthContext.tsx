import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface User {
  email: string;
  name: string;
  role: "student" | "faculty" | "admin";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, role: "student" | "faculty" | "admin") => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("eduportal_user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("eduportal_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("eduportal_user");
    }
  }, [user]);

  const login = (email: string, role: "student" | "faculty" | "admin") => {
    // Extract name from email (before @)
    const emailName = email.split("@")[0];
    const name = emailName
      .split(/[._-]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

    setUser({ email, name, role });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
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
