import { motion } from "motion/react";
import { useTranslation, Trans } from "react-i18next";
import AppBaseButton from "~/components/appBaseButton";
import AppBaseTitle from "~/components/appBaseTitle";

const Contact = () => {
    const { t } = useTranslation();

    return (
        <>
            <AppBaseTitle
                title={t("contact.title")}
                subtitle={t("contact.subtitle")}
            />
            <div className="flex flex-col sm:flex-row items-center justify-around p-8 md:px-24">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="flex flex-col items-start w-full sm:w-xl"
                >
                    <p className="mb-6 sm:mb-8 text-lg sm:text-2xl text-justify">
                        <Trans i18nKey="contact.intro" />
                    </p>
                    <div className="flex flex-col sm:flex-row justify-between sm:mt-8">
                        <div className="flex flex-col sm:mr-8">
                            <h5 className="font-bold text-xl mb-2">
                                {t("contact.support.title")}
                            </h5>
                            <p className="text-sm text-justify mb-4">
                                <Trans i18nKey="contact.support.text" />
                            </p>
                        </div>
                        <div className="flex flex-col sm:ml-8">
                            <h5 className="font-bold text-xl mb-2">
                                {t("contact.feedback.title")}
                            </h5>
                            <p className="text-sm text-justify">
                                <Trans i18nKey="contact.feedback.text" />
                            </p>
                        </div>
                    </div>
                </motion.div>

                <div
                    className="flex flex-col w-full sm:w-xl p-6 rounded-lg shadow-lg"
                    style={{
                        background: "#04FF0003",
                        boxShadow: "0px 0px 6px 0px #04FF0040"
                    }}
                >
                    <h2 className="text-xl font-bold text-center mb-4">
                        {t("contact.form.title")}
                    </h2>
                    <form className="flex flex-col space-y-4">
                        <motion.input
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.6,
                                ease: "easeOut",
                                delay: 0
                            }}
                            type="text"
                            placeholder={t("contact.form.name")}
                            className="p-2 border border-gray-300 rounded-md"
                        />
                        <motion.input
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.6,
                                ease: "easeOut",
                                delay: 0.2
                            }}
                            type="email"
                            placeholder={t("contact.form.email")}
                            className="p-2 border border-gray-300 rounded-md"
                        />
                        <motion.input
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.6,
                                ease: "easeOut",
                                delay: 0.4
                            }}
                            type="tel"
                            placeholder={t("contact.form.phone")}
                            className="p-2 border border-gray-300 rounded-md"
                        />
                        <motion.input
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.6,
                                ease: "easeOut",
                                delay: 0.6
                            }}
                            type="text"
                            placeholder={t("contact.form.subject")}
                            className="p-2 border border-gray-300 rounded-md"
                        />
                        <motion.textarea
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.6,
                                ease: "easeOut",
                                delay: 0.8
                            }}
                            placeholder={t("contact.form.message")}
                            className="p-2 border border-gray-300"
                            rows={8}
                        />
                        <AppBaseButton
                            type="first"
                            bgColor="bg-secondary"
                            textColor="text-dark"
                            text={t("contact.form.send")}
                        />
                    </form>
                </div>
            </div>
        </>
    );
};

export default Contact;
