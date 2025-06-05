import { createContext, useContext, useState, useCallback } from "react";

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const login = useCallback(async (email: string, password: string) => {
        // Simulate API call
        try {
            const response = await mockLogin(email, password);
            setUser({
                id: response.id,
                email: response.email,
                role: response.role
            });
            setToken(response.token);
        } catch (e) {
            throw new Error("Invalid credentials", e!);
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
    }, []);

    const isAuthenticated = !!user && !!token;

    return (
        <AuthContext.Provider
            value={{ user, token, login, logout, isAuthenticated }}
        >
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
    // Simulate API response
    if (email === "admin@scarsoft.com" && password === "password123") {
        return {
            id: "1",
            email,
            role: "admin" as const,
            token: "mock-jwt-token"
        };
    }
    throw new Error("Invalid credentials");
};
