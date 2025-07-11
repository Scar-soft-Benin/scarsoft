// ~/store/sagas/companySaga.ts
import { call, put, takeLatest } from "redux-saga/effects";
import { companyService } from "~/services/api/companyService";
import type {
    CreateCompanyPayload,
    CreateCompanyResponse,
    Company,
    GetAllCompaniesPayload,
    ApiResponse,
    ApiError,
    GetAllCompaniesResponse,
    UpdateCompanyPayload,
    DeleteCompanyResponse,
    UpdateCompanyResponse,
    GetCompanyJobsResponse,
} from "~/services/types/company.types";
import { addMessage } from "../reducer/messageReducer";
import { showLoading, hideLoading } from "../reducer/loadingReducer";

// Action Types
export const CREATE_COMPANY = "CREATE_COMPANY";
export const CREATE_COMPANY_SUCCESS = "CREATE_COMPANY_SUCCESS";
export const CREATE_COMPANY_FAILURE = "CREATE_COMPANY_FAILURE";
export const GET_ALL_COMPANIES = "GET_ALL_COMPANIES";
export const GET_ALL_COMPANIES_SUCCESS = "GET_ALL_COMPANIES_SUCCESS";
export const GET_ALL_COMPANIES_FAILURE = "GET_ALL_COMPANIES_FAILURE";
export const UPDATE_COMPANY = "UPDATE_COMPANY";
export const UPDATE_COMPANY_SUCCESS = "UPDATE_COMPANY_SUCCESS";
export const UPDATE_COMPANY_FAILURE = "UPDATE_COMPANY_FAILURE";
export const DELETE_COMPANY = "DELETE_COMPANY";
export const DELETE_COMPANY_SUCCESS = "DELETE_COMPANY_SUCCESS";
export const DELETE_COMPANY_FAILURE = "DELETE_COMPANY_FAILURE";
export const GET_COMPANY_JOBS = "GET_COMPANY_JOBS";
export const GET_COMPANY_JOBS_SUCCESS = "GET_COMPANY_JOBS_SUCCESS";
export const GET_COMPANY_JOBS_FAILURE = "GET_COMPANY_JOBS_FAILURE";


// Action Interfaces
interface CreateCompanyAction {
  type: typeof CREATE_COMPANY;
  payload: CreateCompanyPayload;
}

interface GetAllCompaniesAction {
  type: typeof GET_ALL_COMPANIES;
  payload: GetAllCompaniesPayload;
}

interface UpdateCompanyAction {
  type: typeof UPDATE_COMPANY;
  payload: { id: string; data: UpdateCompanyPayload };
}

interface DeleteCompanyAction {
  type: typeof DELETE_COMPANY;
  payload: string;
}

interface GetCompanyJobsAction {
  type: typeof GET_COMPANY_JOBS;
  payload: string;
}


// Action Creators
export const createCompany = (payload: CreateCompanyPayload): CreateCompanyAction => ({
    type: CREATE_COMPANY,
    payload,
});

export const createCompanySuccess = (company: Company) => ({
    type: CREATE_COMPANY_SUCCESS,
    payload: company,
});

export const createCompanyFailure = (error: { message: string; error_code?: string }) => ({
    type: CREATE_COMPANY_FAILURE,
    payload: error,
});

export const getAllCompanies = (p0: { status: string; }) => ({
    type: GET_ALL_COMPANIES,
    // payload,
});

export const getAllCompaniesSuccess = (response: GetAllCompaniesResponse) => ({
    type: GET_ALL_COMPANIES_SUCCESS,
    payload: response,
});

export const getAllCompaniesFailure = (error: { message: string; error_code?: string }) => ({
    type: GET_ALL_COMPANIES_FAILURE,
    payload: error,
});


export const updateCompany = (id: string, data: UpdateCompanyPayload): UpdateCompanyAction => ({
  type: UPDATE_COMPANY,
  payload: { id, data },
});

export const updateCompanySuccess = (response: UpdateCompanyResponse) => ({
  type: UPDATE_COMPANY_SUCCESS,
  payload: response,
});

export const updateCompanyFailure = (error: { message: string; error_code?: string }) => ({
  type: UPDATE_COMPANY_FAILURE,
  payload: error,
});


export const deleteCompany = (id: string): DeleteCompanyAction => ({
  type: DELETE_COMPANY,
  payload: id,
});

export const deleteCompanySuccess = (id: string) => ({
  type: DELETE_COMPANY_SUCCESS,
  payload: id,
});

export const deleteCompanyFailure = (error: { message: string; error_code?: string }) => ({
  type: DELETE_COMPANY_FAILURE,
  payload: error,
});

export const getCompanyJobsSuccess = (response: GetCompanyJobsResponse) => ({
  type: GET_COMPANY_JOBS_SUCCESS,
  payload: response,
});

