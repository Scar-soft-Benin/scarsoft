import type { Job } from "./job.types";

// ~/services/types/company.types.ts
export interface Company {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    website?: string;
    contact_person: string;
    notes?: string;
    logo?: string;
    job_offers_count: number;
    active_job_offers_count: number; // Added
    status: "active" | "inactive";
    created_at: string; // Added
    updated_at: string; // Added
    creator_name: string;
    creator: {
        id: number;
        name: string;
        email: string;
        email_verified_at: string;
        is_active: boolean;
        last_login_at: string;
        last_login_ip: string;
        failed_login_attempts: number;
        locked_until: string | null;
        created_at: string;
        updated_at: string;
    };
    job_offers: Job[]; // Added, adjust type if job_offers structure is known
}

export interface CreateCompanyPayload {
    name: string;
    email: string;
    phone: string;
    address: string;
    website?: string;
    contact_person: string;
    notes?: string;
}

export interface CreateCompanyResponse {
    success: boolean;
    message: string;
    data: Company;
}

export interface Meta {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
}

export interface ApiResponse<T> {
    data: T;
    status: number;
    message: string;
    meta?: Meta; // Included for pagination
}

export interface GetAllCompaniesPayload {
    search?: string;
    status: "active" | "inactive"; // Required
    page?: number;
    per_page?: number;
}

export interface CompanyAction {
    type: string;
    payload:
        | CreateCompanyPayload
        | { companies: Company[]; meta: Meta }
        | { message: string }
        | Company;
}
