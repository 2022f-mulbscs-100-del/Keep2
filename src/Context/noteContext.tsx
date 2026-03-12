import React, { useContext, useState, createContext } from "react";
import type { LoadingType, NoteType } from "../types/Note.types";

type NoteContextProps = {
  Notes: NoteType[];
  isPinned: boolean;
  setIsPinned: React.Dispatch<React.SetStateAction<boolean>>;
  archivedNotes: NoteType[];
  setArchivedNotes: React.Dispatch<React.SetStateAction<NoteType[]>>;
  loading: LoadingType;
  setNotes: React.Dispatch<React.SetStateAction<NoteType[]>>;
  deletedNotes: NoteType[];
  setDeletedNotes: React.Dispatch<React.SetStateAction<NoteType[]>>;
  setLoading: React.Dispatch<React.SetStateAction<LoadingType>>;
};

const noteContext = createContext<NoteContextProps | undefined>(undefined);

export const NoteContext = ({ children }: { children: React.ReactNode }) => {
  const [Notes, setNotes] = useState<NoteType[]>([]);
  const [isPinned, setIsPinned] = useState<boolean>(false);
  const [archivedNotes, setArchivedNotes] = useState<NoteType[]>([]);
  const [deletedNotes, setDeletedNotes] = useState<NoteType[]>([]);
  const [loading, setLoading] = useState<LoadingType>({
    intialLoading: false,
    deleteLoading: false,
    updateLoading: false,
    archiveLoading: false,
  });

  return (
    <noteContext.Provider
      value={{
        isPinned,
        setIsPinned,
        archivedNotes,
        setArchivedNotes,
        Notes,
        deletedNotes,
        setDeletedNotes,
        loading,
        setNotes,
        setLoading,
      }}
    >
      {children}
    </noteContext.Provider>
  );
};
//eslint-disable-next-line
export const useNote = () => {
  const context = useContext(noteContext);
  if (!context) {
    throw new Error("useNote must be used within a noteProvider");
  }
  return context;
};
