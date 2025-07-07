import { apiClient } from "../config/apiConfig";
import { parseApiError } from "../utils/errorParser";
import type { ApiResponse } from "../types/common.types";
import type {
    User,
    LoginPayload,
    LoginResponse,
    PasswordResetPayload,
    OTPVerificationPayload,
    ResendOTPPayload,
    VerifyOTPResponse,
    RegisterPayload,
    RegisterResponse,
    EmailVerificationPayload,
    ResendEmailVerificationPayload,
    LogoutPayload,
    LogoutResponse
} from "../types/auth.types";

export const authService = {
    login: async (
        payload: LoginPayload
    ): Promise<ApiResponse<LoginResponse>> => {
        try {
            const response = await apiClient.post("/auth/login", payload);
            console.log("authService: Login response:", response.data);
            return {
                data: {
                    success: response.data.success,
                    message: response.data.message,
                    login_session_id: response.data.login_session_id,
                    otp_expires_at: response.data.otp_expires_at,
                    next_step: response.data.next_step
                },
                status: response.status,
                message: response.data.message
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    },
    register: async (
        payload: RegisterPayload
    ): Promise<ApiResponse<RegisterResponse>> => {
        try {
            const response = await apiClient.post("/auth/register", {
                name: payload.name,
                email: payload.email,
                password: payload.password,
                password_confirmation: payload.passwordConfirmation
            });
            console.log("authService: Register response:", response.data);
            return {
                data: {
                    success: response.data.success,
                    message: response.data.message,
                    user: response.data.user,
                    verification_required: response.data.verification_required,
                    errors: response.data.errors
                },
                status: response.status,
                message: response.data.message
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    },

    verifyOTP: async (
        payload: OTPVerificationPayload
    ): Promise<ApiResponse<VerifyOTPResponse>> => {
        try {
            const response = await apiClient.post(
                "/auth/verify-login-otp",
                payload
            );
            console.log("authService: Verify OTP response:", response.data);
            return {
                data: {
                    success: response.data.success,
                    message: response.data.message,
                    access_token: response.data.access_token,
                    refresh_token: response.data.refresh_token,
                    token_type: response.data.token_type,
                    expires_in: response.data.expires_in,
                    user: response.data.user
                },
                status: response.status,
                message: response.data.message
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    },

    resendOTP: async (
        payload: ResendOTPPayload
    ): Promise<ApiResponse<LoginResponse>> => {
        try {
            const response = await apiClient.post(
                "/auth/resend-login-otp",
                payload
            );
            console.log("authService: Resend OTP response:", response.data);
            return {
                data: {
                    success: response.data.success,
                    message: response.data.message,
                    login_session_id: response.data.login_session_id,
                    otp_expires_at: response.data.otp_expires_at,
                    next_step: response.data.next_step
                },
                status: response.status,
                message: response.data.message
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    },

    logout: async (
        payload: LogoutPayload
    ): Promise<ApiResponse<LogoutResponse>> => {
        try {
            const response = await apiClient.post("/auth/logout", payload);
            console.log("authService: Logout response:", response.data);
            return {
                data: {
                    success: response.data.success,
                    message: response.data.message || "Logged out successfully"
                },
                status: response.status,
                message: response.data.message || "Logged out successfully"
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    },

    getCurrentUser: async (): Promise<ApiResponse<User>> => {
        try {
            const response = await apiClient.get("/auth/me");
            console.log(
                "authService: Get current user response:",
                response.data
            );
            return {
                data: response.data,
                status: response.status,
                message: "User fetched successfully"
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    },

    requestPasswordReset: async (
        payload: PasswordResetPayload
    ): Promise<ApiResponse<null>> => {
        try {
            const response = await apiClient.post(
                "/auth/password/reset",
                payload
            );
            console.log(
                "authService: Request password reset response:",
                response.data
            );
            return {
                data: null,
                status: response.status,
                message: response.data.message || "Password reset link sent"
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    },
    verifyEmail: async (
        payload: EmailVerificationPayload
    ): Promise<ApiResponse<VerifyOTPResponse>> => {
        try {
            const response = await apiClient.post(
                "/auth/email/verify",
                payload
            );
            console.log("authService: Verify Email response:", response.data);
            return {
                data: {
                    success: response.data.success,
                    message: response.data.message,
                    access_token: response.data.access_token,
                    refresh_token: response.data.refresh_token,
                    token_type: response.data.token_type,
                    expires_in: response.data.expires_in,
                    user: response.data.user
                },
                status: response.status,
                message: response.data.message
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    },

    resendEmailVerification: async (
        payload: ResendEmailVerificationPayload
    ): Promise<ApiResponse<null>> => {
        try {
            const response = await apiClient.post(
                "/auth/email/resend",
                payload
            );
            console.log(
                "authService: Resend Email Verification response:",
                response.data
            );
            return {
                data: null,
                status: response.status,
                message:
                    response.data.message ||
                    "Verification code resent successfully"
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    }
};
