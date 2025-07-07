import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "~/context/authContext";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { login } from "~/store/sagas/authSaga";
import { useEffect, useRef } from "react";
import type { RootState } from "~/store";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authState = useSelector(
        (state: RootState) => state.auth,
        (prev, next) =>
            prev.navigate?.path === next.navigate?.path &&
            prev.login_session_id === next.login_session_id &&
            prev.next_step === next.next_step &&
            prev.token === next.token
    );
    const isLoading = useSelector(
        (state: RootState) => state.loading.isLoading
    );
    const isMounted = useRef(true);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
        reset,
        watch
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const email = watch("email");

    useEffect(() => {
        if (!isMounted.current) {
            console.log("Login: Component unmounted, skipping useEffect");
            return;
        }

        console.log("Login: useEffect triggered with authState:", {
            navigate: authState.navigate,
            login_session_id: authState.login_session_id,
            next_step: authState.next_step,
            isAuthenticated,
            token: authState.token,
            email
        });

        if (authState.navigate) {
            console.log(
                "Login: Navigating to",
                authState.navigate.path,
                "with state:",
                authState.navigate.state
            );
            navigate(authState.navigate.path, {
                state: authState.navigate.state,
                replace: authState.navigate.replace ?? true
            });
        } else if (
            authState.login_session_id &&
            authState.next_step === "verify_login_otp"
        ) {
            console.log(
                "Login: Fallback navigation to /verify-otp with email:",
                email,
                "and login_session_id:",
                authState.login_session_id
            );
            navigate("/auth/verify-otp", {
                state: { email, login_session_id: authState.login_session_id },
                replace: true
            });
        } else if (isAuthenticated && authState.token) {
            console.log("Login: Navigating to /dashboard");
            navigate("/dashboard", { replace: true });
        } else {
            console.log("Login: No navigation triggered");
        }

        return () => {
            console.log("Login: Cleaning up useEffect");
            isMounted.current = false;
        };
    }, [
        isAuthenticated,
        authState.navigate,
        authState.login_session_id,
        authState.next_step,
        authState.token,
        navigate,
        email
    ]);

    useEffect(() => {
        if (authState.error && isMounted.current) {
            console.log("Login: Auth error:", authState.error);
            setError("root", {
                message:
                    authState.error.message || "An error occurred during login"
            });
            reset({ password: "" });
        }
    }, [authState.error, setError, reset]);

    const onSubmit: SubmitHandler<LoginForm> = (data, event) => {
        event?.preventDefault();
        console.log("Login: Submitting login with data:", data);
        dispatch(login(data));
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Login</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        {...register("email")}
                        className="mt-1 w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                        placeholder="Enter your email"
                        disabled={isSubmitting || isLoading}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.email.message}
                        </p>
                    )}
                </div>
                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        {...register("password")}
                        className="mt-1 w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                        placeholder="Enter your password"
                        disabled={isSubmitting || isLoading}
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.password.message}
                        </p>
                    )}
                </div>
                {errors.root && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.root.message}
                    </p>
                )}
                <div className="text-right">
                    <a
                        href="/forgot-password"
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Forgot Password?
                    </a>
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Logging in..." : "Login"}
                </button>
            </form>
            <p className="text-center text-sm">
                Don't have an account?{" "}
                <a href="/auth/register" className="text-blue-600 hover:underline">
                    Register
                </a>
            </p>
        </div>
    );
}
