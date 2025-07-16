import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import AppBaseButton from "~/components/appBaseButton";
import Logo from "./SS-Mono.png";

const Navbar = () => {
    const { t } = useTranslation();
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const menuItems = [
        { name: t("navbar.home"), link: "/" },
        { name: t("navbar.about"), link: "/a-propos" },
        { name: t("navbar.services"), link: "/nos-service" },
        { name: t("navbar.projects"), link: "/nos-projets" },
        { name: t("navbar.careers"), link: "/carrieres" }
    ];

    return (
        <div className="p-2">
            <nav
                className={`w-[calc(99vw-0.75rem)] fixed duration-300 ${
                    scrolled
                        ? "z-50 rounded-3xl shadow-lg bg-dime-green"
                        : "bg-transparent z-50"
                }`}
            >
                <div className="container mx-auto flex justify-between items-center py-4 px-6">
                    {/* Logo */}
                    <Link to="/">
                        <motion.img
                            src={Logo}
                            alt="ScarSoft Logo"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.1 }}
                            transition={{
                                duration: 0.8,
                                ease: [0.68, -0.55, 0.265, 1.55],
                                delay: 0.5
                            }}
                            className="h-15 w-48 object-contain"
                        />
                    </Link>

                    {/* Menu toggle (mobile) */}
                    <div
                        className="md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <button className="text-3xl">
                            {isMenuOpen ? <FiX /> : <FiMenu />}
                        </button>
                    </div>

                    {/* Menu (desktop) */}
                    <ul className="hidden md:flex space-x-6 font-chivo">
                        {menuItems.map((item, index) => (
                            <li key={index}>
                                <Link
                                    to={item.link}
                                    className="hover:text-secondary transition"
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Contact button */}
                    <div className="hidden md:block">
                        <AppBaseButton
                            text={t("navbar.contact")}
                            textColor="text-blackk"
                            bgColor="bg-secondary"
                            type="first"
                            href="/contactez-nous"
                        />
                    </div>
                </div>
            </nav>

            {/* Mobile drawer */}
            {isMenuOpen && (
                <div className="md:hidden pl-2 pt-2 fixed inset-0 bg-transparent bg-opacity-50 z-40">
                    <div className="bg-black w-2/3 h-full p-6 rounded-tl-3xl">
                        <ul className="space-y-10 mt-16 flex items-start flex-col">
                            {menuItems.map((item, index) => (
                                <li key={index}>
                                    <Link
                                        to={item.link}
                                        className="hover:text-secondary transition"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;
