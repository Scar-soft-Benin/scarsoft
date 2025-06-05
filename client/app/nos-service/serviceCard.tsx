import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

interface ServiceCardProps {
    image: string;
    title: string;
    description: string;
    alignment: "left" | "right";
}

const ServiceCard: React.FC<ServiceCardProps> = ({
    image,
    title,
    description,
    alignment
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const tl = useRef<GSAPTimeline | null>(null);

    useEffect(() => {
        if (cardRef.current) {
            // Set initial position based on alignment
            const initialX = alignment === "left" ? -100 : 100;

            // Initialize timeline
            tl.current = gsap.timeline({ paused: true });
            tl.current.fromTo(
                cardRef.current,
                {
                    opacity: 0,
                    x: initialX
                },
                {
                    opacity: 1,
                    x: 0,
                    duration: 2.5,
                    ease: "slow(0.7,0.7,false)" // Fallback to "power3.out" if custom ease is unavailable
                }
            );

            // Create ScrollTrigger
            ScrollTrigger.create({
                trigger: cardRef.current,
                start: "top 80%", // Start when top of card is 80% from viewport top
                end: "bottom 20%", // End when bottom of card is 20% from viewport top
                toggleActions: "play none none reverse", // Play on enter, reverse on leave
                onEnter: () => {
                    if (tl.current) {
                        tl.current.restart(); // Restart animation on enter
                    }
                },
                onEnterBack: () => {
                    if (tl.current) {
                        tl.current.restart(); // Restart animation on re-entry from bottom
                    }
                },
                onLeave: () => {
                    if (tl.current) {
                        tl.current.reverse(); // Reverse animation when leaving
                    }
                },
                onLeaveBack: () => {
                    if (tl.current) {
                        tl.current.reverse(); // Reverse animation when leaving upward
                    }
                }
            });
        }

        // Cleanup ScrollTrigger on unmount
        return () => {
            if (tl.current) {
                tl.current.kill();
            }
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, [alignment]);

    return (
        <div
            ref={cardRef}
            className={`flex flex-col sm:flex-row items-center ${
                alignment === "left"
                    ? "justify-baseline sm:ml-36"
                    : "justify-end sm:mr-36"
            } mb-12 sm:mb-24`}
        >
            <div
                className="rounded-3xl w-[80vw] sm:w-72 h-72 bg-cover bg-center mt-10"
                style={{ backgroundImage: `url(${image})` }}
            ></div>
            <div
                className="-mt-12 sm:mt-10 sm:-ml-12 rounded-lg flex flex-col bg-white border-xs p-4 w-[78vw] sm:w-lg"
                style={{ boxShadow: "0px 0px 20px 0px #04FF001A" }}
            >
                <h3 className="text-xl sm:text-4xl mb-6 font-bold">{title}</h3>
                <p className="text-left">{description}</p>
            </div>
        </div>
    );
};

export default ServiceCard;
