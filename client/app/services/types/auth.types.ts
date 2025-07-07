export interface User {
    id: number; // Changed to number to match backend
    name: string;
    email: string;
    role?: "admin" | "secretary"; // Optional, as backend doesn’t provide it
    email_verified_at: string;
    is_active: boolean;
    last_login_at: string;
    created_at: string;
    updated_at: string;
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
}

export interface VerifyOTPResponse {
    success: boolean;
    message?: string;
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
    user: User;
}

export interface VerifyEmailResponse {
    success: boolean;
    message: string;
}
export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
}

export interface RegisterResponse {
    success: boolean;
    message?: string;
    user?: User;
    verification_required?: boolean;
    errors?: Record<string, string[]>;
}
export interface PasswordResetPayload {
    email: string;
}

export interface OTPVerificationPayload {
    email: string;
    code: string; 
    login_session_id: string; // Added to match backend expectation
}

export interface ResendOTPPayload {
    email: string;
    login_session_id: string; // Added for resend OTP
}

export interface EmailVerificationPayload{
    email: string;
    code: string; 
}
export interface ResendEmailVerificationPayload{
    email: string;
}

export interface LogoutPayload {
    refresh_token: string;
    logout_all_devices: boolean;
}

export interface LogoutResponse {
    success: boolean;
    message: string;
}