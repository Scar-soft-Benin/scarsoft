import axios, { type AxiosInstance, type AxiosRequestConfig, AxiosError } from "axios";
import { getAuthToken } from "../utils/httpClient";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8010/api";
export const STORAGE_BASE_URL =
    import.meta.env.VITE_STORAGE_BASE_URL || "http://localhost:8010";
const TOKEN_REFRESH_URL = `${API_BASE_URL}/auth/refresh`;
const REQUEST_TIMEOUT = 10000; // 10 seconds

interface RefreshTokenResponse {
    token: string;
    refreshToken: string;
}

const createApiClient = (): AxiosInstance => {
    const client = axios.create({
        baseURL: API_BASE_URL,
        timeout: REQUEST_TIMEOUT,
        headers: {
            "Content-Type": "application/json",
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",
            Accept: "application/json"
        }
    });

    // Request Interceptor
    client.interceptors.request.use(
        async (config: import("axios").InternalAxiosRequestConfig) => {
            const token = getAuthToken();
            if (token) {
                config.headers = config.headers ?? {};
                (
                    config.headers as Record<string, string>
                ).Authorization = `Bearer ${token}`;
            }
            // Sanitize payload to prevent XSS and ensure clean data
            if (config.data) {
                config.data = sanitizePayload(config.data);
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Response Interceptor
    client.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            const originalRequest = error.config as AxiosRequestConfig & {
                _retry?: boolean;
            };

            // Handle 401 (Unauthorized) - Token expired
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    const refreshToken = localStorage.getItem("refresh_token");
                    if (!refreshToken) {
                        throw new Error("No refresh token available");
                    }

                    const response = await axios.post<RefreshTokenResponse>(
                        TOKEN_REFRESH_URL,
                        { refreshToken },
                        { timeout: REQUEST_TIMEOUT }
                    );

                    const { token, refreshToken: newRefreshToken } =
                        response.data;
                    localStorage.setItem("auth_token", token);
                    localStorage.setItem("refresh_token", newRefreshToken);

                    // Update original request with new token
                    originalRequest.headers = originalRequest.headers ?? {};
                    originalRequest.headers.Authorization = `Bearer ${token}`;

                    return client(originalRequest);
                } catch (refreshError) {
                    // Clear auth data and redirect to login
                    localStorage.removeItem("auth_token");
                    localStorage.removeItem("refresh_token");
                    localStorage.removeItem("auth_user");
                    window.location.href = "/auth/login";
                    return Promise.reject(refreshError);
                }
            }

            // Handle 429 (Too Many Requests)
            if (error.response?.status === 429) {
                const retryAfter =
                    Number(error.response.headers["retry-after"]) || 1;
                await new Promise((resolve) =>
                    setTimeout(resolve, retryAfter * 1000)
                );
                return client(originalRequest);
            }

            // Handle other errors
            let errorMessage = "An unexpected error occurred";
            const data = error.response?.data;
            if (data && typeof data === "object" && "message" in data) {
                errorMessage = (data as { message?: string }).message || errorMessage;
            }
            return Promise.reject({
                status: error.response?.status || 500,
                message: errorMessage,
                details: error.response?.data
            });
        }
    );

    return client;
};

// Payload sanitization to prevent XSS and ensure clean data
const sanitizePayload = (payload: unknown): unknown => {
    if (typeof payload === "string") {
        // Trim and escape potentially dangerous characters
        const isFilePattern = /^File:\s.+\(\d+\sbytes\)$/;
        return isFilePattern.test(payload) ? payload : payload.trim().replace(/[<>]/g, "");
        // return payload.trim().replace(/[<>]/g, "");
    }
    if (Array.isArray(payload)) {
        return payload.map(sanitizePayload);
    }
    return payload;
};

export const apiClient = createApiClient();
