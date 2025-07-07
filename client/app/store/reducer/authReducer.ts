import {
    type LoginResponse,
    type LogoutResponse,
    type RegisterResponse,
    type User,
    type VerifyOTPResponse
} from "../../services/types/auth.types";

// Action Types
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const LOGOUT_FAILURE = "LOGOUT_FAILURE";
export const FETCH_USER_SUCCESS = "FETCH_USER_SUCCESS";
export const FETCH_USER_FAILURE = "FETCH_USER_FAILURE";
export const OTP_VERIFICATION_SUCCESS = "OTP_VERIFICATION_SUCCESS";
export const OTP_VERIFICATION_FAILURE = "OTP_VERIFICATION_FAILURE";
export const RESEND_OTP_SUCCESS = "RESEND_OTP_SUCCESS";
export const RESEND_OTP_FAILURE = "RESEND_OTP_FAILURE";
export const REQUEST_PASSWORD_RESET_SUCCESS = "REQUEST_PASSWORD_RESET_SUCCESS";
export const REQUEST_PASSWORD_RESET_FAILURE = "REQUEST_PASSWORD_RESET_FAILURE";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS"; // Added
export const REGISTER_FAILURE = "REGISTER_FAILURE"; // Added
export const NAVIGATE = "NAVIGATE";

export const EMAIL_VERIFICATION_SUCCESS = "EMAIL_VERIFICATION_SUCCESS";
export const EMAIL_VERIFICATION_FAILURE = "EMAIL_VERIFICATION_FAILURE";
export const RESEND_EMAIL_VERIFICATION_SUCCESS =
    "RESEND_EMAIL_VERIFICATION_SUCCESS";
export const RESEND_EMAIL_VERIFICATION_FAILURE =
    "RESEND_EMAIL_VERIFICATION_FAILURE";

interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    error: { message: string; error_code?: string } | null;
    isOTPVerified: boolean;
    login_session_id: string | null;
    otp_expires_at: string | null;
    next_step: string | null;
    navigate: { path: string; state?: unknown; replace?: boolean } | null;
}

const initialState: AuthState = {
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    error: null,
    isOTPVerified: false,
    login_session_id: null,
    otp_expires_at: null,
    next_step: null,
    navigate: null
};

type AuthAction =
    | { type: typeof LOGIN_SUCCESS; payload: LoginResponse }
    | {
          type: typeof LOGIN_FAILURE;
          payload: { message: string; error_code?: string };
      }
    | { type: typeof LOGOUT_SUCCESS }
    | {
          type: typeof LOGOUT_FAILURE;
          payload: { message: string; error_code?: string };
      }
    | { type: typeof FETCH_USER_SUCCESS; payload: User }
    | {
          type: typeof FETCH_USER_FAILURE;
          payload: { message: string; error_code?: string };
      }
    | { type: typeof OTP_VERIFICATION_SUCCESS; payload: VerifyOTPResponse } // Updated to handle VerifyOTPResponse
    | {
          type: typeof OTP_VERIFICATION_FAILURE;
          payload: { message: string; error_code?: string };
      }
    | { type: typeof RESEND_OTP_SUCCESS }
    | {
          type: typeof RESEND_OTP_FAILURE;
          payload: { message: string; error_code?: string };
      }
    | { type: typeof REQUEST_PASSWORD_RESET_SUCCESS }
    | {
          type: typeof REQUEST_PASSWORD_RESET_FAILURE;
          payload: { message: string; error_code?: string };
      }
    | { type: typeof REGISTER_SUCCESS; payload: RegisterResponse } // Added
    | {
          type: typeof REGISTER_FAILURE;
          payload: {
              message: string;
              error_code?: string;
              errors?: Record<string, string[]>;
          };
      } // Added
    | {
          type: typeof NAVIGATE;
          payload: { path: string; state?: unknown; replace?: boolean };
      }
    | { type: typeof EMAIL_VERIFICATION_SUCCESS; payload: VerifyOTPResponse }
    | {
          type: typeof EMAIL_VERIFICATION_FAILURE;
          payload: { message: string; error_code?: string };
      }
    | { type: typeof RESEND_EMAIL_VERIFICATION_SUCCESS }
    | {
          type: typeof RESEND_EMAIL_VERIFICATION_FAILURE;
          payload: { message: string; error_code?: string };
      }
    | { type: typeof LOGOUT_SUCCESS; payload: LogoutResponse }
    | {
          type: typeof LOGOUT_FAILURE;
          payload: { message: string; error_code?: string };
      };

