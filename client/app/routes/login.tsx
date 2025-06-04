import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "~/context/authContext";
import { useLoading } from "~/context/loadingContext";
import { useNavigate } from "react-router";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
    const { login } = useAuth();
    const { showLoading, hideLoading } = useLoading();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data: LoginForm) => {
        try {
            showLoading();
            await login(data.email, data.password);
            navigate("/dashboard");
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : "Invalid credentials";
            setError("root", { message });
            console.error("Login error:", error); // Log for debugging
        } finally {
            hideLoading();
        }
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
                            className="mt-1 w-full p-2 border rounded-md"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm">
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
                            className="mt-1 w-full p-2 border rounded-md"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm">
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                    {errors.root && (
                        <p className="text-red-500 text-sm">
                            {errors.root.message}
                        </p>
                    )}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full p-2 bg-secondary text-dark rounded-md hover:bg-opacity-90"
                    >
                        {isSubmitting ? "Logging in..." : "Login"}
                    </button>
                </form>
                <p className="mt-4 text-center">
                    Don't have an account?{" "}
                    <a href="/register" className="text-secondary">
                        Register
                    </a>
                </p>
            </div>
        </div>
    );
}
