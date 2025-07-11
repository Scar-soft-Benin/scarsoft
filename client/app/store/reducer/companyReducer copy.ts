// ~/store/reducer/companyReducer.ts
import type { Company, Meta } from "~/services/types/company.types";
import {
  CREATE_COMPANY,
  CREATE_COMPANY_SUCCESS,
  CREATE_COMPANY_FAILURE,
  GET_ALL_COMPANIES,
  GET_ALL_COMPANIES_SUCCESS,
  GET_ALL_COMPANIES_FAILURE,
} from "../sagas/companySaga";

// Action Types
// (Définis dans companySaga.ts pour éviter la duplication)

interface CompanyState {
  companies: Company[];
  loading: boolean;
  error: { message: string; error_code?: string } | null;
  meta: Meta | null;
}

const initialState: CompanyState = {
  companies: [],
  loading: false,
  error: null,
  meta: null,
};

type CompanyAction =
  | { type: typeof CREATE_COMPANY }
  | { type: typeof CREATE_COMPANY_SUCCESS; payload: Company }
  | { type: typeof CREATE_COMPANY_FAILURE; payload: { message: string; error_code?: string } }
  | { type: typeof GET_ALL_COMPANIES }
  | { type: typeof GET_ALL_COMPANIES_SUCCESS; payload: { companies: Company[]; meta: Meta } }
  | { type: typeof GET_ALL_COMPANIES_FAILURE; payload: { message: string; error_code?: string } };

const companyReducer = (state = initialState, action: CompanyAction): CompanyState => {
  switch (action.type) {
    case CREATE_COMPANY:
    case GET_ALL_COMPANIES:
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
        companies: action.payload.companies,
        meta: action.payload.meta,
        loading: false,
        error: null,
      };
    case GET_ALL_COMPANIES_FAILURE:
      console.log("companyReducer: GET_ALL_COMPANIES_FAILURE with payload:", action.payload);
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default companyReducer;