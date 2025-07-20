// ~/services/contactService.ts

import type {
    CreateContactPayload,
    UpdateContactStatusPayload,
    ContactStatistics,
    CreateContactResponse,
    GetAllContactsResponse,
    GetContactDetailResponse,
    ReplyContactPayload,
    Contact
} from "~/services/types/contact.types";
import { apiClient } from "../config/apiConfig";
import { parseApiError } from "../utils/errorParser";
import type { ApiResponse } from "../types/common.types";
import type { UpdateCompanyResponse } from "../types/company.types";

export const contactService = {
    // Soumettre un formulaire de contact
    createContact: async (
        payload: CreateContactPayload
    ): Promise<ApiResponse<CreateContactResponse>> => {
        try {
            const response = await apiClient.post("/contacts", payload);
            console.log("contactService: Create contact response:", response);
            return {
                data: {
                    data: response.data.data,
                    success: response.data.success,
                    message:
                        response.data.message ||
                        "Contact message created successfully"
                },
                status: response.status,
                message:
                    response.data.message ||
                    "Contact message created successfully"
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    },

    // Récupérer tous les messages de contact (admin)
    getAllContacts: async (): Promise<ApiResponse<GetAllContactsResponse>> => {
        try {
            const response = await apiClient.get("/admin/contacts");
            console.log("contactService: Get all contacts response:", response);
            return {
                data: {
                    data: response.data.data, // Contact[]
                    status: response.status,
                    message:
                        response.data.message || "Contacts fetched successfully"
                },
                status: response.status,
                message:
                    response.data.message || "Contacts fetched successfully"
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    },

    // Récupérer les détails d'un message de contact (admin)
    getContactDetails: async (
        contactId: string
    ): Promise<ApiResponse<GetContactDetailResponse>> => {
        try {
            console.log(
                "contactService: Initiating getContactDetails request with contactId:",
                contactId
            );
            console.log("contactService: apiClient config:", {
                baseURL: apiClient.defaults.baseURL
            });
            const response = await apiClient.get(
                `/admin/contacts/${contactId}`
            );
            console.log(
                "contactService: Get contact details response:",
                response
            );
            return {
                data: response.data.data,
                status: response.status,
                message:
                    response.data.message ||
                    "Contact details fetched successfully"
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    },

    // Supprimer un message de contact (admin)
    deleteContact: async (contactId: string): Promise<ApiResponse<void>> => {
        try {
            console.log(
                "contactService: Initiating deleteContact request with contactId:",
                contactId
            );
            console.log("contactService: apiClient config:", {
                baseURL: apiClient.defaults.baseURL
            });
            const response = await apiClient.delete(
                `/admin/contacts/${contactId}`
            );
            console.log("contactService: Delete contact response:", response);
            return {
                data: undefined,
                status: response.status,
                message: response.data.message || "Contact deleted successfully"
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    },

    // Mettre à jour le statut d'un message de contact (admin)
    updateContactStatus: async (
        contactId: string,
        payload: UpdateContactStatusPayload
    ): Promise<ApiResponse<UpdateCompanyResponse>> => {
        try {
            console.log(
                "contactService: Initiating updateContactStatus request with contactId:",
                contactId,
                "and payload:",
                payload
            );
            console.log("contactService: apiClient config:", {
                baseURL: apiClient.defaults.baseURL
            });
            const response = await apiClient.put(
                `/admin/contacts/${contactId}/status`,
                payload
            );
            console.log(
                "contactService: Update contact status response:",
                response
            );
            return {
                data: response.data.data,
                status: response.status,
                message:
                    response.data.message ||
                    "Contact status updated successfully"
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    },

    // Récupérer les statistiques des contacts (admin)
    getContactStatistics: async (): Promise<ApiResponse<ContactStatistics>> => {
        try {
            console.log(
                "contactService: Initiating getContactStatistics request"
            );
            console.log("contactService: apiClient config:", {
                baseURL: apiClient.defaults.baseURL
            });
            const response = await apiClient.get("/admin/contacts/statistics");
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


    replyToContact: async (
        contactId: string,
        payload: ReplyContactPayload
    ): Promise<ApiResponse<Contact>> => {
        try {
            console.log(
                "contactService: Initiating replyToContact request with contactId:",
                contactId,
                "and payload:",
                payload
            );
            console.log("contactService: apiClient config:", {
                baseURL: apiClient.defaults.baseURL
            });
            const response = await apiClient.put(
                `/admin/contacts/${contactId}/reply`,
                payload
            );
            console.log(
                "contactService: Reply to contact response:",
                response
            );
            return {
                data: response.data.data,
                status: response.status,
                message:
                    response.data.message ||
                    "Reply sent successfully"
            };
        } catch (error: unknown) {
            throw parseApiError(error);
        }
    },
};
