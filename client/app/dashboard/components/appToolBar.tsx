// components/AppToolbar.tsx
import type { ReactNode } from "react";

interface AppToolbarProps {
    left?: ReactNode;
    right?: ReactNode;
    className?: string;
}

export default function AppToolbar({
    left,
    right,
    className = ""
}: AppToolbarProps) {
    return (
        <div
            className={`flex flex-wrap justify-between items-center mb-4 ${className}`}
        >
            <div>{left}</div>
            <div>{right}</div>
        </div>
    );
}
