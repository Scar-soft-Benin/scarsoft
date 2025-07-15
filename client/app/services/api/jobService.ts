// services/api/jobService.ts

import { apiClient } from "../config/apiConfig";
import { parseApiError } from "../utils/errorParser";
import type { ApiResponse } from "../types/common.types";
import type {
    CreateJobPayload,
    CreateJobResponse,
    GetAllJobsResponse
} from "../types/job.types";

export const jobService = {
    /**
     * Create a new job.
     * @param payload - The job data to create.
     * @returns A promise that resolves to the created job data.
     */
    createJob: async (
        payload: CreateJobPayload
    ): Promise<ApiResponse<CreateJobResponse>> => {
        try {
            const response = await apiClient.post("/admin/job-offers", payload);
            console.log("jobService: Create job response:", response.data);
            return {
                data: {
                    success: response.data.success,
                    message:
                        response.data.message || "Job created successfully",
                    data: response.data.data
                },
                status: response.status,
                message: response.data.message || "Job created successfully"
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    },

    /**
     * Get all jobs.
     * @returns A promise that resolves to the jobs data.
     */
    getAllJobs: async (): Promise<ApiResponse<GetAllJobsResponse>> => {
        try {
            const response = await apiClient.get("/job-offers");
            console.log("jobService: Get all jobs response:", response.data);
            return {
                data: {
                    success: response.data.success,
                    message: response.data.message,
                    data: response.data.data
                },
                status: response.status,
                message: response.data.message
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    },

    /**
     * Get all jobs for admin.
     * @returns A promise that resolves to the jobs data.
     */
    getAllJobForAdmin: async (): Promise<ApiResponse<GetAllJobsResponse>> => {
        try {
            const response = await apiClient.get("/admin/job-offers");
            console.log(
                "jobService: Get all jobs for admin response:",
                response.data
            );
            return {
                data: {
                    success: response.data.success,
                    message:
                        response.data.message || "Jobs fetched successfully",
                    data: response.data.data
                },
                status: response.status,
                message: response.data.message || "Jobs fetched successfully"
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    },

    /**
     * Fetch jobs by company ID.
     * @param companyId - The ID of the company to fetch jobs for.
     * @returns A promise that resolves to the jobs data.
     */

    getAllJobsByCompanyId: async (
        companyId: string
    ): Promise<ApiResponse<GetAllJobsResponse>> => {
        try {
            const response = await apiClient.get(
                `/job-offers/company/${companyId}`
            );
            console.log(
                "jobService: Get jobs by company ID response:",
                response.data
            );
            return {
                data: {
                    success: response.data.success,
                    message:
                        response.data.message || "Jobs fetched successfully",
                    data: response.data.data
                },
                status: response.status,
                message: response.data.message || "Jobs fetched successfully"
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    },

    /**
     * Fetch a job by its ID.
     * @param id - The ID of the job to fetch.
     * @returns A promise that resolves to the job data.
     */
    getJobById: async (
        id: number | string
    ): Promise<ApiResponse<CreateJobResponse>> => {
        try {
            const response = await apiClient.get(`/job-offers/${id}`);
            console.log("jobService: Get job by ID response:", response.data);
            return {
                data: {
                    success: response.data.success,
                    message:
                        response.data.message || "Job fetched successfully",
                    data: response.data.data
                },
                status: response.status,
                message: response.data.message || "Job fetched successfully"
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    },

    /**
     * Update a job by its ID.
     * @param id - The ID of the job to update.
     * @param payload - The updated job data.
     * @returns A promise that resolves to the updated job data.
     */
    updateJob: async (
        id: string,
        payload: CreateJobPayload
    ): Promise<ApiResponse<CreateJobResponse>> => {
        try {
            const response = await apiClient.put(
                `/admin/job-offers/${id}`,
                payload
            );
            console.log("jobService: Update job response:", response.data);
            return {
                data: {
                    success: response.data.success,
                    message:
                        response.data.message || "Job updated successfully",
                    data: response.data.data
                },
                status: response.status,
                message: response.data.message || "Job updated successfully"
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    },
    /**
     * Delete a job by its ID.
     * @param id - The ID of the job to delete.
     * @returns A promise that resolves to the deletion response.
     */
    deleteJob: async (
        id: string
    ): Promise<ApiResponse<{ success: boolean; message: string }>> => {
        try {
            const response = await apiClient.delete(`/admin/job-offers/${id}`);
            console.log("jobService: Delete job response:", response.data);
            return {
                data: {
                    success: response.data.success,
                    message: response.data.message || "Job deleted successfully"
                },
                status: response.status,
                message: response.data.message || "Job deleted successfully"
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    }
};
