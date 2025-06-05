import Sidebar from "~/dashboard/components/sidebar";
import MainContent from "~/dashboard/components/mainContent";
import Header from "~/dashboard/components/header";

export default function DashboardLayout() {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <MainContent />
            </div>
        </div>
    );
}
