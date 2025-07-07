import { type Message, type MessageType } from "~/context/messageContext";
import { createAction } from "@reduxjs/toolkit";

// Action Types
export const ADD_MESSAGE = "ADD_MESSAGE";
export const REMOVE_MESSAGE = "REMOVE_MESSAGE";

// Define Action Payloads
interface AddMessagePayload {
    text: string;
    type: MessageType;
}

interface RemoveMessagePayload {
    id: string;
}

// Action Creators
export const addMessage = createAction<AddMessagePayload>(ADD_MESSAGE);
export const removeMessage = createAction<RemoveMessagePayload>(REMOVE_MESSAGE);

interface MessageState {
    messages: Message[];
}

const initialState: MessageState = {
    messages: []
};

type MessageAction =
    | ReturnType<typeof addMessage>
    | ReturnType<typeof removeMessage>;

const messageReducer = (
    state = initialState,
    action: MessageAction
): MessageState => {
    switch (action.type) {
        case ADD_MESSAGE: {
            const id = Math.random().toString(36).substr(2, 9); // Generate ID in reducer
            const { text, type } = action.payload as AddMessagePayload;
            const newMessage: Message = {
                id,
                text,
                type
            };
            return {
                ...state,
                messages: [...state.messages, newMessage]
            };
        }
        case REMOVE_MESSAGE: {
            const { id } = action.payload as RemoveMessagePayload;
            return {
                ...state,
                messages: state.messages.filter(
                    (msg) => msg.id !== id
                )
            };
        }
        default:
            return state;
    }
};

export default messageReducer;
