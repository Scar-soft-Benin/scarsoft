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
        <div ref={titleRef} className="text-center py-8">
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">{title}</h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-4">{subtitle}</p>
            {children}
        </div>
    );
};

export default AppBaseTitle;
