// ~/services/types/contact.types.ts

// Type pour un message de contact
export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied" | "archived";
  ip_address: string;
  user_id: number | null;
  replied_at: string | null;
  replied_by: number | null;
  reply_message: string | null;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  } | null;
}

export interface Meta {
  current_page: number;
  total: number;
  per_page: number;
  last_page: number;
}

// Payload pour créer un message de contact
export interface CreateContactPayload {
  name: string;
  email: string;
  phone?: string; // Optionnel
  subject: string;
  message: string;
}

// Payload pour répondre à un message de contact
export interface ReplyContactPayload {
  reply_message: string;
}

// Payload pour mettre à jour le statut d'un message
export interface UpdateContactStatusPayload {
  status: "unread" | "read" | "replied" | "archived";
}

// Type pour les statistiques des contacts
export interface ContactStatistics {
  total: number;
  unread: number;
  read: number;
  replied: number;
  archived: number;
  recent: number;
  today: number;
  this_week: number;
  this_month: number;
}

// Types pour les réponses des endpoints
export interface CreateContactResponse {
  success: boolean;
  message: string;
  data: Contact;
}

export interface GetAllContactsResponse {
  success: boolean;
  message: string;
  data: Contact[];
  meta?: Meta;
}


export interface GetContactDetailResponse {
    success: boolean;
    message: string;
    data: Contact;
}

export interface UpdateContactStatusResponse {
  success: boolean;
  message: string;
  data: Contact;
}

export interface DeleteContactResponse {
  success: boolean;
  message: string;
  data: { contactId: number };
}