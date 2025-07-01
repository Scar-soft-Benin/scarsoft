import {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect
} from "react";
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

// Storage keys
const STORAGE_KEY = {
    USER: "auth_user",
    TOKEN: "auth_token"
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children
}) => {
    const { addMessage } = useMessage();
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    // Initialize auth state from localStorage on mount
    useEffect(() => {
        const initializeAuth = async () => {
            const storedUser = localStorage.getItem(STORAGE_KEY.USER);
            const storedToken = localStorage.getItem(STORAGE_KEY.TOKEN);

            if (storedUser && storedToken) {
                try {
                    // Parse stored user
                    const parsedUser = JSON.parse(storedUser) as User;

                    // Optional: Validate token with backend
                    // const isValid = await validateToken(storedToken);
                    // if (!isValid) throw new Error("Invalid token");

                    setUser(parsedUser);
                    setToken(storedToken);
                } catch (error) {
                    console.error("Auth initialization failed:", error);
                    localStorage.removeItem(STORAGE_KEY.USER);
                    localStorage.removeItem(STORAGE_KEY.TOKEN);
                    addMessage(
                        "Session expired. Please log in again.",
                        "error"
                    );
                }
            }
        };

        initializeAuth();
    }, [addMessage]);

    const login = useCallback(
        async (email: string, password: string) => {
            try {
                const response = await mockLogin(email, password);
                setUser({
                    id: response.id,
                    email: response.email,
                    role: response.role
                });
                setToken(response.token);

                // Persist to localStorage
                localStorage.setItem(
                    STORAGE_KEY.USER,
                    JSON.stringify(response)
                );
                localStorage.setItem(STORAGE_KEY.TOKEN, response.token);
            } catch (error) {
                if (
                    error instanceof Error &&
                    error.message.includes("network")
                ) {
                    addMessage(
                        "Network error. Please check your connection.",
                        "error"
                    );
                } else if (
                    error instanceof Error &&
                    error.message.includes("database")
                ) {
                    addMessage(
                        "Database error. Please try again later.",
                        "error"
                    );
                } else {
                    addMessage("Invalid credentials.", "error");
                }
                throw error;
            }
        },
        [addMessage]
    );

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        // Clear localStorage
        localStorage.removeItem(STORAGE_KEY.USER);
        localStorage.removeItem(STORAGE_KEY.TOKEN);
        addMessage("Logged out successfully.", "success");
    }, [addMessage]);

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
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (email === "admin@scarsoft.com" && password === "password123") {
        return {
            id: "1",
            email,
            role: "admin" as const,
            token: "mock-jwt-token"
        };
    } else if (email === "network@scarsoft.com") {
        throw new Error("Network error");
    } else if (email === "db@scarsoft.com") {
        throw new Error("Database error");
    }
    throw new Error("Invalid credentials");
};
