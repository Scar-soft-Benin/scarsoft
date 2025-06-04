import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "~/utils/gsap"; // Adjust if direct import needed
import partner1 from "./chinese-company-logo.jpeg";
import partner2 from "./connect-logo.jpeg";
import partner3 from "./ohie-logo.jpeg";
import partner4 from "./halal-logo.jpeg";
import partner5 from "./name-logo.jpeg";
import aboutImg from "./about-img.jpeg";
import AppBaseButton from "~/components/appBaseButton";
import AppBaseTitle from "~/components/appBaseTitle";

const partners = [
    { logo: partner1, title: "Partner One", url: "https://partnerone.com" },
    { logo: partner2, title: "Partner Two", url: "https://partnertwo.com" },
    { logo: partner3, title: "Partner Three", url: "https://partnerthree.com" },
    { logo: partner4, title: "Partner Four", url: "https://partnertwo.com" },
    { logo: partner5, title: "Partner Five", url: "https://partnerthree.com" }
];

const About = () => {
    const partnersRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const partnersTl = useRef<GSAPTimeline | null>(null);
    const contentTl = useRef<GSAPTimeline | null>(null);

    useEffect(() => {
        // Animate partner logos
        if (partnersRef.current) {
            const partnerLinks = partnersRef.current.querySelectorAll("a");
            if (partnerLinks.length > 0) {
                partnersTl.current = gsap.timeline({ paused: true });
                partnersTl.current.fromTo(
                    partnerLinks,
                    { opacity: 0, scale: 0.8 },
                    {
                        opacity: 1,
                        scale: 1,
                        duration: 0.8,
                        stagger: 0.2,
                        ease: "power2.out"
                    }
                );

                ScrollTrigger.create({
                    trigger: partnersRef.current,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse",
                    onEnter: () => partnersTl.current?.restart(),
                    onEnterBack: () => partnersTl.current?.restart(),
                    onLeave: () => partnersTl.current?.reverse(),
                    onLeaveBack: () => partnersTl.current?.reverse()
                });
            }
        }

        // Animate content section
        if (contentRef.current) {
            const contentElements =
                contentRef.current.querySelectorAll("p, div, img");
            if (contentElements.length > 0) {
                contentTl.current = gsap.timeline({ paused: true });
                contentTl.current.fromTo(
                    contentElements,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        stagger: 0.3,
                        ease: "power3.out"
                    }
                );

                ScrollTrigger.create({
                    trigger: contentRef.current,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse",
                    onEnter: () => contentTl.current?.restart(),
                    onEnterBack: () => contentTl.current?.restart(),
                    onLeave: () => contentTl.current?.reverse(),
                    onLeaveBack: () => contentTl.current?.reverse()
                });
            }
        }

        // Cleanup ScrollTrigger and timelines on unmount
        return () => {
            if (partnersTl.current) partnersTl.current.kill();
            if (contentTl.current) contentTl.current.kill();
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    return (
        <>
            <div ref={partnersRef} className="py-10 px-6">
                <div className="flex flex-wrap justify-center items-center gap-6">
                    {partners.map((partner, index) => (
                        <a
                            key={index}
                            href={partner.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center bg-white rounded-lg p-4 transition-transform hover:scale-105"
                        >
                            <img
                                src={partner.logo}
                                alt={partner.title}
                                className="w-32 h-16 object-contain mb-2 filter grayscale transition-all duration-300 hover:grayscale-0"
                            />
                            <p className="text-lg font-medium text-gray-700 transition-all duration-300 hover:text-black">
                                {partner.title}
                            </p>
                        </a>
                    ))}
                </div>
            </div>
            <AppBaseTitle
                title="À propos"
                subtitle="Une expertise reconnue, une approche sur mesure et un accompagnement de bout en bout."
            />
            <div
                ref={contentRef}
                className="flex flex-col md:flex-row items-center justify-center p-4 md:px-32 my-8"
            >
                <div className="flex flex-col p-4 items-start sm:mr-32 w-auto md:w-xl">
                    <p className="mb-6 sm:mb-16 text-md md:text-2xl">
                        Scar-Soft est une entreprise spécialisée dans le
                        développement d’applications, de logiciels sur mesure,
                        le marketing digital, le community management et le
                        recrutement IT. Notre mission est d’apporter des
                        solutions fiables et innovantes adaptées aux besoins de
                        nos clients.
                    </p>
                    <AppBaseButton
                        text="En savoir plus"
                        textColor="text-dark"
                        bgColor="bg-secondary"
                        type="first"
                        href="/a-propos"
                    />
                </div>
                <div className="mt-4 w-auto md:w-2xl">
                    <img
                        src={aboutImg}
                        alt="À propos"
                        className="object-cover"
                    />
                </div>
            </div>
        </>
    );
};

export default About;
