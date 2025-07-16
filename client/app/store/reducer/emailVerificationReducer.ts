// ~/reducer/emailVerificationReducer.ts

import type {
  EmailStatusResponse,
  VerifyEmailResponse,
  ResendEmailResponse,
} from "~/services/types/emailVerification.types";

export const VERIFY_EMAIL = "VERIFY_EMAIL";
export const VERIFY_EMAIL_SUCCESS = "VERIFY_EMAIL_SUCCESS";
export const VERIFY_EMAIL_FAILURE = "VERIFY_EMAIL_FAILURE";
export const RESEND_EMAIL = "RESEND_EMAIL";
export const RESEND_EMAIL_SUCCESS = "RESEND_EMAIL_SUCCESS";
export const RESEND_EMAIL_FAILURE = "RESEND_EMAIL_FAILURE";
export const GET_EMAIL_STATUS = "GET_EMAIL_STATUS";
export const GET_EMAIL_STATUS_SUCCESS = "GET_EMAIL_STATUS_SUCCESS";
export const GET_EMAIL_STATUS_FAILURE = "GET_EMAIL_STATUS_FAILURE";
export const CLEAR_EMAIL_VERIFICATION_ERROR = "CLEAR_EMAIL_VERIFICATION_ERROR";

interface EmailVerificationState {
  status: EmailStatusResponse | null;
  lastVerification: VerifyEmailResponse | null;
  lastResend: ResendEmailResponse | null;
  loading: boolean;
  error: { message: string; error_code?: string } | null;
}

const initialState: EmailVerificationState = {
  status: null,
  lastVerification: null,
  lastResend: null,
  loading: false,
  error: null,
};

type EmailVerificationAction =
  | { type: typeof VERIFY_EMAIL }
  | { type: typeof VERIFY_EMAIL_SUCCESS; payload: VerifyEmailResponse }
  | { type: typeof VERIFY_EMAIL_FAILURE; payload: { message: string; error_code?: string } }
  | { type: typeof RESEND_EMAIL }
  | { type: typeof RESEND_EMAIL_SUCCESS; payload: ResendEmailResponse }
  | { type: typeof RESEND_EMAIL_FAILURE; payload: { message: string; error_code?: string } }
  | { type: typeof GET_EMAIL_STATUS }
  | { type: typeof GET_EMAIL_STATUS_SUCCESS; payload: EmailStatusResponse }
  | { type: typeof GET_EMAIL_STATUS_FAILURE; payload: { message: string; error_code?: string } }
  | { type: typeof CLEAR_EMAIL_VERIFICATION_ERROR };

const emailVerificationReducer = (
  state = initialState,
  action: EmailVerificationAction
): EmailVerificationState => {
  switch (action.type) {
    case VERIFY_EMAIL:
    case RESEND_EMAIL:
    case GET_EMAIL_STATUS:
      console.log(`emailVerificationReducer: ${action.type} - Setting loading to true`);
      return {
        ...state,
        loading: true,
        error: null,
      };
    case VERIFY_EMAIL_SUCCESS:
      console.log("emailVerificationReducer: VERIFY_EMAIL_SUCCESS with payload:", action.payload);
      return {
        ...state,
        lastVerification: action.payload,
        loading: false,
        error: null,
      };
    case VERIFY_EMAIL_FAILURE:
      console.log("emailVerificationReducer: VERIFY_EMAIL_FAILURE with payload:", action.payload);
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case RESEND_EMAIL_SUCCESS:
      console.log("emailVerificationReducer: RESEND_EMAIL_SUCCESS with payload:", action.payload);
      return {
        ...state,
        lastResend: action.payload,
        loading: false,
        error: null,
      };
    case RESEND_EMAIL_FAILURE:
      console.log("emailVerificationReducer: RESEND_EMAIL_FAILURE with payload:", action.payload);
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case GET_EMAIL_STATUS_SUCCESS:
      console.log("emailVerificationReducer: GET_EMAIL_STATUS_SUCCESS with payload:", action.payload);
      return {
        ...state,
        status: action.payload,
        loading: false,
        error: null,
      };
    case GET_EMAIL_STATUS_FAILURE:
      console.log("emailVerificationReducer: GET_EMAIL_STATUS_FAILURE with payload:", action.payload);
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CLEAR_EMAIL_VERIFICATION_ERROR:
      console.log("emailVerificationReducer: Clearing error");
      return { ...state, error: null };
    default:
      return state;
  }
};

export default emailVerificationReducer;