import { useTranslation } from "react-i18next";
import AppBaseTitle from "~/components/appBaseTitle";
import card1 from "./card-1.jpeg";
import card2 from "./card-2.jpeg";
import card3 from "./card-3.jpeg";
import ServiceCard from "./serviceCard";

const Service = () => {
  const { t } = useTranslation();

  const services = [
    {
      image: card1,
      title: t("serviceHome.list.1.title"),
      description: t("serviceHome.list.1.description"),
      alignment: "left" as const
    },
    {
      image: card2,
      title: t("serviceHome.list.2.title"),
      description: t("serviceHome.list.2.description"),
      alignment: "right" as const
    },
    {
      image: card3,
      title: t("serviceHome.list.3.title"),
      description: t("serviceHome.list.3.description"),
      alignment: "left" as const
    }
  ];

  return (
    <div className="p-4">
      <AppBaseTitle
        title={t("serviceHome.title")}
        subtitle={t("serviceHome.subtitle")}
      />
      {services.map((service, index) => (
        <ServiceCard
          key={index}
          image={service.image}
          title={service.title}
          description={service.description}
          alignment={service.alignment}
        />
      ))}
    </div>
  );
};

export default Service;
