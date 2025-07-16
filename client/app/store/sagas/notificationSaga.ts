// ~/sagas/notificationSaga.ts

import { call, put, takeLatest } from "redux-saga/effects";

import type {
  ApiResponse,
  SendToCandidatePayload,
  SendToCompanyPayload,
  NotificationResponse,
} from "~/services/types/notification.types";
import { addMessage } from "../reducer/messageReducer";
import { showLoading, hideLoading } from "../reducer/loadingReducer";
import { notificationService } from "~/services/api/notificationService";

// Action Types
export const SEND_TO_CANDIDATE = "SEND_TO_CANDIDATE";
export const SEND_TO_CANDIDATE_SUCCESS = "SEND_TO_CANDIDATE_SUCCESS";
export const SEND_TO_CANDIDATE_FAILURE = "SEND_TO_CANDIDATE_FAILURE";
export const SEND_TO_COMPANY = "SEND_TO_COMPANY";
export const SEND_TO_COMPANY_SUCCESS = "SEND_TO_COMPANY_SUCCESS";
export const SEND_TO_COMPANY_FAILURE = "SEND_TO_COMPANY_FAILURE";
export const CLEAR_NOTIFICATION_ERROR = "CLEAR_NOTIFICATION_ERROR";

// Action Interfaces
interface SendToCandidateAction {
  type: typeof SEND_TO_CANDIDATE;
  payload: SendToCandidatePayload;
}

interface SendToCompanyAction {
  type: typeof SEND_TO_COMPANY;
  payload: SendToCompanyPayload;
}

// Action Creators
export const sendToCandidate = (payload: SendToCandidatePayload) => ({
  type: SEND_TO_CANDIDATE,
  payload,
});

export const sendToCandidateSuccess = (response: NotificationResponse) => ({
  type: SEND_TO_CANDIDATE_SUCCESS,
  payload: response,
});

export const sendToCandidateFailure = (error: { message: string; error_code?: string }) => ({
  type: SEND_TO_CANDIDATE_FAILURE,
  payload: error,
});

export const sendToCompany = (payload: SendToCompanyPayload) => ({
  type: SEND_TO_COMPANY,
  payload,
});

export const sendToCompanySuccess = (response: NotificationResponse) => ({
  type: SEND_TO_COMPANY_SUCCESS,
  payload: response,
});

export const sendToCompanyFailure = (error: { message: string; error_code?: string }) => ({
  type: SEND_TO_COMPANY_FAILURE,
  payload: error,
});

export const clearNotificationError = () => ({
  type: CLEAR_NOTIFICATION_ERROR,
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
function* sendToCandidateSaga(action: SendToCandidateAction) {
  try {
    yield put(showLoading());
    console.log(
      "sendToCandidateSaga: Calling notificationService.sendToCandidate with payload:",
      action.payload
    );
    const response: ApiResponse<NotificationResponse> = yield call(
      notificationService.sendToCandidate,
      action.payload
    );
    console.log("sendToCandidateSaga: Send to candidate response:", response);
    yield put(sendToCandidateSuccess(response.data));
    yield put(
      addMessage({
        text: response.message || "Email envoyé au candidat avec succès",
        type: "success",
      })
    );
  } catch (error: unknown) {
    console.error("sendToCandidateSaga: Error sending to candidate:", error);
    const apiError = isApiError(error)
      ? { message: error.message, error_code: error.error_code }
      : { message: "Impossible d'envoyer l'email au candidat" };
    yield put(sendToCandidateFailure(apiError));
    yield put(addMessage({ text: apiError.message, type: "error" }));
  } finally {
    yield put(hideLoading());
    console.log("sendToCandidateSaga: Saga completed.");
  }
}

function* sendToCompanySaga(action: SendToCompanyAction) {
  try {
    yield put(showLoading());
    console.log(
      "sendToCompanySaga: Calling notificationService.sendToCompany with payload:",
      action.payload
    );
    const response: ApiResponse<NotificationResponse> = yield call(
      notificationService.sendToCompany,
      action.payload
    );
    console.log("sendToCompanySaga: Send to company response:", response);
    yield put(sendToCompanySuccess(response.data));
    yield put(
      addMessage({
        text: response.message || "Candidature transférée à l'entreprise avec succès",
        type: "success",
      })
    );
  } catch (error: unknown) {
    console.error("sendToCompanySaga: Error sending to company:", error);
    const apiError = isApiError(error)
      ? { message: error.message, error_code: error.error_code }
      : { message: "Impossible de transférer la candidature à l'entreprise" };
    yield put(sendToCompanyFailure(apiError));
    yield put(addMessage({ text: apiError.message, type: "error" }));
  } finally {
    yield put(hideLoading());
    console.log("sendToCompanySaga: Saga completed.");
  }
}

export function* notificationSaga() {
  console.log("notificationSaga: Initializing saga listeners");
  yield takeLatest(SEND_TO_CANDIDATE, sendToCandidateSaga);
  yield takeLatest(SEND_TO_COMPANY, sendToCompanySaga);
}