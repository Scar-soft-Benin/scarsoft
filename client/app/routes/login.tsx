import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "~/context/authContext";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { login } from "~/store/sagas/authSaga";
import { useEffect } from "react";
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
    const authError = useSelector((state: RootState) => state.auth.error);
    const isLoading = useSelector(
        (state: RootState) => state.loading.isLoading
    );

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
        reset
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    // Redirect if authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, navigate]);

    // Handle auth errors and OTP redirect
    useEffect(() => {
        if (authError) {
            if (authError.error_code === "OTP_GENERATION_FAILED") {
                navigate("/verify-otp", { state: { email: "" } }); // Pass email if available
            } else {
                setError("root", { message: authError.message });
                reset({ password: "" });
            }
        }
    }, [authError, setError, reset, navigate]);

    const onSubmit = async (data: LoginForm) => {
        dispatch(login(data));
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
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
                <p className="mt-4 text-center text-sm">
                    Don't have an account?{" "}
                    <a
                        href="/register"
                        className="text-blue-600 hover:underline"
                    >
                        Register
                    </a>
                </p>
            </div>
        </div>
    );
}
