import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoading } from "~/context/loadingContext";
import { useNavigate } from "react-router";

const registerSchema = z
    .object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(6, "Confirm password is required")
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"]
    });

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
    const { showLoading, hideLoading } = useLoading();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema)
    });

    const onSubmit = async (data: RegisterForm) => {
        try {
            showLoading();
            await mockRegister(data.email, data.password);
            navigate("/login");
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : "Registration failed";
            setError("root", { message });
            console.error("Register error:", error); // Log for debugging
        } finally {
            hideLoading();
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">
                    Register
                </h2>
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
                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            {...register("confirmPassword")}
                            className="mt-1 w-full p-2 border rounded-md"
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm">
                                {errors.confirmPassword.message}
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
                        {isSubmitting ? "Registering..." : "Register"}
                    </button>
                </form>
                <p className="mt-4 text-center">
                    Already have an account?{" "}
                    <a href="/login" className="text-secondary">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
}

// Mock register function (replace with API call later)
const mockRegister = async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay
    if (email && password) {
        return { success: true };
    }
    throw new Error("Registration failed");
};
