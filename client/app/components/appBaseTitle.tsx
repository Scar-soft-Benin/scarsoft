import React from "react";
import ellipse from "./Ellipse-4.png";

interface AppBaseTitleProps {
    title: string;
    subtitle?: string;
    children?: React.ReactNode; // Optional children prop
}

const AppBaseTitle: React.FC<AppBaseTitleProps> = ({
    title,
    subtitle,
    children
}) => {
    return (
        <div className="mx-4 my-16 px-8 md:px-32 flex flex-col relative">
            <div className="flex flex-col md:flex-row items-center sm:justify-between">
                <div className="flex flex-col sm:flex-row items-center">
                    <img
                        src={ellipse}
                        alt="ellipse"
                        className="absolute w-96 h-96 left-0 -top-48 sm:-top-36"
                    />
                    <h2 className="font-chivo text-4xl md:text-6xl">{title}</h2>
                    <p className="sm:ml-6 sm:text-xl mt-4">{subtitle}</p>
                </div>
                {children}
            </div>
            <div className="my-4 w-[80vw] border-t-1 border-gray-200"></div>
        </div>
    );
};

export default AppBaseTitle;
