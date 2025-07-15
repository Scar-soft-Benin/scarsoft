import { call, put, takeLatest } from "redux-saga/effects";
import { authService } from "../../services/api/authService";
import type {
    LoginPayload,
    LoginResponse,
    OTPVerificationPayload,
    ResendOTPPayload,
    User,
    PasswordResetPayload,
    VerifyOTPResponse,
    RegisterPayload,
    RegisterResponse,
    EmailVerificationPayload,
    VerifyEmailResponse,
    ResendEmailVerificationPayload,
    LogoutPayload,
    LogoutResponse
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
    RESEND_OTP_SUCCESS,
    REQUEST_PASSWORD_RESET_SUCCESS,
    REQUEST_PASSWORD_RESET_FAILURE,
    REGISTER_FAILURE,
    REGISTER_SUCCESS,
    EMAIL_VERIFICATION_FAILURE,
    EMAIL_VERIFICATION_SUCCESS,
    RESEND_EMAIL_VERIFICATION_FAILURE,
    RESEND_EMAIL_VERIFICATION_SUCCESS
} from "~/store/reducer/authReducer";
import { addMessage } from "~/store/reducer/messageReducer";
import { showLoading, hideLoading } from "~/store/reducer/loadingReducer";
import type { ApiResponse, ApiError } from "../../services/types/common.types";

// Action Types
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const FETCH_USER = "FETCH_USER";
export const VERIFY_OTP = "VERIFY_OTP";
export const RESEND_OTP = "RESEND_OTP";
export const REQUEST_PASSWORD_RESET = "REQUEST_PASSWORD_RESET";
export const REGISTER = "REGISTER";
export const NAVIGATE = "NAVIGATE";
export const VERIFY_EMAIL = "VERIFY_EMAIL";
export const RESEND_EMAIL_VERIFICATION = "RESEND_EMAIL_VERIFICATION";

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

interface RequestPasswordResetAction {
    type: typeof REQUEST_PASSWORD_RESET;
    payload: PasswordResetPayload;
}
interface RegisterAction {
    type: typeof REGISTER;
    payload: RegisterPayload;
}

interface VerifyEmailAction {
    type: typeof VERIFY_EMAIL;
    payload: OTPVerificationPayload;
}

interface ResendEmailVerificationAction {
    type: typeof RESEND_EMAIL_VERIFICATION;
    payload: ResendOTPPayload;
}
interface LogoutAction {
    type: typeof LOGOUT;
    payload: LogoutPayload;
}

// Action Creators
export const login = (payload: LoginPayload) => ({
    type: LOGIN,
    payload
});
export const register = (payload: RegisterPayload) => ({
    type: REGISTER,
    payload
});

export const logout = (payload: LogoutPayload) => ({
    type: LOGOUT,
    payload
});

export const fetchUser = () => ({ type: FETCH_USER });

export const verifyOTP = (payload: OTPVerificationPayload) => ({
    type: VERIFY_OTP,
    payload
});

export const resendOTP = (payload: ResendOTPPayload) => ({
    type: RESEND_OTP,
    payload
});

