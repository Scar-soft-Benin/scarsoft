import type { StatisticsResponse } from "~/services/types/statistics.types";

export const GET_JOB_STATISTICS_SUCCESS = "GET_JOB_STATISTICS_SUCCESS";
export const GET_JOB_STATISTICS_FAILURE = "GET_JOB_STATISTICS_FAILURE";
export const GET_JOB_APPLY_STATISTICS_SUCCESS = "GET_JOB_APPLY_STATISTICS_SUCCESS";
export const GET_JOB_APPLY_STATISTICS_FAILURE = "GET_JOB_APPLY_STATISTICS_FAILURE";
export const GET_COMPANY_STATISTICS_SUCCESS = "GET_COMPANY_STATISTICS_SUCCESS";
export const GET_COMPANY_STATISTICS_FAILURE = "GET_COMPANY_STATISTICS_FAILURE";

interface StatisticsState {
  job: {
    statistics: StatisticsResponse | null;
    error: { message: string; error_code?: string } | null;
  };
  jobApply: {
    statistics: StatisticsResponse | null;
    error: { message: string; error_code?: string } | null;
  };
  company: {
    statistics: StatisticsResponse | null;
    error: { message: string; error_code?: string } | null;
  };
}

const initialState: StatisticsState = {
  job: { statistics: null, error: null },
  jobApply: { statistics: null, error: null },
  company: { statistics: null, error: null },
};

export default function statisticsReducer(state = initialState, action: any): StatisticsState {
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
    default:
      return state;
  }
}