const authReducer = (state = initialState, action: AuthAction): AuthState => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            console.log(
                "authReducer: LOGIN_SUCCESS with payload:",
                action.payload
            );
            return {
                ...state,
                user: null, // Explicitly null as no user data in login response
                token: null, // No token in login response
                refreshToken: null, // No refresh token in login response
                isAuthenticated: false, // Not authenticated until OTP verified
                error: null,
                login_session_id: action.payload.login_session_id || null,
                otp_expires_at: action.payload.otp_expires_at || null,
                next_step: action.payload.next_step || null,
                navigate: null
            };
        case LOGIN_FAILURE:
            console.log(
                "authReducer: LOGIN_FAILURE with payload:",
                action.payload
            );
            return {
                ...state,
                error: action.payload,
                isAuthenticated: false,
                navigate: null
            };

        case FETCH_USER_SUCCESS:
            console.log(
                "authReducer: FETCH_USER_SUCCESS with payload:",
                action.payload
            );
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                error: null
            };
        case FETCH_USER_FAILURE:
            console.log(
                "authReducer: FETCH_USER_FAILURE with payload:",
                action.payload
            );
            return {
                ...state,
                error: action.payload,
                isAuthenticated: false
            };
        case OTP_VERIFICATION_SUCCESS:
            console.log(
                "authReducer: OTP_VERIFICATION_SUCCESS with payload:",
                action.payload
            );
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.access_token,
                refreshToken: action.payload.refresh_token,
                isAuthenticated: true,
                isOTPVerified: true,
                error: null,
                navigate: null
            };
        case OTP_VERIFICATION_FAILURE:
            console.log(
                "authReducer: OTP_VERIFICATION_FAILURE with payload:",
                action.payload
            );
            return {
                ...state,
                error: action.payload
            };
        case RESEND_OTP_SUCCESS:
            console.log("authReducer: RESEND_OTP_SUCCESS");
            return {
                ...state,
                error: null
            };
        case RESEND_OTP_FAILURE:
            console.log(
                "authReducer: RESEND_OTP_FAILURE with payload:",
                action.payload
            );
            return {
                ...state,
                error: action.payload
            };
        case REQUEST_PASSWORD_RESET_SUCCESS:
            console.log("authReducer: REQUEST_PASSWORD_RESET_SUCCESS");
            return {
                ...state,
                error: null
            };
        case REQUEST_PASSWORD_RESET_FAILURE:
            console.log(
                "authReducer: REQUEST_PASSWORD_RESET_FAILURE with payload:",
                action.payload
            );
            return {
                ...state,
                error: action.payload
            };
        case REGISTER_SUCCESS:
            console.log(
                "authReducer: REGISTER_SUCCESS with payload:",
                action.payload
            );
            return {
                ...state,
                user: action.payload.user || null,
                isAuthenticated: false, // User not authenticated until email verified/login
                error: null,
                navigate: action.payload.verification_required
                    ? {
                          path: "/auth/verify-email",
                          state: { email: action.payload.user?.email },
                          replace: true
                      }
                    : { path: "/auth/login", state: undefined, replace: true }
            };
        case REGISTER_FAILURE:
            console.log(
                "authReducer: REGISTER_FAILURE with payload:",
                action.payload
            );
            return {
                ...state,
                error: action.payload
            };
        case NAVIGATE:
            console.log("authReducer: NAVIGATE with payload:", action.payload);
            return {
                ...state,
                navigate: action.payload
            };
        case EMAIL_VERIFICATION_SUCCESS:
            console.log(
                "authReducer: EMAIL_VERIFICATION_SUCCESS with payload:",
                action.payload
            );
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.access_token,
                refreshToken: action.payload.refresh_token,
                isAuthenticated: true,
                error: null,
                navigate: { path: "/dashboard", replace: true }
            };
        case EMAIL_VERIFICATION_FAILURE:
            console.log(
                "authReducer: EMAIL_VERIFICATION_FAILURE with payload:",
                action.payload
            );
            return {
                ...state,
                error: action.payload
            };
        case RESEND_EMAIL_VERIFICATION_SUCCESS:
            console.log("authReducer: RESEND_EMAIL_VERIFICATION_SUCCESS");
            return {
                ...state,
                error: null
            };
        case RESEND_EMAIL_VERIFICATION_FAILURE:
            console.log(
                "authReducer: RESEND_EMAIL_VERIFICATION_FAILURE with payload:",
                action.payload
            );
            return {
                ...state,
                error: action.payload
            };
        case LOGOUT_SUCCESS:
            return {
                ...state,
                user: null,
                token: null,
                refreshToken: null,
                isAuthenticated: false,
                isOTPVerified: false,
                error: null,
                login_session_id: null,
                otp_expires_at: null,
                next_step: null,
                navigate: { path: "/auth/login", replace: true }
            };
        case LOGOUT_FAILURE:
            console.log(
                "authReducer: LOGOUT_FAILURE with payload:",
                action.payload
            );
            return {
                ...state,
                error: action.payload
            };
        default:
            return state;
    }
};

export default authReducer;
