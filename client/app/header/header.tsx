import { useState } from "react";
import { motion } from "motion/react";
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

    return (
        <div className="p-2">
            {/* Blurred Placeholder */}
            <div
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${
                    imageLoaded ? "opacity-0" : "opacity-100 blur-lg"
                }`}
                style={{
                    backgroundImage: `url(${bannerImage}?w=50&blur=10)`
                }}
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
                <div className="flex flex-col items-center justify-center min-h-screen text-center text-white px-6 rounded-3xl bg-dime-green">
                    <div className="absolute left-0 top-0">
                        <Navbar />
                    </div>
                    <div className="flex flex-col items-center mt-20">
                        <motion.h2
                            initial={{ opacity: 0, y: 50 }}
                            animate={
                                imageLoaded
                                    ? { opacity: 1, y: 0 }
                                    : { opacity: 0, y: 50 }
                            }
                            transition={{
                                duration: 1,
                                ease: "easeOut",
                                delay: 0.2
                            }}
                            className="font-bold text-4xl md:text-6xl leading-tight"
                        >
                            {title}
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 50 }}
                            animate={
                                imageLoaded
                                    ? { opacity: 1, y: 0 }
                                    : { opacity: 0, y: 50 }
                            }
                            transition={{
                                duration: 1,
                                ease: "easeOut",
                                delay: 0.5
                            }}
                            className="text-lg md:text-lg mt-4"
                        >
                            {subtitle}
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={
                                imageLoaded
                                    ? { opacity: 1, y: 0 }
                                    : { opacity: 0, y: 50 }
                            }
                            transition={{
                                duration: 1,
                                ease: "easeOut",
                                delay: 0.8
                            }}
                            className="mt-12"
                        >
                            <AppBaseButton
                                text={btnText}
                                textColor="text-white"
                                bgColor="bg-transparent"
                                type="second"
                                href={undefined}
                            />
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
