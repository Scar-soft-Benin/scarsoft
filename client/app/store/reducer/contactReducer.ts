// ~/reducer/contactReducer.ts

import type {
    Contact,
    ContactStatistics,
    CreateContactResponse,
    GetAllContactsResponse
} from "~/services/types/contact.types";

export const CREATE_CONTACT_SUCCESS = "CREATE_CONTACT_SUCCESS";
export const CREATE_CONTACT_FAILURE = "CREATE_CONTACT_FAILURE";
export const GET_ALL_CONTACTS_SUCCESS = "GET_ALL_CONTACTS_SUCCESS";
export const GET_ALL_CONTACTS_FAILURE = "GET_ALL_CONTACTS_FAILURE";
export const GET_CONTACT_DETAILS_SUCCESS = "GET_CONTACT_DETAILS_SUCCESS";
export const GET_CONTACT_DETAILS_FAILURE = "GET_CONTACT_DETAILS_FAILURE";
export const DELETE_CONTACT_SUCCESS = "DELETE_CONTACT_SUCCESS";
export const DELETE_CONTACT_FAILURE = "DELETE_CONTACT_FAILURE";
export const REPLY_TO_CONTACT_SUCCESS = "REPLY_TO_CONTACT_SUCCESS";
export const REPLY_TO_CONTACT_FAILURE = "REPLY_TO_CONTACT_FAILURE";
export const UPDATE_CONTACT_STATUS_SUCCESS = "UPDATE_CONTACT_STATUS_SUCCESS";
export const UPDATE_CONTACT_STATUS_FAILURE = "UPDATE_CONTACT_STATUS_FAILURE";
export const GET_CONTACT_STATISTICS_SUCCESS = "GET_CONTACT_STATISTICS_SUCCESS";
export const GET_CONTACT_STATISTICS_FAILURE = "GET_CONTACT_STATISTICS_FAILURE";

interface ContactState {
    
    contacts: Contact[];
    currentContact: Contact | null;
    statistics: ContactStatistics | null;
    loading: boolean;
    error: { message: string; error_code?: string } | null;
}

const initialState: ContactState = {
    contacts: [],
    currentContact: null,
    statistics: null,
    loading: false,
    error: null
};

type ContactAction =
    | { type: typeof CREATE_CONTACT_SUCCESS; payload: CreateContactResponse }
    | {
          type: typeof CREATE_CONTACT_FAILURE;
          payload: { message: string; error_code?: string };
      }
    | { type: typeof GET_ALL_CONTACTS_SUCCESS; payload: GetAllContactsResponse }
    | {
          type: typeof GET_ALL_CONTACTS_FAILURE;
          payload: { message: string; error_code?: string };
      }
    | { type: typeof GET_CONTACT_DETAILS_SUCCESS; payload: Contact }
    | {
          type: typeof GET_CONTACT_DETAILS_FAILURE;
          payload: { message: string; error_code?: string };
      }
    | { type: typeof DELETE_CONTACT_SUCCESS; payload: string }
    | {
          type: typeof DELETE_CONTACT_FAILURE;
          payload: { message: string; error_code?: string };
      }
    | { type: typeof REPLY_TO_CONTACT_SUCCESS; payload: Contact }
    | {
          type: typeof REPLY_TO_CONTACT_FAILURE;
          payload: { message: string; error_code?: string };
      }
    | { type: typeof UPDATE_CONTACT_STATUS_SUCCESS; payload: Contact }
    | {
          type: typeof UPDATE_CONTACT_STATUS_FAILURE;
          payload: { message: string; error_code?: string };
      }
    | {
          type: typeof GET_CONTACT_STATISTICS_SUCCESS;
          payload: ContactStatistics;
      }
    | {
          type: typeof GET_CONTACT_STATISTICS_FAILURE;
          payload: { message: string; error_code?: string };
      };

const contactReducer = (
    state = initialState,
    action: ContactAction
): ContactState => {
    switch (action.type) {
        case CREATE_CONTACT_SUCCESS:
            console.log(
                "contactReducer: CREATE_CONTACT_SUCCESS with payload:",
                action.payload
            );
            return {
                ...state,
                contacts: [...state.contacts, action.payload.data],
                loading: false,
                error: null
            };
        case CREATE_CONTACT_FAILURE:
            console.log(
                "contactReducer: CREATE_CONTACT_FAILURE with payload:",
                action.payload
            );
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case GET_ALL_CONTACTS_SUCCESS:
            console.log(
                "contactReducer: GET_ALL_CONTACTS_SUCCESS with payload:",
                action.payload
            );
            return {
                ...state,
                contacts: action.payload.data,
                loading: false,
                error: null
            };
        case GET_ALL_CONTACTS_FAILURE:
            console.log(
                "contactReducer: GET_ALL_CONTACTS_FAILURE with payload:",
                action.payload
            );
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case GET_CONTACT_DETAILS_SUCCESS:
            console.log(
                "contactReducer: GET_CONTACT_DETAILS_SUCCESS with payload:",
                action.payload
            );
            return {
                ...state,
                currentContact: action.payload,
                loading: false,
                error: null
            };
        case GET_CONTACT_DETAILS_FAILURE:
            console.log(
                "contactReducer: GET_CONTACT_DETAILS_FAILURE with payload:",
                action.payload
            );
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case DELETE_CONTACT_SUCCESS:
            console.log(
                "contactReducer: DELETE_CONTACT_SUCCESS with payload:",
                action.payload
            );
            return {
                ...state,
                contacts: state.contacts.filter(
                    (contact) => contact.id.toString() !== action.payload
                ),
                loading: false,
                error: null
            };
        case DELETE_CONTACT_FAILURE:
            console.log(
                "contactReducer: DELETE_CONTACT_FAILURE with payload:",
                action.payload
            );
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case REPLY_TO_CONTACT_SUCCESS:
            console.log(
                "contactReducer: REPLY_TO_CONTACT_SUCCESS with payload:",
                action.payload
            );
            return {
                ...state,
                contacts: state.contacts.map((contact) =>
                    contact.id === action.payload.id ? action.payload : contact
                ),
                currentContact:
                    state.currentContact &&
                    state.currentContact.id === action.payload.id
                        ? action.payload
                        : state.currentContact,
                loading: false,
                error: null
            };
        case REPLY_TO_CONTACT_FAILURE:
            console.log(
                "contactReducer: REPLY_TO_CONTACT_FAILURE with payload:",
                action.payload
            );
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case UPDATE_CONTACT_STATUS_SUCCESS:
            console.log(
                "contactReducer: UPDATE_CONTACT_STATUS_SUCCESS with payload:",
                action.payload
            );
            return {
                ...state,
                contacts: state.contacts.map((contact) =>
                    contact.id === action.payload.id ? action.payload : contact
                ),
                currentContact:
                    state.currentContact &&
                    state.currentContact.id === action.payload.id
                        ? action.payload
                        : state.currentContact,
                loading: false,
                error: null
            };
        case UPDATE_CONTACT_STATUS_FAILURE:
            console.log(
                "contactReducer: UPDATE_CONTACT_STATUS_FAILURE with payload:",
                action.payload
            );
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case GET_CONTACT_STATISTICS_SUCCESS:
            console.log(
                "contactReducer: GET_CONTACT_STATISTICS_SUCCESS with payload:",
                action.payload
            );
            return {
                ...state,
                statistics: action.payload,
                loading: false,
                error: null
            };
        case GET_CONTACT_STATISTICS_FAILURE:
            console.log(
                "contactReducer: GET_CONTACT_STATISTICS_FAILURE with payload:",
                action.payload
            );
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
};

export default contactReducer;
