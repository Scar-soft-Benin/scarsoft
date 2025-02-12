import AppBaseButton from "../components/appBaseButton.js";
import Navbar from "./navbar.js";
import bannerImage from "./banner.jpeg";
import { useState } from "react";

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
            {/* 🔥 Blurred Placeholder */}
            <div
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${
                    imageLoaded ? "opacity-0" : "opacity-100 blur-lg"
                }`}
                style={{ backgroundImage: `url(${bannerImage}?w=50&blur=10)` }} // Low-quality image
            ></div>

            {/* 🔥 Hidden <img> to detect when the high-quality image is fully loaded */}
            <img
                src={bannerImage}
                alt="Background"
                className="hidden"
                onLoad={() => setImageLoaded(true)} // ✅ Fires when the image is loaded
            />

            {/* 🔥 Full-Quality Background */}
            <div
                className={`min-h-screen bg-cover bg-center text-center rounded-3xl transition-opacity duration-500 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                style={{
                    backgroundImage: `url(${bannerImage})`
                }}
            >
                <div className="flex flex-col items-center justify-center min-h-screen text-center text-white px-6 rounded-3xl bg-dim-green">
                    <div className="absolute left-0 top-0">
                        <Navbar />
                    </div>
                    <div className="flex flex-col items-center mt-20 max-w-3xl ">
                        <h2 className="font-bold text-4xl md:text-6xl leading-tight">
                            {title}
                        </h2>
                        <p className="text-xl md:text-2xl mt-4">{subtitle}</p>

                        <div className="mt-12">
                            <AppBaseButton
                                text={btnText}
                                textColor="text-white"
                                bgColor="bg-transparent"
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
