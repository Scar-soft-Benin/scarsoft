// services/api/jobService.ts

import { apiClient } from "../config/apiConfig";
import { parseApiError } from "../utils/errorParser";
import type { ApiResponse } from "../types/common.types";
import type { CreateJobPayload, CreateJobResponse, GetAllJobsResponse } from "../types/job.types";

export const jobService = {
    createJob: async (
        payload: CreateJobPayload
    ): Promise<ApiResponse<CreateJobResponse>> => {
        try {
            const response = await apiClient.post(
                "/admin/job-offers",
                payload
            );
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
    getAllJobs: async (): Promise<ApiResponse<GetAllJobsResponse>> => {
        try {
            const response = await apiClient.get("/admin/job-offers");
            console.log("jobService: Get all jobs response:", response.data);
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
    }
};
