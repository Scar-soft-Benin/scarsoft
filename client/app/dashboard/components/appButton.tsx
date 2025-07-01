// ~/components/AppButton.tsx
import { type ReactNode } from "react";

interface AppButtonProps {
    label?: string;
    icon?: ReactNode;
    className?: string;
    onClick?: () => void;
    type?: "primary" | "secondary" | "danger" | "warning" | "info";
    size?: "sm" | "md" | "lg";
    outlined?: boolean;
    tooltip?: string;
    disabled?: boolean;
}

export default function AppButton({
    label,
    icon,
    className = "",
    onClick,
    type = "primary",
    size = "md",
    outlined = false,
    tooltip,
    disabled = false
}: AppButtonProps) {
    const typeStyles = {
        primary: outlined
            ? "border-primary text-primary hover:bg-primary hover:text-neutral-dark-text"
            : "bg-primary text-neutral-dark-text hover:bg-primary-light",
        secondary: outlined
            ? "border-neutral-light-border dark:border-neutral-dark-border text-neutral-light-text dark:text-neutral-dark-text hover:bg-neutral-light-bg dark:hover:bg-neutral-dark-bg"
            : "bg-neutral-light-bg dark:bg-neutral-dark-bg text-neutral-light-text dark:text-neutral-dark-text hover:bg-neutral-light-surface dark:hover:bg-neutral-dark-surface",
        danger: outlined
            ? "border-danger text-danger hover:bg-danger hover:text-neutral-dark-text"
            : "bg-danger text-neutral-dark-text hover:bg-danger/90",
        warning: outlined
            ? "border-warning text-warning hover:bg-warning hover:text-neutral-dark-text"
            : "bg-warning text-neutral-dark-text hover:bg-warning/90",
        info: outlined
            ? "border-info text-info hover:bg-info hover:text-neutral-dark-text"
            : "bg-info text-neutral-dark-text hover:bg-info/90"
    };

    const sizeStyles = {
        sm: "px-2 py-1 text-sm",
        md: "px-4 py-2",
        lg: "px-6 py-3 text-lg"
    };

    return (
        <button
            className={`flex items-center gap-2 rounded-md font-medium ${
                typeStyles[type]
            } ${sizeStyles[size]} ${outlined ? "bg-transparent" : ""} ${
                disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"
            } ${className}`}
            onClick={onClick}
            title={tooltip}
            disabled={disabled}
            aria-label={tooltip || label}
        >
            {icon}
            {label}
        </button>
    );
}
