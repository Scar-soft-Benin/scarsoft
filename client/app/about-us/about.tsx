import { motion } from "motion/react";
import partner1 from "./chinese-company-logo.jpeg";
import partner2 from "./connect-logo.jpeg";
import partner3 from "./ohie-logo.jpeg";
import partner4 from "./halal-logo.jpeg";
import partner5 from "./name-logo.jpeg";
import aboutImg from "./about-img.jpeg";
import AppBaseButton from "~/components/appBaseButton";
import AppBaseTitle from "~/components/appBaseTitle";
import { useTranslation } from "react-i18next";

const About = () => {
    const { t, i18n } = useTranslation();
    console.log("Langue actuelle :", i18n.language);
    console.log("Traduction de about.title :", t("about.title"));

    const partners = [
        {
            logo: partner1,
            title: t("about.partners.1"),
            url: "https://partnerone.com"
        },
        {
            logo: partner2,
            title: t("about.partners.2"),
            url: "https://partnertwo.com"
        },
        {
            logo: partner3,
            title: t("about.partners.3"),
            url: "https://partnerthree.com"
        },
        {
            logo: partner4,
            title: t("about.partners.4"),
            url: "https://partnertwo.com"
        },
        {
            logo: partner5,
            title: t("about.partners.5"),
            url: "https://partnerthree.com"
        }
    ];

    return (
        <>
            <div className="py-10 px-6">
                <div className="flex flex-wrap justify-center items-center gap-6">
                    {partners.map((partner, index) => (
                        <motion.a
                            key={index}
                            href={partner.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.8,
                                ease: "easeOut",
                                delay: index * 0.2
                            }}
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
                        </motion.a>
                    ))}
                </div>
            </div>

            <AppBaseTitle
                title={t("about.title")}
                subtitle={t("about.subtitle")}
            />

            <div className="flex flex-col md:flex-row items-center justify-center p-4 md:px-32 my-8">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0 }}
                    className="flex flex-col p-4 items-start sm:mr-32 w-auto md:w-xl"
                >
                    <motion.p
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 1,
                            ease: "easeOut",
                            delay: 0.3
                        }}
                        className="mb-6 sm:mb-16 text-md md:text-2xl"
                    >
                        {t("about.description")}
                    </motion.p>
                    <AppBaseButton
                        text={t("about.cta")}
                        textColor="text-dark"
                        bgColor="bg-secondary"
                        type="first"
                        href="/a-propos"
                    />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
                    className="mt-4 w-auto md:w-2xl"
                >
                    <motion.img
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 1,
                            ease: "easeOut",
                            delay: 0.9
                        }}
                        src={aboutImg}
                        alt={t("about.title")}
                        className="object-cover rounded-xl shadow-lg w-full h-auto"
                    />
                </motion.div>
            </div>
        </>
    );
};

export default About;
