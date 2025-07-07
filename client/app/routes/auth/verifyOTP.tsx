import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "~/context/authContext";
import { useNavigate, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { verifyOTP, resendOTP } from "~/store/sagas/authSaga";
import { useEffect } from "react";
import type { RootState } from "~/store";

const otpSchema = z.object({
    otp: z
        .string()
        .length(6, "OTP must be 6 digits")
        .regex(/^\d+$/, "OTP must contain only digits")
});

type OTPForm = z.infer<typeof otpSchema>;

export default function VerifyOTP() {
    const { isAuthenticated, isOTPVerified } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
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
    } = useForm<OTPForm>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            otp: ""
        }
    });

    // Redirect if authenticated and OTP verified
    useEffect(() => {
        if (isAuthenticated && isOTPVerified) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, isOTPVerified, navigate]);

    // Handle auth errors
    useEffect(() => {
        if (authError) {
            setError("root", { message: authError.message });
            reset({ otp: "" });
        }
    }, [authError, setError, reset]);

    // Extract email from location state
    const email = (location.state as { email?: string } | null)?.email || "";

    const onSubmit = async (data: OTPForm) => {
        if (!email) {
            setError("root", {
                message: "Email not provided. Please try logging in again."
            });
            return;
        }
        dispatch(verifyOTP({ email, code: data.otp }));
    };

    const handleResendOTP = () => {
        if (!email) {
            setError("root", {
                message: "Email not provided. Please try logging in again."
            });
            return;
        }
        dispatch(resendOTP({ email }));
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Verify OTP</h2>
            <p className="text-sm text-gray-600 text-center">
                Enter the 6-digit OTP sent to {email || "your email"}.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label
                        htmlFor="otp"
                        className="block text-sm font-medium text-gray-700"
                    >
                        OTP Code
                    </label>
                    <input
                        id="otp"
                        type="text"
                        {...register("otp")}
                        className="mt-1 w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                        placeholder="Enter 6-digit OTP"
                        disabled={isSubmitting || isLoading}
                        maxLength={6}
                    />
                    {errors.otp && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.otp.message}
                        </p>
                    )}
                    {errors.root && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.root.message}
                        </p>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Verifying..." : "Verify OTP"}
                </button>
            </form>
            <div className="text-center">
                <button
                    onClick={handleResendOTP}
                    disabled={isLoading}
                    className="text-sm text-blue-600 hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                    Resend OTP
                </button>
            </div>
            <p className="text-center text-sm">
                Back to{" "}
                <a href="/login" className="text-blue-600 hover:underline">
                    Login
                </a>
            </p>
        </div>
    );
}
