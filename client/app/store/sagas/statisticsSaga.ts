import { call, put, takeLatest } from "redux-saga/effects";
import { statisticsService } from "~/services/api/statisticsService";
import type { StatisticsResponse } from "~/services/types/statistics.types";
import { addMessage } from "../reducer/messageReducer";
import { showLoading, hideLoading } from "../reducer/loadingReducer";
import type { ApiResponse } from "~/services/types/common.types";
import {
  GET_JOB_STATISTICS_SUCCESS,
  GET_JOB_STATISTICS_FAILURE,
  GET_JOB_APPLY_STATISTICS_SUCCESS,
  GET_JOB_APPLY_STATISTICS_FAILURE,
  GET_COMPANY_STATISTICS_SUCCESS,
  GET_COMPANY_STATISTICS_FAILURE,
} from "../reducer/statisticsReducer";

export const GET_JOB_STATISTICS = "GET_JOB_STATISTICS";
export const GET_JOB_APPLY_STATISTICS = "GET_JOB_APPLY_STATISTICS";
export const GET_COMPANY_STATISTICS = "GET_COMPANY_STATISTICS";

export const getJobStatistics = () => ({
  type: GET_JOB_STATISTICS,
});

export const getJobApplyStatistics = () => ({
  type: GET_JOB_APPLY_STATISTICS,
});

export const getCompanyStatistics = () => ({
  type: GET_COMPANY_STATISTICS,
});

export const getJobStatisticsSuccess = (statistics: StatisticsResponse) => ({
  type: GET_JOB_STATISTICS_SUCCESS,
  payload: statistics,
});

export const getJobStatisticsFailure = (error: { message: string; error_code?: string }) => ({
  type: GET_JOB_STATISTICS_FAILURE,
  payload: error,
});

export const getJobApplyStatisticsSuccess = (statistics: StatisticsResponse) => ({
  type: GET_JOB_APPLY_STATISTICS_SUCCESS,
  payload: statistics,
});

export const getJobApplyStatisticsFailure = (error: { message: string; error_code?: string }) => ({
  type: GET_JOB_APPLY_STATISTICS_FAILURE,
  payload: error,
});

export const getCompanyStatisticsSuccess = (statistics: StatisticsResponse) => ({
  type: GET_COMPANY_STATISTICS_SUCCESS,
  payload: statistics,
});

export const getCompanyStatisticsFailure = (error: { message: string; error_code?: string }) => ({
  type: GET_COMPANY_STATISTICS_FAILURE,
  payload: error,
});

function isApiError(error: unknown): error is { message: string; status: number; error_code?: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    "status" in error
  );
}

function* getJobStatisticsSaga() {
  try {
    yield put(showLoading());
    console.log("getJobStatisticsSaga: Calling statisticsService.getJobStatistics");
    const response: ApiResponse<StatisticsResponse> = yield call(statisticsService.getJobStatistics);
    console.log("getJobStatisticsSaga: Get job statistics response:", response);
    yield put(getJobStatisticsSuccess(response.data));
    yield put(
      addMessage({
        text: response.message || "Statistiques des offres d'emploi chargées avec succès",
        type: "success",
      })
    );
  } catch (error: unknown) {
    console.error("getJobStatisticsSaga: Error fetching job statistics:", error);
    const apiError = isApiError(error)
      ? { message: error.message, error_code: error.error_code }
      : { message: "Impossible de charger les statistiques des offres d'emploi" };
    yield put(getJobStatisticsFailure(apiError));
    yield put(addMessage({ text: apiError.message, type: "error" }));
  } finally {
    yield put(hideLoading());
    console.log("getJobStatisticsSaga: Saga completed.");
  }
}

function* getJobApplyStatisticsSaga() {
  try {
    yield put(showLoading());
    console.log("getJobApplyStatisticsSaga: Calling statisticsService.getJobApplyStatistics");
    const response: ApiResponse<StatisticsResponse> = yield call(statisticsService.getJobApplyStatistics);
    console.log("getJobApplyStatisticsSaga: Get recruitment statistics response:", response);
    yield put(getJobApplyStatisticsSuccess(response.data));
    yield put(
      addMessage({
        text: response.message || "Statistiques des candidatures chargées avec succès",
        type: "success",
      })
    );
  } catch (error: unknown) {
    console.error("getJobApplyStatisticsSaga: Error fetching recruitment statistics:", error);
    const apiError = isApiError(error)
      ? { message: error.message, error_code: error.error_code }
      : { message: "Impossible de charger les statistiques des candidatures" };
    yield put(getJobApplyStatisticsFailure(apiError));
    yield put(addMessage({ text: apiError.message, type: "error" }));
  } finally {
    yield put(hideLoading());
    console.log("getJobApplyStatisticsSaga: Saga completed.");
  }
}

function* getCompanyStatisticsSaga() {
  try {
    yield put(showLoading());
    console.log("getCompanyStatisticsSaga: Calling statisticsService.getCompanyStatistics");
    const response: ApiResponse<StatisticsResponse> = yield call(statisticsService.getCompanyStatistics);
    console.log("getCompanyStatisticsSaga: Get company statistics response:", response);
    yield put(getCompanyStatisticsSuccess(response.data));
    yield put(
      addMessage({
        text: response.message || "Statistiques des entreprises chargées avec succès",
        type: "success",
      })
    );
  } catch (error: unknown) {
    console.error("getCompanyStatisticsSaga: Error fetching company statistics:", error);
    const apiError = isApiError(error)
      ? { message: error.message, error_code: error.error_code }
      : { message: "Impossible de charger les statistiques des entreprises" };
    yield put(getCompanyStatisticsFailure(apiError));
    yield put(addMessage({ text: apiError.message, type: "error" }));
  } finally {
    yield put(hideLoading());
    console.log("getCompanyStatisticsSaga: Saga completed.");
  }
}

export function* statisticsSaga() {
  console.log("statisticsSaga: Initializing saga listeners");
  yield takeLatest(GET_JOB_STATISTICS, getJobStatisticsSaga);
  yield takeLatest(GET_JOB_APPLY_STATISTICS, getJobApplyStatisticsSaga);
  yield takeLatest(GET_COMPANY_STATISTICS, getCompanyStatisticsSaga);
}