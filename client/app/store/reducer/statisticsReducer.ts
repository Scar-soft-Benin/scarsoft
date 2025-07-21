import type { ContactStatistics } from "~/services/types/contact.types";
import type { CompaniesStatisticsResponse, ContactStatisticsResponse, JobApplyStatisticsResponse, JobsStatisticsResponse } from "~/services/types/statistics.types";

export const GET_JOB_STATISTICS_SUCCESS = "GET_JOB_STATISTICS_SUCCESS";
export const GET_JOB_STATISTICS_FAILURE = "GET_JOB_STATISTICS_FAILURE";
export const GET_JOB_APPLY_STATISTICS_SUCCESS = "GET_JOB_APPLY_STATISTICS_SUCCESS";
export const GET_JOB_APPLY_STATISTICS_FAILURE = "GET_JOB_APPLY_STATISTICS_FAILURE";
export const GET_COMPANY_STATISTICS_SUCCESS = "GET_COMPANY_STATISTICS_SUCCESS";
export const GET_COMPANY_STATISTICS_FAILURE = "GET_COMPANY_STATISTICS_FAILURE";
export const GET_CONTACT_STATISTICS_SUCCESS = "GET_CONTACT_STATISTICS_SUCCESS";
export const GET_CONTACT_STATISTICS_FAILURE = "GET_CONTACT_STATISTICS_FAILURE";

interface StatisticsState {
  job: {
    statistics: JobsStatisticsResponse | null;
    error: { message: string; error_code?: string } | null;

  };
  jobApply: {
    statistics: JobApplyStatisticsResponse | null;
    error: { message: string; error_code?: string } | null;
  };
  company: {
    statistics: CompaniesStatisticsResponse | null;
    error: { message: string; error_code?: string } | null;
  };
  contact: {
    statistics: ContactStatistics | null;
    error: { message: string; error_code?: string } | null;
    loading: boolean;
  };
}

const initialState: StatisticsState = {
  job: { statistics: null, error: null },
  jobApply: { statistics: null, error: null },
  company: { statistics: null, error: null },
  contact: { statistics: null, error: null ,loading: false},
};

type StatisticsAction =
  | {
    type: typeof GET_COMPANY_STATISTICS_SUCCESS;
    payload: CompaniesStatisticsResponse
  }
  | {
    type: typeof GET_COMPANY_STATISTICS_FAILURE;
    payload: { message: string; error_code?: string };
  }
  | {
    type: typeof GET_JOB_STATISTICS_SUCCESS;
    payload: JobsStatisticsResponse
  }
  | {
    type: typeof GET_JOB_STATISTICS_FAILURE;
    payload: { message: string; error_code?: string };
  }
  | {
    type: typeof GET_JOB_APPLY_STATISTICS_SUCCESS;
    payload: JobApplyStatisticsResponse
  }
  | {
    type: typeof GET_JOB_APPLY_STATISTICS_FAILURE;
    payload: { message: string; error_code?: string };
  }
  | {
    type: typeof GET_CONTACT_STATISTICS_SUCCESS;
    payload: ContactStatisticsResponse;
  }
  | {
    type: typeof GET_CONTACT_STATISTICS_FAILURE;
    payload: { message: string; error_code?: string };
  };

const statisticsReducer = (state = initialState, action: StatisticsAction): StatisticsState => {
  switch (action.type) {
    case GET_JOB_STATISTICS_SUCCESS:
      return {
        ...state,
        job: { statistics: action.payload, error: null },
      };
    case GET_JOB_STATISTICS_FAILURE:
      return {
        ...state,
        job: { ...state.job, error: action.payload },
      };
    case GET_JOB_APPLY_STATISTICS_SUCCESS:
      return {
        ...state,
        jobApply: { statistics: action.payload, error: null },
      };
    case GET_JOB_APPLY_STATISTICS_FAILURE:
      return {
        ...state,
        jobApply: { ...state.jobApply, error: action.payload },
      };
    case GET_COMPANY_STATISTICS_SUCCESS:
      return {
        ...state,
        company: { statistics: action.payload, error: null },
      };
    case GET_COMPANY_STATISTICS_FAILURE:
      return {
        ...state,
        company: { ...state.company, error: action.payload },
      };
    case GET_CONTACT_STATISTICS_SUCCESS:
      console.log(
        "contactReducer: GET_CONTACT_STATISTICS_SUCCESS with payload:",
        action.payload
      );
      return {
        ...state,
        contact: {statistics: action.payload,
        loading: false,
        error: null}
      };
    case GET_CONTACT_STATISTICS_FAILURE:
      console.log(
        "contactReducer: GET_CONTACT_STATISTICS_FAILURE with payload:",
        action.payload
      );
      return {
        ...state,
        contact: {
          ...state.contact, error: action.payload,
          loading: false
        }
      };
    default:
      return state;
  }
}

export default statisticsReducer