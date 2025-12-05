import { createContext, useContext, useState } from "react";
import { LOCAL_THEME_VALUE } from "../Constants/LocalStorage.constants";

type themeSwitcherContextType = {
  theme: string;
  settingTheme: (value: string) => void;
};
const themeSwitcherContext = createContext<themeSwitcherContextType | null>(
  null,
);

export const ThemeSwitcherProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [theme, setTheme] = useState(
    localStorage.getItem(LOCAL_THEME_VALUE) || "light",
  );

  const settingTheme = (value: string) => {
    setTheme(value);
    localStorage.setItem(LOCAL_THEME_VALUE, value);
  };
  return (
    <themeSwitcherContext.Provider value={{ theme, settingTheme }}>
      {children}
    </themeSwitcherContext.Provider>
  );
};

//eslint-disable-next-line
export const useTheme = () => {
  const context = useContext(themeSwitcherContext);
  if (!context) {
    throw new Error("useLanguage must be used within a ThemeSwitcherProvider");
  }
  return context;
};
