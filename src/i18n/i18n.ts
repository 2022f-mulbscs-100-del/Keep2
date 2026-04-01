import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "../../public/locales/en/translation.json";
import ur from "../../public/locales/ur/translation.json";
import es from "../../public/locales/es/translation.json";
import fr from "../../public/locales/fr/translation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ur: { translation: ur },
      es: { translation: es },
      fr: { translation: fr },
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
