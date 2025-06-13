import { NavLink, Link } from "react-router"; 
import { useAuth } from "~/context/authContext";
import { useMessage } from "~/context/messageContext";
import { FiLogOut, FiMail, FiUsers, FiChevronDown, FiChevronUp, FiBriefCase } from "react-icons/fi";
import Logo from "~/header/SS-Vert.svg";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function Sidebar() {
    const { user, logout } = useAuth();
    const { addMessage } = useMessage();
    const sidebarRef = useRef<HTMLElement>(null);
    const submenuRef = useRef<HTMLDivElement>(null);
    const [recruitmentOpen, setRecruitmentOpen] = useState(false);

    const handleLogout = () => {
        logout();
        addMessage("Logged out successfully.", "success");
    };

    useEffect(() => {
        if (sidebarRef.current) {
            gsap.fromTo(
                sidebarRef.current,
                { opacity: 0, x: -50 },
                { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" }
            );
        }
    }, []);

    // Animate dropdown opening/closing
    useEffect(() => {
        const submenu = submenuRef.current;
        if (!submenu) return;

        if (recruitmentOpen) {
            gsap.to(submenu, {
                height: "auto",
                opacity: 1,
                duration: 0.3,
                ease: "power2.out",
                display: "block",
            });
        } else {
            gsap.to(submenu, {
                height: 0,
                opacity: 0,
                duration: 0.3,
                ease: "power2.inOut",
                onComplete: () => {
                    if (submenu) submenu.style.display = "none";
                },
            });
        }
    }, [recruitmentOpen]);

    return (
        <aside ref={sidebarRef} className="w-64 bg-white shadow-md h-full">
            <div className="p-4">
                <Link to="/">
                    <img src={Logo} alt="ScarSoft Logo" className="h-35 w-48 object-contain" />
                </Link>
                <p className="text-sm text-gray-600">Welcome, {user?.email}</p>
            </div>
            <nav className="mt-6">
                <NavLink
                    to="/dashboard"
                    end
                    className={({ isActive }) =>
                        `flex items-center p-4 text-gray-700 hover:bg-gray-200 ${
                            isActive ? "bg-gray-200" : ""
                        }`
                    }
                >
                    <FiUsers className="mr-2" /> Overview
                </NavLink>

                <NavLink
                    to="/dashboard/contacts"
                    className={({ isActive }) =>
                        `flex items-center p-4 text-gray-700 hover:bg-gray-200 ${
                            isActive ? "bg-gray-200" : ""
                        }`
                    }
                >
                    <FiMail className="mr-2" /> Contacts
                </NavLink>
                <NavLink
                    to="/dashboard/recruitment"
                    className={({ isActive }) =>
                        `flex items-center p-4 text-gray-700 hover:bg-gray-200 ${
                            isActive ? "bg-gray-200" : ""
                        }`
                    }
                >
                    <FiUsers className="mr-2" /> Recruitment
                </NavLink>
                <NavLink
                    to="/dashboard/jobs"
                    className={({ isActive }) =>
                        `flex items-center p-4 text-gray-700 hover:bg-gray-200 ${
                            isActive ? "bg-gray-200" : ""
                        }`
                    }
                >
                    <FiBriefcase className="mr-2" /> Offres d'emploi
                </NavLink>
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full p-4 text-gray-700 hover:bg-gray-200"
                >
                    <FiLogOut className="mr-2" /> Logout
                </button>
            </nav>
        </aside>
    );
}
