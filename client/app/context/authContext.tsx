import { createContext, useContext, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, fetchUser } from "../store/sagas/authSaga";
import { type User } from "../services/types/auth.types";
import type { RootState } from "../store";

interface AuthContextType {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isOTPVerified: boolean;
    login: (email: string, password: string) => void;
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
    const authState = useSelector((state: RootState) => state.auth);

    // Initialize auth state from localStorage
    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = localStorage.getItem(STORAGE_KEY.TOKEN);
            if (storedToken && !authState.user) {
                console.log("AuthProvider: Fetching user on mount");
                // dispatch(fetchUser());
            }
        };
        initializeAuth();
    }, [dispatch, authState.user]);

    // Log auth state changes for debugging
    useEffect(() => {
        console.log("AuthProvider: authState updated", {
            user: authState.user,
            token: authState.token,
            refreshToken: authState.refreshToken,
            isAuthenticated: authState.isAuthenticated,
            isOTPVerified: authState.isOTPVerified
        });
    }, [authState]);

    const loginAction = useCallback(
        (email: string, password: string) => {
            console.log("AuthProvider: Dispatching login", { email });
            dispatch(login({ email, password }));
        },
        [dispatch]
    );

    const logoutAction = useCallback(() => {
        console.log("AuthProvider: Dispatching logout");
        dispatch(logout());
    }, [dispatch]);

    const fetchUserAction = useCallback(() => {
        console.log("AuthProvider: Dispatching fetchUser");
        dispatch(fetchUser());
    }, [dispatch]);

    // Sync localStorage changes across tabs
    useEffect(() => {
        const handleStorageUpdate = () => {
            const storedToken = localStorage.getItem(STORAGE_KEY.TOKEN);
            if (storedToken && !authState.user) {
                console.log("AuthProvider: Storage changed, fetching user");
                dispatch(fetchUser());
            } else if (!storedToken) {
                console.log(
                    "AuthProvider: Storage cleared, resetting auth state"
                );
                dispatch(logout());
            }
        };

        window.addEventListener("storage", handleStorageUpdate);
        return () => window.removeEventListener("storage", handleStorageUpdate);
    }, [dispatch, authState.user]);

    const value: AuthContextType = {
        user: authState.user,
        token: authState.token,
        refreshToken: authState.refreshToken,
        isOTPVerified: authState.isOTPVerified,
        login: loginAction,
        logout: logoutAction,
        fetchUser: fetchUserAction,
        isAuthenticated: authState.isAuthenticated
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
