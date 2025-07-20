import { apiClient } from "../config/apiConfig";
import { parseApiError } from "../utils/errorParser";
import type { ApiResponse } from "../types/common.types";

interface StatisticsResponse {
  total: number;
}

export const statisticsService = {
  getJobStatistics: async (): Promise<ApiResponse<StatisticsResponse>> => {
    try {
      console.log("statisticsService: Initiating getJobStatistics request");
      const response = await apiClient.get("/admin/job-offers/statistics");
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
      const response = await apiClient.get("/admin/job-applications/statistics");
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
      const response = await apiClient.get("/admin/companies/statistics/all");
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