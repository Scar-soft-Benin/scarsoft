import { useTranslation, Trans } from "react-i18next";
import webDevImg from "./web-dev.jpeg";
import marketingImg from "./marketingImg.jpeg";
import ServiceSection from "./serviceSection";

const Services = () => {
  const { t } = useTranslation();

  return (
    <div className="p-4">
      <ServiceSection
        title={t("services.web.title")}
        description={t("services.web.description")}
        details={
          <p className="text-sm sm:text-lg text-justify my-2 sm:my-4">
            <Trans i18nKey="services.web.details" components={{ strong: <strong /> }} />
          </p>
        }
        buttonText={t("services.web.cta")}
        image={webDevImg}
      />

      <ServiceSection
        title={t("services.marketing.title")}
        description={t("services.marketing.description")}
        details={
          <p className="text-sm sm:text-lg text-justify my-2 sm:my-4">
            <Trans i18nKey="services.marketing.details" components={{ strong: <strong /> }} />
          </p>
        }
        buttonText={t("services.marketing.cta")}
        image={marketingImg}
        reverse
      />

      <ServiceSection
        title={t("services.recruitment.title")}
        description={t("services.recruitment.description")}
        details={
          <p className="text-sm sm:text-lg text-justify my-2 sm:my-4">
            <Trans i18nKey="services.recruitment.details" components={{ strong: <strong /> }} />
          </p>
        }
        buttonText={t("services.recruitment.cta")}
        image={webDevImg}
      />
    </div>
  );
};

export default Services;
