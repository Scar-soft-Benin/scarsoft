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
    status: 'active' | 'archived' | 'draft';
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

export interface GetJobByIdPayload {
    jobId: number;
}

export interface UpdateJobPayload {
    id: number;
    payload: CreateJobPayload;
}
export interface DeleteJobPayload {
    jobId: number;
}


export interface GetJobByIdResponse {
    success: boolean;
    message: string;
    data: Job;
}

export interface GetAllJobsResponse {
    success: boolean;
    message: string;
    data: Job[];
}

export interface GetAllJobsByCompanyIdResponse {
    success: boolean;
    message: string;
    data: Job[];
}

export interface GetAllJobsForAdminResponse {
    success: boolean;
    message: string;
    data: Job[];
}

export interface CreateJobResponse {
    success: boolean;
    message: string;
    data: Job;
}
export interface UpdateJobResponse {
    success: boolean;
    message: string;
    data: Job;
}

export interface DeleteJobResponse {
    success: boolean;
    message: string;
    data: { jobId: number };
}
