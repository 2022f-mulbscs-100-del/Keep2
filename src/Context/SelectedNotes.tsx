import { createContext, useContext, useState } from "react";

type SelectedNotesContextType = {
  selectedNotes: number[];
  setSelectedNotes: React.Dispatch<React.SetStateAction<number[]>>;
};

//eslint-disable-next-line
export const SelectedNotesContext =
  createContext<SelectedNotesContextType | null>(null);

export const SelectedNotesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedNotes, setSelectedNotes] = useState<number[]>([]);
  console.log(
    "SelectedNotesProvider rendered with selectedNotes:",
    selectedNotes,
  );
  return (
    <SelectedNotesContext.Provider value={{ selectedNotes, setSelectedNotes }}>
      {children}
    </SelectedNotesContext.Provider>
  );
};

//eslint-disable-next-line react-refresh/only-export-components
export const useSelectedNotes = () => {
  const context = useContext(SelectedNotesContext);
  if (!context) {
    throw new Error(
      "useSelectedNotes must be used within a SelectedNotesProvider",
    );
  }
  return context;
};
