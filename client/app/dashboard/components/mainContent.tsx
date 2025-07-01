// ~/dashboard/components/MainContent.tsx
import { Outlet } from "react-router";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function MainContent() {
    const mainRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (mainRef.current) {
            gsap.fromTo(
                mainRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.5, ease: "power3.out" }
            );
        }
    }, []);

    return (
        <main
            ref={mainRef}
            className="flex-1 p-6 bg-neutral-light-bg dark:bg-neutral-dark-bg"
        >
            <Outlet />
        </main>
    );
}
