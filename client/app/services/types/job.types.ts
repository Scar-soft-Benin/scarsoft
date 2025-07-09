// services/types/job.types.ts
export interface Job {
    id: number;
    title: string;
    type: string;
    contract: string;
    location: string;
    salary: string;
    mission: string;
    skills: string[];
    requirements: string[];
    company_id: number;
    company_contact_email: string;
    is_internal: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateJobPayload {
    title: string;
    type: string;
    contract: string;
    location: string;
    salary: string;
    mission: string;
    skills: string[];
    requirements: string[];
    company_id: number;
    company_contact_email: string;
    is_internal: boolean;
}

export interface CreateJobResponse {
    success: boolean;
    message: string;
    data: Job;
}

export interface GetAllJobsResponse {
    success: boolean;
    message: string;
    data: Job[];
}

export interface ApiResponse<T> {
    data: T;
    status: number;
    message: string;
}

export interface ApiError {
    message: string;
    status: number;
    error_code?: string;
}
