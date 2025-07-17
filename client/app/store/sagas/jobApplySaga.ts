import { call, put, takeLatest } from "redux-saga/effects";
import type {
  CreateJobApplicationPayload,
  CreateJobApplicationResponse,
  GetAllJobApplicationsResponse,
  UpdateJobApplicationStatusPayload,
  UpdateJobApplicationStatusResponse,
} from "~/services/types/jobApply.types";
import { addMessage } from "../reducer/messageReducer";
import { showLoading, hideLoading } from "../reducer/loadingReducer";
import type { ApiError, ApiResponse } from "~/services/types/common.types";
import { jobApplyServices } from "~/services/api/jobApplyServices";
import { 
  CREATE_JOBAPPLICATION_FAILURE, 
  CREATE_JOBAPPLICATION_SUCCESS, 
  DELETE_JOBAPPLICATION_FAILURE, 
  DELETE_JOBAPPLICATION_SUCCESS, 
  GET_ALL_JOBAPPLICATIONS_FAILURE, 
  GET_ALL_JOBAPPLICATIONS_SUCCESS, 
  GET_JOBAPPLICATION_BY_ID_FAILURE, 
  GET_JOBAPPLICATION_BY_ID_SUCCESS, 
  UPDATE_JOBAPPLICATION_STATUS_FAILURE, 
  UPDATE_JOBAPPLICATION_STATUS_SUCCESS 
} from "../reducer/jobApplyReducer";

export const CREATE_JOBAPPLICATION = "CREATE_JOBAPPLICATION";
export const GET_ALL_JOBAPPLICATIONS = "GET_ALL_JOBAPPLICATIONS";
export const GET_JOBAPPLICATION_BY_ID = "GET_JOBAPPLICATION_BY_ID";
export const UPDATE_JOBAPPLICATION_STATUS = "UPDATE_JOBAPPLICATION_STATUS";
export const DELETE_JOBAPPLICATION = "DELETE_JOBAPPLICATION";

interface CreateJobApplicationAction {
  type: typeof CREATE_JOBAPPLICATION;
  payload: CreateJobApplicationPayload;
}

export const createJobApplication = (payload: CreateJobApplicationPayload) => ({
  type: CREATE_JOBAPPLICATION,
  payload,
});

export const getAllJobApplications = () => ({
  type: GET_ALL_JOBAPPLICATIONS,
});

export const getJobApplication = (id: number) => ({
  type: GET_JOBAPPLICATION_BY_ID,
  payload: id,
});

export const updateJobApplicationStatus = (
  id: number,
  payload: { status: string; notes?: string }
) => ({
  type: UPDATE_JOBAPPLICATION_STATUS,
  payload: { id, ...payload },
});

export const deleteJobApplication = (id: number) => ({
  type: DELETE_JOBAPPLICATION,
  payload: id,
});

export const createJobApplicationSuccess = (response: CreateJobApplicationResponse) => ({
  type: CREATE_JOBAPPLICATION_SUCCESS,
  payload: response,
});

export const createJobApplicationFailure = (error: {
  message: string;
  error_code?: string;
}) => ({
  type: CREATE_JOBAPPLICATION_FAILURE,
  payload: error
});



export const getAllJobApplicationsSuccess = (response: GetAllJobApplicationsResponse) => ({
  type: GET_ALL_JOBAPPLICATIONS_SUCCESS,
  payload: response.data
});

export const getAllJobApplicationsFailure = (error: {
  message: string;
  error_code?: string;
}) => ({
  type: GET_ALL_JOBAPPLICATIONS_FAILURE,
  payload: error
});

export const getJobApplicationByIdSuccess = (response: CreateJobApplicationResponse) => ({
  type: GET_JOBAPPLICATION_BY_ID_SUCCESS,
  payload: response
});
export const getJobApplicationByIdFailure = (error: {
  message: string;
  error_code?: string;
  errors?: unknown;
  status: number;
}) => ({
  type: GET_JOBAPPLICATION_BY_ID_FAILURE,
  payload: error
});

export const updateJobApplicationStatusSuccess = (response: UpdateJobApplicationStatusResponse) => ({
  type: UPDATE_JOBAPPLICATION_STATUS_SUCCESS,
  payload: response
});
export const updateJobApplicationStatusFailure = (error: {
  message: string;
  error_code?: string;
}) => ({
  type: UPDATE_JOBAPPLICATION_STATUS_FAILURE,
  payload: error
});

export const deleteJobApplicationSuccess = (response: CreateJobApplicationResponse) => ({
  type: DELETE_JOBAPPLICATION_SUCCESS,
  payload: response
});

export const deleteJobApplicationFailure = (error: {
  message: string;
  error_code?: string;
}) => ({
  type: DELETE_JOBAPPLICATION_FAILURE,
  payload: error
});


function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    "status" in error
  );
}

function* createJobApplicationSaga(action: CreateJobApplicationAction) {
  try {
    yield put(showLoading());
    const response: ApiResponse<CreateJobApplicationResponse> = yield call(
      jobApplyServices.createJobApply,
      action.payload
    );
    console.log("createJobApplicationSaga: Create job application response:", response);
    yield put(createJobApplicationSuccess(response.data));
    yield put(
      addMessage({
        type: "success",
        text: response.data.message,
      })
    );
  } catch (error: unknown) {

    const apiError = isApiError(error)
      ? { message: error.message || "Erreur lors de la création de la candidature", status: error.status }
      : { message: "impossible de postuler", status: 500 };
    console.error("createJobApplicationSaga: Parsed API error:", apiError);
    // yield put(createJobApplicationFailure(apiError));
    yield put(
      addMessage({
        type: "error",
        text: apiError.message
      })
    );

    console.error("createJobApplicationSaga: Error creating job application:", error);
  } finally {
    yield put(hideLoading());
    console.log("createJobApplicationSaga: Saga completed.");
  }
}


