import { createContext, useContext, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import {
    showLoading as showLoadingAction,
    hideLoading as hideLoadingAction
} from "~/store/reducer/loadingReducer";

interface LoadingContextType {
    isLoading: boolean;
    showLoading: () => void;
    hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({
    children
}) => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const showLoading = useCallback(() => {
        console.log("LoadingProvider: Showing loading");
        setIsLoading(true);
        dispatch(showLoadingAction());
    }, [dispatch]);

    const hideLoading = useCallback(() => {
        console.log("LoadingProvider: Hiding loading");
        setIsLoading(false);
        dispatch(hideLoadingAction());
    }, [dispatch]);

    return (
        <LoadingContext.Provider
            value={{ isLoading, showLoading, hideLoading }}
        >
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error("useLoading must be used within a LoadingProvider");
    }
    return context;
};
