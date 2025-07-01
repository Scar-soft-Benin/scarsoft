// ~/dashboard/components/Sidebar.tsx
import { NavLink, Link } from "react-router";
import { useAuth } from "~/context/authContext";
import { FiBriefcase, FiMail, FiUsers } from "react-icons/fi";
import Logo from "~/header/SS-Vert.svg"; 
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Sidebar() {
    const { user } = useAuth();
    const sidebarRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (sidebarRef.current) {
            gsap.fromTo(
                sidebarRef.current,
                { opacity: 0, x: -50 },
                { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" }
            );
        }
    }, []);

    return (
        <aside
            ref={sidebarRef}
            className="w-64 bg-neutral-light-surface dark:bg-neutral-dark-surface shadow-md h-screen"
        >
            <div className="p-4">
                <Link to="/dashboard">
                    <img
                        src={Logo}
                        alt="ScarSoft Logo"
                        className="h-24 w-48 object-contain"
                    />
                </Link>
                <p className="text-sm text-neutral-light-secondary dark:text-neutral-dark-secondary">
                    Welcome, {user?.email}
                </p>
            </div>
            <nav className="mt-6">
                <NavLink
                    to="/dashboard"
                    end
                    className={({ isActive }) =>
                        `flex items-center p-4 text-neutral-light-text dark:text-neutral-dark-text hover:bg-neutral-light-bg dark:hover:bg-neutral-dark-bg hover:text-primary ${
                            isActive
                                ? "bg-neutral-light-bg dark:bg-neutral-dark-bg text-primary"
                                : ""
                        }`
                    }
                >
                    <FiUsers className="mr-2" /> Overview
                </NavLink>
                <NavLink
                    to="/dashboard/contacts"
                    className={({ isActive }) =>
                        `flex items-center p-4 text-neutral-light-text dark:text-neutral-dark-text hover:bg-neutral-light-bg dark:hover:bg-neutral-dark-bg hover:text-primary ${
                            isActive
                                ? "bg-neutral-light-bg dark:bg-neutral-dark-bg text-primary"
                                : ""
                        }`
                    }
                >
                    <FiMail className="mr-2" /> Contacts
                </NavLink>
                <NavLink
                    to="/dashboard/recruitment"
                    className={({ isActive }) =>
                        `flex items-center p-4 text-neutral-light-text dark:text-neutral-dark-text hover:bg-neutral-light-bg dark:hover:bg-neutral-dark-bg hover:text-primary ${
                            isActive
                                ? "bg-neutral-light-bg dark:bg-neutral-dark-bg text-primary"
                                : ""
                        }`
                    }
                >
                    <FiUsers className="mr-2" /> Recruitment
                </NavLink>
                <NavLink
                    to="/dashboard/jobs"
                    className={({ isActive }) =>
                        `flex items-center p-4 text-neutral-light-text dark:text-neutral-dark-text hover:bg-neutral-light-bg dark:hover:bg-neutral-dark-bg hover:text-primary ${
                            isActive
                                ? "bg-neutral-light-bg dark:bg-neutral-dark-bg text-primary"
                                : ""
                        }`
                    }
                >
                    <FiBriefcase className="mr-2" /> Offres d'emploi
                </NavLink>
            </nav>
        </aside>
    );
}
