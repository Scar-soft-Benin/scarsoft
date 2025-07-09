// headerConfig.ts
import type { TFunction } from "i18next";
import homeBanner from "./banner.jpeg";
import aboutBanner from "../about-us/about-us.jpeg";
import serviceBanner from "../nos-service/banner.jpeg";
import contactBanner from "../contact-us/banner.jpg";
import careerBanner from "../career/banner.jpg";
import projectBanner from "../nos-projets/banner.jpg";

/**
 * Fonction de configuration des headers avec support i18n
 */
export const getHeaderConfig = (t: TFunction): Record<
  string,
  {
    bannerImage: string;
    title: string;
    subtitle: string;
    btnText: string;
  }
> => ({
  "/": {
    bannerImage: homeBanner,
    title: t("header.home.title"),
    subtitle: t("header.home.subtitle"),
    btnText: t("header.home.button")
  },
  "/a-propos": {
    bannerImage: aboutBanner,
    title: t("header.about.title"),
    subtitle: t("header.about.subtitle"),
    btnText: t("header.about.button")
  },
  "/nos-service": {
    bannerImage: serviceBanner,
    title: t("header.service.title"),
    subtitle: t("header.service.subtitle"),
    btnText: t("header.service.button")
  },
  "/carrieres": {
    bannerImage: careerBanner,
    title: t("header.career.title"),
    subtitle: t("header.career.subtitle"),
    btnText: t("header.career.button")
  },
  "/carriere-candidature/:jobId": {
    bannerImage: careerBanner,
    title: t("header.career.title"),
    subtitle: t("header.career.subtitle"),
    btnText: t("header.career.button")
  },
  "/contactez-nous": {
    bannerImage: contactBanner,
    title: t("header.contact.title"),
    subtitle: t("header.contact.subtitle"),
    btnText: t("header.contact.button")
  },
  "/nos-projets": {
    bannerImage: projectBanner,
    title: t("header.project.title"),
    subtitle: t("header.project.subtitle"),
    btnText: t("header.project.button")
  }
});
