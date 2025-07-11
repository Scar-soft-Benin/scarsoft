// services/types/JobApplication.types.ts
export interface JobApplication {
    id: number;
    job_offer_id: string; // Assuming this is a string, adjust if it's a number
    applicant_name: string;
    applicant_email: string;
    applicant_phone: string;
    cv: string; // Assuming this is a base64 encoded string or a file path
    cover_letter_type?: string; // Optional field
    cover_letter_content?: string; // Optional field
    cover_letter_file?: string; // Optional field, assuming this is a base64 encoded string
    status?: "pending" | "reviewed" | "accepted" | "rejected"; // Assuming these are the possible statuses
    created_at: string;
    updated_at: string;
}

export interface CreateJobApplicationPayload {
    jobOfferId : number;
    applicant_name : string;
    applicant_email : string;
    applicant_phone : string;
    cv: string; // Assuming this is a base64 encoded string or a file path
    cover_letter_type: string; // Optional field
    cover_letter_content?: string; // Optional field
    cover_letter_file?: string; // Optional field, assuming this is a base64 encoded string or a file path
}

export interface UpdateJobApplicationStatusPayload {
    status: "pending" | "reviewed" | "accepted" | "rejected"; // Assuming these are the possible statuses
    notes?: string; // Optional field for additional notes
}

export interface CreateJobApplicationResponse {
    success: boolean;
    message: string;
    data: JobApplication;
}

export interface GetJobApplicationByIdResponse {
    success: boolean;
    message: string;
    data: JobApplication;
}

export interface UpdateJobApplicationStatusResponse {
    success: boolean;
    message: string;
    data: JobApplication; // Returning the updated job application
}

export interface DeleteJobApplicationResponse {
    success: boolean;
    message: string;
    // data: {
    //     id: number; // Assuming the ID of the deleted job application is returned
    // };
}

export interface GetAllJobApplicationsPayload {
    page?: number; // Optional, for pagination
    perPage?: number; // Optional, for pagination
    status?: "pending" | "reviewed" | "accepted" | "rejected"; // Optional, to filter by status
}


export interface GetAllJobApplicationsResponse {
    success: boolean;
    message: string;
    data: JobApplication[];
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
