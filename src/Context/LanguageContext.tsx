import { createContext, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface LanguageContextProps {
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(
  undefined,
);

const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "en";
    if (i18n.language !== savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  // useEffect(() => {
  //     const direction = i18n.language === "ur" ? "rtl" : "ltr";
  //     document.documentElement.dir = direction;
  //     document.documentElement.lang = i18n.language;
  // }, [i18n.language]);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <LanguageContext.Provider
      value={{ currentLanguage: i18n.language, changeLanguage }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// eslint-disable-next-line
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export { LanguageProvider };

// {
//   "item": "{{count}} item",
//   "item_plural": "{{count}} items"
// }
//  i18next auto-selects _plural
