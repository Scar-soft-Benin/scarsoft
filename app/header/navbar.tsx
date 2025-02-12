import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi"; // Importing icons from react-icons/fi
import AppBaseButton from "~/components/appBaseButton";

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage drawer visibility

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
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
                    {/* Logo */}
                    <div>SCAR-SOFT</div>

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
                            href="/contact"
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
