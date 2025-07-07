import { type User } from "../../services/types/auth.types";

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

interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    error: { message: string; error_code?: string } | null;
    isOTPVerified: boolean;
}

const initialState: AuthState = {
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    error: null,
    isOTPVerified: false
};

type AuthAction =
    | {
          type: typeof LOGIN_SUCCESS;
          payload: { user: User; token: string; refreshToken: string };
      }
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
    | { type: typeof OTP_VERIFICATION_SUCCESS }
    | {
          type: typeof OTP_VERIFICATION_FAILURE;
          payload: { message: string; error_code?: string };
      }
    | { type: typeof RESEND_OTP_SUCCESS }
    | {
          type: typeof RESEND_OTP_FAILURE;
          payload: { message: string; error_code?: string };
      };

const authReducer = (state = initialState, action: AuthAction): AuthState => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                refreshToken: action.payload.refreshToken,
                isAuthenticated: true,
                error: null
            };
        case LOGIN_FAILURE:
            return {
                ...state,
                error: action.payload,
                isAuthenticated: false
            };
        case LOGOUT_SUCCESS:
            return {
                ...state,
                user: null,
                token: null,
                refreshToken: null,
                isAuthenticated: false,
                isOTPVerified: false,
                error: null
            };
        case LOGOUT_FAILURE:
            return {
                ...state,
                error: action.payload
            };
        case FETCH_USER_SUCCESS:
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                error: null
            };
        case FETCH_USER_FAILURE:
            return {
                ...state,
                error: action.payload,
                isAuthenticated: false
            };
        case OTP_VERIFICATION_SUCCESS:
            return {
                ...state,
                isOTPVerified: true,
                error: null
            };
        case OTP_VERIFICATION_FAILURE:
            return {
                ...state,
                error: action.payload
            };
        case RESEND_OTP_SUCCESS:
            return {
                ...state,
                error: null
            };
        case RESEND_OTP_FAILURE:
            return {
                ...state,
                error: action.payload
            };
        default:
            return state;
    }
};

export default authReducer;
