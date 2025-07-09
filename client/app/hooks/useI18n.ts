import { useTranslation } from 'react-i18next';

// Hook personnalisé pour simplifier l'utilisation de i18n
export const useI18n = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string | undefined) => {
    i18n.changeLanguage(lng);
  };

  const getCurrentLanguage = () => {
    return i18n.language;
  };

  const isRTL = () => {
    // Ajouter les langues RTL si nécessaire
    const rtlLanguages = ['ar', 'he', 'fa'];
    return rtlLanguages.includes(i18n.language);
  };

  return {
    t,
    i18n,
    changeLanguage,
    getCurrentLanguage,
    isRTL,
    currentLanguage: i18n.language
  };
};

// Hook pour les traductions avec namespace
export const useI18nNamespace = (namespace: any) => {
  const { t, i18n } = useTranslation();

  const tns = (key: any, options = {}) => {
    return t(`${namespace}.${key}`, options);
  };

  return {
    t: tns,
    i18n,
    currentLanguage: i18n.language
  };
};