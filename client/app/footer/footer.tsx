import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router";

const socialIcons = [
    { icon: <FaFacebook />, link: "#" },
    { icon: <FaTwitter />, link: "#" },
    { icon: <FaInstagram />, link: "#" },
    { icon: <FaLinkedin />, link: "#" }
];

const footerSections = [
    {
        title: "LIENS UTILES",
        links: ["Accueil", "Nos Services", "Nos Clients", "Projets", "Contact"]
    },
    {
        title: "SERVICES",
        links: [
            "Développement Web",
            "Design UI/UX",
            "Développement Mobile",
            "Consulting Tech",
            "Marketing digital",
            "Recrutement"
        ]
    }
];

const Footer = () => {
    return (
        <footer className="bg-black text-white h-full sm:h-[60vh] flex flex-col justify-between py-12">
            <div className="container mx-auto px-6 flex-grow">
                {/* Top Section */}
                <div className="flex flex-col md:flex-row justify-around gap-8">
                    {/* Company Info */}
                    <div className="flex flex-col items-baseline sm:items-center md:items-start">
                        <h2 className="text-2xl font-bold">SCAR SOFT</h2>
                        <div className="flex space-x-4 my-4">
                            {socialIcons.map((item, index) => (
                                <a
                                    key={index}
                                    href={item.link}
                                    className="text-xl cursor-pointer hover:text-secondary"
                                >
                                    {item.icon}
                                </a>
                            ))}
                        </div>
                        <p className="text-gray-400 text-center md:text-left">
                            Système informatique et logiciel
                        </p>
                    </div>

                    {/* Dynamic Sections */}
                    {footerSections.map((section, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-baseline sm:items-center md:items-start"
                        >
                            <h3 className="text-lg font-semibold mb-4">
                                {section.title}
                            </h3>
                            <ul className="space-y-2 text-gray-400">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <a
                                            href="#"
                                            className="hover:text-secondary transition-colors"
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Divider & Copyright (Always at the bottom) */}
            <div className="mx-6 sm:mx-16">
                <hr className="border-gray-600 my-6" />
                <div className="text-center text-gray-400 flex flex-col items-start sm:flex-row justify-center">
                    © 2025 SCAR SOFT. Tous droits réservés.
                    <Link to="/policy" style={{margin:"0 .5rem"}}>Politique de confidentialité</Link>
                    <Link to="/conditions">Condition d’utilisation</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
