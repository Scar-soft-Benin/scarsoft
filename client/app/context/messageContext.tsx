import { createContext, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addMessage, removeMessage } from "~/store/reducer/messageReducer";
import type { RootState } from "../store";

export type MessageType = "success" | "error" | "warning" | "info";

export interface Message {
    id: string;
    text: string;
    type: MessageType;
}

interface MessageContextType {
    messages: Message[];
    addMessage: (text: string, type: MessageType) => void;
    removeMessage: (id: string) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({
    children
}) => {
    const dispatch = useDispatch();
    const messages = useSelector((state: RootState) => state.message.messages);

    const addMessageHandler = (text: string, type: MessageType) => {
        const id = Math.random().toString(36).substr(2, 9); // Generate ID for auto-remove
        dispatch(addMessage({ text, type }));
        // Auto-remove after 3 seconds
        setTimeout(() => {
            dispatch(removeMessage({ id }));
        }, 3000);
    };

    const removeMessageHandler = (id: string) => {
        dispatch(removeMessage({ id }));
    };

    return (
        <MessageContext.Provider
            value={{
                messages,
                addMessage: addMessageHandler,
                removeMessage: removeMessageHandler
            }}
        >
            {children}
        </MessageContext.Provider>
    );
};

export const useMessage = () => {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error("useMessage must be used within a MessageProvider");
    }
    return context;
};
