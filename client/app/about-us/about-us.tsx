import { useTranslation, Trans } from "react-i18next";
import AppBaseTitle from "~/components/appBaseTitle";
import AppBaseButton from "~/components/appBaseButton";

import innovationIcon from "./innovation.png";
import collaborationIcon from "./collaboration.png";
import expertiseIcon from "./expertise.png";
import excellenceIcon from "./excellence.png";
import adaptibilityIcon from "./adapatibility.png";
import responsabilityIcon from "./responsability.png";
import checkIcon from "./Check.png";
import illustration from "./demarchIllustration.jpeg";

import img_1 from "./img-1.jpeg";
import img_2 from "./img-2.jpeg";
import img_3 from "./img-3.jpeg";
import img_4 from "./img-4.jpeg";
import img_5 from "./img-5.jpeg";

const AboutUs = () => {
  const { t } = useTranslation();

  const values = [
    {
      icon: innovationIcon,
      title: t("aboutUs.values.innovation.title"),
      subtitle: t("aboutUs.values.innovation.subtitle")
    },
    {
      icon: collaborationIcon,
      title: t("aboutUs.values.collaboration.title"),
      subtitle: t("aboutUs.values.collaboration.subtitle")
    },
    {
      icon: expertiseIcon,
      title: t("aboutUs.values.expertise.title"),
      subtitle: t("aboutUs.values.expertise.subtitle")
    },
    {
      icon: excellenceIcon,
      title: t("aboutUs.values.excellence.title"),
      subtitle: t("aboutUs.values.excellence.subtitle")
    },
    {
      icon: adaptibilityIcon,
      title: t("aboutUs.values.adaptability.title"),
      subtitle: t("aboutUs.values.adaptability.subtitle")
    },
    {
      icon: responsabilityIcon,
      title: t("aboutUs.values.responsibility.title"),
      subtitle: t("aboutUs.values.responsibility.subtitle")
    }
  ];

  const demarches = [
    t("aboutUs.steps.1"),
    t("aboutUs.steps.2"),
    t("aboutUs.steps.3"),
    t("aboutUs.steps.4")
  ];

  const images = [
    { src: img_1, alt: "Image 1", span: "row-span-2" },
    { src: img_2, alt: "Image 2", span: "row-span-1" },
    { src: img_3, alt: "Image 3", span: "row-span-4" },
    { src: img_4, alt: "Image 4", span: "row-span-1" },
    { src: img_5, alt: "Image 5", span: "row-span-2 sm:col-span-2" }
  ];

  return (
    <div className="p-4">
      <AppBaseTitle title={t("aboutUs.title")} subtitle={t("aboutUs.subtitle")} />

      {/* Valeurs */}
      <div className="sm:px-32 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {values.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-6 rounded-2xl text-center"
          >
            <div className="mb-4">
              <img src={item.icon} alt={item.title} className="w-24 h-24" />
            </div>
            <h3 className="font-bold text-xl">{item.title}</h3>
            <p className="text-gray-600 mt-2">{item.subtitle}</p>
          </div>
        ))}
      </div>

      <AppBaseTitle title={t("aboutUs.approach.title")} subtitle={t("aboutUs.approach.subtitle")} />

      <p className="text-sm sm:text-2xl sm:my-4 text-center">
        {t("aboutUs.approach.description")}
      </p>

      {/* Démarche */}
      <div className="px-4 sm:px-16 flex flex-col-reverse sm:flex-row justify-center items-center">
        <div className="flex flex-col sm:w-1/3 sm:mx-16">
          {demarches.map((demarche, index) => (
            <div className="flex flex-row my-4" key={index}>
              <img src={checkIcon} alt="check icon" className="w-8 h-8" />
              <p className="mx-4">{demarche}</p>
            </div>
          ))}
        </div>
        <img src={illustration} alt="démarche" className="sm:w-1/3 grayscale-100" />
      </div>

      <div className="flex flex-row items-center justify-center my-20">
        <AppBaseButton
          type="first"
          bgColor="bg-secondary"
          textColor="text-dark"
          href="/contact"
          text={t("aboutUs.contactCta")}
        />
      </div>

      <AppBaseTitle title={t("aboutUs.team.title")} subtitle={t("aboutUs.team.subtitle")} />

      {/* Équipe */}
      <div className="flex flex-col sm:flex-row sm:px-32 md:my-16 relative">
        <div className="flex flex-col">
          <div className="bg-secondary text-white rounded-2xl p-8 sm:w-sm">
            <h2 className="text-8xl">+ 10</h2>
            <p>{t("aboutUs.team.count")}</p>
          </div>
          <div className="border-l-secondary p-4 border-l-2 my-4 sm:w-2/3">
            {["devs", "design", "community", "marketing", "recruitment"].map((key, i) => (
              <p key={i} className="my-2 sm:text-xl">
                {t(`aboutUs.team.roles.${key}`)}
              </p>
            ))}
          </div>
        </div>
        <div className="sm:-ml-24 mt-8 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[250px] z-30">
          {images.map((img, index) => (
            <div key={index} className={`${img.span} overflow-hidden rounded-lg`}>
              <img
                src={img.src}
                alt={img.alt}
                className={`w-full h-full object-cover ${[0, 1].includes(index) ? 'sm:h-[600px]' : ''} ${[4].includes(index) ? 'sm:h-[550px]' : ''} ${index === 1 ? 'h-2/5' : ''}`}
              />
            </div>
          ))}
        </div>
        <div className="sm:absolute sm:right-24 bg-secondary sm:w-32 sm:h-32 rounded-2xl -bottom-6"></div>
      </div>
    </div>
  );
};

export default AboutUs;
