import Header from "~/dashboard/components/header";
import MainContent from "~/dashboard/components/mainContent";
import Sidebar from "~/dashboard/components/sidebar";


export default function DashboardLayout() {
    return (
        <div data-theme-target="dashboard" className="dashboard-root flex min-h-screen bg-neutral-light-bg dark:bg-neutral-dark-bg">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <MainContent />
            </div>
        </div>
    );
}
