import React, { useEffect, useState } from "react";
import { useUser } from "./UserContext";

type navbarContextProps = {
  layout: boolean;
  setLayout: React.Dispatch<React.SetStateAction<boolean>>;
  selecting: boolean;
  setselecting: React.Dispatch<React.SetStateAction<boolean>>;
};

const navbarContext = React.createContext<navbarContextProps | undefined>(
  undefined,
);

export const NavbarProvider = ({ children }: { children: React.ReactNode }) => {
  const { profileData } = useUser();
  const [layout, setLayout] = useState(false);
  const [selecting, setselecting] = useState(false);

  useEffect(() => {
    if (profileData?.layout === "list") {
      setLayout(true);
    } else {
      setLayout(false);
    }
  }, [profileData]);

  return (
    <navbarContext.Provider
      value={{ layout, setLayout, selecting, setselecting }}
    >
      {children}
    </navbarContext.Provider>
  );
};

//eslint-disable-next-line
export const useNavbar = () => {
  const context = React.useContext(navbarContext);
  if (!context) {
    throw new Error("useNavbar must be used within a NavbarProvider");
  }
  return context;
};
