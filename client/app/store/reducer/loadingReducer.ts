export const SHOW_LOADING = "SHOW_LOADING";
export const HIDE_LOADING = "HIDE_LOADING";

interface LoadingState {
    isLoading: boolean;
}

const initialState: LoadingState = {
    isLoading: false
};

type LoadingAction =
    | { type: typeof SHOW_LOADING }
    | { type: typeof HIDE_LOADING };

const loadingReducer = (
    state = initialState,
    action: LoadingAction
): LoadingState => {
    switch (action.type) {
        case SHOW_LOADING:
            console.log("loadingReducer: SHOW_LOADING");
            return { ...state, isLoading: true };
        case HIDE_LOADING:
            console.log("loadingReducer: HIDE_LOADING");
            return { ...state, isLoading: false };
        default:
            return state;
    }
};

export const showLoading = () => ({ type: SHOW_LOADING });
export const hideLoading = () => ({ type: HIDE_LOADING });

export default loadingReducer;