export const getCompanyJobsFailure = (error: { message: string; error_code?: string }) => ({
  type: GET_COMPANY_JOBS_FAILURE,
  payload: error,
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
function* createCompanySaga(action: CreateCompanyAction) {
    try {
        yield put(showLoading());
        console.log("createCompanySaga: Calling companyService.createCompany with payload:", action.payload);
        const response: ApiResponse<CreateCompanyResponse> = yield call(
            companyService.createCompany,
            action.payload
        );
        console.log("createCompanySaga: Create company response:", response);
        yield put(createCompanySuccess(response.data.data));
        yield put(
            addMessage({
                text: response.data.message || "Entreprise créée avec succès",
                type: "success",
            })
        );
    } catch (error: unknown) {
        console.error("createCompanySaga: Error creating company:", error);
        const apiError = isApiError(error)
            ? { message: error.message, error_code: error.error_code }
            : { message: "Impossible de créer l'entreprise" };
        yield put(createCompanyFailure(apiError));
        yield put(addMessage({ text: apiError.message, type: "error" }));
    } finally {
        yield put(hideLoading());
        console.log("createCompanySaga: Saga completed.");
    }
}

function* getAllCompaniesSaga(action: GetAllCompaniesAction) {
    try {
        yield put(showLoading());
        console.log("getAllCompaniesSaga: Calling companyService.getAllCompanies with params:", action.payload);
        const response: ApiResponse<GetAllCompaniesResponse> = yield call(
            companyService.getAllCompanies,
            action.payload
        );
        console.log("getAllCompaniesSaga: Get all companies response:", response);
        yield put(
            getAllCompaniesSuccess(response.data)
        );
        yield put(
            addMessage({
                text: response.data.message || "Entreprises chargées avec succès",
                type: "success",
            })
        );
    } catch (error: unknown) {
        console.error("getAllCompaniesSaga: Error fetching companies:", error);
        const apiError = isApiError(error)
            ? { message: error.message, error_code: error.error_code }
            : { message: "Impossible de charger les entreprises" };
        yield put(getAllCompaniesFailure(apiError));
        yield put(addMessage({ text: apiError.message, type: "error" }));
    } finally {
        yield put(hideLoading());
        console.log("getAllCompaniesSaga: Saga completed.");
    }
}

function* updateCompanySaga(action: UpdateCompanyAction) {
    try {
        yield put(showLoading());
        console.log("updateCompanySaga: Calling companyService.updateCompany with id:", action.payload.id, "and payload:", action.payload.data);
        const response: ApiResponse<UpdateCompanyResponse> = yield call(
            companyService.updateCompany,
            action.payload.id,
            action.payload.data
        );
        console.log("updateCompanySaga: Update company response:", response);
        yield put(updateCompanySuccess(response.data));
        yield put(
            addMessage({
                text: response.data.message || "Entreprise mise à jour avec succès",
                type: "success",
            })
        );
    } catch (error: unknown) {
        console.error("updateCompanySaga: Error updating company:", error);
        const apiError = isApiError(error)
            ? { message: error.message, error_code: error.error_code }
            : { message: "Impossible de mettre à jour l'entreprise" };
        yield put(updateCompanyFailure(apiError));
        yield put(addMessage({ text: apiError.message, type: "error" }));
    } finally {
        yield put(hideLoading());
        console.log("updateCompanySaga: Saga completed.");
    }
}

function* deleteCompanySaga(action: DeleteCompanyAction) {
    try {
        yield put(showLoading());
        console.log("deleteCompanySaga: Calling companyService.deleteCompany with id:", action.payload);
        const response: ApiResponse<DeleteCompanyResponse> = yield call(companyService.deleteCompany, action.payload);
        console.log("deleteCompanySaga: Delete company response:", response);
        yield put(deleteCompanySuccess(action.payload));
        yield put(
            addMessage({
                text: response.data.message || "Entreprise supprimée avec succès",
                type: "success",
            })
        );
    } catch (error: unknown) {
        console.error("deleteCompanySaga: Error deleting company:", error);
        const apiError = isApiError(error)
            ? { message: error.message, error_code: error.error_code }
            : { message: "Impossible de supprimer l'entreprise" };
        yield put(deleteCompanyFailure(apiError));
        yield put(addMessage({ text: apiError.message, type: "error" }));
    } finally {
        yield put(hideLoading());
        console.log("deleteCompanySaga: Saga completed.");
    }
}

function* getCompanyJobsSaga(action: GetCompanyJobsAction) {
    try {
        yield put(showLoading());
        console.log("getCompanyJobsSaga: Calling companyService.getCompanyJobs with companyId:", action.payload);
        const response: ApiResponse<GetCompanyJobsResponse> = yield call(companyService.getCompanyJobs, action.payload);
        console.log("getCompanyJobsSaga: Get company jobs response:", response);
        yield put(
            getCompanyJobsSuccess(
                 response.data,
            )
        );
        yield put(
            addMessage({
                text: response.data.message || "Offres de l'entreprise chargées avec succès",
                type: "success",
            })
        );
    } catch (error: unknown) {
        console.error("getCompanyJobsSaga: Error fetching company jobs:", error);
        const apiError = isApiError(error)
            ? { message: error.message, error_code: error.error_code }
            : { message: "Impossible de charger les offres de l'entreprise" };
        yield put(getCompanyJobsFailure(apiError));
        yield put(addMessage({ text: apiError.message, type: "error" }));
    } finally {
        yield put(hideLoading());
        console.log("getCompanyJobsSaga: Saga completed.");
    }
}



export function* companySaga() {
    console.log("companySaga: Initializing saga listeners");
    yield takeLatest(CREATE_COMPANY, createCompanySaga);
    yield takeLatest(GET_ALL_COMPANIES, getAllCompaniesSaga);
    yield takeLatest(UPDATE_COMPANY, updateCompanySaga);
    yield takeLatest(DELETE_COMPANY, deleteCompanySaga);
    yield takeLatest(GET_COMPANY_JOBS, getCompanyJobsSaga);
}