import { useEffect, useRef } from "react";
import About from "~/about-us/about";
import Contact from "~/contact/contact";
import NosProject from "~/nos-projets/nos-projet";
import Service from "~/nos-service/service";
import { gsap } from "~/utils/gsap";

export function Welcome() {
    const welcomeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.fromTo(
            welcomeRef.current,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: welcomeRef.current,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    }, []);

    return (
        <div ref={welcomeRef}>
            <About />
            <Service />
            <NosProject />
            <Contact />
        </div>
    );
}
