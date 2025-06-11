import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useAuth } from "~/context/authContext";
import { useMessage } from "~/context/messageContext";
import { useTheme } from "~/context/themeContext";
import { FiUser, FiBell, FiMoon, FiSun, FiLogOut } from "react-icons/fi";

export default function Header() {
    const { user, logout } = useAuth();
    const { addMessage } = useMessage();
    const { isDarkMode, toggleTheme } = useTheme();
    const headerRef = useRef<HTMLElement>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (headerRef.current) {
            gsap.fromTo(
                headerRef.current,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
            );
        }
    }, []);

    useEffect(() => {
        if (isProfileOpen && dropdownRef.current) {
            gsap.fromTo(
                dropdownRef.current,
                { opacity: 0, y: -10 },
                { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }
            );
        }
    }, [isProfileOpen]);

    const handleLogout = () => {
        logout();
        addMessage("Logged out successfully.", "success");
        setIsProfileOpen(false);
    };

    const toggleProfileDropdown = () => setIsProfileOpen((prev) => !prev);

    return (
        <header
            ref={headerRef}
            className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center"
        >
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                ScarSoft Dashboard
            </h1>
            <div className="flex items-center space-x-4">
                <button
                    onClick={toggleTheme}
                    className="text-gray-600 dark:text-gray-300 hover:text-secondary p-2 rounded-full"
                    title={
                        isDarkMode
                            ? "Switch to Light Mode"
                            : "Switch to Dark Mode"
                    }
                >
                    {isDarkMode ? (
                        <FiSun className="w-5 h-5" />
                    ) : (
                        <FiMoon className="w-5 h-5" />
                    )}
                </button>
                <button
                    className="text-gray-600 dark:text-gray-300 hover:text-secondary p-2 rounded-full relative"
                    title="Notifications"
                >
                    <FiBell className="w-5 h-5" />
                    {/* Placeholder for notification badge */}
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="relative">
                    <button
                        onClick={toggleProfileDropdown}
                        className="text-gray-600 dark:text-gray-300 hover:text-secondary p-2 rounded-full"
                        title="Profile"
                    >
                        <FiUser className="w-5 h-5" />
                    </button>
                    {isProfileOpen && (
                        <div
                            ref={dropdownRef}
                            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 shadow-lg rounded-md py-2 z-10"
                        >
                            <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                {user?.email}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                                <FiLogOut className="mr-2" /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
