import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router";
import { useEffect, useRef } from "react";
import { verifyOTP, resendOTP } from "~/store/sagas/authSaga";
import type { RootState } from "~/store";

const otpSchema = z.object({
    digits: z
        .array(z.string().regex(/^[0-9]?$/, "Must be a single digit"))
        .length(6, "OTP must be 6 digits")
});

type OTPForm = z.infer<typeof otpSchema>;

export default function VerifyOTP() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authState = useSelector((state: RootState) => state.auth);
    const isLoading = useSelector(
        (state: RootState) => state.loading.isLoading
    );
    const isMounted = useRef(true);

    const email = location.state?.email as string | undefined;
    const login_session_id = location.state?.login_session_id as
        | string
        | undefined;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
        setValue,
        watch
    } = useForm<OTPForm>({
        resolver: zodResolver(otpSchema),
        defaultValues: { digits: ["", "", "", "", "", ""] }
    });

    const digits = watch("digits");

    useEffect(() => {
        if (!isMounted.current) return;
        if (!email || !login_session_id) {
            console.log(
                "VerifyOTP: Missing email or login_session_id, redirecting to /login"
            );
            navigate("/auth/login", { replace: true });
        }
        if (authState.navigate) {
            console.log("VerifyOTP: Navigating to", authState.navigate.path);
            navigate(authState.navigate.path, {
                state: authState.navigate.state,
                replace: authState.navigate.replace ?? true
            });
        }
    }, [authState.navigate, email, login_session_id, navigate]);

    useEffect(() => {
        if (authState.error && isMounted.current) {
            console.log("VerifyOTP: Auth error:", authState.error);
            setError("root", {
                message:
                    authState.error.message ||
                    "An error occurred during OTP verification"
            });
            setValue("digits", ["", "", "", "", "", ""]);
        }
        return () => {
            isMounted.current = false;
        };
    }, [authState.error, setError, setValue]);

    const handleDigitChange = (index: number, value: string) => {
        if (/^[0-9]?$/.test(value)) {
            const newDigits = [...digits];
            newDigits[index] = value;
            setValue("digits", newDigits);
            if (value && index < 5) {
                document.getElementById(`digit-${index + 1}`)?.focus();
            }
        }
    };

    const onSubmit: SubmitHandler<OTPForm> = (data, event) => {
        event?.preventDefault();
        if (!email || !login_session_id) return;
        const otp = data.digits.join("");
        console.log("VerifyOTP: Submitting OTP with data:", {
            code: otp,
            email,
            login_session_id
        });
        dispatch(verifyOTP({ code: otp, email, login_session_id }));
    };

    const handleResendOTP = () => {
        if (!email || !login_session_id) return;
        console.log("VerifyOTP: Resending OTP for email:", email);
        dispatch(resendOTP({ email, login_session_id }));
        setValue("digits", ["", "", "", "", "", ""]);
    };

    if (!email || !login_session_id) {
        return <div>Error: Missing email or login session ID</div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Verify OTP</h2>
            <p className="text-center text-sm">
                A verification code has been sent to {email}.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex justify-center gap-2">
                    {digits.map((_, index) => (
                        <input
                            key={index}
                            id={`digit-${index}`}
                            type="text"
                            maxLength={1}
                            {...register(`digits.${index}`)}
                            value={digits[index]}
                            onChange={(e) =>
                                handleDigitChange(index, e.target.value)
                            }
                            className="w-12 h-12 text-center border rounded-md focus:ring focus:ring-blue-300 disabled:bg-gray-100"
                            disabled={isSubmitting || isLoading}
                        />
                    ))}
                </div>
                {errors.digits && (
                    <p className="text-red-500 text-sm text-center">
                        {errors.digits.message ||
                            "Please enter a valid 6-digit OTP"}
                    </p>
                )}
                {errors.root && (
                    <p className="text-red-500 text-sm text-center">
                        {errors.root.message}
                    </p>
                )}
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
                    disabled={isSubmitting || isLoading}
                    className="text-sm text-blue-600 hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                    Resend OTP
                </button>
            </div>
        </div>
    );
}
