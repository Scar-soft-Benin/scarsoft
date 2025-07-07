import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "~/store";
import { resendEmailVerification, verifyEmail } from "~/store/sagas/authSaga";

export default function VerifyEmail() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const email = location.state?.email as string | undefined;
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState<string | null>(null);
    const { error: authError, isAuthenticated } = useSelector(
        (state: RootState) => state.auth
    );

    useEffect(() => {
        if (!email) {
            console.log("VerifyEmail: Missing email, redirecting to /login");
            navigate("/auth/login", { replace: true });
        }
        if (isAuthenticated) {
            navigate("/dashboard", { replace: true });
        }
    }, [email, isAuthenticated, navigate]);

    const handleCodeChange = (index: number, value: string) => {
        if (/^[0-9]?$/.test(value)) {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);
            setError(null);
            if (value && index < 5) {
                document.getElementById(`code-input-${index + 1}`)?.focus();
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const verificationCode = code.join("");
        if (verificationCode.length !== 6) {
            setError("Please enter a 6-digit code");
            return;
        }
        dispatch(verifyEmail({ email: email!, code: verificationCode }));
    };

    const handleResend = () => {
        dispatch(resendEmailVerification({ email: email! }));
    };

    if (!email) {
        return <div>Error: Missing email</div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-6">
                Verify Your Email
            </h2>
            <p className="text-center text-sm mb-4">
                A 6-digit code has been sent to {email}. Enter it below to
                verify your account.
            </p>
            <form onSubmit={handleSubmit}>
                <div className="flex justify-center gap-2 mb-4">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            id={`code-input-${index}`}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) =>
                                handleCodeChange(index, e.target.value)
                            }
                            className="w-12 h-12 text-center border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    ))}
                </div>
                {error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
                )}
                {authError && (
                    <p className="text-red-500 text-sm text-center">
                        {authError.message}
                    </p>
                )}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                    Verify
                </button>
            </form>
            <p className="mt-4 text-center text-sm">
                Didn't receive a code?{" "}
                <button
                    onClick={handleResend}
                    className="text-blue-600 hover:underline"
                >
                    Resend Code
                </button>
            </p>
            <p className="mt-2 text-center text-sm">
                <button
                    onClick={() => navigate("/auth/login", { replace: true })}
                    className="text-blue-600 hover:underline"
                >
                    Back to Login
                </button>
            </p>
        </div>
    );
}
