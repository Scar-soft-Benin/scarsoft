// components/AppBaseCard.tsx
import React from "react";

interface AppBaseCardProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

const AppBaseCard: React.FC<AppBaseCardProps> = ({
    children,
    className = "",
    style
}) => {
    return (
        <div
            className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${className}`}
            style={style}
        >
            {children}
        </div>
    );
};

export default AppBaseCard;
