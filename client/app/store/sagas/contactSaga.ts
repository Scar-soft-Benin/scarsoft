// ~/sagas/contactSaga.ts

import { call, put, takeLatest } from "redux-saga/effects";
import { contactService } from "~/services/api/contactService";
import type {
  ApiResponse,
  Contact,
  CreateContactPayload,
  ReplyContactPayload,
  UpdateContactStatusPayload,
  ContactStatistics,
  CreateContactResponse,
  GetAllContactsResponse,
  UpdateContactStatusResponse,
  DeleteContactResponse,
} from "~/services/types/contact.types";
import { addMessage } from "../reducer/messageReducer";
import { showLoading, hideLoading } from "../reducer/loadingReducer";

// Action Types
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

// Action Interfaces
interface CreateContactAction {
  type: typeof CREATE_CONTACT;
  payload: CreateContactPayload;
}

interface GetAllContactsAction {
  type: typeof GET_ALL_CONTACTS;
  payload: { page?: number; per_page?: number; status?: string };
}

interface GetContactDetailsAction {
  type: typeof GET_CONTACT_DETAILS;
  payload: string;
}

interface DeleteContactAction {
  type: typeof DELETE_CONTACT;
  payload: string;
}

interface ReplyToContactAction {
  type: typeof REPLY_TO_CONTACT;
  payload: { contactId: string; data: ReplyContactPayload };
}

interface UpdateContactStatusAction {
  type: typeof UPDATE_CONTACT_STATUS;
  payload: { contactId: string; data: UpdateContactStatusPayload };
}

interface GetContactStatisticsAction {
  type: typeof GET_CONTACT_STATISTICS;
}

// Action Creators
export const createContact = (payload: CreateContactPayload) => ({
  type: CREATE_CONTACT,
  payload,
});

export const createContactSuccess = (contact: Contact) => ({
  type: CREATE_CONTACT_SUCCESS,
  payload: contact,
});

export const createContactFailure = (error: { message: string; error_code?: string }) => ({
  type: CREATE_CONTACT_FAILURE,
  payload: error,
});

export const getAllContacts = (payload: { page?: number; per_page?: number; status?: string }) => ({
  type: GET_ALL_CONTACTS,
  payload,
});

export const getAllContactsSuccess = (response: GetAllContactsResponse) => ({
  type: GET_ALL_CONTACTS_SUCCESS,
  payload: response,
});

export const getAllContactsFailure = (error: { message: string; error_code?: string }) => ({
  type: GET_ALL_CONTACTS_FAILURE,
  payload: error,
});

export const getContactDetails = (contactId: string) => ({
  type: GET_CONTACT_DETAILS,
  payload: contactId,
});

export const getContactDetailsSuccess = (contact: Contact) => ({
  type: GET_CONTACT_DETAILS_SUCCESS,
  payload: contact,
});

export const getContactDetailsFailure = (error: { message: string; error_code?: string }) => ({
  type: GET_CONTACT_DETAILS_FAILURE,
  payload: error,
});

export const deleteContact = (contactId: string) => ({
  type: DELETE_CONTACT,
  payload: contactId,
});

export const deleteContactSuccess = (contactId: string) => ({
  type: DELETE_CONTACT_SUCCESS,
  payload: contactId,
});

export const deleteContactFailure = (error: { message: string; error_code?: string }) => ({
  type: DELETE_CONTACT_FAILURE,
  payload: error,
});

export const replyToContact = (contactId: string, data: ReplyContactPayload) => ({
  type: REPLY_TO_CONTACT,
  payload: { contactId, data },
});

export const replyToContactSuccess = (contact: Contact) => ({
  type: REPLY_TO_CONTACT_SUCCESS,
  payload: contact,
});

export const replyToContactFailure = (error: { message: string; error_code?: string }) => ({
  type: REPLY_TO_CONTACT_FAILURE,
  payload: error,
});

export const updateContactStatus = (contactId: string, data: UpdateContactStatusPayload) => ({
  type: UPDATE_CONTACT_STATUS,
  payload: { contactId, data },
});

export const updateContactStatusSuccess = (contact: Contact) => ({
  type: UPDATE_CONTACT_STATUS_SUCCESS,
  payload: contact,
});

export const updateContactStatusFailure = (error: { message: string; error_code?: string }) => ({
  type: UPDATE_CONTACT_STATUS_FAILURE,
  payload: error,
});

export const getContactStatistics = () => ({
  type: GET_CONTACT_STATISTICS,
});

