import { useEffect, useRef } from "react";
import { gsap } from "~/utils/gsap";

interface AppBaseTitleProps {
    title: string;
    subtitle: string;
    children?: React.ReactNode;
}

const AppBaseTitle: React.FC<AppBaseTitleProps> = ({
    title,
    subtitle,
    children
}) => {
    const titleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.fromTo(
            titleRef.current,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: titleRef.current,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    }, []);

    return (
        <div 
            ref={titleRef} 
            className="relative w-full h-32 md:h-40 bg-gradient-to-r from-green-100 via-green-50 to-green-100/30 flex items-center px-6 md:px-12 lg:px-24"
        >
            {/* Titre principal à gauche */}
            <div className="flex-shrink-0">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-800">
                    {title}
                </h1>
            </div>
            
            {/* Sous-titre à droite */}
            <div className="flex-1 ml-8 md:ml-16 flex items-center">
                <p className="text-sm md:text-lg lg:text-xl text-gray-600 font-medium">
                    {subtitle}
                </p>
            </div>
            
            {/* Children si présents */}
            {children && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    {children}
                </div>
            )}
        </div>
    );
};

export default AppBaseTitle;