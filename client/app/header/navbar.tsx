import { useEffect, useState, useRef } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { gsap } from "gsap";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import AppBaseButton from "~/components/appBaseButton";
import Logo from "./SS-Mono.png";

const Navbar = () => {
  const { t } = useTranslation();
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
      gsap.fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)", delay: 0.5 }
      );

      logoRef.current.addEventListener("mouseenter", () => {
        gsap.to(logoRef.current, { scale: 1.1, duration: 0.3, ease: "power2.out" });
      });
      logoRef.current.addEventListener("mouseleave", () => {
        gsap.to(logoRef.current, { scale: 1, duration: 0.3, ease: "power2.out" });
      });
    }
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
          scrolled ? "z-50 rounded-3xl shadow-lg bg-dime-green" : "bg-transparent z-50"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          {/* Logo */}
          <Link to="/">
            <img
              src={Logo}
              alt="ScarSoft Logo"
              className="h-15 w-48 object-contain"
              ref={logoRef}
            />
          </Link>

          {/* Menu toggle (mobile) */}
          <div className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <button className="text-3xl">{isMenuOpen ? <FiX /> : <FiMenu />}</button>
          </div>

          {/* Menu (desktop) */}
          <ul className="hidden md:flex space-x-6 font-chivo">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link to={item.link} className="hover:text-secondary transition">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Contact button */}
          <div className="hidden md:block">
            <AppBaseButton
              text={t("navbar.contact")}
              textColor="text-primary-dark"
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
