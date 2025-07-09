// ~/store/saga/companySaga.ts
import { takeLatest, put, call } from "redux-saga/effects";
import type {
    Company,
    CreateCompanyPayload,
    CreateCompanyResponse,
    GetAllCompaniesPayload,
    ApiResponse
} from "~/services/types/company.types";
import { companyService } from "~/services/api/companyService";
import {
    createCompanySuccess,
    createCompanyFailure,
    getAllCompaniesSuccess,
    getAllCompaniesFailure,
    CREATE_COMPANY,
    GET_ALL_COMPANIES
} from "../reducer/companyReducer";
import { hideLoading, showLoading } from "../reducer/loadingReducer";
import { addMessage } from "../reducer/messageReducer";
import type { ApiError } from "~/services/types/common.types";

// Error Type Guard
function isApiError(error: unknown): error is ApiError {
    return (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        "status" in error
    );
}

function* createCompanySaga(action: {
    type: string;
    payload: CreateCompanyPayload;
}) {
    console.log(
        "createCompanySaga: Starting createCompanySaga with action:",
        action
    );
    try {
        yield put(showLoading());
        console.log(
            "createCompanySaga: Testing companyService import:",
            companyService
        );
        console.log(
            "createCompanySaga: Calling companyService.createCompany with payload:",
            action.payload
        );
        const response: ApiResponse<CreateCompanyResponse> = yield call(
            companyService.createCompany,
            action.payload
        );
        console.log("createCompanySaga: Received response:", response);
        yield put(createCompanySuccess(response.data.data)); // Pass Company object
        console.log(
            "createCompanySaga: Dispatched createCompanySuccess with company:",
            response.data.data
        );
        yield put(
            addMessage({
                text: response.data.message || "Entreprise créée avec succès",
                type: "success"
            })
        );
    } catch (error: unknown) {
        console.error("createCompanySaga: Error occurred:", error);
        const apiError = isApiError(error)
            ? { message: error.message, error_code: error.error_code }
            : { message: "Impossible de créer l'entreprise" };
        console.log("createJobSaga: Processed create job error:", apiError);
        console.log(
            "createCompanySaga: Dispatching createCompanyFailure with error:",
            apiError
        );
        yield put(createCompanyFailure(apiError));
        yield put(addMessage({ text: apiError.message, type: "error" }));
    } finally {
        console.log("createCompanySaga: Hiding loading");
        yield put(hideLoading());
    }
}

function* getAllCompaniesSaga(action: {
    type: string;
    payload: GetAllCompaniesPayload;
}) {
    console.log(
        "getAllCompaniesSaga: Starting getAllCompaniesSaga with params:",
        action.payload
    );
    try {
        yield put(showLoading());
        console.log(
            "getAllCompaniesSaga: Testing companyService import:",
            companyService
        );
        console.log(
            "getAllCompaniesSaga: Calling companyService.getAllCompanies with params:",
            action.payload
        );
        const response: ApiResponse<Company[]> = yield call(
            companyService.getAllCompanies,
            action.payload
        );
        console.log("getAllCompaniesSaga: Received response:", response);
        yield put(
            getAllCompaniesSuccess({
                companies: response.data,
                meta: response.meta!
            })
        );
        console.log(
            "getAllCompaniesSaga: Dispatched getAllCompaniesSuccess with data:",
            response.data,
            "meta:",
            response.meta
        );
    } catch (error: unknown) {
        console.error("getAllCompaniesSaga: Error occurred:", error);
        const apiError = isApiError(error)
            ? { message: error.message, error_code: error.error_code }
            : { message: "Impossible de charger les entreprises" };
        console.log("getAllJobsSaga: Processed get all jobs error:", apiError);
        console.log(
            "getAllCompaniesSaga: Dispatching getAllCompaniesFailure with error:",
            apiError
        );
        yield put(getAllCompaniesFailure(apiError));
        yield put(addMessage({ text: apiError.message, type: "error" }));
    } finally {
        console.log("getAllCompaniesSaga: Hiding loading");
        yield put(hideLoading());
    }
}

export function* companySaga() {
    console.log("companySaga: Initializing saga listeners");
    yield takeLatest(CREATE_COMPANY, createCompanySaga);
    yield takeLatest(GET_ALL_COMPANIES, getAllCompaniesSaga);
}
