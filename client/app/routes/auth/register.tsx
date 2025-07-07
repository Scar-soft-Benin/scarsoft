import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useEffect, useRef } from "react";
import { register } from "~/store/sagas/authSaga";
import type { RootState } from "~/store";

const registerSchema = z
    .object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        passwordConfirmation: z.string().min(6, "Confirm password is required")
    })
    .refine((data) => data.password === data.passwordConfirmation, {
        message: "Passwords do not match",
        path: ["passwordConfirmation"]
    });

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authState = useSelector(
        (state: RootState) => state.auth,
        (prev, next) =>
            prev.navigate?.path === next.navigate?.path &&
            prev.error === next.error
    );
    const isLoading = useSelector(
        (state: RootState) => state.loading.isLoading
    );
    const isMounted = useRef(true);

    const {
        register: formRegister,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
        reset
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            passwordConfirmation: ""
        }
    });

    useEffect(() => {
        if (!isMounted.current) {
            console.log("Register: Component unmounted, skipping useEffect");
            return;
        }

        console.log("Register: useEffect triggered with authState:", {
            navigate: authState.navigate,
            error: authState.error
        });

        if (authState.navigate) {
            console.log(
                "Register: Navigating to",
                authState.navigate.path,
                "with state:",
                authState.navigate.state
            );
            navigate(authState.navigate.path, {
                state: authState.navigate.state,
                replace: authState.navigate.replace ?? true
            });
        }

        if (authState.error) {
            console.log("Register: Auth error:", authState.error);
            setError("root", {
                message:
                    authState.error.message ||
                    "An error occurred during registration"
            });
            if (authState.error) {
                Object.entries(authState.error).forEach(([field, messages]) => {
                    setError(field as keyof RegisterForm, {
                        message: messages[0]
                    });
                });
            }
            reset({ password: "", passwordConfirmation: "" });
        }

        return () => {
            console.log("Register: Cleaning up useEffect");
            isMounted.current = false;
        };
    }, [authState.navigate, authState.error, navigate, setError, reset]);

    const onSubmit: SubmitHandler<RegisterForm> = (data, event) => {
        event?.preventDefault();
        console.log("Register: Submitting registration with data:", data);
        dispatch(register(data));
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        {...formRegister("name")}
                        className="mt-1 w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                        placeholder="Enter your name"
                        disabled={isSubmitting || isLoading}
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.name.message}
                        </p>
                    )}
                </div>
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
                        {...formRegister("email")}
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
                        {...formRegister("password")}
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
                <div>
                    <label
                        htmlFor="passwordConfirmation"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Confirm Password
                    </label>
                    <input
                        id="passwordConfirmation"
                        type="password"
                        {...formRegister("passwordConfirmation")}
                        className="mt-1 w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                        placeholder="Confirm your password"
                        disabled={isSubmitting || isLoading}
                    />
                    {errors.passwordConfirmation && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.passwordConfirmation.message}
                        </p>
                    )}
                </div>
                {errors.root && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.root.message}
                    </p>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Registering..." : "Register"}
                </button>
            </form>
            <p className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <a href="/auth/login" className="text-blue-600 hover:underline">
                    Login
                </a>
            </p>
        </div>
    );
}
