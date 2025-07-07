import { createAction } from "@reduxjs/toolkit";

// Action Types
export const SHOW_LOADING = "SHOW_LOADING";
export const HIDE_LOADING = "HIDE_LOADING";

// Action Creators
export const showLoading = createAction<void>(SHOW_LOADING);
export const hideLoading = createAction<void>(HIDE_LOADING);

interface LoadingState {
    isLoading: boolean;
}

const initialState: LoadingState = {
    isLoading: false
};

type LoadingAction = ReturnType<typeof showLoading | typeof hideLoading>;

const loadingReducer = (
    state = initialState,
    action: LoadingAction
): LoadingState => {
    switch (action.type) {
        case SHOW_LOADING:
            return { ...state, isLoading: true };
        case HIDE_LOADING:
            return { ...state, isLoading: false };
        default:
            return state;
    }
};

export default loadingReducer;
