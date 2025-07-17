import type {
    ApiResponse,
    CreateCompanyPayload,
    CreateCompanyResponse,
    Company,
    UpdateCompanyPayload,
    GetAllCompaniesResponse,
} from "~/services/types/company.types";
import type { Job } from "~/services/types/job.types";
import { apiClient } from "../config/apiConfig";
import { parseApiError } from "../utils/errorParser";


export const companyService = {
getAllCompanies: async (): Promise<ApiResponse<GetAllCompaniesResponse>> => {
        try {
            const response = await apiClient.get("/admin/companies");
            console.log("companyService: Get all companies response:", response);
            const transformedData = response.data.data.map((company: Company) => ({
                ...company,
                creator_name: company.creator?.name || "Inconnu",
            }));
            return {
                data: {
                    success: response.data.success,
                    message: response.data.message || "Companies fetched successfully",
                    data: transformedData || [],
                },
                status: response.status,
                message: response.data.message || "Companies fetched successfully",
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
                baseURL: apiClient.defaults.baseURL,
            });
            const response = await apiClient.post("/admin/companies", payload);
            console.log("companyService: Create company response:", response);
            return {
                data: {
                    success: response.data.success,
                    message: response.data.message || "Company created successfully",
                    data: response.data.data,
                },
                status: response.status,
                message: response.data.message || "Company created successfully",
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    },

    updateCompany: async (
        id: string,
        payload: UpdateCompanyPayload
    ): Promise<ApiResponse<Company>> => {
        try {
            console.log(
                "companyService: Initiating updateCompany request with id:",
                id,
                "and payload:",
                payload
            );
            const response = await apiClient.put(`/admin/companies/${id}`, payload);
            console.log("companyService: Update company response:", response);
            return {
                data: response.data.data,
                status: response.status,
                message: response.data.message || "Company updated successfully",
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    },

    deleteCompany: async (id: string): Promise<ApiResponse<void>> => {
        try {
            console.log("companyService: Initiating deleteCompany request with id:", id);
            const response = await apiClient.delete(`/admin/companies/${id}`);
            console.log("companyService: Delete company response:", response);
            return {
                data: undefined,
                status: response.status,
                message: response.data.message || "Company deleted successfully",
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    },

    getCompanyJobs: async (companyId: string): Promise<ApiResponse<Job[]>> => {
        try {
            console.log(
                "companyService: Initiating getCompanyJobs request with companyId:",
                companyId
            );
            const response = await apiClient.get(`/admin/companies/${companyId}/jobs`);
            console.log("companyService: Get company jobs response:", response);
            return {
                data: response.data.data,
                status: response.status,
                message: response.data.message || "Company jobs fetched successfully",
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    },

    getCompanyDetails: async (companyId: string): Promise<ApiResponse<Company>> => {
        try {
            console.log(
                "companyService: Initiating getCompanyDetails request with companyId:",
                companyId
            );
            console.log("companyService: apiClient config:", {
                baseURL: apiClient.defaults.baseURL,
            });
            const response = await apiClient.get(`/admin/companies/${companyId}`);
            console.log("companyService: Get company details response:", response);
            return {
                data: response.data.data,
                status: response.status,
                message: response.data.message || "Company details fetched successfully",
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    },
};