import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import Navbar from "./navbar";
import AppBaseButton from "~/components/appBaseButton";

interface HeaderProps {
    bannerImage: string;
    title: string;
    subtitle: string;
    btnText: string;
}

const Header: React.FC<HeaderProps> = ({
    bannerImage,
    title,
    subtitle,
    btnText
}) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (imageLoaded && contentRef.current) {
            // Animate title, subtitle, and button
            gsap.fromTo(
                contentRef.current.querySelectorAll("h2, p, div"),
                {
                    opacity: 0,
                    y: 50,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    stagger: 0.3,
                    ease: "power3.out",
                    delay: 0.2,
                }
            );
        }
    }, [imageLoaded]);

    return (
        <div className="p-2">
            {/* Blurred Placeholder */}
            <div
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${
                    imageLoaded ? "opacity-0" : "opacity-100 blur-lg"
                }`}
                style={{ backgroundImage: `url(${bannerImage}?w=50&blur=10)` }}
            ></div>

            {/* Hidden <img> to detect when the high-quality image is fully loaded */}
            <img
                src={bannerImage}
                alt="Background"
                className="hidden"
                onLoad={() => setImageLoaded(true)}
            />

            {/* Full-Quality Background */}
            <div
                className={`min-h-screen bg-cover bg-center text-center rounded-3xl transition-opacity duration-500 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                style={{ backgroundImage: `url(${bannerImage})` }}
            >
                <div className="flex flex-col items-center justify-center min-h-screen text-center text-white px-6 rounded-3xl bg-dim-green">
                    <div className="absolute left-0 top-0">
                        <Navbar />
                    </div>
                    <div
                        className="flex flex-col items-center mt-20 max-w-8xl"
                        ref={contentRef}
                    >
                        <h2 className="font-bold text-4xl md:text-8xl leading-tight">
                            {title}
                        </h2>
                        <p className="text-xl md:text-2xl mt-4">{subtitle}</p>
                        <div className="mt-12">
                            <AppBaseButton
                                text={btnText}
                                textColor="text-black"
                                bgColor="bg-green-500"
                                type="second"
                                href={undefined}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;