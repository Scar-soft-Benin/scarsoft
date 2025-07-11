// ~/services/api/companyService.ts
import type {
    ApiResponse,
    CreateCompanyPayload,
    CreateCompanyResponse,
    Company,
    GetAllCompaniesPayload,
    UpdateCompanyPayload
} from "~/services/types/company.types";
import { apiClient } from "../config/apiConfig";
import { parseApiError } from "../utils/errorParser";
import type { GetAllJobsResponse } from "../types/job.types";

export const companyService = {
    getAllCompanies: async (
        params: GetAllCompaniesPayload
    ): Promise<ApiResponse<Company[]>> => {
        try {
            console.log(
                "companyService: Initiating getAllCompanies request with params:",
                params
            );
            console.log("companyService: apiClient config:", {
                baseURL: apiClient.defaults.baseURL
            });
            const response = await apiClient.get("/admin/companies", {
                params
            });
            console.log(
                "companyService: Get all companies response:",
                response
            );
            const transformedData = response.data.data.map((company: Company) => ({
                ...company,
                creator_name: company.creator.name,
            }));
            return {
                data: transformedData,
                status: response.status,
                message: response.data.message || "Companies fetched successfully",
                meta: response.data.meta,
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    },

    createCompany: async (
        payload: CreateCompanyPayload
    ): Promise<ApiResponse<CreateCompanyResponse>> => {
        try {
            console.log(
                "companyService: Initiating createCompany request with payload:",
                payload
            );
            console.log("companyService: apiClient config:", {
                baseURL: apiClient.defaults.baseURL
            });
            const response = await apiClient.post("/admin/companies", payload);
            console.log("companyService: Create company response:", response);
            return {
                data: {
                    success: response.data.success,
                    message:
                        response.data.message || "Company created successfully",
                    data: response.data.data
                },
                status: response.status,
                message: response.data.message || "Company created successfully"
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    },
    // Mettre à jour une entreprise
    updateCompany: async (id: string, payload: UpdateCompanyPayload): Promise<ApiResponse<GetAllJobsResponse>> => {
        try {
            const response = await apiClient.put(`/admin/companies/${id}`, payload);
            return response.data;
        } catch (error: any) {
            throw {
                status: error.response?.status || 500,
                message: error.response?.data?.message || "Erreur lors de la mise à jour de l'entreprise",
                error_code: error.response?.data?.error_code,
            };
        }
    },
    // Supprimer une entreprise
    deleteCompany: async (id: string) => {
        try {
            const response = await apiClient.delete(`/admin/companies/${id}`);
            return response.data;
        } catch (error: any) {
            throw {
                status: error.response?.status || 500,
                message: error.response?.data?.message || "Erreur lors de la suppression de l'entreprise",
                error_code: error.response?.data?.error_code,
            };
        }
    },

    // Récupérer les offres d'une entreprise
    getCompanyJobs: async (companyId: string): Promise<ApiResponse<GetAllJobsResponse>> => {
        try {
            const response = await apiClient.get(`/admin/companies/${companyId}/jobs`);
            return response.data;
        } catch (error: any) {
            throw {
                status: error.response?.status || 500,
                message: error.response?.data?.message || "Erreur lors de la récupération des offres de l'entreprise",
                error_code: error.response?.data?.error_code,
            };
        }
    },
};
//
