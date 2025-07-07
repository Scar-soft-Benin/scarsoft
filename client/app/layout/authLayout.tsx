import { Outlet } from "react-router";

export default function AuthLayout() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                {/* Branding */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">SCAR-SOFT</h1>
                    <p className="text-sm text-gray-500">
                        Secure Authentication
                    </p>
                </div>
                {/* Render child routes */}
                <Outlet />
            </div>
        </div>
    );
}
