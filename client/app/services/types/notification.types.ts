// ~/services/types/notification.types.ts

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

// Payload pour envoyer un email à un candidat
export interface SendToCandidatePayload {
  candidate_email: string;
  message: string;
  job_offer_id: number;
}

// Payload pour envoyer des informations de candidat à une entreprise
export interface SendToCompanyPayload {
  company_email: string;
  message: string;
  candidate_id: number;
  job_offer_id: number;
}

// Réponse pour les notifications (générique, car les réponses ne contiennent pas de "data" complexe)
export interface NotificationResponse {
  success: boolean;
  message: string;
}