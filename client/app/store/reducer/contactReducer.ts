// ~/reducer/contactReducer.ts

import type { Contact, ContactStatistics } from "~/services/types/contact.types";
import type {
  GetAllContactsResponse,
  CreateContactResponse,
  UpdateContactStatusResponse,
  DeleteContactResponse,
} from "~/services/types/contact.types";

export const CREATE_CONTACT = "CREATE_CONTACT";
export const CREATE_CONTACT_SUCCESS = "CREATE_CONTACT_SUCCESS";
export const CREATE_CONTACT_FAILURE = "CREATE_CONTACT_FAILURE";
export const GET_ALL_CONTACTS = "GET_ALL_CONTACTS";
export const GET_ALL_CONTACTS_SUCCESS = "GET_ALL_CONTACTS_SUCCESS";
export const GET_ALL_CONTACTS_FAILURE = "GET_ALL_CONTACTS_FAILURE";
export const GET_CONTACT_DETAILS = "GET_CONTACT_DETAILS";
export const GET_CONTACT_DETAILS_SUCCESS = "GET_CONTACT_DETAILS_SUCCESS";
export const GET_CONTACT_DETAILS_FAILURE = "GET_CONTACT_DETAILS_FAILURE";
export const DELETE_CONTACT = "DELETE_CONTACT";
export const DELETE_CONTACT_SUCCESS = "DELETE_CONTACT_SUCCESS";
export const DELETE_CONTACT_FAILURE = "DELETE_CONTACT_FAILURE";
export const REPLY_TO_CONTACT = "REPLY_TO_CONTACT";
export const REPLY_TO_CONTACT_SUCCESS = "REPLY_TO_CONTACT_SUCCESS";
export const REPLY_TO_CONTACT_FAILURE = "REPLY_TO_CONTACT_FAILURE";
export const UPDATE_CONTACT_STATUS = "UPDATE_CONTACT_STATUS";
export const UPDATE_CONTACT_STATUS_SUCCESS = "UPDATE_CONTACT_STATUS_SUCCESS";
export const UPDATE_CONTACT_STATUS_FAILURE = "UPDATE_CONTACT_STATUS_FAILURE";
export const GET_CONTACT_STATISTICS = "GET_CONTACT_STATISTICS";
export const GET_CONTACT_STATISTICS_SUCCESS = "GET_CONTACT_STATISTICS_SUCCESS";
export const GET_CONTACT_STATISTICS_FAILURE = "GET_CONTACT_STATISTICS_FAILURE";
export const CLEAR_CONTACT_ERROR = "CLEAR_CONTACT_ERROR";

interface ContactState {
  contacts: Contact[];
  currentContact: Contact | null;
  statistics: ContactStatistics | null;
  loading: boolean;
  error: { message: string; error_code?: string } | null;
  meta: { current_page?: number; total?: number; per_page?: number; last_page?: number } | null;
}

const initialState: ContactState = {
  contacts: [],
  currentContact: null,
  statistics: null,
  loading: false,
  error: null,
  meta: null,
};

type ContactAction =
  | { type: typeof CREATE_CONTACT }
  | { type: typeof CREATE_CONTACT_SUCCESS; payload: Contact }
  | { type: typeof CREATE_CONTACT_FAILURE; payload: { message: string; error_code?: string } }
  | { type: typeof GET_ALL_CONTACTS }
  | { type: typeof GET_ALL_CONTACTS_SUCCESS; payload: GetAllContactsResponse }
  | { type: typeof GET_ALL_CONTACTS_FAILURE; payload: { message: string; error_code?: string } }
  | { type: typeof GET_CONTACT_DETAILS }
  | { type: typeof GET_CONTACT_DETAILS_SUCCESS; payload: Contact }
  | { type: typeof GET_CONTACT_DETAILS_FAILURE; payload: { message: string; error_code?: string } }
  | { type: typeof DELETE_CONTACT }
  | { type: typeof DELETE_CONTACT_SUCCESS; payload: string }
  | { type: typeof DELETE_CONTACT_FAILURE; payload: { message: string; error_code?: string } }
  | { type: typeof REPLY_TO_CONTACT }
  | { type: typeof REPLY_TO_CONTACT_SUCCESS; payload: Contact }
  | { type: typeof REPLY_TO_CONTACT_FAILURE; payload: { message: string; error_code?: string } }
  | { type: typeof UPDATE_CONTACT_STATUS }
  | { type: typeof UPDATE_CONTACT_STATUS_SUCCESS; payload: Contact }
  | { type: typeof UPDATE_CONTACT_STATUS_FAILURE; payload: { message: string; error_code?: string } }
  | { type: typeof GET_CONTACT_STATISTICS }
  | { type: typeof GET_CONTACT_STATISTICS_SUCCESS; payload: ContactStatistics }
  | { type: typeof GET_CONTACT_STATISTICS_FAILURE; payload: { message: string; error_code?: string } }
  | { type: typeof CLEAR_CONTACT_ERROR };

