'use client'
import React, { createContext, useContext, useState } from "react";


type SideBarContextType = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SideBarContext = createContext<SideBarContextType | undefined>(undefined);

export const SideBarProvider = ({ children }: { children: React.ReactNode }) => {

const [isOpen, setIsOpen] = useState(true);

return(
  <SideBarContext.Provider value={{isOpen, setIsOpen}}>
    {children}
</SideBarContext.Provider>

)
};

export const useSidebar = () => {
  const context = useContext(SideBarContext);
  if (!context) {
    throw new Error("useSideba must be used within a SideBarProvider");
  }
  return context;
};
