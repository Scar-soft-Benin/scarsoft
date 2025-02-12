import React from "react";
import partner1 from "./chinese-company-logo.jpeg";
import partner2 from "./connect-logo.jpeg";
import partner3 from "./ohie-logo.jpeg";
import partner4 from "./halal-logo.jpeg";
import partner5 from "./name-logo.jpeg";
import AppBaseButton from "~/components/appBaseButton";
import aboutImg from "./about-img.jpeg";
import AppBaseTitle from "~/components/appBaseTitle";

const About = () => {
    return (
        <>
            <div className="py-10 px-6">
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
            <div className="flex flex-col md:flex-row items-center justify-center p-4 md:px-32 my-8">
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
                        textColor="text-ddark"
                        bgColor="bg-secondary"
                        type="first"
                        href={undefined}
                    />
                </div>
                <div className="mt-4 w-auto md:w-2xl">
                    <img
                        src={aboutImg}
                        alt="a propos"
                        className="object-cover"
                    />
                </div>
            </div>
        </>
    );
};

export default About;

const partners = [
    {
        logo: partner1,
        title: "Partner One",
        url: "https://partnerone.com"
    },
    {
        logo: partner2,
        title: "Partner Two",
        url: "https://partnertwo.com"
    },
    {
        logo: partner3,
        title: "Partner Three",
        url: "https://partnerthree.com"
    },
    {
        logo: partner4,
        title: "Partner Four",
        url: "https://partnertwo.com"
    },
    {
        logo: partner5,
        title: "Partner Five",
        url: "https://partnerthree.com"
    }
];
