import { useEffect, useState, useRef } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { gsap } from "gsap";
import AppBaseButton from "~/components/appBaseButton";
import Logo from "./SS-Mono.png"; // Adjust path to your SVG
import { Link } from "react-router";

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const logoRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (logoRef.current) {
            // Animate logo
            gsap.fromTo(
                logoRef.current,
                {
                    opacity: 0,
                    scale: 0.8,
                },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    ease: "back.out(1.7)",
                    delay: 0.5,
                }
            );

            // Hover effect
            logoRef.current.addEventListener("mouseenter", () => {
                gsap.to(logoRef.current, {
                    scale: 1.1,
                    duration: 0.3,
                    ease: "power2.out",
                });
            });
            logoRef.current.addEventListener("mouseleave", () => {
                gsap.to(logoRef.current, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out",
                });
            });
        }
    }, []);

    const menuItems = [
        { name: "Accueil", link: "/" },
        { name: "À propos", link: "a-propos" },
        { name: "Nos Services", link: "nos-service" },
        { name: "Projets", link: "maintenance" },
        { name: "Carrières", link: "maintenance" }
    ];

    return (
        <div className="p-2">
            <nav
                className={`w-[calc(99vw-0.75rem)] fixed transition-all duration-300 ${
                    scrolled
                        ? "z-50 rounded-3xl shadow-lg bg-dim-green"
                        : "bg-transparent z-50"
                }`}
            >
                <div className="container mx-auto flex justify-between items-center py-4 px-6">
                    {/* SVG Logo */}
                    <Link to="/" >
                        <img
                            src={Logo}
                            alt="ScarSoft Logo"
                            className="h-15 w-48 object-contain"
                            ref={logoRef}
                        />
                    </Link>

                    {/* Hamburger Icon (only on small screens) */}
                    <div
                        className="md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <button className="text-3xl">
                            {isMenuOpen ? <FiX /> : <FiMenu />}
                        </button>
                    </div>

                    {/* Menu (only on larger screens) */}
                    <ul className="hidden md:flex space-x-6 font-chivo">
                        {menuItems.map((item, index) => (
                            <li key={index}>
                                <a
                                    href={item.link}
                                    className="hover:text-secondary transition"
                                >
                                    {item.name}
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* Contact Button (hidden on small screens) */}
                    <div className="hidden md:block">
                        <AppBaseButton
                            text="Contactez nous"
                            textColor="text-dark"
                            bgColor="bg-secondary"
                            type="first"
                            href="/contactez-nous"
                        />
                    </div>
                </div>
            </nav>

            {/* Drawer (only visible on small screens when menu is open) */}
            {isMenuOpen && (
                <div className="md:hidden pl-2 pt-2 fixed inset-0 bg-transparent bg-opacity-50 z-40">
                    <div className="bg-black w-2/3 h-full p-6 rounded-tl-3xl">
                        <ul className="space-y-10 mt-16 flex items-start flex-col">
                            {menuItems.map((item, index) => (
                                <li key={index}>
                                    <a
                                        href={item.link}
                                        className="hover:text-secondary transition"
                                    >
                                        {item.name}
                                    </a>
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