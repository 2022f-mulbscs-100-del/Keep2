import { useContext, useState } from "react";
import { createContext } from "react";

type modalContextType = {
  reminderModal: boolean;
  setReminderModal: React.Dispatch<React.SetStateAction<boolean>>;
  noteId: number | null;
  setNoteId: React.Dispatch<React.SetStateAction<number | null>>;
};

const modalContext = createContext<modalContextType | null>(null);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [reminderModal, setReminderModal] = useState(false);
  const [noteId, setNoteId] = useState<number | null>(null);
  return (
    <modalContext.Provider
      value={{
        reminderModal,
        setReminderModal,
        noteId,
        setNoteId,
      }}
    >
      {children}
    </modalContext.Provider>
  );
};

//eslint-disable-next-line
export const useModal = () => {
  const modal = useContext(modalContext);
  if (!modal) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return modal;
};
