import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useLoading } from "~/context/loadingContext";

export default function Loading() {
    const { isLoading } = useLoading();
    const overlayRef = useRef<HTMLDivElement>(null);
    const spinnerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (overlayRef.current && spinnerRef.current) {
            if (isLoading) {
                // Fade in animation
                gsap.fromTo(
                    overlayRef.current,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.5, ease: "power3.out" }
                );
                gsap.fromTo(
                    spinnerRef.current,
                    { scale: 0.8, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.5, ease: "power3.out" }
                );
                // Rotate spinner
                gsap.to(spinnerRef.current, {
                    rotation: 360,
                    duration: 1,
                    repeat: -1,
                    ease: "linear"
                });
            } else {
                // Fade out animation
                gsap.to(overlayRef.current, {
                    opacity: 0,
                    duration: 0.5,
                    ease: "power3.out",
                    onComplete: () => {
                        gsap.set(overlayRef.current, { display: "none" });
                    }
                });
                gsap.to(spinnerRef.current, {
                    opacity: 0,
                    scale: 0.8,
                    duration: 0.5,
                    ease: "power3.out"
                });
            }
        }
    }, [isLoading]);

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            style={{ display: isLoading ? "flex" : "none" }}
        >
            <div
                ref={spinnerRef}
                className="w-16 h-16 border-4 border-t-secondary border-gray-200 rounded-full animate-spin"
            ></div>
        </div>
    );
}
