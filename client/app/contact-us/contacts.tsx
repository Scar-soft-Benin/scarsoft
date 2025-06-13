'use client'

import { useEffect, useRef } from "react";
import AppBaseButton from "~/components/appBaseButton";
import AppBaseTitle from "~/components/appBaseTitle";
import { gsap, ScrollTrigger } from "~/utils/gsap";

const Contacts = () => {
    const contentRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Animate content section
        if (contentRef.current) {
            gsap.fromTo(
                contentRef.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: contentRef.current,
                        start: "top 80%",
                        end: "bottom 20%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }

        // Animate cards with stagger
        if (cardsRef.current) {
            const cards = cardsRef.current.querySelectorAll(".contact-card");
            if (cards.length > 0) {
                gsap.fromTo(
                    cards,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        stagger: 0.2,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: cardsRef.current,
                            start: "top 80%",
                            end: "bottom 20%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            }
        }

        // Animate form fields with stagger
        if (formRef.current) {
            const formFields = formRef.current.querySelectorAll("input, textarea");
            if (formFields.length > 0) {
                gsap.fromTo(
                    formFields,
                    { opacity: 0, x: -20 },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 0.6,
                        stagger: 0.1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: formRef.current,
                            start: "top 80%",
                            end: "bottom 20%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            }
        }

        // Cleanup ScrollTrigger on unmount
        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100/30">
            <AppBaseTitle
                title="Contact"
                subtitle="Besoin d'une solution digitale ? Parlons-en !"
            />
            
            {/* Section principale */}
            <div ref={contentRef} className="text-center py-12 px-6">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                    Construisons ensemble vos projets !
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Contactez-nous et trouvons ensemble la solution idéale pour votre entreprise.
                </p>
            </div>

            {/* Cartes de contact */}
            <div ref={cardsRef} className="flex flex-col md:flex-row justify-center gap-6 px-6 mb-16">
                {/* Carte Téléphone */}
                <div className="contact-card bg-green-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center max-w-sm mx-auto md:mx-0">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Appelez nous</h3>
                    <p className="text-green-600 font-medium text-lg">24h/7</p>
                    <p className="text-gray-600 mt-2">+229 68 505 786</p>
                </div>

                {/* Carte Email */}
                <div className="contact-card bg-green-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center max-w-sm mx-auto md:mx-0">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Écrivez-nous</h3>
                    <p className="text-gray-600">contact@scar-soft.com</p>
                </div>

                {/* Carte Localisation */}
                <div className="contact-card bg-green-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center max-w-sm mx-auto md:mx-0">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Visitez nous</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Agla, Petit à petit 2<br />
                        Cotonou, Littoral, Bénin
                    </p>
                </div>
            </div>

            {/* Section formulaire */}
            <div className="bg-gray-200 py-16">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-24">
                        <p className="text-gray-600 text-lg">
                            Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                        </p>
                    </div>

                    <div ref={formRef} className="max-w-2xl mx-auto">
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input
                                    type="text"
                                    placeholder="Nom complet"
                                    className="w-full p-4 border border-transparent bg-white rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full p-4 border border-transparent bg-white rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input
                                    type="tel"
                                    placeholder="Téléphone"
                                    className="w-full p-4 border border-transparent bg-white rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                                />
                                <input
                                    type="text"
                                    placeholder="Objet"
                                    className="w-full p-4 border border-transparent bg-white rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                                />
                            </div>
                            
                            <textarea
                                placeholder="Écrivez votre message..."
                                rows={6}
                                className="w-full p-4 border border-transparent bg-white rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
                            ></textarea>
                            
                            <AppBaseButton
                                type="first"
                                bgColor="bg-secondary"
                                textColor="text-dark"
                                href={undefined}
                                text="Envoyer"
                                className="w-1/3 rounded-xl"
                            />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contacts;