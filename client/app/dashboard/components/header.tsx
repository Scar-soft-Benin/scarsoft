"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "~/context/authContext";
import { useMessage } from "~/context/messageContext";
import { useTheme } from "~/context/themeContext";
import { FiUser, FiBell, FiMoon, FiSun, FiLogOut } from "react-icons/fi";

const mockNotifications = [
    {
        id: 1,
        type: "message",
        content: "Nouveau message de John Doe",
        timestamp: "2025-06-12 14:00"
    },
    {
        id: 2,
        type: "application",
        content: "Nouvelle candidature pour le poste de Développeur",
        timestamp: "2025-06-12 13:45"
    },
    {
        id: 3,
        type: "message",
        content: "Message de Jane Smith",
        timestamp: "2025-06-12 12:30"
    }
];

export default function Header() {
    const { user, logout } = useAuth();
    const { addMessage } = useMessage();
    const { isDarkMode, toggleTheme } = useTheme();
    const profileDropdownRef = useRef<HTMLDivElement>(null);
    const notificationDropdownRef = useRef<HTMLDivElement>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                profileDropdownRef.current &&
                !profileDropdownRef.current.contains(event.target as Node)
            ) {
                setIsProfileOpen(false);
            }
            if (
                notificationDropdownRef.current &&
                !notificationDropdownRef.current.contains(event.target as Node)
            ) {
                setIsNotificationsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        addMessage("Déconnexion réussie.", "success");
        setIsProfileOpen(false);
    };

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-neutral-light-surface dark:bg-neutral-dark-surface shadow-md p-4 flex justify-between items-center relative z-40"
        >
            <h1 className="text-xl font-bold text-neutral-light-text dark:text-neutral-dark-text">
                ScarSoft Dashboard
            </h1>
            <div className="flex items-center space-x-4">
                <button
                    onClick={toggleTheme}
                    className="text-neutral-light-secondary dark:text-neutral-dark-secondary hover:text-primary p-2 rounded-full transition-colors duration-200"
                    title={
                        isDarkMode
                            ? "Passer au mode clair"
                            : "Passer au mode sombre"
                    }
                    aria-label={
                        isDarkMode
                            ? "Passer au mode clair"
                            : "Passer au mode sombre"
                    }
                >
                    {isDarkMode ? (
                        <FiSun className="w-5 h-5" />
                    ) : (
                        <FiMoon className="w-5 h-5" />
                    )}
                </button>

                <div className="relative">
                    <button
                        onClick={() => setIsNotificationsOpen((prev) => !prev)}
                        className="text-neutral-light-secondary dark:text-neutral-dark-secondary hover:text-primary p-2 rounded-full relative transition-colors duration-200"
                        title="Notifications"
                        aria-label="Notifications"
                    >
                        <FiBell className="w-5 h-5" />
                        {mockNotifications.length > 0 && (
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-danger rounded-full animate-pulse" />
                        )}
                    </button>
                    <AnimatePresence>
                        {isNotificationsOpen && (
                            <motion.div
                                ref={notificationDropdownRef}
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="absolute right-0 mt-2 w-64 bg-neutral-light-surface dark:bg-neutral-dark-surface shadow-lg rounded-md py-2 z-50 max-h-80 overflow-y-auto border border-neutral-light-border dark:border-neutral-dark-border"
                            >
                                <div className="px-4 py-2 text-sm font-semibold text-neutral-light-text dark:text-neutral-dark-text border-b border-neutral-light-border dark:border-neutral-dark-border">
                                    Notifications ({mockNotifications.length})
                                </div>
                                {mockNotifications.length === 0 ? (
                                    <div className="px-4 py-2 text-sm text-neutral-light-secondary dark:text-neutral-dark-secondary">
                                        Aucune notification
                                    </div>
                                ) : (
                                    mockNotifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className="px-4 py-2 text-sm text-neutral-light-text dark:text-neutral-dark-text hover:bg-neutral-light-bg dark:hover:bg-neutral-dark-bg transition-colors duration-150"
                                        >
                                            <p className="font-medium">
                                                {notification.type === "message"
                                                    ? "Nouveau message"
                                                    : "Nouvelle candidature"}
                                            </p>
                                            <p className="text-xs">
                                                {notification.content}
                                            </p>
                                            <p className="text-xs text-neutral-light-secondary dark:text-neutral-dark-secondary mt-1">
                                                {notification.timestamp}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen((prev) => !prev)}
                        className="text-neutral-light-secondary dark:text-neutral-dark-secondary hover:text-primary p-2 rounded-full transition-colors duration-200"
                        title="Profil"
                        aria-label="Profil"
                    >
                        <FiUser className="w-5 h-5" />
                    </button>
                    <AnimatePresence>
                        {isProfileOpen && (
                            <motion.div
                                ref={profileDropdownRef}
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="absolute right-0 mt-2 w-48 bg-neutral-light-surface dark:bg-neutral-dark-surface shadow-lg rounded-md py-2 z-50 border border-neutral-light-border dark:border-neutral-dark-border"
                            >
                                <div className="px-4 py-2 text-sm text-neutral-light-text dark:text-neutral-dark-text border-b border-neutral-light-border dark:border-neutral-dark-border">
                                    {user?.email || "Utilisateur"}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center w-full px-4 py-2 text-sm text-neutral-light-text dark:text-neutral-dark-text hover:bg-neutral-light-bg dark:hover:bg-neutral-dark-bg transition-colors duration-150"
                                >
                                    <FiLogOut className="mr-2" /> Déconnexion
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.header>
    );
}
