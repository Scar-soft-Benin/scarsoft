import { apiClient } from "../config/apiConfig";
import { type ApiResponse, type ApiError } from "../types/common.types";
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
            return {
                data: response.data,
                status: response.status,
                message: response.data.message
            };
        } catch (error: unknown) {
            const err = error as {
                response?: {
                    status?: number;
                    data?: { message?: string; error_code?: string };
                };
            };
            throw {
                status: err.response?.status || 500,
                message: err.response?.data?.message || "Failed to login",
                error_code: err.response?.data?.error_code
            } as ApiError;
        }
    },

    register: async (payload: RegisterPayload): Promise<ApiResponse<User>> => {
        try {
            const response = await apiClient.post("/auth/register", payload);
            return {
                data: response.data,
                status: response.status,
                message: response.data.message
            };
        } catch (error: unknown) {
            const err = error as {
                response?: {
                    status?: number;
                    data?: { message?: string; error_code?: string };
                };
            };
            throw {
                status: err.response?.status || 500,
                message: err.response?.data?.message || "Failed to register",
                error_code: err.response?.data?.error_code
            } as ApiError;
        }
    },

    refreshToken: async (
        refreshToken: string
    ): Promise<ApiResponse<LoginResponse>> => {
        try {
            const response = await apiClient.post("/auth/refresh", {
                refreshToken
            });
            return {
                data: response.data,
                status: response.status,
                message: response.data.message
            };
        } catch (error: unknown) {
            const err = error as {
                response?: {
                    status?: number;
                    data?: { message?: string; error_code?: string };
                };
            };
            throw {
                status: err.response?.status || 500,
                message:
                    err.response?.data?.message || "Failed to refresh token",
                error_code: err.response?.data?.error_code
            } as ApiError;
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
            return {
                data: null,
                status: response.status,
                message: response.data.message
            };
        } catch (error: unknown) {
            const err = error as {
                response?: {
                    status?: number;
                    data?: { message?: string; error_code?: string };
                };
            };
            throw {
                status: err.response?.status || 500,
                message:
                    err.response?.data?.message ||
                    "Failed to request password reset",
                error_code: err.response?.data?.error_code
            } as ApiError;
        }
    },

    verifyOTP: async (
        payload: OTPVerificationPayload
    ): Promise<ApiResponse<null>> => {
        try {
            const response = await apiClient.post("/auth/verify-otp", payload);
            return {
                data: null,
                status: response.status,
                message: response.data.message
            };
        } catch (error: unknown) {
            const err = error as {
                response?: {
                    status?: number;
                    data?: { message?: string; error_code?: string };
                };
            };
            throw {
                status: err.response?.status || 500,
                message: err.response?.data?.message || "Failed to verify OTP",
                error_code: err.response?.data?.error_code
            } as ApiError;
        }
    },

    resendOTP: async (
        payload: ResendOTPPayload
    ): Promise<ApiResponse<null>> => {
        try {
            const response = await apiClient.post("/auth/resend-otp", payload);
            return {
                data: null,
                status: response.status,
                message: response.data.message
            };
        } catch (error: unknown) {
            const err = error as {
                response?: {
                    status?: number;
                    data?: { message?: string; error_code?: string };
                };
            };
            throw {
                status: err.response?.status || 500,
                message: err.response?.data?.message || "Failed to resend OTP",
                error_code: err.response?.data?.error_code
            } as ApiError;
        }
    },

    logout: async (): Promise<ApiResponse<null>> => {
        try {
            const response = await apiClient.post("/auth/logout");
            return {
                data: null,
                status: response.status,
                message: response.data.message
            };
        } catch (error: unknown) {
            const err = error as {
                response?: {
                    status?: number;
                    data?: { message?: string; error_code?: string };
                };
            };
            throw {
                status: err.response?.status || 500,
                message: err.response?.data?.message || "Failed to logout",
                error_code: err.response?.data?.error_code
            } as ApiError;
        }
    },

    getCurrentUser: async (): Promise<ApiResponse<User>> => {
        try {
            const response = await apiClient.get("/auth/me");
            return {
                data: response.data,
                status: response.status,
                message: response.data.message
            };
        } catch (error: unknown) {
            const err = error as {
                response?: {
                    status?: number;
                    data?: { message?: string; error_code?: string };
                };
            };
            throw {
                status: err.response?.status || 500,
                message:
                    err.response?.data?.message ||
                    "Failed to fetch current user",
                error_code: err.response?.data?.error_code
            } as ApiError;
        }
    }
};
