// store/saga/jobSaga.ts

import { call, put, takeLatest } from "redux-saga/effects";
import { jobService } from "../../services/api/jobService";
import type {
    CreateJobPayload,
    CreateJobResponse,
    GetAllJobsResponse
} from "../../services/types/job.types";
import {
    CREATE_JOB_SUCCESS,
    CREATE_JOB_FAILURE,
    GET_ALL_JOBS_SUCCESS,
    GET_ALL_JOBS_FAILURE
} from "../reducer/jobReducer";
import { addMessage } from "../reducer/messageReducer";
import { showLoading, hideLoading } from "../reducer/loadingReducer";
import type { ApiResponse, ApiError } from "../../services/types/common.types";

// Action Types
export const CREATE_JOB = "CREATE_JOB";
export const GET_ALL_JOBS = "GET_ALL_JOBS";

// Action Interfaces
interface CreateJobAction {
    type: typeof CREATE_JOB;
    payload: CreateJobPayload;
}
// Action Creators
export const createJob = (payload: CreateJobPayload) => ({
    type: CREATE_JOB,
    payload
});

export const getAllJobs = () => ({
    type: GET_ALL_JOBS
});

export const createJobSuccess = (response: CreateJobResponse) => ({
    type: CREATE_JOB_SUCCESS,
    payload: response
});

export const createJobFailure = (error: {
    message: string;
    error_code?: string;
}) => ({
    type: CREATE_JOB_FAILURE,
    payload: error
});

export const getAllJobsSuccess = (response: GetAllJobsResponse) => ({
    type: GET_ALL_JOBS_SUCCESS,
    payload: response
});

export const getAllJobsFailure = (error: {
    message: string;
    error_code?: string;
}) => ({
    type: GET_ALL_JOBS_FAILURE,
    payload: error
});

// Error Type Guard
function isApiError(error: unknown): error is ApiError {
    return (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        "status" in error
    );
}

// Sagas
function* createJobSaga(action: CreateJobAction) {
    try {
        yield put(showLoading());
        const response: ApiResponse<CreateJobResponse> = yield call(
            jobService.createJob,
            action.payload
        );
        console.log("createJobSaga: Create job response:", response);
        yield put(createJobSuccess(response.data));
        yield put(
            addMessage({
                text: response.data.message || "Offre créée avec succès",
                type: "success"
            })
        );
    } catch (error: unknown) {
        console.error("createJobSaga: Raw create job error:", error);
        const apiError = isApiError(error)
            ? { message: error.message, error_code: error.error_code }
            : { message: "Impossible de créer l'offre" };
        console.log("createJobSaga: Processed create job error:", apiError);
        yield put(createJobFailure(apiError));
        yield put(addMessage({ text: apiError.message, type: "error" }));
    } finally {
        yield put(hideLoading());
    }
}

function* getAllJobsSaga() {
    try {
        yield put(showLoading());
        const response: ApiResponse<GetAllJobsResponse> = yield call(
            jobService.getAllJobs
        );
        console.log("getAllJobsSaga: Get all jobs response:", response);
        yield put(getAllJobsSuccess(response.data));
        yield put(
            addMessage({
                text: response.data.message || "Offres chargées avec succès",
                type: "success"
            })
        );
    } catch (error: unknown) {
        console.error("getAllJobsSaga: Raw get all jobs error:", error);
        const apiError = isApiError(error)
            ? { message: error.message, error_code: error.error_code }
            : { message: "Impossible de charger les offres d'emploi" };
        console.log("getAllJobsSaga: Processed get all jobs error:", apiError);
        yield put(getAllJobsFailure(apiError));
        yield put(addMessage({ text: apiError.message, type: "error" }));
    } finally {
        yield put(hideLoading());
    }
}

export function* jobSaga() {
    yield takeLatest(CREATE_JOB, createJobSaga);
    yield takeLatest(GET_ALL_JOBS, getAllJobsSaga);
}
