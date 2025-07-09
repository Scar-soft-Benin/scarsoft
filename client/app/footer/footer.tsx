import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import Logo from "../header/SS-Vert.svg";

const Footer = () => {
  const { t } = useTranslation();

  const socialIcons = [
    { icon: <FaFacebook />, link: "#" },
    { icon: <FaTwitter />, link: "#" },
    { icon: <FaInstagram />, link: "#" },
    { icon: <FaLinkedin />, link: "#" }
  ];

  const footerSections = [
    {
      title: t("footer.sections.links"),
      links: [
        { text: t("footer.links.home"), to: "/" },
        { text: t("footer.links.services"), to: "/nos-service" },
        { text: t("footer.links.clients"), to: "/nos-clients" },
        { text: t("footer.links.projects"), to: "/nos-projets" },
        { text: t("footer.links.contact"), to: "/contactez-nous" }
      ]
    },
    {
      title: t("footer.sections.services"),
      links: [
        { text: t("footer.services.web"), to: "#" },
        { text: t("footer.services.uiux"), to: "#" },
        { text: t("footer.services.mobile"), to: "#" },
        { text: t("footer.services.consulting"), to: "#" },
        { text: t("footer.services.marketing"), to: "#" },
        { text: t("footer.services.recruitment"), to: "#" }
      ]
    }
  ];

  return (
    <footer className="bg-black text-white h-full md:h-[60vh] flex flex-col justify-between py-12">
      <div className="container mx-auto px-6 flex-grow">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-around gap-8">
          {/* Company Info */}
          <div className="flex flex-col items-baseline sm:items-center md:items-start">
            <div>
              <img src={Logo} alt="ScarSoft Logo" className="h-30 w-auto" />
            </div>
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
              {t("footer.tagline")}
            </p>
          </div>

          {/* Dynamic Sections */}
          {footerSections.map((section, index) => (
            <div
              key={index}
              className="flex flex-col items-baseline sm:items-center md:items-start"
            >
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2 text-gray-400">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <Link
                      to={link.to}
                      className="hover:text-secondary transition-colors"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="mx-6 sm:mx-16">
        <hr className="border-gray-600 my-6" />
        <div className="text-center text-gray-400 flex flex-col items-start sm:flex-row justify-center gap-2">
          © 2025 SCAR SOFT. {t("footer.rights")}
          <Link to="/policy" className="hover:text-secondary">
            {t("footer.policy")}
          </Link>
          <Link to="/conditions" className="hover:text-secondary">
            {t("footer.terms")}
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
