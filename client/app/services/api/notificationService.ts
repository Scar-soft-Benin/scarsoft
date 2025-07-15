// ~/services/notificationService.ts

import type {
  ApiResponse,
  SendToCandidatePayload,
  SendToCompanyPayload,
  NotificationResponse,
} from "~/services/types/notification.types";
import { apiClient } from "../config/apiConfig";
import { parseApiError } from "../utils/errorParser";

export const notificationService = {
  // Envoyer un email à un candidat
  sendToCandidate: async (
    payload: SendToCandidatePayload
  ): Promise<ApiResponse<NotificationResponse>> => {
    try {
      console.log(
        "notificationService: Initiating sendToCandidate request with payload:",
        payload
      );
      console.log("notificationService: apiClient config:", {
        baseURL: apiClient.defaults.baseURL,
      });
      const response = await apiClient.post(
        "/api/admin/notifications/send-to-candidate",
        payload
      );
      console.log("notificationService: Send to candidate response:", response);
      return {
        data: {
          success: response.data.success,
          message: response.data.message || "Email sent to candidate successfully",
        },
        status: response.status,
        message: response.data.message || "Email sent to candidate successfully",
      };
    } catch (error: unknown) {
      throw parseApiError(error);
    }
  },

  // Envoyer des informations de candidat à une entreprise
  sendToCompany: async (
    payload: SendToCompanyPayload
  ): Promise<ApiResponse<NotificationResponse>> => {
    try {
      console.log(
        "notificationService: Initiating sendToCompany request with payload:",
        payload
      );
      console.log("notificationService: apiClient config:", {
        baseURL: apiClient.defaults.baseURL,
      });
      const response = await apiClient.post(
        "/api/admin/notifications/send-to-company",
        payload
      );
      console.log("notificationService: Send to company response:", response);
      return {
        data: {
          success: response.data.success,
          message:
            response.data.message ||
            "Candidate information sent to company successfully",
        },
        status: response.status,
        message:
          response.data.message ||
          "Candidate information sent to company successfully",
      };
    } catch (error: unknown) {
      throw parseApiError(error);
    }
  },
};