import { motion, AnimatePresence } from "motion/react";
import { type JSX } from "react";
import {
    useMessage,
    type MessageType,
    type Message
} from "~/context/messageContext";
import {
    FiCheckCircle,
    FiAlertTriangle,
    FiXCircle,
    FiInfo
} from "react-icons/fi";

const typeStyles: Record<MessageType, string> = {
    success: "bg-green-100 border-green-500 text-green-700",
    error: "bg-red-100 border-red-500 text-red-700",
    warning: "bg-yellow-100 border-yellow-500 text-yellow-700",
    info: "bg-blue-100 border-blue-500 text-blue-700"
};

const typeIcons: Record<MessageType, JSX.Element> = {
    success: <FiCheckCircle className="w-5 h-5" />,
    error: <FiXCircle className="w-5 h-5" />,
    warning: <FiAlertTriangle className="w-5 h-5" />,
    info: <FiInfo className="w-5 h-5" />
};

export default function Message() {
    const { messages, removeMessage } = useMessage();

    return (
        <div className="fixed top-4 right-4 space-y-2 z-50">
            <AnimatePresence>
                {messages.map((message) => (
                    <MessageItem
                        key={message.id}
                        message={message}
                        onClose={() => removeMessage(message.id)}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}

interface MessageItemProps {
    message: Message;
    onClose: () => void;
}

function MessageItem({ message, onClose }: MessageItemProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`flex items-center p-4 border-l-4 rounded-md shadow-md ${
                typeStyles[message.type]
            }`}
            role="alert"
        >
            <span className="mr-2">{typeIcons[message.type]}</span>
            <span className="flex-1">{message.text}</span>
            <button onClick={onClose} className="ml-2 focus:outline-none">
                <FiXCircle className="w-4 h-4" />
            </button>
        </motion.div>
    );
}
