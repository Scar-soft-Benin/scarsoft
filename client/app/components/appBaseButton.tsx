// components/AppBaseButton.tsx
import React from "react";

interface AppBaseButtonProps {
    text: string;
    textColor: string;
    bgColor: string;
    type: "first" | "second";
    href?: string;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
    icon?: React.ReactNode; // Add icon prop
    iconPos?: "left" | "right"; // Add icon position prop
}

const AppBaseButton: React.FC<AppBaseButtonProps> = ({
    text,
    textColor,
    bgColor,
    type,
    href,
    className = "",
    onClick,
    icon,
    iconPos = "left", // Default to left if not specified
    ...rest
}) => {
    const baseStyles =
        "px-5 py-2 flex items-center justify-center transition-all";
    const typeStyles =
        type === "first"
            ? "p-[10px_20px] rounded-[50px]"
            : "p-[10px_20px] rounded-[50px] border border-solid";
    const classes =
        `${baseStyles} ${typeStyles} ${bgColor} ${textColor} ${className}`.trim();

    const content = (
        <>
            {icon && iconPos === "left" && <span className="mr-2">{icon}</span>}
            {text}
            {icon && iconPos === "right" && (
                <span className="ml-2">{icon}</span>
            )}
        </>
    );

    if (href) {
        return (
            <a
                href={href}
                className={classes}
                onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
                {...(rest as React.HTMLAttributes<HTMLAnchorElement>)}
            >
                {content}
            </a>
        );
    }

    return (
        <button
            className={classes}
            onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
            {...(rest as React.HTMLAttributes<HTMLButtonElement>)}
        >
            {content}
        </button>
    );
};

export default AppBaseButton;
