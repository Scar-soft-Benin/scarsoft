import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FaGlobe } from "react-icons/fa";
import "./LanguageSelector.css"; // Import your CSS styles
const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "en", label: "English", flag: "🇺🇸" },
  ];

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = languages.find((l) => l.code === i18n.language) || languages[0];

  return (
    <>
      {/* Overlay */}
      <div className={`overlay ${menuOpen ? "active" : ""}`} onClick={toggleMenu}></div>

      {/* Floating Button */}
      <button
        className={`floating-language-btn ${menuOpen ? "active" : ""}`}
        onClick={toggleMenu}
        aria-label="Change language"
      >
        <FaGlobe className="globe-icon" />
        <div className="current-language">{current.code.toUpperCase()}</div>
      </button>

      {/* Language Menu */}
      <div ref={menuRef} className={`language-menu ${menuOpen ? "active" : ""}`}>
        {languages.map((lang) => (
          <button
            key={lang.code}
            type="button"
            className={`language-option ${
              i18n.language === lang.code ? "active" : ""
            }`}
            onClick={() => handleLanguageChange(lang.code)}
          >
            <span className="flag">{lang.flag}</span>
            <span>{lang.label}</span>
          </button>
        ))}
      </div>
    </>
  );
};

export default LanguageSelector;
