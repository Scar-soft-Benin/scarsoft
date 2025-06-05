import { createContext, useContext, useState, useCallback } from "react";
import { useMessage } from "./messageContext";

interface User {
  id: string;
  email: string;
  role: "admin" | "secretary";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addMessage } = useMessage();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await mockLogin(email, password);
        setUser({ id: response.id, email: response.email, role: response.role });
        setToken(response.token);
      } catch (error) {
        // Simulate different error types
        if (error instanceof Error && error.message.includes("network")) {
          addMessage("Network error. Please check your connection.", "error");
        } else if (error instanceof Error && error.message.includes("database")) {
          addMessage("Database error. Please try again later.", "error");
        } else {
          addMessage("Invalid credentials.", "error");
        }
        throw error; // Rethrow for form handling
      }
    },
    [addMessage]
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    addMessage("Logged out successfully.", "success");
  }, [addMessage]);

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Mock login function (replace with API call later)
const mockLogin = async (email: string, password: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (email === "admin@scarsoft.com" && password === "password123") {
    return {
      id: "1",
      email,
      role: "admin" as const,
      token: "mock-jwt-token",
    };
  } else if (email === "network@scarsoft.com") {
    throw new Error("Network error");
  } else if (email === "db@scarsoft.com") {
    throw new Error("Database error");
  }
  throw new Error("Invalid credentials");
};