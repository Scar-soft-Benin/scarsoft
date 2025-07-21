// ~/layout/companyLayout.tsx
import { Outlet, NavLink } from "react-router";
import { FiHome, FiBriefcase, FiUsers, FiBarChart2, FiSettings } from "react-icons/fi";

export default function CompanyLayout() {
  const navItems = [
    { to: "/company/dashboard", label: "Tableau de Bord", icon: <FiHome /> },
    { to: "/company/dashboard/jobs", label: "Offres", icon: <FiBriefcase /> },
    { to: "/company/dashboard/recruitment", label: "Candidatures", icon: <FiUsers /> },
    { to: "/company/dashboard/analytics", label: "Statistiques", icon: <FiBarChart2 /> },
    { to: "/company/dashboard/profile", label: "Profil", icon: <FiSettings /> },
  ];

  return (
    <div className="flex min-h-screen bg-neutral-light-bg dark:bg-neutral-dark-bg">
      <aside className="w-64 bg-white dark:bg-neutral-dark-surface p-4 shadow-md">
        <h2 className="text-xl font-bold text-neutral-light-text dark:text-neutral-dark-text mb-4">
          Espace Entreprise
        </h2>
        <nav>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center p-2 mb-2 rounded-md ${
                  isActive
                    ? "bg-teal-800 dark:bg-teal-400 text-white dark:text-neutral-dark-text"
                    : "text-neutral-light-text dark:text-neutral-dark-text hover:bg-teal-100 dark:hover:bg-teal-300"
                }`
              }
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}