// ~/dashboard/job-management/jobManagementRoute.tsx
import JobManagement from "./jobManagement";

export function meta() {
    return [
        { title: "Dashboard - Gestion des Offres d'Emploi" },
        { name: "description", content: "Gérez vos offres d'emploi dans le dashboard admin" }
    ];
}

export default function JobManagementRoute() {
    return <JobManagement />;
}