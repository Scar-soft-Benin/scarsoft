'use client';

import { useEffect, useRef } from "react";
import { useTranslation, Trans } from "react-i18next";
import AppBaseButton from "~/components/appBaseButton";
import AppBaseTitle from "~/components/appBaseTitle";
import { gsap, ScrollTrigger } from "~/utils/gsap";

const Contacts = () => {
  const { t } = useTranslation();

  const contentRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll(".contact-card");
      gsap.fromTo(cards, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power3.out",
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      });
    }

    if (formRef.current) {
      const formFields = formRef.current.querySelectorAll("input, textarea");
      gsap.fromTo(formFields, { opacity: 0, x: -20 }, {
        opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: "power3.out",
        scrollTrigger: {
          trigger: formRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100/30">
      <AppBaseTitle
        title={t("contactUs.title")}
        subtitle={t("contactUs.subtitle")}
      />

      {/* Section principale */}
      <div ref={contentRef} className="text-center py-12 px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          {t("contactUs.heading")}
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t("contactUs.text")}
        </p>
      </div>

      {/* Cartes de contact */}
      <div ref={cardsRef} className="flex flex-col md:flex-row justify-center gap-6 px-6 mb-16">
        {/* Téléphone */}
        <div className="contact-card bg-green-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center max-w-sm mx-auto md:mx-0">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2..." />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{t("contactUs.cards.phone.title")}</h3>
          <p className="text-green-600 font-medium text-lg">{t("contactUs.cards.phone.hours")}</p>
          <p className="text-gray-600 mt-2">+229 68 505 786</p>
        </div>

        {/* Email */}
        <div className="contact-card bg-green-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center max-w-sm mx-auto md:mx-0">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26..." />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{t("contactUs.cards.email.title")}</h3>
          <p className="text-gray-600">contact@scar-soft.com</p>
        </div>

        {/* Adresse */}
        <div className="contact-card bg-green-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center max-w-sm mx-auto md:mx-0">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657..." />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{t("contactUs.cards.location.title")}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Agla, Petit à petit 2<br />Cotonou, Littoral, Bénin
          </p>
        </div>
      </div>

      {/* Formulaire */}
      <div className="bg-gray-200 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-24">
            <p className="text-gray-600 text-lg">
              {t("contactUs.form.subtitle")}
            </p>
          </div>
          <div ref={formRef} className="max-w-2xl mx-auto">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" placeholder={t("contactUs.form.name")} className="w-full p-4 border border-transparent bg-white rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200" />
                <input type="email" placeholder={t("contactUs.form.email")} className="w-full p-4 border border-transparent bg-white rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="tel" placeholder={t("contactUs.form.phone")} className="w-full p-4 border border-transparent bg-white rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200" />
                <input type="text" placeholder={t("contactUs.form.subject")} className="w-full p-4 border border-transparent bg-white rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200" />
              </div>
              <textarea placeholder={t("contactUs.form.message")} rows={6} className="w-full p-4 border border-transparent bg-white rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 resize-none" />
              <AppBaseButton
                type="first"
                bgColor="bg-secondary"
                textColor="text-dark"
                text={t("contactUs.form.send")}
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
