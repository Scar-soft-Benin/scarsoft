// store/saga/jobSaga.ts

import { call, put, takeLatest } from "redux-saga/effects";
import { jobService } from "../../services/api/jobService";
import type {
    CreateJobPayload,
    CreateJobResponse,
    DeleteJobResponse,
    GetAllJobsByCompanyIdResponse,
    GetAllJobsResponse,
    GetJobByIdResponse,
    Job,
    UpdateJobResponse
} from "../../services/types/job.types";
import {
    CREATE_JOB_SUCCESS,
    CREATE_JOB_FAILURE,
    GET_ALL_JOBS_SUCCESS,
    GET_ALL_JOBS_FAILURE,
    SET_SINGLE_JOB_SUCCESS,
    SET_SINGLE_JOB_FAILURE,
    UPDATE_JOB_SUCCESS,
    UPDATE_JOB_FAILURE,
    DELETE_JOB_SUCCESS,
    DELETE_JOB_FAILURE,
    GET_ALL_JOBS_FOR_ADMIN_SUCCESS,
    GET_ALL_JOBS_FOR_ADMIN_FAILURE,
    GET_JOB_BY_ID_SUCCESS,
    GET_JOB_BY_ID_FAILURE
} from "../reducer/jobReducer";
import { addMessage } from "../reducer/messageReducer";
import { showLoading, hideLoading } from "../reducer/loadingReducer";
import type { ApiResponse, ApiError } from "../../services/types/common.types";

// Action Types
export const CREATE_JOB = "CREATE_JOB";
export const GET_ALL_JOBS = "GET_ALL_JOBS";
export const GET_ALL_JOBS_FOR_ADMIN = "GET_ALL_JOBS_FOR_ADMIN";
export const SET_SINGLE_JOB = "SET_SINGLE_JOB";
export const GET_JOB_BY_ID = "GET_JOB_BY_ID";
export const UPDATE_JOB = "UPDATE_JOB";
export const DELETE_JOB = "DELETE_JOB";
export const GET_All_JOBS_BY_COMPANY_ID = "GET_All_JOBS_BY_COMPANY_ID";

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

export const getAllJobsForAdmin = () => ({
    type: GET_ALL_JOBS_FOR_ADMIN
});

export const setSingleJob = (job: Job) => ({
    type: SET_SINGLE_JOB,
    payload: job
});

export const getJobById = (jobId: string) => ({
    type: GET_JOB_BY_ID,
    payload: { jobId }
});

export const getAllJobsByCompanyId = (companyId: string) => ({
    type: GET_All_JOBS_BY_COMPANY_ID,
    payload: { companyId }
});
export const updateJob = (job: Job) => ({
    type: UPDATE_JOB,
    payload: job
});
export const deleteJob = (jobId: string) => ({
    type: DELETE_JOB,
    payload: { jobId }
});

// Action Creators for Success and Failure

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

