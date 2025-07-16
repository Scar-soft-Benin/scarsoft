// ~/reducer/notificationReducer.ts

import type { NotificationResponse } from "~/services/types/notification.types";

export const SEND_TO_CANDIDATE = "SEND_TO_CANDIDATE";
export const SEND_TO_CANDIDATE_SUCCESS = "SEND_TO_CANDIDATE_SUCCESS";
export const SEND_TO_CANDIDATE_FAILURE = "SEND_TO_CANDIDATE_FAILURE";
export const SEND_TO_COMPANY = "SEND_TO_COMPANY";
export const SEND_TO_COMPANY_SUCCESS = "SEND_TO_COMPANY_SUCCESS";
export const SEND_TO_COMPANY_FAILURE = "SEND_TO_COMPANY_FAILURE";
export const CLEAR_NOTIFICATION_ERROR = "CLEAR_NOTIFICATION_ERROR";

interface NotificationState {
  loading: boolean;
  error: { message: string; error_code?: string } | null;
  lastNotification: NotificationResponse | null;
}

const initialState: NotificationState = {
  loading: false,
  error: null,
  lastNotification: null,
};

type NotificationAction =
  | { type: typeof SEND_TO_CANDIDATE }
  | { type: typeof SEND_TO_CANDIDATE_SUCCESS; payload: NotificationResponse }
  | { type: typeof SEND_TO_CANDIDATE_FAILURE; payload: { message: string; error_code?: string } }
  | { type: typeof SEND_TO_COMPANY }
  | { type: typeof SEND_TO_COMPANY_SUCCESS; payload: NotificationResponse }
  | { type: typeof SEND_TO_COMPANY_FAILURE; payload: { message: string; error_code?: string } }
  | { type: typeof CLEAR_NOTIFICATION_ERROR };

const notificationReducer = (
  state = initialState,
  action: NotificationAction
): NotificationState => {
  switch (action.type) {
    case SEND_TO_CANDIDATE:
    case SEND_TO_COMPANY:
      console.log(`notificationReducer: ${action.type} - Setting loading to true`);
      return {
        ...state,
        loading: true,
        error: null,
      };
    case SEND_TO_CANDIDATE_SUCCESS:
    case SEND_TO_COMPANY_SUCCESS:
      console.log(`notificationReducer: ${action.type} with payload:`, action.payload);
      return {
        ...state,
        lastNotification: action.payload,
        loading: false,
        error: null,
      };
    case SEND_TO_CANDIDATE_FAILURE:
    case SEND_TO_COMPANY_FAILURE:
      console.log(`notificationReducer: ${action.type} with payload:`, action.payload);
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CLEAR_NOTIFICATION_ERROR:
      console.log("notificationReducer: Clearing error");
      return { ...state, error: null };
    default:
      return state;
  }
};

export default notificationReducer;