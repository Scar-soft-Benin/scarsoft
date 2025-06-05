import { Outlet, NavLink } from "react-router";
import { useAuth } from "~/context/authContext";
import { FiLogOut, FiMail, FiUsers } from "react-icons/fi";

export default function DashboardLayout() {
    const { user, logout } = useAuth();

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md">
                <div className="p-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                        ScarSoft Dashboard
                    </h2>
                    <p className="text-sm text-gray-600">
                        Welcome, {user?.email}
                    </p>
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
                    <button
                        onClick={logout}
                        className="flex items-center w-full p-4 text-gray-700 hover:bg-gray-200"
                    >
                        <FiLogOut className="mr-2" /> Logout
                    </button>
                </nav>
            </aside>
            {/* Main Content */}
            <main className="flex-1 p-6">
                <Outlet />
            </main>
        </div>
    );
}