export const getAllJobsForAdminSuccess = (response: GetAllJobsResponse) => ({
    type: GET_ALL_JOBS_FOR_ADMIN_SUCCESS,
    payload: response
});
export const getAllJobsForAdminFailure = (error: {
    message: string;
    error_code?: string;
}) => ({
    type: GET_ALL_JOBS_FOR_ADMIN_FAILURE,
    payload: error
});
export const getJobByIdSuccess = (job: Job) => ({
    type: GET_JOB_BY_ID_SUCCESS,
    payload: job
});
export const getJobByIdFailure = (error: {
    message: string;
    error_code?: string;
}) => ({
    type: GET_JOB_BY_ID_FAILURE,
    payload: error
});
export const setSingleJobSuccess = (job: Job) => ({
    type: SET_SINGLE_JOB_SUCCESS,
    payload: job
});
export const setSingleJobFailure = (error: {
    message: string;
    error_code?: string;
}) => ({
    type: SET_SINGLE_JOB_FAILURE,
    payload: error
});
export const updateJobSuccess = (job: Job) => ({
    type: UPDATE_JOB_SUCCESS,
    payload: job
});
export const updateJobFailure = (error: {
    message: string;
    error_code?: string;
}) => ({
    type: UPDATE_JOB_FAILURE,
    payload: error
});
export const deleteJobSuccess = (jobId: string) => ({
    type: DELETE_JOB_SUCCESS,
    payload: { jobId }
});
export const deleteJobFailure = (error: {
    message: string;
    error_code?: string;
}) => ({
    type: DELETE_JOB_FAILURE,
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
        const apiError = isApiError(error)
            ? {
                  message: error.message || "Processed create job error",
                  error_code: error.error_code
              }
            : {
                  message: "Impossible de créer l'offre",
                  error_code: undefined
              };
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
    } catch (error: unknown) {
        console.error("getAllJobsSaga: Raw get all jobs error:", error);
        const apiError = isApiError(error)
            ? {
                  message:
                      error.message ||
                      "Erreur lors du chargement des offres d'emploi",
                  error_code: error.error_code
              }
            : {
                  message: "Impossible de charger les offres d'emploi",
                  error_code: undefined
              };
        console.log("getAllJobsSaga: Processed get all jobs error:", apiError);
        yield put(getAllJobsFailure(apiError));
        yield put(addMessage({ text: apiError.message, type: "error" }));
    } finally {
        yield put(hideLoading());
    }
}

function* getJobByIdSaga(action: { type: string; payload: { jobId: string } }) {
    try {
        yield put(showLoading());
        const response: ApiResponse<GetJobByIdResponse> = yield call(
            jobService.getJobById,
            action.payload.jobId
        );
        console.log("getJobByIdSaga: Get job by ID response:", response);
        yield put(getJobByIdSuccess(response.data.data));
        yield put(
            addMessage({
                text: response.data.message,
                type: "success"
            })
        );
    } catch (error: unknown) {
        console.error("getJobByIdSaga: Raw get job by ID error:", error);
        const apiError = isApiError(error)
            ? {
                  message:
                      error.message ||
                      "Erreur lors du chargement de l'offres d'emploi",
                  error_code: error.error_code
              }
            : {
                  message: "Impossible de charger l'offres d'emploi",
                  error_code: undefined
              };
        yield put(getJobByIdFailure(apiError));
        yield put(addMessage({ text: apiError.message, type: "error" }));
    } finally {
        yield put(hideLoading());
    }
}

function* getAllJobForAdminSaga() {
    try {
        yield put(showLoading());
        const response: ApiResponse<GetAllJobsResponse> = yield call(
            jobService.getAllJobForAdmin
        );
        console.log(
            "getAllJobForAdminSaga: Get all jobs for admin response:",
            response
        );
        yield put(getAllJobsSuccess(response.data));
        yield put(
            addMessage({
                text:
                    response.data.message ||
                    "Offres administratives chargées avec succès",
                type: "success"
            })
        );
    } catch (error: unknown) {
        const apiError = isApiError(error)
            ? {
                  message:
                      error.message ||
                      "Processed get all jobs for admin error:",
                  error_code: error.error_code
              }
            : {
                  message: "Impossible de charger les offres administratives",
                  error_code: undefined
              };
        console.error(
            "getAllJobForAdminSaga: Raw get all jobs for admin error:",
            error
        );
        yield put(getAllJobsFailure(apiError));
        yield put(addMessage({ text: apiError.message, type: "error" }));
    } finally {
        yield put(hideLoading());
    }
}

