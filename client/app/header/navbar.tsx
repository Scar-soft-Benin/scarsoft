import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi"; // Add FiChevronDown
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import AppBaseButton from "~/components/appBaseButton";
import Logo from "./SS-Mono.png";

const Navbar = () => {
    const { t } = useTranslation();
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openSubMenu, setOpenSubMenu] = useState<string | null>(null); // Track open sub-menu in mobile

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
        {
            name: t("navbar.services"),
            link: "#",
            subItems: [
                { name: t("navbar.itSolutions"), link: "/nos-service/solution-it" },
                { name: t("navbar.digitalMarketing"), link: "/nos-service/marketing-digital" },
                { name: t("navbar.recruitment"), link: "/nos-service/recrutement" },
            ],
        },
        { name: t("navbar.projects"), link: "/nos-projets" },
        { name: t("navbar.careers"), link: "/carrieres" },
    ];

    const toggleSubMenu = (name: string) => {
        setOpenSubMenu(openSubMenu === name ? null : name);
    };

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
                                delay: 0.5,
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
                            <li key={index} className="relative group">
                                <Link
                                    to={item.link}
                                    className="hover:text-secondary transition flex items-center"
                                >
                                    {item.name}
                                    {item.subItems && (
                                        <FiChevronDown className="ml-1" />
                                    )}
                                </Link>
                                {item.subItems && (
                                    <ul className="absolute left-0 mt-2 w-48 bg-dime-green rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                                        {item.subItems.map((subItem, subIndex) => (
                                            <li key={subIndex}>
                                                <Link
                                                    to={subItem.link}
                                                    className="block px-4 py-2 text-sm hover:bg-secondary hover:text-white transition"
                                                >
                                                    {subItem.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
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
                                    <div className="flex flex-col">
                                        <div className="flex items-center">
                                            <Link
                                                to={item.link}
                                                className="hover:text-secondary transition"
                                                onClick={() => {
                                                    if (!item.subItems) {
                                                        setIsMenuOpen(false);
                                                    }
                                                }}
                                            >
                                                {item.name}
                                            </Link>
                                            {item.subItems && (
                                                <button
                                                    onClick={() => toggleSubMenu(item.name)}
                                                    className="ml-2"
                                                >
                                                    <FiChevronDown
                                                        className={`transition-transform ${
                                                            openSubMenu === item.name ? "rotate-180" : ""
                                                        }`}
                                                    />
                                                </button>
                                            )}
                                        </div>
                                        {item.subItems && openSubMenu === item.name && (
                                            <ul className="ml-4 mt-2 space-y-4">
                                                {item.subItems.map((subItem, subIndex) => (
                                                    <li key={subIndex}>
                                                        <Link
                                                            to={subItem.link}
                                                            className="hover:text-secondary transition text-sm"
                                                            onClick={() => setIsMenuOpen(false)}
                                                        >
                                                            {subItem.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
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