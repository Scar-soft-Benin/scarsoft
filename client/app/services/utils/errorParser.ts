import type { ApiError } from "../types/common.types";

export function parseApiError(error: unknown): ApiError {
    console.error("Raw error in parseApiError:", error);
    const err = error as {
        response?: {
            status?: number;
            data?: {
                message?: string;
                error_code?: string;
                details?: { message?: string; error_code?: string };
            };
        };
    };
    return {
        status: err.response?.status || 500,
        message:
            err.response?.data?.details?.message ||
            err.response?.data?.message ||
            "Unknown error",
        error_code:
            err.response?.data?.details?.error_code ||
            err.response?.data?.error_code
    };
}
