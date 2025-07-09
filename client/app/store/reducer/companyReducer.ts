// ~/store/reducer/companyReducer.ts
import type {
    Company,
    CompanyAction,
    CreateCompanyPayload,
    Meta
} from "~/services/types/company.types";

export const CREATE_COMPANY = "CREATE_COMPANY";
export const CREATE_COMPANY_SUCCESS = "CREATE_COMPANY_SUCCESS";
export const CREATE_COMPANY_FAILURE = "CREATE_COMPANY_FAILURE";
export const GET_ALL_COMPANIES = "GET_ALL_COMPANIES";
export const GET_ALL_COMPANIES_SUCCESS = "GET_ALL_COMPANIES_SUCCESS";
export const GET_ALL_COMPANIES_FAILURE = "GET_ALL_COMPANIES_FAILURE";
export const CLEAR_ERROR = "CLEAR_ERROR";

interface CompanyState {
    companies: Company[];
    loading: boolean;
    error: string | null;
    meta: Meta | null;
}

const initialState: CompanyState = {
    companies: [],
    loading: false,
    error: null,
    meta: null
};

export const createCompany = (payload: CreateCompanyPayload) => ({
    type: CREATE_COMPANY,
    payload
});

export const createCompanySuccess = (company: Company) => ({
    type: CREATE_COMPANY_SUCCESS,
    payload: company
});

export const createCompanyFailure = (error: { message: string }) => ({
    type: CREATE_COMPANY_FAILURE,
    payload: error
});

export const getAllCompanies = (payload: {
    search?: string;
    status: "active" | "inactive";
    page?: number;
    per_page?: number;
}) => ({
    type: GET_ALL_COMPANIES,
    payload
});

export const getAllCompaniesSuccess = (payload: {
    companies: Company[];
    meta: Meta;
}) => ({
    type: GET_ALL_COMPANIES_SUCCESS,
    payload
});

export const getAllCompaniesFailure = (error: { message: string }) => ({
    type: GET_ALL_COMPANIES_FAILURE,
    payload: error
});

export const clearError = () => ({
    type: CLEAR_ERROR
});

export default function companyReducer(
    state = initialState,
    action: CompanyAction
): CompanyState {
    console.log("companyReducer: Received action:", action);
    switch (action.type) {
        case CREATE_COMPANY:
        case GET_ALL_COMPANIES:
            console.log("companyReducer: Setting loading to true");
            return { ...state, loading: true, error: null };
        case CREATE_COMPANY_SUCCESS:
            console.log("companyReducer: Adding new company:", action.payload);
            return {
                ...state,
                companies: [...state.companies, action.payload as Company],
                loading: false,
                error: null
            };
        case GET_ALL_COMPANIES_SUCCESS:
            console.log(
                "companyReducer: Updating companies list:",
                action.payload
            );
            return {
                ...state,
                companies: (
                    action.payload as { companies: Company[]; meta: Meta }
                ).companies,
                meta: (action.payload as { companies: Company[]; meta: Meta })
                    .meta,
                loading: false,
                error: null
            };
        case CREATE_COMPANY_FAILURE:
        case GET_ALL_COMPANIES_FAILURE:
            console.log("companyReducer: Setting error:", action.payload);
            return {
                ...state,
                loading: false,
                error: (action.payload as { message: string }).message
            };
        case CLEAR_ERROR:
            console.log("companyReducer: Clearing error");
            return { ...state, error: null };
        default:
            return state;
    }
}
