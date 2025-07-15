// ~/services/types/emailVerification.types.ts

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

// Payload pour vérifier un email avec un code OTP
export interface VerifyEmailPayload {
  email: string;
  code: string;
}

// Payload pour renvoyer un code de vérification
export interface ResendEmailPayload {
  email: string;
}

// Réponse pour la vérification d'email
export interface VerifyEmailResponse {
  success: boolean;
  message: string;
}

// Réponse pour le renvoi de code de vérification
export interface ResendEmailResponse {
  success: boolean;
  message: string;
  expires_at?: string; // Présent uniquement en cas de succès
}

// Réponse pour le statut de vérification d'email
export interface EmailStatusResponse {
  success: boolean;
  email_verified: boolean;
  verified_at?: string | null;
  has_active_code: boolean;
  attempts_remaining: number | null;
  code_expires_at: string | null;
  time_remaining_seconds: number | null;
}