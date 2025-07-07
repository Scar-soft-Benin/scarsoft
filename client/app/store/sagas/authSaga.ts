import { call, put, takeLatest } from "redux-saga/effects";
import { authService } from "../../services/api/authService";
import type {
    LoginPayload,
    LoginResponse,
    OTPVerificationPayload,
    ResendOTPPayload,
    User
} from "../../services/types/auth.types";
import {
    FETCH_USER_FAILURE,
    FETCH_USER_SUCCESS,
    LOGIN_FAILURE,
    LOGIN_SUCCESS,
    LOGOUT_FAILURE,
    LOGOUT_SUCCESS,
    OTP_VERIFICATION_FAILURE,
    OTP_VERIFICATION_SUCCESS,
    RESEND_OTP_FAILURE,
    RESEND_OTP_SUCCESS
} from "../reducer/authReducer";
import { addMessage } from "../reducer/messageReducer";
import { showLoading, hideLoading } from "../reducer/loadingReducer";
import type { ApiResponse, ApiError } from "../../services/types/common.types";

// Action Types
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const FETCH_USER = "FETCH_USER";
export const VERIFY_OTP = "VERIFY_OTP";
export const RESEND_OTP = "RESEND_OTP";

// Define Action Interfaces
interface LoginAction {
    type: typeof LOGIN;
    payload: LoginPayload;
}

interface VerifyOTPAction {
    type: typeof VERIFY_OTP;
    payload: OTPVerificationPayload;
}

interface ResendOTPAction {
    type: typeof RESEND_OTP;
    payload: ResendOTPPayload;
}

// Action Creators
export const login = (payload: LoginPayload) => ({
    type: LOGIN,
    payload
});

export const logout = () => ({ type: LOGOUT });

export const fetchUser = () => ({ type: FETCH_USER });

export const verifyOTP = (payload: OTPVerificationPayload) => ({
    type: VERIFY_OTP,
    payload
});

export const resendOTP = (payload: ResendOTPPayload) => ({
    type: RESEND_OTP,
    payload
});

export const loginSuccess = (response: LoginResponse) => ({
    type: LOGIN_SUCCESS,
    payload: response
});

export const loginFailure = (error: {
    message: string;
    error_code?: string;
}) => ({
    type: LOGIN_FAILURE,
    payload: error
});

export const logoutSuccess = () => ({
    type: LOGOUT_SUCCESS
});

export const logoutFailure = (error: {
    message: string;
    error_code?: string;
}) => ({
    type: LOGOUT_FAILURE,
    payload: error
});

export const fetchUserSuccess = (user: User) => ({
    type: FETCH_USER_SUCCESS,
    payload: user
});

export const fetchUserFailure = (error: {
    message: string;
    error_code?: string;
}) => ({
    type: FETCH_USER_FAILURE,
    payload: error
});

export const otpVerificationSuccess = () => ({
    type: OTP_VERIFICATION_SUCCESS
});

export const otpVerificationFailure = (error: {
    message: string;
    error_code?: string;
}) => ({
    type: OTP_VERIFICATION_FAILURE,
    payload: error
});

export const resendOTPSuccess = () => ({
    type: RESEND_OTP_SUCCESS
});

export const resendOTPFailure = (error: {
    message: string;
    error_code?: string;
}) => ({
    type: RESEND_OTP_FAILURE,
    payload: error
});

// Error Type Guard
function isApiError(error: unknown): error is ApiError {
    return (
        typeof error === "object" &&
        error !== null &&
        ("message" in error || "response" in error)
    );
}

// Sagas
function* loginSaga(action: LoginAction) {
    try {
        yield put(showLoading());
        const response: ApiResponse<LoginResponse> = yield call(
            authService.login,
            action.payload
        );
        yield put(loginSuccess(response.data));
        localStorage.setItem("auth_token", response.data.token);
        localStorage.setItem("refresh_token", response.data.refreshToken);
        localStorage.setItem("auth_user", JSON.stringify(response.data.user));
        yield put(
            addMessage({
                text: response.data.message || "Logged in successfully",
                type: "success"
            })
        );
    } catch (error: unknown) {
        const apiError = isApiError(error)
            ? {
                  message: error.message || "Failed to login",
                  error_code: error.error_code
              }
            : { message: "Failed to login" };
        yield put(loginFailure(apiError));
        yield put(addMessage({ text: apiError.message, type: "error" }));
        throw apiError;
    } finally {
        yield put(hideLoading());
    }
}

function* logoutSaga() {
    try {
        yield put(showLoading());
        yield call(authService.logout);
        yield put(logoutSuccess());
        localStorage.removeItem("auth_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("auth_user");
        yield put(
            addMessage({ text: "Logged out successfully", type: "success" })
        );
    } catch (error: unknown) {
        const apiError = isApiError(error)
            ? {
                  message: error.message || error.message || "Failed to logout",
                  error_code: error.error_code
              }
            : { message: "Failed to logout" };
        yield put(logoutFailure(apiError));
        yield put(addMessage({ text: apiError.message, type: "error" }));
    } finally {
        yield put(hideLoading());
    }
}

function* fetchUserSaga() {
    try {
        yield put(showLoading());
        const response: ApiResponse<User> = yield call(
            authService.getCurrentUser
        );
        yield put(fetchUserSuccess(response.data));
    } catch (error: unknown) {
        const apiError = isApiError(error)
            ? {
                  message:
                      error.message || error.message || "Failed to fetch user",
                  error_code: error.error_code
              }
            : { message: "Failed to fetch user" };
        yield put(fetchUserFailure(apiError));
        yield put(addMessage({ text: apiError.message, type: "error" }));
    } finally {
        yield put(hideLoading());
    }
}

function* verifyOTPSaga(action: VerifyOTPAction) {
    try {
        yield put(showLoading());
        const response: ApiResponse<null> = yield call(
            authService.verifyOTP,
            action.payload
        );
        yield put(otpVerificationSuccess());
        yield put(
            addMessage({
                text: response.message || "OTP verified successfully",
                type: "success"
            })
        );
    } catch (error: unknown) {
        const apiError = isApiError(error)
            ? {
                  message:
                      error.message || error.message || "Failed to verify OTP",
                  error_code: error.error_code
              }
            : { message: "Failed to verify OTP" };
        yield put(otpVerificationFailure(apiError));
        yield put(addMessage({ text: apiError.message, type: "error" }));
    } finally {
        yield put(hideLoading());
    }
}

function* resendOTPSaga(action: ResendOTPAction) {
    try {
        yield put(showLoading());
        const response: ApiResponse<null> = yield call(
            authService.resendOTP,
            action.payload
        );
        yield put(resendOTPSuccess());
        yield put(
            addMessage({
                text: response.message || "OTP resent successfully",
                type: "success"
            })
        );
    } catch (error: unknown) {
        const apiError = isApiError(error)
            ? {
                  message:
                      error.message || error.message || "Failed to resend OTP",
                  error_code: error.error_code
              }
            : { message: "Failed to resend OTP" };
        yield put(resendOTPFailure(apiError));
        yield put(addMessage({ text: apiError.message, type: "error" }));
    } finally {
        yield put(hideLoading());
    }
}

export function* authSaga() {
    yield takeLatest(LOGIN, loginSaga);
    yield takeLatest(LOGOUT, logoutSaga);
    yield takeLatest(FETCH_USER, fetchUserSaga);
    yield takeLatest(VERIFY_OTP, verifyOTPSaga);
    yield takeLatest(RESEND_OTP, resendOTPSaga);
}
