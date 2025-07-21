import { apiClient } from "../config/apiConfig";
import { parseApiError } from "../utils/errorParser";
import type { ApiResponse } from "../types/common.types";
import type { ContactStatistics } from "../types/contact.types";

interface StatisticsResponse {
  total: number;
}

export const statisticsService = {

  // Récupérer les statistiques des contacts (admin)
  getContactStatistics: async (): Promise<ApiResponse<ContactStatistics>> => {
    try {
      console.log(
        "contactService: Initiating getContactStatistics request"
      );
      console.log("contactService: apiClient config:", {
        baseURL: apiClient.defaults.baseURL
      });
      const response = await apiClient.get("/admin/statistics/contacts");
      console.log(
        "contactService: Get contact statistics response:",
        response
      );
      return {
        data: response.data.data,
        status: response.status,
        message:
          response.data.message ||
          "Contact statistics fetched successfully"
      };
    } catch (error: unknown) {
      throw parseApiError(error);
    }
  },
  
  getJobStatistics: async (): Promise<ApiResponse<StatisticsResponse>> => {
    try {
      console.log("statisticsService: Initiating getJobStatistics request");
      const response = await apiClient.get("/admin/statistics/job-offers");
      console.log("statisticsService: Get job statistics response:", response);
      return {
        data: response.data.data,
        status: response.status,
        message: response.data.message || "Job statistics fetched successfully",
      };
    } catch (error: unknown) {
      throw parseApiError(error);
    }
  },

  getJobApplyStatistics: async (): Promise<ApiResponse<StatisticsResponse>> => {
    try {
      console.log("statisticsService: Initiating getRecruitmentStatistics request");
      const response = await apiClient.get("/admin/statistics/job-applications");
      console.log("statisticsService: Get recruitment statistics response:", response);
      return {
        data: response.data.data,
        status: response.status,
        message: response.data.message || "Recruitment statistics fetched successfully",
      };
    } catch (error: unknown) {
      throw parseApiError(error);
    }
  },

  getCompanyStatistics: async (): Promise<ApiResponse<StatisticsResponse>> => {
    try {
      console.log("statisticsService: Initiating getCompanyStatistics request");
      const response = await apiClient.get("/admin/statistics/companies");
      console.log("statisticsService: Get company statistics response:", response);
      return {
        data: response.data.data,
        status: response.status,
        message: response.data.message || "Company statistics fetched successfully",
      };
    } catch (error: unknown) {
      throw parseApiError(error);
    }
  },
};