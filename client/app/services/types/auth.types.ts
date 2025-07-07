export interface User {
    id: string;
    email: string;
    role: "admin" | "secretary";
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  login_session_id?: string;
  otp_expires_at?: string;
  next_step?: string;
  user?: User;
  token?: string;
  refreshToken?: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
}

export interface PasswordResetPayload {
    email: string;
}

export interface OTPVerificationPayload {
    email: string;
    code: string;
}

export interface ResendOTPPayload {
    email: string;
}
