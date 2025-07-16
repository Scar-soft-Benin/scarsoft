// ~/sagas/emailVerificationSaga.ts

import { call, put, takeLatest } from "redux-saga/effects";

import type {
  ApiResponse,
  VerifyEmailPayload,
  ResendEmailPayload,
  VerifyEmailResponse,
  ResendEmailResponse,
  EmailStatusResponse,
} from "~/services/types/emailVerification.types";
import { addMessage } from "../reducer/messageReducer";
import { showLoading, hideLoading } from "../reducer/loadingReducer";
import { emailVerificationService } from "~/services/api/emailVerificationService";

// Action Types
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

// Action Interfaces
interface VerifyEmailAction {
  type: typeof VERIFY_EMAIL;
  payload: VerifyEmailPayload;
}

interface ResendEmailAction {
  type: typeof RESEND_EMAIL;
  payload: ResendEmailPayload;
}

interface GetEmailStatusAction {
  type: typeof GET_EMAIL_STATUS;
  payload: string;
}

// Action Creators
export const verifyEmail = (payload: VerifyEmailPayload) => ({
  type: VERIFY_EMAIL,
  payload,
});

export const verifyEmailSuccess = (response: VerifyEmailResponse) => ({
  type: VERIFY_EMAIL_SUCCESS,
  payload: response,
});

export const verifyEmailFailure = (error: { message: string; error_code?: string }) => ({
  type: VERIFY_EMAIL_FAILURE,
  payload: error,
});

export const resendEmail = (payload: ResendEmailPayload) => ({
  type: RESEND_EMAIL,
  payload,
});

export const resendEmailSuccess = (response: ResendEmailResponse) => ({
  type: RESEND_EMAIL_SUCCESS,
  payload: response,
});

export const resendEmailFailure = (error: { message: string; error_code?: string }) => ({
  type: RESEND_EMAIL_FAILURE,
  payload: error,
});

export const getEmailStatus = (email: string) => ({
  type: GET_EMAIL_STATUS,
  payload: email,
});

export const getEmailStatusSuccess = (response: EmailStatusResponse) => ({
  type: GET_EMAIL_STATUS_SUCCESS,
  payload: response,
});

export const getEmailStatusFailure = (error: { message: string; error_code?: string }) => ({
  type: GET_EMAIL_STATUS_FAILURE,
  payload: error,
});

export const clearEmailVerificationError = () => ({
  type: CLEAR_EMAIL_VERIFICATION_ERROR,
});

// Error Type Guard
function isApiError(error: unknown): error is { message: string; status: number; error_code?: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    "status" in error
  );
}

// Sagas
function* verifyEmailSaga(action: VerifyEmailAction) {
  try {
    yield put(showLoading());
    console.log("verifyEmailSaga: Calling emailVerificationService.verifyEmail with payload:", action.payload);
    const response: ApiResponse<VerifyEmailResponse> = yield call(
      emailVerificationService.verifyEmail,
      action.payload
    );
    console.log("verifyEmailSaga: Verify email response:", response);
    yield put(verifyEmailSuccess(response.data));
    yield put(
      addMessage({
        text: response.message || "Email vérifié avec succès",
        type: "success",
      })
    );
  } catch (error: unknown) {
    console.error("verifyEmailSaga: Error verifying email:", error);
    const apiError = isApiError(error)
      ? { message: error.message, error_code: error.error_code }
      : { message: "Impossible de vérifier l'email" };
    yield put(verifyEmailFailure(apiError));
    yield put(addMessage({ text: apiError.message, type: "error" }));
  } finally {
    yield put(hideLoading());
    console.log("verifyEmailSaga: Saga completed.");
  }
}

function* resendEmailSaga(action: ResendEmailAction) {
  try {
    yield put(showLoading());
    console.log("resendEmailSaga: Calling emailVerificationService.resendEmail with payload:", action.payload);
    const response: ApiResponse<ResendEmailResponse> = yield call(
      emailVerificationService.resendEmail,
      action.payload
    );
    console.log("resendEmailSaga: Resend email response:", response);
    yield put(resendEmailSuccess(response.data));
    yield put(
      addMessage({
        text: response.message || "Code de vérification renvoyé avec succès",
        type: "success",
      })
    );
  } catch (error: unknown) {
    console.error("resendEmailSaga: Error resending email:", error);
    const apiError = isApiError(error)
      ? { message: error.message, error_code: error.error_code }
      : { message: "Impossible de renvoyer le code de vérification" };
    yield put(resendEmailFailure(apiError));
    yield put(addMessage({ text: apiError.message, type: "error" }));
  } finally {
    yield put(hideLoading());
    console.log("resendEmailSaga: Saga completed.");
  }
}

function* getEmailStatusSaga(action: GetEmailStatusAction) {
  try {
    yield put(showLoading());
    console.log("getEmailStatusSaga: Calling emailVerificationService.getEmailStatus with email:", action.payload);
    const response: ApiResponse<EmailStatusResponse> = yield call(
      emailVerificationService.getEmailStatus,
      action.payload
    );
    console.log("getEmailStatusSaga: Get email status response:", response);
    yield put(getEmailStatusSuccess(response.data));
    yield put(
      addMessage({
        text: response.message || "Statut de vérification chargé avec succès",
        type: "success",
      })
    );
  } catch (error: unknown) {
    console.error("getEmailStatusSaga: Error fetching email status:", error);
    const apiError = isApiError(error)
      ? { message: error.message, error_code: error.error_code }
      : { message: "Impossible de charger le statut de vérification" };
    yield put(getEmailStatusFailure(apiError));
    yield put(addMessage({ text: apiError.message, type: "error" }));
  } finally {
    yield put(hideLoading());
    console.log("getEmailStatusSaga: Saga completed.");
  }
}

export function* emailVerificationSaga() {
  console.log("emailVerificationSaga: Initializing saga listeners");
  yield takeLatest(VERIFY_EMAIL, verifyEmailSaga);
  yield takeLatest(RESEND_EMAIL, resendEmailSaga);
  yield takeLatest(GET_EMAIL_STATUS, getEmailStatusSaga);
}