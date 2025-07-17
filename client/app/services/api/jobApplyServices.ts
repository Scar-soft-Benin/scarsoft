import { apiClient } from "../config/apiConfig";
import type { ApiResponse } from "../types/common.types";
import type {
    CreateJobApplicationPayload,
    CreateJobApplicationResponse,
    DeleteJobApplicationResponse,
    GetAllJobApplicationsResponse,
    UpdateJobApplicationStatusPayload,
    UpdateJobApplicationStatusResponse,
} from "../types/jobApply.types";
import { parseApiError } from "../utils/errorParser";

export const jobApplyServices = {
    createJobApply: async (
        payload: CreateJobApplicationPayload
    ): Promise<ApiResponse<CreateJobApplicationResponse>> => {
        try {
            console.log(
                "recruitmentServices: Initiating createJobApply request with payload:",
                payload
            );

            // console.log("recruitmentServices: Initiating createJobApply request with formData:", formData);
            const response = await apiClient.post(
                `/job-offers/${payload.jobOfferId}/apply`,
                payload,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Accept: "application/json"
                    }
                }
            );
            console.log(
                "recruitmentServices: Create job application response:",
                response.data
            );
            return {
                data: {
                    success: response.data.success,
                    message:
                        response.data.message ||
                        "Job application created successfully",
                    data: response.data.data
                },
                status: response.status,
                message:
                    response.data.message ||
                    "Job application created successfully"
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    },
    getAllJobApplications: async (): Promise<
        ApiResponse<GetAllJobApplicationsResponse>
    > => {
        try {
            console.log(
                "recruitmentServices: Initiating getAllJobApplications request"
            );
            const response = await apiClient.get("/admin/job-applications");
            console.log(
                "recruitmentServices: Get all job applications response:",
                response.data
            );
            return {
                data: {
                    success: response.data.success,
                    message:
                        response.data.message ||
                        "Job applications fetched successfully",
                    data: response.data.data
                },
                status: response.status,
                message:
                    response.data.message ||
                    "Job applications fetched successfully"
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    },
    getJobApplicationById: async (
        id: string
    ): Promise<ApiResponse<CreateJobApplicationResponse>> => {
        try {
            console.log(
                `recruitmentServices: Initiating getJobApplicationById request for ID: ${id}`
            );
            const response = await apiClient.get(
                `/admin/job-applications/${id}`
            );
            console.log(
                "recruitmentServices: Get job application by ID response:",
                response.data
            );
            return {
                data: {
                    success: response.data.success,
                    message:
                        response.data.message ||
                        "Job application fetched successfully",
                    data: response.data.data
                },
                status: response.status,
                message:
                    response.data.message ||
                    "Job application fetched successfully"
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
            console.log(
                `recruitmentServices: Initiating updateJobApplication request for ID: ${id} with payload:`,
                payload
            );
            const response = await apiClient.put(
                `/admin/job-applications/${id}/status`,
                payload
            );
            console.log(
                "recruitmentServices: Update job application response:",
                response.data
            );
            return {
                data: {
                    success: response.data.success,
                    message:
                        response.data.message ||
                        "Statut mis à jour avec succès",
                    data: response.data.data
                },
                status: response.status,
                message:
                    response.data.message || "Statut mis à jour avec succès"
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    },
    deleteJobApplication: async (
        id: string
    ): Promise<ApiResponse<DeleteJobApplicationResponse>> => {
        try {
            console.log(
                `recruitmentServices: Initiating deleteJobApplication request for ID: ${id}`
            );
            const response = await apiClient.delete(
                `/admin/job-applications/${id}`
            );
            // console.log("recruitmentServices: Delete job application response:", response.data);
            return {
                data: {
                    success: response.data.success,
                    message:
                        response.data.message ||
                        "Job application deleted successfully"
                    // data: response.data.data
                },
                status: response.status,
                message:
                    response.data.message ||
                    "Job application deleted successfully"
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    },

    // Télécharger un fichier de candidature (CV ou lettre de motivation)
    downloadJobApplicationFile: async (
        id: string,
        type: "cv" | "cover-letter"
    ): Promise<Blob> => {
        try {
            console.log(
                `jobApplyServices: Initiating downloadJobApplicationFile request for ID: ${id} and type: ${type}`
            );
            console.log("jobApplyServices: apiClient config:", {
                baseURL: apiClient.defaults.baseURL
            });
            const response = await apiClient.get(
                `/api/admin/job-applications/${id}/download/${type}`,
                {
                    responseType: "blob"
                }
            );
            console.log("jobApplyServices: Download file response:", {
                status: response.status,
                headers: {
                    contentType: response.headers["content-type"],
                    contentDisposition: response.headers["content-disposition"]
                },
                data: response.data
            });

            // Check if the response is JSON (indicating an error)
            const contentType = response.headers["content-type"];
            if (contentType?.includes("application/json")) {
                const text = await response.data.text();
                console.error(
                    "jobApplyServices: Unexpected JSON response =",
                    text
                );
                throw new Error(
                    "Réponse inattendue du serveur: format JSON au lieu d'un fichier."
                );
            }

            // Validate supported file types
            const validMimeTypes = [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ];
            if (!validMimeTypes.includes(contentType)) {
                console.error(
                    "jobApplyServices: Unsupported Content-Type =",
                    contentType
                );
                throw new Error("Type de fichier non supporté.");
            }

            return response.data; // Blob
        } catch (error: unknown) {
            console.error("jobApplyServices: Download file error =", error);
            throw parseApiError(error);
        }
    }
};
