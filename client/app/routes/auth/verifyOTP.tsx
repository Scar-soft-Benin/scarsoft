import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router";
import { useEffect, useRef, useLayoutEffect } from "react";
import { verifyOTP, resendOTP } from "~/store/sagas/authSaga";
import type { RootState } from "~/store";
import type { Route } from "./+types/verifyOTP";
import { motion, useAnimate } from "motion/react";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "OTP Code | Scar-Soft" },
        {
            name: "description",
            content:
                "Please enter the 6-digit OTP code sent to your email to verify your account. If you haven't received the code, you can request a new one."
        }
    ];
}

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

    const email = location.state?.email as string | undefined;
    const login_session_id = location.state?.login_session_id as
        | string
        | undefined;

    const inputRefs = useRef<HTMLInputElement[]>([]);
    const [scope, animate] = useAnimate();
    const inputContainerRef = useRef<HTMLDivElement>(null);

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

    // ✨ Animation des inputs à l’apparition
    useLayoutEffect(() => {
        if (inputContainerRef.current) {
            const els = inputContainerRef.current.children;
            Array.from(els).forEach((el, i) => {
                animate(
                    el,
                    { opacity: [0, 1], y: [20, 0], scale: [0.8, 1] },
                    {
                        duration: 0.5,
                        delay: i * 0.05,
                        ease: "easeOut"
                    }
                );
            });
        }
    }, [animate]);

    // 🔁 Redirection si infos manquantes
    useEffect(() => {
        if (!email || !login_session_id) {
            navigate("/auth/login", { replace: true });
        }
        if (authState.navigate) {
            navigate(authState.navigate.path, {
                state: authState.navigate.state,
                replace: authState.navigate.replace ?? true
            });
        }
    }, [authState.navigate, email, login_session_id, navigate]);

    // ❌ Gestion erreur OTP
    useEffect(() => {
        if (authState.error && inputContainerRef.current) {
            animate(
                inputContainerRef.current,
                { x: [-10, 10] },
                {
                    duration: 0.1,
                    repeat: 5,
                    ease: "easeInOut"
                }
            );
        }
    }, [authState.error, animate]);

    // ✍️ Saisie OTP chiffre par chiffre
    const handleDigitChange = (index: number, value: string) => {
        if (!/^[0-9]?$/.test(value)) return;

        const newDigits = [...digits];
        newDigits[index] = value;
        setValue("digits", newDigits);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        const completed = newDigits.every((d) => d.length === 1);
        if (completed) {
            handleSubmit(onSubmit)();
        }
    };

    // ⌨️ Retour arrière
    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number
    ) => {
        if (e.key === "Backspace" && digits[index] === "" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // 📋 Gestion du collage d’un code complet
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const paste = e.clipboardData.getData("text").trim();
        if (/^\d{6}$/.test(paste)) {
            const newDigits = paste.split("");
            setValue("digits", newDigits);
            newDigits.forEach((digit, i) => {
                if (inputRefs.current[i]) inputRefs.current[i].value = digit;
            });
            handleSubmit(onSubmit)();
            e.preventDefault();
        }
    };

    // 🚀 Soumission
    const onSubmit: SubmitHandler<OTPForm> = (data, event) => {
        event?.preventDefault();
        if (!email || !login_session_id) return;
        const otp = data.digits.join("");
        dispatch(verifyOTP({ code: otp, email, login_session_id }));
    };

    const handleResendOTP = () => {
        if (!email || !login_session_id) return;
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
                <motion.div ref={scope} className="flex justify-center gap-2">
                    {digits.map((_, index) => (
                        <input
                            key={index}
                            id={`digit-${index}`}
                            type="text"
                            inputMode="numeric"
                            pattern="\d*"
                            maxLength={1}
                            {...register(`digits.${index}`)}
                            ref={(el) => {
                                if (el) inputRefs.current[index] = el;
                            }}
                            value={digits[index]}
                            onChange={(e) =>
                                handleDigitChange(index, e.target.value)
                            }
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onPaste={handlePaste}
                            className="w-12 h-12 text-center text-lg border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:bg-gray-100 transition-all duration-150"
                            disabled={isSubmitting || isLoading}
                        />
                    ))}
                </motion.div>

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
                    className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading && (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    )}
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
