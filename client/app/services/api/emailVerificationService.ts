// ~/services/emailVerificationService.ts

import type {
  ApiResponse,
  VerifyEmailPayload,
  ResendEmailPayload,
  VerifyEmailResponse,
  ResendEmailResponse,
  EmailStatusResponse,
} from "~/services/types/emailVerification.types";
import { apiClient } from "../config/apiConfig";
import { parseApiError } from "../utils/errorParser";

export const emailVerificationService = {
  // Vérifier un email avec un code OTP
  verifyEmail: async (
    payload: VerifyEmailPayload
  ): Promise<ApiResponse<VerifyEmailResponse>> => {
    try {
      console.log(
        "emailVerificationService: Initiating verifyEmail request with payload:",
        payload
      );
      console.log("emailVerificationService: apiClient config:", {
        baseURL: apiClient.defaults.baseURL,
      });
      const response = await apiClient.post("/api/auth/email/verify", payload);
      console.log("emailVerificationService: Verify email response:", response);
      return {
        data: {
          success: response.data.success,
          message: response.data.message || "Email verified successfully",
        },
        status: response.status,
        message: response.data.message || "Email verified successfully",
      };
    } catch (error: unknown) {
      throw parseApiError(error);
    }
  },

  // Renvoyer un code de vérification
  resendEmail: async (
    payload: ResendEmailPayload
  ): Promise<ApiResponse<ResendEmailResponse>> => {
    try {
      console.log(
        "emailVerificationService: Initiating resendEmail request with payload:",
        payload
      );
      console.log("emailVerificationService: apiClient config:", {
        baseURL: apiClient.defaults.baseURL,
      });
      const response = await apiClient.post("/api/auth/email/resend", payload);
      console.log("emailVerificationService: Resend email response:", response);
      return {
        data: {
          success: response.data.success,
          message: response.data.message || "Verification code sent successfully",
          expires_at: response.data.expires_at,
        },
        status: response.status,
        message: response.data.message || "Verification code sent successfully",
      };
    } catch (error: unknown) {
      throw parseApiError(error);
    }
  },

  // Récupérer le statut de vérification d'email
  getEmailStatus: async (email: string): Promise<ApiResponse<EmailStatusResponse>> => {
    try {
      console.log(
        "emailVerificationService: Initiating getEmailStatus request with email:",
        email
      );
      console.log("emailVerificationService: apiClient config:", {
        baseURL: apiClient.defaults.baseURL,
      });
      const response = await apiClient.get("/api/auth/email/status", {
        params: { email },
      });
      console.log("emailVerificationService: Get email status response:", response);
      return {
        data: response.data,
        status: response.status,
        message:
          response.data.message || "Email verification status retrieved successfully",
      };
    } catch (error: unknown) {
      throw parseApiError(error);
    }
  },
};