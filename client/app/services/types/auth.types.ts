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
    message: string;
    user: User;
    token: string;
    refreshToken: string;
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
    otp: string;
}

export interface ResendOTPPayload {
    email: string;
}
