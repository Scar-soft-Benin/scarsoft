// store/reducer/jobReducer.ts

import type { Job, CreateJobResponse, GetAllJobsResponse, GetAllJobsByCompanyIdResponse } from "../../services/types/job.types";

// Action Types
export const CREATE_JOB_SUCCESS = "CREATE_JOB_SUCCESS";
export const CREATE_JOB_FAILURE = "CREATE_JOB_FAILURE";
export const GET_ALL_JOBS_SUCCESS = "GET_ALL_JOBS_SUCCESS";
export const GET_ALL_JOBS_FAILURE = "GET_ALL_JOBS_FAILURE";
export const GET_ALL_JOBS_FOR_ADMIN_SUCCESS = "GET_ALL_JOBS_FOR_ADMIN_SUCCESS";
export const GET_ALL_JOBS_FOR_ADMIN_FAILURE = "GET_ALL_JOBS_FOR_ADMIN_FAILURE";
export const GET_ALL_JOBS_BY_COMPANY_ID_SUCCESS = "GET_ALL_JOBS_BY_COMPANY_ID_SUCCESS";
export const GET_ALL_JOBS_BY_COMPANY_ID_FAILURE = "GET_ALL_JOBS_BY_COMPANY_ID_FAILURE";
export const GET_JOB_BY_ID_SUCCESS = "GET_JOB_BY_ID_SUCCESS";
export const GET_JOB_BY_ID_FAILURE = "GET_JOB_BY_ID_FAILURE";
export const SET_SINGLE_JOB_SUCCESS = "SET_SINGLE_JOB_SUCCESS";
export const SET_SINGLE_JOB_FAILURE = "SET_SINGLE_JOB_FAILURE";
export const UPDATE_JOB_SUCCESS = "UPDATE_JOB_SUCCESS";
export const UPDATE_JOB_FAILURE = "UPDATE_JOB_FAILURE";
export const DELETE_JOB_SUCCESS = "DELETE_JOB_SUCCESS";
export const DELETE_JOB_FAILURE = "DELETE_JOB_FAILURE";



interface JobState {
    jobs: Job[];
    singleJob: Job | null;
    error: { message: string; error_code?: string } | null;
    loading: boolean;
}

const initialState: JobState = {
    jobs: [],
    singleJob: null,
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
    }
    | { type: typeof GET_ALL_JOBS_FOR_ADMIN_SUCCESS; payload: GetAllJobsResponse }
    | {
        type: typeof GET_ALL_JOBS_FOR_ADMIN_FAILURE;
        payload: { message: string; error_code?: string };
    }
    | { type: typeof GET_ALL_JOBS_BY_COMPANY_ID_SUCCESS; payload: GetAllJobsByCompanyIdResponse }
    | {
        type: typeof GET_ALL_JOBS_BY_COMPANY_ID_FAILURE;
        payload: { message: string; error_code?: string };
    }
    | { type: typeof GET_JOB_BY_ID_SUCCESS; payload: Job }
    | { 
        type: typeof GET_JOB_BY_ID_FAILURE; payload: { message: string; error_code?: string } 
    }
    | { type: typeof SET_SINGLE_JOB_SUCCESS; payload: Job }
    | {
        type: typeof SET_SINGLE_JOB_FAILURE;
        payload: { message: string; error_code?: string }
    }
    | { type: typeof UPDATE_JOB_SUCCESS; payload: Job }
    | {
        type: typeof UPDATE_JOB_FAILURE;
        payload: { message: string; error_code?: string }
    }
    | { type: typeof DELETE_JOB_SUCCESS; payload: { jobId: number } }
    | { 
        type: typeof DELETE_JOB_FAILURE; 
        payload: { message: string; error_code?: string } 
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

        case GET_ALL_JOBS_FOR_ADMIN_SUCCESS:
            console.log(
                "jobReducer: GET_ALL_JOBS_FOR_ADMIN_SUCCESS with payload:", 
                action.payload
            );
            return {
                ...state,
                jobs: action.payload.data,
                error: null,
                loading: false
            };
        case GET_ALL_JOBS_FOR_ADMIN_FAILURE:
            console.log(
                "jobReducer: GET_ALL_JOBS_FOR_ADMIN_FAILURE with payload:",
                action.payload  
            );
            return {
                ...state,   
                error: action.payload,
                loading: false
            };
        case GET_ALL_JOBS_BY_COMPANY_ID_SUCCESS:
            console.log(
                "jobReducer: GET_ALL_JOBS_BY_COMPANY_ID_SUCCESS with payload:",
                action.payload
            );
            return {
                ...state,
                jobs: action.payload.data,
                error: null,
                loading: false
            };
        case GET_ALL_JOBS_BY_COMPANY_ID_FAILURE:
            console.log(
                "jobReducer: GET_ALL_JOBS_BY_COMPANY_ID_FAILURE with payload:",
                action.payload
            );
            return {
                ...state,
                error: action.payload,
                loading: false
            };
        case GET_JOB_BY_ID_SUCCESS:
            console.log(
                "jobReducer: GET_JOB_BY_ID_SUCCESS with payload:",
                action.payload
            );
            return {
                ...state,
                singleJob: action.payload,
                error: null,
                loading: false
            };
        case GET_JOB_BY_ID_FAILURE:
            console.log(
                "jobReducer: GET_JOB_BY_ID_FAILURE with payload:",
                action.payload
            );
            return {
                ...state,
                error: action.payload,
                loading: false
            };

        case SET_SINGLE_JOB_SUCCESS:
            console.log(
                "jobReducer: SET_SINGLE_JOB with payload:",
                action.payload
            );
            return {
                ...state,
                singleJob: action.payload,
                error: null,
                loading: false
            };
        case SET_SINGLE_JOB_FAILURE:
            console.log(
                "jobReducer: SET_SINGLE_JOB_FAILURE with payload:",
                action.payload
            );
            return {
                ...state,
                error: action.payload,
                loading: false
            };
        case UPDATE_JOB_SUCCESS:
            console.log(
                "jobReducer: UPDATE_JOB_SUCCESS with payload:",
                action.payload
            );
            return {
                ...state,
                jobs: state.jobs.map(job =>
                    job.id === action.payload.id ? action.payload : job
                ),
                error: null,
                loading: false
            };
        case UPDATE_JOB_FAILURE:
            console.log(
                "jobReducer: UPDATE_JOB_FAILURE with payload:",
                action.payload
            );
            return {
                ...state,
                error: action.payload,
                loading: false
            };
        case DELETE_JOB_SUCCESS:
            console.log(
                "jobReducer: DELETE_JOB_SUCCESS with payload:",
                action.payload
            );
            return {
                ...state,
                jobs: state.jobs.filter(job => job.id !== action.payload.jobId),
                error: null,
                loading: false
            };
        case DELETE_JOB_FAILURE:
            console.log(
                "jobReducer: DELETE_JOB_FAILURE with payload:",
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
