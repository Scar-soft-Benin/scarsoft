import {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect
} from "react";
import { useDispatch } from "react-redux";
import { login, logout, fetchUser } from "../store/sagas/authSaga";
import { type User } from "../services/types/auth.types";
import { type ApiError } from "../services/types/common.types";
import { addMessage } from "~/store/reducer/messageReducer";

interface AuthContextType {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    fetchUser: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = {
    USER: "auth_user",
    TOKEN: "auth_token",
    REFRESH_TOKEN: "refresh_token"
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children
}) => {
    const dispatch = useDispatch();
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);

    // Initialize auth state from localStorage
    useEffect(() => {
        const initializeAuth = async () => {
            const storedUser = localStorage.getItem(STORAGE_KEY.USER);
            const storedToken = localStorage.getItem(STORAGE_KEY.TOKEN);
            const storedRefreshToken = localStorage.getItem(
                STORAGE_KEY.REFRESH_TOKEN
            );

            if (storedUser && storedToken && storedRefreshToken) {
                try {
                    const parsedUser = JSON.parse(storedUser) as User;
                    setUser(parsedUser);
                    setToken(storedToken);
                    setRefreshToken(storedRefreshToken);
                    dispatch(fetchUser());
                } catch (error) {
                    console.error("Auth initialization failed:", error);
                    localStorage.removeItem(STORAGE_KEY.USER);
                    localStorage.removeItem(STORAGE_KEY.TOKEN);
                    localStorage.removeItem(STORAGE_KEY.REFRESH_TOKEN);
                    dispatch(
                        addMessage(
                            "Session expired. Please log in again.",
                            "error"
                        )
                    );
                }
            }
        };

        initializeAuth();
    }, [dispatch]);

    const loginAction = useCallback(
        async (email: string, password: string) => {
            try {
                await new Promise<void>((resolve, reject) => {
                    dispatch(
                        login({
                            email,
                            password
                        })
                    );
                    // Since saga handles state updates, wait for localStorage to sync
                    const checkAuth = () => {
                        const storedUser = localStorage.getItem(
                            STORAGE_KEY.USER
                        );
                        const storedToken = localStorage.getItem(
                            STORAGE_KEY.TOKEN
                        );
                        if (storedUser && storedToken) {
                            setUser(JSON.parse(storedUser) as User);
                            setToken(storedToken);
                            setRefreshToken(
                                localStorage.getItem(STORAGE_KEY.REFRESH_TOKEN)
                            );
                            resolve();
                        } else {
                            reject(new Error("Login failed"));
                        }
                    };
                    setTimeout(checkAuth, 100); // Small delay to allow saga to update localStorage
                });
            } catch (error: unknown) {
                const apiError = error as ApiError;
                throw apiError;
            }
        },
        [dispatch]
    );

    const logoutAction = useCallback(() => {
        dispatch(logout());
        setUser(null);
        setToken(null);
        setRefreshToken(null);
    }, [dispatch]);

    const fetchUserAction = useCallback(() => {
        dispatch(fetchUser());
    }, [dispatch]);

    useEffect(() => {
        const handleStorageUpdate = () => {
            const storedUser = localStorage.getItem(STORAGE_KEY.USER);
            const storedToken = localStorage.getItem(STORAGE_KEY.TOKEN);
            const storedRefreshToken = localStorage.getItem(
                STORAGE_KEY.REFRESH_TOKEN
            );

            setUser(storedUser ? JSON.parse(storedUser) : null);
            setToken(storedToken);
            setRefreshToken(storedRefreshToken);
        };

        window.addEventListener("storage", handleStorageUpdate);
        return () => window.removeEventListener("storage", handleStorageUpdate);
    }, []);

    const isAuthenticated = !!user && !!token;

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                refreshToken,
                login: loginAction,
                logout: logoutAction,
                fetchUser: fetchUserAction,
                isAuthenticated
            }}
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
