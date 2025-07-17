"use client";

import { motion } from "motion/react";
import AppBaseButton from "~/components/appBaseButton";
import AppBaseTitle from "~/components/appBaseTitle";

const Faq = () => {
    return (
        <>
            <AppBaseTitle
                title="FAQ"
                subtitle="Besoin d’une solution digitale sur mesure ? Contactez-nous !"
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
                        Par e-mail, téléphone ou via notre formulaire, découvrez
                        comment Scar-Soft peut répondre à vos besoins
                        technologiques.
                    </p>
                    <div className="flex flex-col">
                        <div className="mb-4 sm:mb-8">
                            <p className="text-lg sm:text-2xl">
                                contact@scarsoft.net
                            </p>
                        </div>
                        <div className="mb-4">
                            <p className="text-lg sm:text-2xl">
                                +229 68 505 786
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between sm:mt-8">
                        <div className="flex flex-col sm:mr-8">
                            <h5 className="font-bold text-xl mb-2">
                                Support Client
                            </h5>
                            <p className="text-sm text-justify mb-4">
                                Par e-mail, téléphone ou via notre formulaire,
                                découvrez comment Scar-Soft peut répondre à vos
                                besoins technologiques.
                            </p>
                        </div>
                        <div className="flex flex-col sm:ml-8">
                            <h5 className="font-bold text-xl mb-2">
                                Suggestions et Retours
                            </h5>
                            <p className="text-sm text-justify">
                                Vos avis sont essentiels pour nous ! Nous
                                améliorons continuellement nos services grâce à
                                vos retours, afin de mieux répondre à vos
                                attentes.
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
                        Envoyez-nous un message
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
                            placeholder="Nom complet"
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
                            placeholder="Email"
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
                            placeholder="Téléphone"
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
                            placeholder="Objet"
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
                            placeholder="Votre message"
                            rows={8}
                            className="p-2 border border-gray-300 rounded-md"
                        />
                        <AppBaseButton
                            type="first"
                            bgColor="bg-secondary"
                            textColor="text-dark"
                            href={undefined}
                            text="Envoyer"
                        />
                    </form>
                </div>
            </div>
        </>
    );
};

export default Faq;
