import { createContext, useContext, useState, useCallback } from "react";

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
    const [messages, setMessages] = useState<Message[]>([]);

    const addMessage = useCallback((text: string, type: MessageType) => {
        const id = Math.random().toString(36).substr(2, 9); // Simple unique ID
        setMessages((prev) => [...prev, { id, text, type }]);
        // Auto-remove after 3 seconds
        setTimeout(() => {
            setMessages((prev) => prev.filter((msg) => msg.id !== id));
        }, 3000);
    }, []);

    const removeMessage = useCallback((id: string) => {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
    }, []);

    return (
        <MessageContext.Provider
            value={{ messages, addMessage, removeMessage }}
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
