import { apiClient } from "../config/apiConfig";
import { parseApiError } from "../utils/errorParser";
import { type ApiResponse } from "../types/common.types";
import type {
    User,
    LoginPayload,
    LoginResponse,
    RegisterPayload,
    PasswordResetPayload,
    OTPVerificationPayload,
    ResendOTPPayload
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
                    next_step: response.data.next_step,
                    user: response.data.user,
                    token: response.data.token,
                    refreshToken: response.data.refreshToken
                },
                status: response.status,
                message: response.data.message
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    },

    register: async (payload: RegisterPayload): Promise<ApiResponse<User>> => {
        try {
            const response = await apiClient.post("/auth/register", payload);
            console.log("authService: Register response:", response.data);
            return {
                data: response.data,
                status: response.status,
                message: response.data.message
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    },

    refreshToken: async (
        refreshToken: string
    ): Promise<ApiResponse<LoginResponse>> => {
        try {
            const response = await apiClient.post("/auth/refresh", {
                refreshToken
            });
            console.log("authService: Refresh token response:", response.data);
            return {
                data: response.data,
                status: response.status,
                message: response.data.message
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
                "/auth/password-reset",
                payload
            );
            console.log("authService: Password reset response:", response.data);
            return {
                data: null,
                status: response.status,
                message: response.data.message
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    },

    verifyOTP: async (
        payload: OTPVerificationPayload
    ): Promise<ApiResponse<null>> => {
        try {
            const response = await apiClient.post("/auth/verify-otp", payload);
            console.log("authService: Verify OTP response:", response.data);
            return {
                data: null,
                status: response.status,
                message: response.data.message
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    },

    resendOTP: async (
        payload: ResendOTPPayload
    ): Promise<ApiResponse<null>> => {
        try {
            const response = await apiClient.post("/auth/resend-otp", payload);
            console.log("authService: Resend OTP response:", response.data);
            return {
                data: null,
                status: response.status,
                message: response.data.message
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    },

    logout: async (): Promise<ApiResponse<null>> => {
        try {
            const response = await apiClient.post("/auth/logout");
            console.log("authService: Logout response:", response.data);
            return {
                data: null,
                status: response.status,
                message: response.data.message
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
                message: response.data.message
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    }
};
