// ~/services/types/jobApply.types.ts

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
  status?: "pending" | "under_review" | "shortlisted" | "accepted" | "rejected"; // Ajout de under_review et shortlisted
  created_at: string;
  updated_at: string;
}

export interface CreateJobApplicationPayload {
  jobOfferId: number;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  cv: File; // Fichier brut pour multipart/form-data
  cover_letter_type: "text" | "file";
  cover_letter_content?: string;
  cover_letter_file?: File; // Fichier brut pour multipart/form-data
}

export interface UpdateJobApplicationStatusPayload {
  status: "pending" | "under_review" | "shortlisted" | "accepted" | "rejected"; // Ajout de under_review et shortlisted
  notes?: string;
}

// Type pour les statistiques des candidatures
export interface JobApplicationStatistics {
  total: number;
  pending: number;
  under_review: number;
  shortlisted: number;
  rejected: number;
  accepted: number;
  recent: number;
  today: number;
  this_week: number;
  this_month: number;
}

export interface CreateJobApplicationResponse {
  success: boolean;
  message: string;
  data: JobApplication;
}

export interface GetJobApplicationByIdResponse {
  success: boolean;
  message: string;
  data: JobApplication[];
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
  status?: "pending" | "under_review" | "shortlisted" | "accepted" | "rejected"; // Mise à jour des statuts
}

export interface GetAllJobApplicationsResponse {
  success: boolean;
  message: string;
  data: JobApplication[];
  
};


export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  meta?: {
    current_page?: number;
    total?: number;
    per_page?: number;
    last_page?: number;
  };
}

export interface ApiError {
  message: string;
  status: number;
  error_code?: string;
  errors?: Record<string, string[]>;
}