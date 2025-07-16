import { apiClient } from "../config/apiConfig";
import type { ApiResponse } from "../types/common.types";
import type { CreateJobApplicationPayload, CreateJobApplicationResponse, DeleteJobApplicationResponse, GetAllJobApplicationsResponse, UpdateJobApplicationStatusPayload, UpdateJobApplicationStatusResponse } from "../types/jobApply.types";
import { parseApiError } from "../utils/errorParser";

export const jobApplyServices = {

    createJobApply: async (
        payload: CreateJobApplicationPayload
    ): Promise<ApiResponse<CreateJobApplicationResponse>> => {
        try {
            console.log("recruitmentServices: Initiating createJobApply request with payload:", payload);
            // console.log("recruitmentServices: Initiating createJobApply request with payload:", {
            //     jobOfferId: payload.jobOfferId,
            //     applicant_name: payload.applicant_name,
            //     applicant_email: payload.applicant_email,
            //     applicant_phone: payload.applicant_phone,
            //     cv: payload.cv ? `File: ${payload.cv.name} (${payload.cv.size} bytes)` : "No CV",
            //     cover_letter_type: payload.cover_letter_type,
            //     cover_letter_content: payload.cover_letter_content,
            //     cover_letter_file: payload.cover_letter_file ? `File: ${payload.cover_letter_file.name} (${payload.cover_letter_file.size} bytes)` : "No cover letter file",
            // });

            // const formData = new FormData();
            // formData.append("applicant_name", payload.applicant_name);
            // formData.append("applicant_email", payload.applicant_email);
            // formData.append("applicant_phone", payload.applicant_phone);
            // formData.append("cv", payload.cv);
            // formData.append("cover_letter_type", payload.cover_letter_type);
            // if (payload.cover_letter_content) {
            //     formData.append("cover_letter_content", payload.cover_letter_content);
            // }
            // if (payload.cover_letter_file) {
            //     formData.append("cover_letter_file", payload.cover_letter_file);
            // }

            // // Log des entrées de FormData pour débogage
            // console.log("recruitmentServices: FormData entries:");
            // for (const [key, value] of formData.entries()) {
            //     console.log(`${key}:`, value instanceof File ? `File: ${value.name} (${value.size} bytes)` : value);
            // }

            // console.log("recruitmentServices: Initiating createJobApply request with formData:", formData);
            const response = await apiClient.post(`/job-offers/${payload.jobOfferId}/apply`, payload, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Accept": "application/json",
                },
            });
            console.log("recruitmentServices: Create job application response:", response.data);
            return {
                data: {
                    success: response.data.success,
                    message: response.data.message || "Job application created successfully",
                    data: response.data.data,
                },
                status: response.status,
                message: response.data.message || "Job application created successfully",
            };
        } catch (error: unknown) {
            console.error("recruitmentServices: Create job application error:", error);
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