const contactReducer = (state = initialState, action: ContactAction): ContactState => {
  switch (action.type) {
    case CREATE_CONTACT:
    case GET_ALL_CONTACTS:
    case GET_CONTACT_DETAILS:
    case DELETE_CONTACT:
    case REPLY_TO_CONTACT:
    case UPDATE_CONTACT_STATUS:
    case GET_CONTACT_STATISTICS:
      console.log(`contactReducer: ${action.type} - Setting loading to true`);
      return {
        ...state,
        loading: true,
        error: null,
      };
    case CREATE_CONTACT_SUCCESS:
      console.log("contactReducer: CREATE_CONTACT_SUCCESS with payload:", action.payload);
      return {
        ...state,
        contacts: [...state.contacts, action.payload],
        loading: false,
        error: null,
      };
    case CREATE_CONTACT_FAILURE:
      console.log("contactReducer: CREATE_CONTACT_FAILURE with payload:", action.payload);
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case GET_ALL_CONTACTS_SUCCESS:
      console.log("contactReducer: GET_ALL_CONTACTS_SUCCESS with payload:", action.payload);
      return {
        ...state,
        contacts: action.payload.data || [],
        meta: action.payload.meta || null,
        loading: false,
        error: null,
      };
    case GET_ALL_CONTACTS_FAILURE:
      console.log("contactReducer: GET_ALL_CONTACTS_FAILURE with payload:", action.payload);
      return {
        ...state,
        loading: false,
        error: action.payload,
        contacts: [],
      };
    case GET_CONTACT_DETAILS_SUCCESS:
      console.log("contactReducer: GET_CONTACT_DETAILS_SUCCESS with payload:", action.payload);
      return {
        ...state,
        currentContact: action.payload,
        loading: false,
        error: null,
      };
    case GET_CONTACT_DETAILS_FAILURE:
      console.log("contactReducer: GET_CONTACT_DETAILS_FAILURE with payload:", action.payload);
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_CONTACT_SUCCESS:
      console.log("contactReducer: DELETE_CONTACT_SUCCESS with payload:", action.payload);
      return {
        ...state,
        contacts: state.contacts.filter((contact) => contact.id.toString() !== action.payload),
        loading: false,
        error: null,
      };
    case DELETE_CONTACT_FAILURE:
      console.log("contactReducer: DELETE_CONTACT_FAILURE with payload:", action.payload);
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case REPLY_TO_CONTACT_SUCCESS:
      console.log("contactReducer: REPLY_TO_CONTACT_SUCCESS with payload:", action.payload);
      return {
        ...state,
        contacts: state.contacts.map((contact) =>
          contact.id === action.payload.id ? action.payload : contact
        ),
        currentContact:
          state.currentContact && state.currentContact.id === action.payload.id
            ? action.payload
            : state.currentContact,
        loading: false,
        error: null,
      };
    case REPLY_TO_CONTACT_FAILURE:
      console.log("contactReducer: REPLY_TO_CONTACT_FAILURE with payload:", action.payload);
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPDATE_CONTACT_STATUS_SUCCESS:
      console.log("contactReducer: UPDATE_CONTACT_STATUS_SUCCESS with payload:", action.payload);
      return {
        ...state,
        contacts: state.contacts.map((contact) =>
          contact.id === action.payload.id ? action.payload : contact
        ),
        currentContact:
          state.currentContact && state.currentContact.id === action.payload.id
            ? action.payload
            : state.currentContact,
        loading: false,
        error: null,
      };
    case UPDATE_CONTACT_STATUS_FAILURE:
      console.log("contactReducer: UPDATE_CONTACT_STATUS_FAILURE with payload:", action.payload);
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case GET_CONTACT_STATISTICS_SUCCESS:
      console.log("contactReducer: GET_CONTACT_STATISTICS_SUCCESS with payload:", action.payload);
      return {
        ...state,
        statistics: action.payload,
        loading: false,
        error: null,
      };
    case GET_CONTACT_STATISTICS_FAILURE:
      console.log("contactReducer: GET_CONTACT_STATISTICS_FAILURE with payload:", action.payload);
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CLEAR_CONTACT_ERROR:
      console.log("contactReducer: Clearing error");
      return { ...state, error: null };
    default:
      return state;
  }
};

export default contactReducer;