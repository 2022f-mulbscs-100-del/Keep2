import { useContext, useState } from "react";
import { createContext } from "react";

type modalContextType = {
  reminderModal: boolean;
  setReminderModal: React.Dispatch<React.SetStateAction<boolean>>;
  noteId: number | null;
  setNoteId: React.Dispatch<React.SetStateAction<number | null>>;
  backgroundColorModal: number | null;
  setBackgroundColorModal: React.Dispatch<React.SetStateAction<number | null>>;
  collaboratorModal: boolean;
  setCollaboratorModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const modalContext = createContext<modalContextType | null>(null);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [reminderModal, setReminderModal] = useState(false);
  const [noteId, setNoteId] = useState<number | null>(null);
  const [collaboratorModal, setCollaboratorModal] = useState(false);
  const [backgroundColorModal, setBackgroundColorModal] = useState<
    number | null
  >(null);
  return (
    <modalContext.Provider
      value={{
        reminderModal,
        setReminderModal,
        backgroundColorModal,
        setBackgroundColorModal,
        noteId,
        setNoteId,
        collaboratorModal,
        setCollaboratorModal,
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
