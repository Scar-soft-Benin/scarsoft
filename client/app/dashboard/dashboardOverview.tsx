import { useAuth } from "~/context/authContext";

export default function Overview() {
    const { user } = useAuth();

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
            <p>Welcome, {user?.role === "admin" ? "Admin" : "Secretary"}!</p>
            <p>
                Use the sidebar to manage contacts or recruitment submissions.
            </p>
        </div>
    );
}
