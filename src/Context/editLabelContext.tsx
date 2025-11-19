'use client';

import React, {useContext, useState} from 'react';

type EditLabelContextType = {
  label: string[];
  setLabel: React.Dispatch<React.SetStateAction<string[]>>;
};
//eslint-disable-next-line
export const EditLabelContext = React.createContext<
  EditLabelContextType | undefined
>(undefined);

export const EditLabelProvider = ({children}: {children: React.ReactNode}) => {
  const [label, setLabel] = useState<string[]>([]);
  return (
    <EditLabelContext.Provider value={{label, setLabel}}>
      {children}
    </EditLabelContext.Provider>
  );
};

//eslint-disable-next-line
export const useEditLaber = () => {
  const editlabel = useContext(EditLabelContext);
  if (!editlabel) {
    throw new Error('useSidebar must be used within a SideBarProvider');
  }
  return editlabel;
};
