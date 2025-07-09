import { useEffect, useRef } from "react";
import { useTranslation, Trans } from "react-i18next";
import AppBaseButton from "~/components/appBaseButton";
import AppBaseTitle from "~/components/appBaseTitle";
import { gsap, ScrollTrigger } from "~/utils/gsap";

const Contact = () => {
  const { t } = useTranslation();
  const contentRef = useRef<HTMLDivElement>(null);
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
            stagger: 0.2,
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

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <>
      <AppBaseTitle
        title={t("contact.title")}
        subtitle={t("contact.subtitle")}
      />
      <div className="flex flex-col sm:flex-row items-center justify-around p-8 md:px-24">
        <div ref={contentRef} className="flex flex-col items-start w-full sm:w-xl">
          <p className="mb-6 sm:mb-8 text-lg sm:text-2xl text-justify">
            <Trans i18nKey="contact.intro" />
          </p>
          <div className="flex flex-col">
            <div className="mb-4 sm:mb-8">
              <p className="text-lg sm:text-2xl">contact@scar-soft.com</p>
            </div>
            <div className="mb-4">
              <p className="text-lg sm:text-2xl">+229 68 505 786</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between sm:mt-8">
            <div className="flex flex-col sm:mr-8">
              <h5 className="font-bold text-xl mb-2">{t("contact.support.title")}</h5>
              <p className="text-sm text-justify mb-4">
                <Trans i18nKey="contact.support.text" />
              </p>
            </div>
            <div className="flex flex-col sm:ml-8">
              <h5 className="font-bold text-xl mb-2">{t("contact.feedback.title")}</h5>
              <p className="text-sm text-justify">
                <Trans i18nKey="contact.feedback.text" />
              </p>
            </div>
          </div>
        </div>

        <div
          ref={formRef}
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
            <input type="text" placeholder={t("contact.form.name")} className="p-2 border border-gray-300 rounded-md" />
            <input type="email" placeholder={t("contact.form.email")} className="p-2 border border-gray-300 rounded-md" />
            <input type="tel" placeholder={t("contact.form.phone")} className="p-2 border border-gray-300 rounded-md" />
            <input type="text" placeholder={t("contact.form.subject")} className="p-2 border border-gray-300 rounded-md" />
            <textarea placeholder={t("contact.form.message")} className="p-2 border border-gray-300" rows={8}></textarea>
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
