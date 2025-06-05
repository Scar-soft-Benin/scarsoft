import { Navigate } from "react-router";
import { useAuth } from "~/context/authContext";
import DashboardLayout from "./dashboardLayout";

export default function ProtectedLayout() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <DashboardLayout />;
}