export const requestPasswordReset = (payload: PasswordResetPayload) => ({
    type: REQUEST_PASSWORD_RESET,
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

export const logoutSuccess = (response: LogoutResponse) => ({
    type: LOGOUT_SUCCESS,
    payload: response
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

export const otpVerificationSuccess = (response: VerifyOTPResponse) => ({
    type: OTP_VERIFICATION_SUCCESS,
    payload: response
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

export const requestPasswordResetSuccess = () => ({
    type: REQUEST_PASSWORD_RESET_SUCCESS
});

export const requestPasswordResetFailure = (error: {
    message: string;
    error_code?: string;
}) => ({
    type: REQUEST_PASSWORD_RESET_FAILURE,
    payload: error
});

export const registerSuccess = (response: RegisterResponse) => ({
    type: REGISTER_SUCCESS,
    payload: response
});
export const registerFailure = (error: {
    message: string;
    error_code?: string;
    errors?: Record<string, string[]>;
}) => ({
    type: REGISTER_FAILURE,
    payload: error
});

export const navigateTo = (
    path: string,
    state?: Record<string, unknown>,
    replace = true
) => ({
    type: NAVIGATE,
    payload: { path, state, replace }
});

export const verifyEmail = (payload: EmailVerificationPayload) => ({
    type: VERIFY_EMAIL,
    payload
});

export const resendEmailVerification = (
    payload: ResendEmailVerificationPayload
) => ({
    type: RESEND_EMAIL_VERIFICATION,
    payload
});

export const emailVerificationSuccess = (response: VerifyEmailResponse) => ({
    type: EMAIL_VERIFICATION_SUCCESS,
    payload: response
});

export const emailVerificationFailure = (error: {
    message: string;
    error_code?: string;
}) => ({
    type: EMAIL_VERIFICATION_FAILURE,
    payload: error
});

export const resendEmailVerificationSuccess = () => ({
    type: RESEND_EMAIL_VERIFICATION_SUCCESS
});

export const resendEmailVerificationFailure = (error: {
    message: string;
    error_code?: string;
}) => ({
    type: RESEND_EMAIL_VERIFICATION_FAILURE,
    payload: error
});

// Error Type Guard
function isApiError(error: unknown): error is ApiError {
    return (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        "status" in error
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
        console.log("loginSaga: Login response:", response);
        yield put(loginSuccess(response.data));
        if (response.data.next_step === "verify_login_otp") {
            console.log("loginSaga: Navigating to /verify-otp");
            yield put(
                navigateTo("/auth/verify-otp", {
                    email: action.payload.email,
                    login_session_id: response.data.login_session_id
                })
            );
        }
        yield put(
            addMessage({
                text:
                    response.data.message ||
                    "Credentials verified. OTP sent to your email",
                type: "success"
            })
        );
    } catch (error: unknown) {
        console.error("loginSaga: Raw login error:", error);
        const apiError = isApiError(error)
            ? {
                  message: error.message || "Failed to login",
                  error_code: error.error_code
              }
            : { message: "Failed to login", error_code: undefined };
        console.log("loginSaga: Processed login error:", apiError);
        yield put(loginFailure(apiError));
        yield put(
            addMessage({
                text: apiError.message ?? "An error occurred",
                type: "error"
            })
        );
    } finally {
        yield put(hideLoading());
    }
}

function* registerSaga(action: RegisterAction) {
    try {
        yield put(showLoading());
        const response: ApiResponse<RegisterResponse> = yield call(
            authService.register,
            action.payload
        );
        console.log("registerSaga: Register response:", response);
        yield put(registerSuccess(response.data));
        yield put(
            addMessage({
                text: response.data.message || "User registered successfully",
                type: "success"
            })
        );
    } catch (error: unknown) {
        console.error("registerSaga: Raw register error:", error);
        const apiError = isApiError(error)
            ? {
                  message: error.message || "Failed to register",
                  error_code: error.error_code
              }
            : { message: "Failed to register", error_code: undefined };
        console.log("registerSaga: Processed register error:", apiError);
        yield put(registerFailure(apiError));
        yield put(addMessage({ text: apiError.message, type: "error" }));
    } finally {
        yield put(hideLoading());
    }
}

function* verifyOTPSaga(action: VerifyOTPAction) {
    try {
        yield put(showLoading());
        const response: ApiResponse<VerifyOTPResponse> = yield call(
            authService.verifyOTP,
            action.payload
        );
        console.log("verifyOTPSaga: Verify OTP response:", response);
        yield put(otpVerificationSuccess(response.data));
        if (response.data.access_token && response.data.user) {
            localStorage.setItem("auth_token", response.data.access_token);
            localStorage.setItem("refresh_token", response.data.refresh_token);
            localStorage.setItem(
                "auth_user",
                JSON.stringify(response.data.user)
            );
            console.log("verifyOTPSaga: Navigating to /dashboard");
            yield put(navigateTo("/dashboard"));
        }
        yield put(
            addMessage({
                text: response.data.message || "Login successful",
                type: "success"
            })
        );
    } catch (error: unknown) {
        console.error("verifyOTPSaga: Raw verify OTP error:", error);
        const apiError = isApiError(error)
            ? {
                  message: error.message || "Failed to verify OTP",
                  error_code: error.error_code
              }
            : { message: "Failed to verify OTP", error_code: undefined };
        console.log("verifyOTPSaga: Processed verify OTP error:", apiError);
        yield put(otpVerificationFailure(apiError));
        yield put(addMessage({ text: apiError.message, type: "error" }));
    } finally {
        yield put(hideLoading());
    }
}

function* logoutSaga(action: LogoutAction) {
    try {
        yield put(showLoading());
        const response: ApiResponse<LogoutResponse> = yield call(
            authService.logout,
            action.payload
        );
        yield put(logoutSuccess(response.data));
        localStorage.removeItem("auth_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("auth_user");
        yield put(
            addMessage({
                text: response.data.message || "Logged out successfully",
                type: "success"
            })
        );
        yield put(navigateTo("/auth/login", undefined, true));
    } catch (error: unknown) {
        console.error("logoutSaga: Raw logout error:", error);
        const apiError = isApiError(error)
            ? {
                  message: error.message || "Failed to logout",
                  error_code: error.error_code
              }
            : { message: "Failed to logout", error_code: undefined };
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
                  message: error.message || "Raw fetch user error",
                  error_code: error.error_code
              }
            : {
                  message: "Failed to fetch user",
                  error_code: undefined
              };
        console.error("fetchUserSaga: Raw fetch user error:", error);
        yield put(fetchUserFailure(apiError));
        yield put(addMessage({ text: apiError.message, type: "error" }));
    } finally {
        yield put(hideLoading());
    }
}

function* resendOTPSaga(action: ResendOTPAction) {
    try {
        yield put(showLoading());
        const response: ApiResponse<LoginResponse> = yield call(
            authService.resendOTP,
            action.payload
        );
        yield put(resendOTPSuccess());
        yield put(
            addMessage({
                text: response.data.message || "OTP resent successfully",
                type: "success"
            })
        );
    } catch (error: unknown) {
        const apiError = isApiError(error)
            ? {
                  message: error.message || "Raw resend OTP error",
                  error_code: error.error_code
              }
            : {
                  message: "Failed to resend OTP",
                  error_code: undefined
              };
        console.error("resendOTPSaga: Raw resend OTP error:", error);
        yield put(resendOTPFailure(apiError));
        yield put(addMessage({ text: apiError.message, type: "error" }));
    } finally {
        yield put(hideLoading());
    }
}

function* requestPasswordResetSaga(action: RequestPasswordResetAction) {
    try {
        yield put(showLoading());
        const response: ApiResponse<null> = yield call(
            authService.requestPasswordReset,
            action.payload
        );
        yield put(requestPasswordResetSuccess());
        yield put(
            addMessage({
                text: response.message || "Password reset link sent",
                type: "success"
            })
        );
    } catch (error: unknown) {
        const apiError = isApiError(error)
            ? {
                  message: error.message || "Raw password reset error",
                  error_code: error.error_code
              }
            : {
                  message: "Failed to request password reset",
                  error_code: undefined
              };
        console.error(
            "requestPasswordResetSaga: Raw password reset error:",
            error
        );
        yield put(requestPasswordResetFailure(apiError));
        yield put(addMessage({ text: apiError.message, type: "error" }));
    } finally {
        yield put(hideLoading());
    }
}

function* verifyEmailSaga(action: VerifyEmailAction) {
    try {
        yield put(showLoading());
        const response: ApiResponse<VerifyEmailResponse> = yield call(
            authService.verifyEmail,
            action.payload
        );
        console.log("verifyEmailSaga: Verify Email response:", response);
        yield put(emailVerificationSuccess(response.data));
        if (response.data.message && response.data.success) {
            console.log("verifyEmailSaga: Navigating to /dashboard");
            yield put(navigateTo("/dashboard"));
        }
        yield put(
            addMessage({
                text: response.data.message || "Email verified successfully",
                type: "success"
            })
        );
    } catch (error: unknown) {
        const apiError = isApiError(error)
            ? {
                  message: error.message || "Raw verify email error",
                  error_code: error.error_code
              }
            : {
                  message: "Failed to verify email",
                  error_code: undefined
              };
        console.error("verifyEmailSaga: Raw verify email error:", error);
        yield put(emailVerificationFailure(apiError));
        yield put(addMessage({ text: apiError.message, type: "error" }));
    } finally {
        yield put(hideLoading());
    }
}

function* resendEmailVerificationSaga(action: ResendEmailVerificationAction) {
    try {
        yield put(showLoading());
        const response: ApiResponse<null> = yield call(
            authService.resendEmailVerification,
            action.payload
        );
        yield put(resendEmailVerificationSuccess());
        yield put(
            addMessage({
                text:
                    response.message || "Verification code resent successfully",
                type: "success"
            })
        );
    } catch (error: unknown) {
        const apiError = isApiError(error)
            ? {
                  message: error.message || "Raw fetch user error",
                  error_code: error.error_code
              }
            : {
                  message: "Failed to resend verification code",
                  error_code: undefined
              };
        yield put(resendEmailVerificationFailure(apiError));
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
    yield takeLatest(REQUEST_PASSWORD_RESET, requestPasswordResetSaga);
    yield takeLatest(REGISTER, registerSaga);
    yield takeLatest(VERIFY_EMAIL, verifyEmailSaga);
    yield takeLatest(RESEND_EMAIL_VERIFICATION, resendEmailVerificationSaga);
}