export const getContactStatisticsSuccess = (statistics: ContactStatistics) => ({
  type: GET_CONTACT_STATISTICS_SUCCESS,
  payload: statistics,
});

export const getContactStatisticsFailure = (error: { message: string; error_code?: string }) => ({
  type: GET_CONTACT_STATISTICS_FAILURE,
  payload: error,
});

export const clearContactError = () => ({
  type: CLEAR_CONTACT_ERROR,
});

// Error Type Guard
function isApiError(error: unknown): error is { message: string; status: number; error_code?: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    "status" in error
  );
}

// Sagas
function* createContactSaga(action: CreateContactAction) {
  try {
    yield put(showLoading());
    console.log("createContactSaga: Calling contactService.createContact with payload:", action.payload);
    const response: ApiResponse<CreateContactResponse> = yield call(
      contactService.createContact,
      action.payload
    );
    console.log("createContactSaga: Create contact response:", response);
    yield put(createContactSuccess(response.data.data));
    yield put(
      addMessage({
        text: response.data.message || "Message de contact créé avec succès",
        type: "success",
      })
    );
  } catch (error: unknown) {
    console.error("createContactSaga: Error creating contact:", error);
    const apiError = isApiError(error)
      ? { message: error.message, error_code: error.error_code }
      : { message: "Impossible de créer le message de contact" };
    yield put(createContactFailure(apiError));
    yield put(addMessage({ text: apiError.message, type: "error" }));
  } finally {
    yield put(hideLoading());
    console.log("createContactSaga: Saga completed.");
  }
}

function* getAllContactsSaga(action: GetAllContactsAction) {
  try {
    yield put(showLoading());
    console.log("getAllContactsSaga: Calling contactService.getAllContacts with params:", action.payload);
    const response: ApiResponse<GetAllContactsResponse> = yield call(
      contactService.getAllContacts,
      action.payload
    );
    console.log("getAllContactsSaga: Get all contacts response:", response);
    yield put(
      getAllContactsSuccess({
        success: response.data.success,
        message: response.data.message || "Messages de contact chargés avec succès",
        data: response.data.data,
        meta: response.meta,
      })
    );
    yield put(
      addMessage({
        text: response.data.message || "Messages de contact chargés avec succès",
        type: "success",
      })
    );
  } catch (error: unknown) {
    console.error("getAllContactsSaga: Error fetching contacts:", error);
    const apiError = isApiError(error)
      ? { message: error.message, error_code: error.error_code }
      : { message: "Impossible de charger les messages de contact" };
    yield put(getAllContactsFailure(apiError));
    yield put(addMessage({ text: apiError.message, type: "error" }));
  } finally {
    yield put(hideLoading());
    console.log("getAllContactsSaga: Saga completed.");
  }
}

function* getContactDetailsSaga(action: GetContactDetailsAction) {
  try {
    yield put(showLoading());
    console.log("getContactDetailsSaga: Calling contactService.getContactDetails with contactId:", action.payload);
    const response: ApiResponse<Contact> = yield call(
      contactService.getContactDetails,
      action.payload
    );
    console.log("getContactDetailsSaga: Get contact details response:", response);
    yield put(getContactDetailsSuccess(response.data));
    yield put(
      addMessage({
        text: response.message || "Détails du contact chargés avec succès",
        type: "success",
      })
    );
  } catch (error: unknown) {
    console.error("getContactDetailsSaga: Error fetching contact details:", error);
    const apiError = isApiError(error)
      ? { message: error.message, error_code: error.error_code }
      : { message: "Impossible de charger les détails du contact" };
    yield put(getContactDetailsFailure(apiError));
    yield put(addMessage({ text: apiError.message, type: "error" }));
  } finally {
    yield put(hideLoading());
    console.log("getContactDetailsSaga: Saga completed.");
  }
}

function* deleteContactSaga(action: DeleteContactAction) {
  try {
    yield put(showLoading());
    console.log("deleteContactSaga: Calling contactService.deleteContact with contactId:", action.payload);
    const response: ApiResponse<DeleteContactResponse> = yield call(
      contactService.deleteContact,
      action.payload
    );
    console.log("deleteContactSaga: Delete contact response:", response);
    yield put(deleteContactSuccess(action.payload));
    yield put(
      addMessage({
        text: response.data.message || "Message de contact supprimé avec succès",
        type: "success",
      })
    );
  } catch (error: unknown) {
    console.error("deleteContactSaga: Error deleting contact:", error);
    const apiError = isApiError(error)
      ? { message: error.message, error_code: error.error_code }
      : { message: "Impossible de supprimer le message de contact" };
    yield put(deleteContactFailure(apiError));
    yield put(addMessage({ text: apiError.message, type: "error" }));
  } finally {
    yield put(hideLoading());
    console.log("deleteContactSaga: Saga completed.");
  }
}

