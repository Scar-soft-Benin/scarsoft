import { useEffect, useRef, type JSX } from "react";
import { gsap } from "gsap";
import { useMessage, type MessageType, type Message } from "~/context/messageContext"; // Import Message
import { FiCheckCircle, FiAlertTriangle, FiXCircle, FiInfo } from "react-icons/fi";

const typeStyles: Record<MessageType, string> = {
  success: "bg-green-100 border-green-500 text-green-700",
  error: "bg-red-100 border-red-500 text-red-700",
  warning: "bg-yellow-100 border-yellow-500 text-yellow-700",
  info: "bg-blue-100 border-blue-500 text-blue-700",
};

const typeIcons: Record<MessageType, JSX.Element> = {
  success: <FiCheckCircle className="w-5 h-5" />,
  error: <FiXCircle className="w-5 h-5" />,
  warning: <FiAlertTriangle className="w-5 h-5" />,
  info: <FiInfo className="w-5 h-5" />,
};

export default function Message() {
  const { messages, removeMessage } = useMessage();

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} onClose={() => removeMessage(message.id)} />
      ))}
    </div>
  );
}

interface MessageItemProps {
  message: Message;
  onClose: () => void;
}

function MessageItem({ message, onClose }: MessageItemProps) {
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageRef.current) {
      // Fade in and slide from right
      gsap.fromTo(
        messageRef.current,
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" }
      );
    }
  }, []);

  const handleClose = () => {
    if (messageRef.current) {
      // Fade out and slide right
      gsap.to(messageRef.current, {
        opacity: 0,
        x: 50,
        duration: 0.5,
        ease: "power3.out",
        onComplete: onClose,
      });
    }
  };

  return (
    <div
      ref={messageRef}
      className={`flex items-center p-4 border-l-4 rounded-md shadow-md ${typeStyles[message.type]}`}
      role="alert"
    >
      <span className="mr-2">{typeIcons[message.type]}</span>
      <span className="flex-1">{message.text}</span>
      <button onClick={handleClose} className="ml-2 focus:outline-none">
        <FiXCircle className="w-4 h-4" />
      </button>
    </div>
  );
}