function* getJobApplicationByIdSaga(action: { type: typeof GET_JOBAPPLICATION_BY_ID; payload: string }) {
  try {
    yield put(showLoading());
    const response: ApiResponse<CreateJobApplicationResponse> = yield call(
      jobApplyServices.getJobApplicationById,
      action.payload
    );
    console.log("getJobApplicationSaga: Get job application response:", response);
    yield put(getJobApplicationByIdSuccess(response.data));
  } catch (error: unknown) {
    console.error("getJobApplicationSaga: Error fetching job application:", error);
    const apiError = isApiError(error)
      ? { message: error.message || "", status: error.status }
      : { message: "Erreur lors de la récupération de la candidature", status: 500 };
    console.error("getJobApplicationSaga: Parsed API error:", apiError);
    yield put(getJobApplicationByIdFailure(apiError));
    yield put(
      addMessage({
        type: "error",
        text: apiError.message || "Erreur lors de la récupération de la candidature"
      })
    );
  } finally {
    yield put(hideLoading());
    console.log("getJobApplicationSaga: Saga completed.");
  }
}


function* getAllJobApplicationsSaga() {
  try {
    yield put(showLoading());
    const response: ApiResponse<GetAllJobApplicationsResponse> = yield call(
      jobApplyServices.getAllJobApplications
    );
    console.log("getAllJobApplicationsSaga: Get all job applications response:", response);
    yield put(getAllJobApplicationsSuccess(response.data));
  } catch (error: unknown) {
    console.error("getAllJobApplicationsSaga: Error fetching all job applications:", error);
    const apiError = isApiError(error)
      ? { message: error.message, status: error.status }
      : { message: "Erreur lors de la récupération des candidatures", status: 500 };
    console.error("getAllJobApplicationsSaga: Parsed API error:", apiError);
    // yield put(getAllJobApplicationsFailure(apiError));
    yield put(
      addMessage({
        type: "error",
        text: apiError.message || "Erreur lors de la récupération des candidatures"
      })
    );
  }
  finally {
    yield put(hideLoading());
    console.log("getAllJobApplicationsSaga: Saga completed.");
  }
}

function* updateJobApplicationStatusSaga(action: {
  type: typeof UPDATE_JOBAPPLICATION_STATUS;
  payload: UpdateJobApplicationStatusPayload & { id: string };
}) {
  try {
    yield put(showLoading());
    const response: ApiResponse<UpdateJobApplicationStatusResponse> = yield call(
      jobApplyServices.updateJobApplication,
      action.payload.id,
      { status: action.payload.status, notes: action.payload.notes }
    );
    console.log("updateJobApplicationStatusSaga: Update job application status response:", response);
    yield put(updateJobApplicationStatusSuccess(response.data));
    yield put(
      addMessage({
        type: "success",
        text: response.data.message || "Statut de la candidature mis à jour avec succès"
      })
    );
  } catch (error: unknown) {
    console.error("updateJobApplicationStatusSaga: Error updating job application status:", error);
    const apiError = isApiError(error)
      ? { message: error.message || "", status: error.status }
      : { message: "Erreur lors de la mise à jour du statut de la candidature", status: 500 };
    yield put(updateJobApplicationStatusFailure(apiError));
    yield put(
      addMessage({
        type: "error",
        text: apiError.message || "Erreur lors de la mise à jour du statut de la candidature"
      })
    );
  } finally {
    yield put(hideLoading());
  }
}

function* deleteJobApplicationSaga(action: {
  type: typeof DELETE_JOBAPPLICATION;
  payload: string;
}) {
  try {
    yield put(showLoading());
    const response: ApiResponse<CreateJobApplicationResponse> = yield call(
      jobApplyServices.deleteJobApplication,
      action.payload
    );
    console.log("deleteJobApplicationSaga: Delete job application response:", response);
    yield put(deleteJobApplicationSuccess(response.data));
    yield put(
      addMessage({
        type: "success",
        text: response.data.message || "Candidature supprimée avec succès"
      })
    );
  } catch (error: unknown) {
    console.error("deleteJobApplicationSaga: Error deleting job application:", error);
    const apiError = isApiError(error)
      ? { message: error.message || "", status: error.status }
      : { message: "Erreur lors de la suppression de la candidature", status: 500 };
    yield put(deleteJobApplicationFailure(apiError));
    yield put(
      addMessage({
        type: "error",
        text: apiError.message || "Erreur lors de la suppression de la candidature"
      })
    );
  } finally {
    yield put(hideLoading());
  }
}

export function* jobApplySaga() {
  yield takeLatest(CREATE_JOBAPPLICATION, createJobApplicationSaga);
  yield takeLatest(GET_JOBAPPLICATION_BY_ID, getJobApplicationByIdSaga);
  yield takeLatest(UPDATE_JOBAPPLICATION_STATUS, updateJobApplicationStatusSaga);
  yield takeLatest(DELETE_JOBAPPLICATION, deleteJobApplicationSaga);
  yield takeLatest(GET_ALL_JOBAPPLICATIONS, getAllJobApplicationsSaga);
}