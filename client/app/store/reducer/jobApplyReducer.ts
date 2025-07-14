import type { JobApplication } from "~/services/types/jobApply.types";

// Action types
export const CREATE_JOBAPPLICATION_SUCCESS = "CREATE_JOBAPPLICATION_SUCCESS";
export const CREATE_JOBAPPLICATION_FAILURE = "CREATE_JOBAPPLICATION_FAILURE";
export const GET_ALL_JOBAPPLICATIONS_SUCCESS = "GET_ALL_JOBAPPLICATIONS_SUCCESS";
export const GET_ALL_JOBAPPLICATIONS_FAILURE = "GET_ALL_JOBAPPLICATIONS_FAILURE";

// State interface
interface JobApplicationState {
    jobApplications: JobApplication[];
    error: { message: string; error_code?: string } | null;
    loading: boolean;
}
const initialState: JobApplicationState = {
    jobApplications: [],
    error: null,
    loading: false
};


// Action interfaces
type JobApplicationAction =
    | { type: typeof CREATE_JOBAPPLICATION_SUCCESS; payload: JobApplication }
    | { type: typeof CREATE_JOBAPPLICATION_FAILURE; payload: { message: string; error_code?: string } }
    | { type: typeof GET_ALL_JOBAPPLICATIONS_SUCCESS; payload: JobApplication[] }
    | { type: typeof GET_ALL_JOBAPPLICATIONS_FAILURE; payload: { message: string; error_code?: string } };


// Reducer function
const jobApplyReducer = (
    state = initialState,
    action: JobApplicationAction
): JobApplicationState => {
    switch (action.type) {
        case CREATE_JOBAPPLICATION_SUCCESS:
            console.log(
                "jobApplicationReducer: CREATE_JOBAPPLICATION_SUCCESS with payload:",
                action.payload
            );
            return {
                ...state,
                jobApplications: [...state.jobApplications, action.payload],
                error: null,
                loading: false
            };
        case CREATE_JOBAPPLICATION_FAILURE:
            console.log(
                "jobApplicationReducer: CREATE_JOBAPPLICATION_FAILURE with payload:",
                action.payload
            );
            return {
                ...state,
                error: action.payload,
                loading: false
            };
        case GET_ALL_JOBAPPLICATIONS_SUCCESS:
            console.log(
                "jobApplicationReducer: GET_ALL_JOBAPPLICATIONS_SUCCESS with payload:",
                action.payload
            );
            return {
                ...state,
                jobApplications: action.payload,
                error: null,
                loading: false
            };
        case GET_ALL_JOBAPPLICATIONS_FAILURE:
            console.log(
                "jobApplicationReducer: GET_ALL_JOBAPPLICATIONS_FAILURE with payload:",
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
}

export default jobApplyReducer;