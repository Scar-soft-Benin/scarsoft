import { apiClient } from "../config/apiConfig";
import type { ApiResponse } from "../types/common.types";
import type { CreateJobApplicationPayload, CreateJobApplicationResponse, DeleteJobApplicationResponse, GetAllJobApplicationsResponse, UpdateJobApplicationStatusPayload, UpdateJobApplicationStatusResponse } from "../types/jobApply.types";
import { parseApiError } from "../utils/errorParser";

export const jobApplyServices = {
    createJobApply:  async (
        // jobOfferId: string,
        payload: CreateJobApplicationPayload
    ): Promise<ApiResponse<CreateJobApplicationResponse>> => {
        try {
            console.log("recruitmentServices: Initiating createJobApply request with payload:", payload);
            const response = await apiClient.post(`/job-offers/${payload.jobOfferId}/apply`, payload);
            console.log("recruitmentServices: Create job application response:", response.data);
            return {
                data: {
                    success: response.data.success,
                    message: response.data.message || "Job application created successfully",
                    data: response.data.data
                },
                status: response.status,
                message: response.data.message || "Job application created successfully"
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    },
    getAllJobApplications: async (): Promise<ApiResponse<GetAllJobApplicationsResponse>> => {
        try {
            console.log("recruitmentServices: Initiating getAllJobApplications request");
            const response = await apiClient.get("/admin/job-applications");
            console.log("recruitmentServices: Get all job applications response:", response.data);
            return {
                data: {
                    success: response.data.success,
                    message: response.data.message || "Job applications fetched successfully",
                    data: response.data.data
                },
                status: response.status,
                message: response.data.message || "Job applications fetched successfully"
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    },
    getJobApplicationById: async (id: string): Promise<ApiResponse<CreateJobApplicationResponse>> => {
        try {
            console.log(`recruitmentServices: Initiating getJobApplicationById request for ID: ${id}`);
            const response = await apiClient.get(`/admin/job-applications/${id}`);
            console.log("recruitmentServices: Get job application by ID response:", response.data);
            return {
                data: {
                    success: response.data.success,
                    message: response.data.message || "Job application fetched successfully",
                    data: response.data.data
                },
                status: response.status,
                message: response.data.message || "Job application fetched successfully"
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    },
    updateJobApplication: async (
        id: string,
        payload: UpdateJobApplicationStatusPayload
    ): Promise<ApiResponse<UpdateJobApplicationStatusResponse>> => {
        try {
            console.log(`recruitmentServices: Initiating updateJobApplication request for ID: ${id} with payload:`, payload);
            const response = await apiClient.put(`/admin/job-applications/${id}/status`, payload);
            console.log("recruitmentServices: Update job application response:", response.data);
            return {
                data: {
                    success: response.data.success,
                    message: response.data.message || "Statut mis à jour avec succès",
                    data: response.data.data
                },
                status: response.status,
                message: response.data.message || "Statut mis à jour avec succès",
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    },
    deleteJobApplication: async (id: string): Promise<ApiResponse<DeleteJobApplicationResponse>> => {
        try {
            console.log(`recruitmentServices: Initiating deleteJobApplication request for ID: ${id}`);
            const response = await apiClient.delete(`/admin/job-applications/${id}`);
            // console.log("recruitmentServices: Delete job application response:", response.data);
            return {
                data: {
                    success: response.data.success,
                    message: response.data.message || "Job application deleted successfully",
                    // data: response.data.data
                },
                status: response.status,
                message: response.data.message || "Job application deleted successfully"
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    }
    
    
}