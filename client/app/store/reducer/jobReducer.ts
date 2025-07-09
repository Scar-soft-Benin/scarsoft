// store/reducer/jobReducer.ts

import type { Job, CreateJobResponse, GetAllJobsResponse } from "../../services/types/job.types";

// Action Types
export const CREATE_JOB_SUCCESS = "CREATE_JOB_SUCCESS";
export const CREATE_JOB_FAILURE = "CREATE_JOB_FAILURE";
export const GET_ALL_JOBS_SUCCESS = "GET_ALL_JOBS_SUCCESS";
export const GET_ALL_JOBS_FAILURE = "GET_ALL_JOBS_FAILURE";

interface JobState {
    jobs: Job[];
    error: { message: string; error_code?: string } | null;
    loading: boolean;
}

const initialState: JobState = {
    jobs: [],
    error: null,
    loading: false
};

type JobAction =
    | { type: typeof CREATE_JOB_SUCCESS; payload: CreateJobResponse }
    | {
          type: typeof CREATE_JOB_FAILURE;
          payload: { message: string; error_code?: string };
      }
    | { type: typeof GET_ALL_JOBS_SUCCESS; payload: GetAllJobsResponse }
    | {
          type: typeof GET_ALL_JOBS_FAILURE;
          payload: { message: string; error_code?: string };
      };

const jobReducer = (state = initialState, action: JobAction): JobState => {
    switch (action.type) {
        case CREATE_JOB_SUCCESS:
            console.log(
                "jobReducer: CREATE_JOB_SUCCESS with payload:",
                action.payload
            );
            return {
                ...state,
                jobs: [...state.jobs, action.payload.data],
                error: null,
                loading: false
            };
        case CREATE_JOB_FAILURE:
            console.log(
                "jobReducer: CREATE_JOB_FAILURE with payload:",
                action.payload
            );
            return {
                ...state,
                error: action.payload,
                loading: false
            };
        case GET_ALL_JOBS_SUCCESS:
            console.log(
                "jobReducer: GET_ALL_JOBS_SUCCESS with payload:",
                action.payload
            );
            return {
                ...state,
                jobs: action.payload.data,
                error: null,
                loading: false
            };
        case GET_ALL_JOBS_FAILURE:
            console.log(
                "jobReducer: GET_ALL_JOBS_FAILURE with payload:",
                action.payload
            );
            return {
                ...state,
                error: action.payload,
                loading: false
            };
        default:
            return state;
    }
};

export default jobReducer;