function* getAllJobsByCompanyIdSaga(action: {
    type: typeof GET_All_JOBS_BY_COMPANY_ID;
    payload: { companyId: string };
}) {
    try {
        yield put(showLoading());
        const response: ApiResponse<GetAllJobsByCompanyIdResponse> = yield call(
            jobService.getAllJobsByCompanyId,
            action.payload.companyId
        );
        console.log(
            "getJobsByCompanyIdSaga: Get jobs by company ID response:",
            response
        );
        yield put(getAllJobsSuccess(response.data));
        yield put(
            addMessage({
                text:
                    response.data.message ||
                    "Offres par entreprise chargées avec succès",
                type: "success"
            })
        );
    } catch (error: unknown) {
        const apiError = isApiError(error)
            ? {
                  message:
                      error.message ||
                      "Processed get jobs by company ID error:",
                  error_code: error.error_code
              }
            : {
                  message: "Impossible de charger les offres par entreprise",
                  error_code: undefined
              };
        console.error(
            "getJobsByCompanyIdSaga: Raw get jobs by company ID error:",
            error
        );
        yield put(getAllJobsFailure(apiError));
        yield put(addMessage({ text: apiError.message, type: "error" }));
    } finally {
        yield put(hideLoading());
    }
}

function* setSingleJobSaga(action: {
    type: typeof SET_SINGLE_JOB;
    payload: Job;
}) {
    try {
        yield put(showLoading());
        const job: Job = action.payload;
        yield put(setSingleJobSuccess(job));
    } catch (error: unknown) {
        const apiError = isApiError(error)
            ? {
                  message: error.message || "Processed set single job error",
                  error_code: error.error_code
              }
            : {
                  message: "Impossible de mettre à jour l'offre",
                  error_code: undefined
              };
        yield put(setSingleJobFailure(apiError));
        yield put(addMessage({ text: apiError.message, type: "error" }));
    } finally {
        yield put(hideLoading());
    }
}

function* updateJobSaga(action: { type: typeof UPDATE_JOB; payload: Job }) {
    try {
        yield put(showLoading());
        const job: Job = action.payload;
        const response: ApiResponse<UpdateJobResponse> = yield call(
            jobService.updateJob,
            job.id.toString(),
            job
        );
        console.log("updateJobSaga: Update job response:", response);
        yield put(updateJobSuccess(response.data.data));
        yield put(
            addMessage({
                text: response.data.message || "Offre mise à jour avec succès",
                type: "success"
            })
        );
    } catch (error: unknown) {
        const apiError = isApiError(error)
            ? {
                  message: error.message || "Processed set single job error",
                  error_code: error.error_code
              }
            : {
                  message: "Impossible de mettre à jour l'offre",
                  error_code: undefined
              };
        console.error("updateJobSaga: Raw update job error:", error);
        yield put(updateJobFailure(apiError));
        yield put(addMessage({ text: apiError.message, type: "error" }));
    } finally {
        yield put(hideLoading());
    }
}

function* deleteJobSaga(action: { type: string; payload: { jobId: string } }) {
    try {
        yield put(showLoading());
        const response: ApiResponse<DeleteJobResponse> = yield call(
            jobService.deleteJob,
            action.payload.jobId
        );
        console.log("deleteJobSaga: Delete job response:", response);
        yield put(deleteJobSuccess(action.payload.jobId));
        yield put(
            addMessage({
                text: response.data.message || "Offre supprimée avec succès",
                type: "success"
            })
        );
    } catch (error: unknown) {
        const apiError = isApiError(error)
            ? {
                  message: error.message || "Processed delete job error",
                  error_code: error.error_code
              }
            : {
                  message: "Impossible de supprimer l'offre",
                  error_code: undefined
              };
        yield put(deleteJobFailure(apiError));
        yield put(addMessage({ text: apiError.message, type: "error" }));
    } finally {
        yield put(hideLoading());
    }
}

export function* jobSaga() {
    yield takeLatest(CREATE_JOB, createJobSaga);
    yield takeLatest(GET_ALL_JOBS, getAllJobsSaga);
    yield takeLatest(GET_ALL_JOBS_FOR_ADMIN, getAllJobForAdminSaga);
    yield takeLatest(GET_All_JOBS_BY_COMPANY_ID, getAllJobsByCompanyIdSaga);
    yield takeLatest(GET_JOB_BY_ID, getJobByIdSaga);
    yield takeLatest(SET_SINGLE_JOB, setSingleJobSaga);
    yield takeLatest(UPDATE_JOB, updateJobSaga);
    yield takeLatest(DELETE_JOB, deleteJobSaga);
}