function* replyToContactSaga(action: ReplyToContactAction) {
  try {
    yield put(showLoading());
    console.log("replyToContactSaga: Calling contactService.replyToContact with contactId:", action.payload.contactId, "and payload:", action.payload.data);
    const response: ApiResponse<Contact> = yield call(
      contactService.replyToContact,
      action.payload.contactId,
      action.payload.data
    );
    console.log("replyToContactSaga: Reply to contact response:", response);
    yield put(replyToContactSuccess(response.data));
    yield put(
      addMessage({
        text: response.message || "Réponse envoyée avec succès",
        type: "success",
      })
    );
  } catch (error: unknown) {
    console.error("replyToContactSaga: Error replying to contact:", error);
    const apiError = isApiError(error)
      ? { message: error.message, error_code: error.error_code }
      : { message: "Impossible d'envoyer la réponse" };
    yield put(replyToContactFailure(apiError));
    yield put(addMessage({ text: apiError.message, type: "error" }));
  } finally {
    yield put(hideLoading());
    console.log("replyToContactSaga: Saga completed.");
  }
}

function* updateContactStatusSaga(action: UpdateContactStatusAction) {
  try {
    yield put(showLoading());
    console.log("updateContactStatusSaga: Calling contactService.updateContactStatus with contactId:", action.payload.contactId, "and payload:", action.payload.data);
    const response: ApiResponse<UpdateContactStatusResponse> = yield call(
      contactService.updateContactStatus,
      action.payload.contactId,
      action.payload.data
    );
    console.log("updateContactStatusSaga: Update contact status response:", response);
    yield put(updateContactStatusSuccess(response.data.data));
    yield put(
      addMessage({
        text: response.data.message || "Statut du contact mis à jour avec succès",
        type: "success",
      })
    );
  } catch (error: unknown) {
    console.error("updateContactStatusSaga: Error updating contact status:", error);
    const apiError = isApiError(error)
      ? { message: error.message, error_code: error.error_code }
      : { message: "Impossible de mettre à jour le statut du contact" };
    yield put(updateContactStatusFailure(apiError));
    yield put(addMessage({ text: apiError.message, type: "error" }));
  } finally {
    yield put(hideLoading());
    console.log("updateContactStatusSaga: Saga completed.");
  }
}

function* getContactStatisticsSaga(action: GetContactStatisticsAction) {
  try {
    yield put(showLoading());
    console.log("getContactStatisticsSaga: Calling contactService.getContactStatistics");
    const response: ApiResponse<ContactStatistics> = yield call(
      contactService.getContactStatistics
    );
    console.log("getContactStatisticsSaga: Get contact statistics response:", response);
    yield put(getContactStatisticsSuccess(response.data));
    yield put(
      addMessage({
        text: response.message || "Statistiques des contacts chargées avec succès",
        type: "success",
      })
    );
  } catch (error: unknown) {
    console.error("getContactStatisticsSaga: Error fetching contact statistics:", error);
    const apiError = isApiError(error)
      ? { message: error.message, error_code: error.error_code }
      : { message: "Impossible de charger les statistiques des contacts" };
    yield put(getContactStatisticsFailure(apiError));
    yield put(addMessage({ text: apiError.message, type: "error" }));
  } finally {
    yield put(hideLoading());
    console.log("getContactStatisticsSaga: Saga completed.");
  }
}

export function* contactSaga() {
  console.log("contactSaga: Initializing saga listeners");
  yield takeLatest(CREATE_CONTACT, createContactSaga);
  yield takeLatest(GET_ALL_CONTACTS, getAllContactsSaga);
  yield takeLatest(GET_CONTACT_DETAILS, getContactDetailsSaga);
  yield takeLatest(DELETE_CONTACT, deleteContactSaga);
  yield takeLatest(REPLY_TO_CONTACT, replyToContactSaga);
  yield takeLatest(UPDATE_CONTACT_STATUS, updateContactStatusSaga);
  yield takeLatest(GET_CONTACT_STATISTICS, getContactStatisticsSaga);
}