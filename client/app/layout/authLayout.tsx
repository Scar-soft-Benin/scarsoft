import { Outlet, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import type { RootState } from "~/store";

export default function AuthLayout() {
    const navigate = useNavigate();
    const authState = useSelector(
        (state: RootState) => state.auth,
        (prev, next) =>
            prev.navigate?.path === next.navigate?.path &&
            prev.login_session_id === next.login_session_id &&
            prev.next_step === next.next_step
    );

    useEffect(() => {
        console.log("AuthLayout: useEffect triggered with authState:", {
            navigate: authState.navigate,
            login_session_id: authState.login_session_id,
            next_step: authState.next_step
        });

        if (authState.navigate) {
            console.log(
                "AuthLayout: Navigating to",
                authState.navigate.path,
                "with state:",
                authState.navigate.state
            );
            navigate(authState.navigate.path, {
                state: authState.navigate.state,
                replace: authState.navigate.replace ?? true
            });
        }
    }, [authState.navigate, navigate]);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">
                        SCAR-SOFT
                    </h1>
                    <p className="text-sm text-gray-500">
                        Secure Authentication
                    </p>
                </div>
                <Outlet />
            </div>
        </div>
    );
}
