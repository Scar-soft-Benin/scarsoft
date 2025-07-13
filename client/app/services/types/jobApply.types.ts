export interface JobApplication {
  id: number;
  job_offer_id: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  cv: string; // Chemin du fichier stocké par le backend
  cover_letter_type?: "text" | "file";
  cover_letter_content?: string;
  cover_letter_file?: string; // Chemin du fichier stocké par le backend
  status?: "pending" | "reviewed" | "accepted" | "rejected";
  created_at: string;
  updated_at: string;
}

export interface CreateJobApplicationPayload {
  jobOfferId: number;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  cv: File; // Fichier brut pour multipart/form-data
  cover_letter_type?: "text" | "file";
  cover_letter_content?: string;
  cover_letter_file?: File; // Fichier brut pour multipart/form-data
}

export interface UpdateJobApplicationStatusPayload {
  status: "pending" | "reviewed" | "accepted" | "rejected";
  notes?: string;
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
  data: JobApplication;
}

export interface DeleteJobApplicationResponse {
  success: boolean;
  message: string;
}

export interface GetAllJobApplicationsPayload {
  page?: number;
  perPage?: number;
  status?: "pending" | "reviewed" | "accepted" | "rejected";
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
  errors?: Record<string, string[]>;
}