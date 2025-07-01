// components/AppBaseTag.tsx
import React from "react";

interface AppBaseTagProps {
    value: string;
    severity?: "success" | "info" | "warning" | "secondary";
    className?: string;
}

const AppBaseTag: React.FC<AppBaseTagProps> = ({
    value,
    severity = "info",
    className = ""
}) => {
    const severityStyles = {
        success: "bg-green-100 text-green-800 border-green-300",
        info: "bg-blue-100 text-blue-800 border-blue-300",
        warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
        secondary: "bg-gray-100 text-gray-800 border-gray-300"
    };

    return (
        <span
            className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold border ${severityStyles[severity]} ${className}`}
        >
            {value}
        </span>
    );
};

export default AppBaseTag;
