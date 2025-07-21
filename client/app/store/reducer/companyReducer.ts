import type { Company, Meta } from "~/services/types/company.types";
import type { Job } from "~/services/types/job.types";
import type { GetAllCompaniesResponse } from "~/services/types/company.types";
import {
  CREATE_COMPANY,
  CREATE_COMPANY_SUCCESS,
  CREATE_COMPANY_FAILURE,
  GET_ALL_COMPANIES,
  GET_ALL_COMPANIES_SUCCESS,
  GET_ALL_COMPANIES_FAILURE,
  UPDATE_COMPANY,
  UPDATE_COMPANY_SUCCESS,
  UPDATE_COMPANY_FAILURE,
  DELETE_COMPANY,
  DELETE_COMPANY_SUCCESS,
  DELETE_COMPANY_FAILURE,
  GET_COMPANY_JOBS,
  GET_COMPANY_JOBS_SUCCESS,
  GET_COMPANY_JOBS_FAILURE,
  GET_COMPANY_DETAILS,
  GET_COMPANY_DETAILS_SUCCESS,
  GET_COMPANY_DETAILS_FAILURE,
  CLEAR_ERROR,
} from "../sagas/companySaga";

interface CompanyState {
  companies: Company[];
  companyJobs: { [companyId: string]: Job[] };
  loading: boolean;
  error: { message: string; error_code?: string } | null;
  meta: Meta | null;
}

const initialState: CompanyState = {
  companies: [],
  companyJobs: {},
  loading: false,
  error: null,
  meta: null,
};

type CompanyAction =
  | { type: typeof CREATE_COMPANY }
  | { type: typeof CREATE_COMPANY_SUCCESS; payload: Company }
  | { type: typeof CREATE_COMPANY_FAILURE; payload: { message: string; error_code?: string } }
  | { type: typeof GET_ALL_COMPANIES }
  | { type: typeof GET_ALL_COMPANIES_SUCCESS; payload: GetAllCompaniesResponse }
  | { type: typeof GET_ALL_COMPANIES_FAILURE; payload: { message: string; error_code?: string } }
  | { type: typeof UPDATE_COMPANY }
  | { type: typeof UPDATE_COMPANY_SUCCESS; payload: Company }
  | { type: typeof UPDATE_COMPANY_FAILURE; payload: { message: string; error_code?: string } }
  | { type: typeof DELETE_COMPANY }
  | { type: typeof DELETE_COMPANY_SUCCESS; payload: string }
  | { type: typeof DELETE_COMPANY_FAILURE; payload: { message: string; error_code?: string } }
  | { type: typeof GET_COMPANY_JOBS }
  | { type: typeof GET_COMPANY_JOBS_SUCCESS; payload: { companyId: string; jobs: Job[] } }
  | { type: typeof GET_COMPANY_JOBS_FAILURE; payload: { message: string; error_code?: string } }
  | { type: typeof GET_COMPANY_DETAILS }
  | { type: typeof GET_COMPANY_DETAILS_SUCCESS; payload: Company }
  | { type: typeof GET_COMPANY_DETAILS_FAILURE; payload: { message: string; error_code?: string } }
  | { type: typeof CLEAR_ERROR };

const companyReducer = (state = initialState, action: CompanyAction): CompanyState => {
  switch (action.type) {
    case CREATE_COMPANY:
    case GET_ALL_COMPANIES:
    case UPDATE_COMPANY:
    case DELETE_COMPANY:
    case GET_COMPANY_JOBS:
      console.log(`companyReducer: ${action.type} - Setting loading to true`);
      return {
        ...state,
        loading: true,
        error: null,
      };
    case CREATE_COMPANY_SUCCESS:
      console.log("companyReducer: CREATE_COMPANY_SUCCESS with payload:", action.payload);
      return {
        ...state,
        companies: [...state.companies, action.payload],
        loading: false,
        error: null,
      };
    case CREATE_COMPANY_FAILURE:
      console.log("companyReducer: CREATE_COMPANY_FAILURE with payload:", action.payload);
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case GET_ALL_COMPANIES_SUCCESS:
      console.log("companyReducer: GET_ALL_COMPANIES_SUCCESS with payload:", action.payload);
      return {
        ...state,
        companies: action.payload.data || [],
        meta: action.payload.meta || null,
        loading: false,
        error: null,
      };
    case GET_ALL_COMPANIES_FAILURE:
      console.log("companyReducer: GET_ALL_COMPANIES_FAILURE with payload:", action.payload);
      return {
        ...state,
        loading: false,
        error: action.payload,
        companies: [],
      };
    case GET_COMPANY_DETAILS_SUCCESS:
      console.log("companyReducer: GET_COMPANY_DETAILS_SUCCESS with payload:", action.payload);
      return {
        ...state,
        companies: state.companies.map((company) =>
          company.id === action.payload.id ? action.payload : company
        ),
        loading: false,
        error: null,
      };
    case GET_COMPANY_DETAILS_FAILURE:
      console.log("companyReducer: GET_COMPANY_DETAILS_FAILURE with payload:", action.payload);
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPDATE_COMPANY_SUCCESS:
      console.log("companyReducer: UPDATE_COMPANY_SUCCESS with payload:", action.payload);
      return {
        ...state,
        companies: state.companies.map((company) =>
          company.id === action.payload.id ? action.payload : company
        ),
        loading: false,
        error: null,
      };
    case UPDATE_COMPANY_FAILURE:
      console.log("companyReducer: UPDATE_COMPANY_FAILURE with payload:", action.payload);
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_COMPANY_SUCCESS:
      console.log("companyReducer: DELETE_COMPANY_SUCCESS with payload:", action.payload);
      return {
        ...state,
        companies: state.companies.filter((company) => company.id.toString() !== action.payload),
        companyJobs: { ...state.companyJobs, [action.payload]: [] },
        loading: false,
        error: null,
      };
    case DELETE_COMPANY_FAILURE:
      console.log("companyReducer: DELETE_COMPANY_FAILURE with payload:", action.payload);
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case GET_COMPANY_JOBS_SUCCESS:
      console.log("companyReducer: GET_COMPANY_JOBS_SUCCESS with payload:", action.payload);
      return {
        ...state,
        companyJobs: {
          ...state.companyJobs,
          [action.payload.companyId]: action.payload.jobs,
        },
        loading: false,
        error: null,
      };
    case GET_COMPANY_JOBS_FAILURE:
      console.log("companyReducer: GET_COMPANY_JOBS_FAILURE with payload:", action.payload);
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERROR:
      console.log("companyReducer: Clearing error");
      return { ...state, error: null };
    default:
      return state;
  }
};

export default companyReducer;