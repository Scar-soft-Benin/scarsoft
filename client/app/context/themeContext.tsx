// app/context/themeContext.tsx
import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode
} from "react";

interface ThemeContextType {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Check localStorage or system preference
        const savedTheme = localStorage.getItem("dashboard-theme");
        if (savedTheme) return savedTheme === "dark";
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    useEffect(() => {
        // Find dashboard root element
        const dashboardRoot = document.querySelector(
            "[data-theme-target='dashboard']"
        );
        if (dashboardRoot) {
            if (isDarkMode) {
                dashboardRoot.classList.add("dashboard-dark");
                localStorage.setItem("dashboard-theme", "dark");
                console.log("Dashboard dark mode enabled");
            } else {
                dashboardRoot.classList.remove("dashboard-dark");
                localStorage.setItem("dashboard-theme", "light");
                console.log("Dashboard dark mode disabled");
            }
        } else {
            console.warn(
                "Dashboard root element not found. Ensure [data-theme-target='dashboard'] is set."
            );
        }

        // Optional: Listen for system theme changes
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
            if (!localStorage.getItem("dashboard-theme")) {
                setIsDarkMode(e.matches);
            }
        };
        mediaQuery.addEventListener("change", handleSystemThemeChange);
        return () =>
            mediaQuery.removeEventListener("change", handleSystemThemeChange);
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode((prev) => !prev);
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
