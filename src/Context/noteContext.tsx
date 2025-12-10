import React, { useContext, useState, createContext, useEffect } from "react";
import axiosClient from "../api/axiosClient";
type NoteType = {
  id: number;
  title: string;
  description: string;
  pinned: boolean;
  isDeleted: boolean;
  isArchived: boolean;
  image: string;
};

type noteContextprops = {
  setArchieveNote: React.Dispatch<React.SetStateAction<NoteType[]>>;
  ArchivedNotes: () => Promise<void>;
  Ispinned: boolean;
  setIspinned: React.Dispatch<React.SetStateAction<boolean>>;
  fetchApiData: () => Promise<void>;
  items: NoteType[];
  deletedNotes: NoteType[];
  DeletedNotes: () => Promise<void>;
  archievedNote: NoteType[];
};

const noteContext = createContext<noteContextprops | undefined>(undefined);

export const NoteContext = ({ children }: { children: React.ReactNode }) => {
  const [archievedNote, setArchieveNote] = useState<NoteType[]>([]);
  const [Ispinned, setIspinned] = useState<boolean>(false);
  const [items, setItems] = useState<NoteType[]>([]);
  const [deletedNotes, setDeletedNotes] = useState<NoteType[]>([]);
  const fetchApiData = async () => {
    axiosClient
      .get("/notes")
      .then((res) => {
        setItems(res.data);
      })
      .catch((error) => {
        console.error("Error fetching notes:", error);
      });
  };

  const DeletedNotes = async () => {
    axiosClient
      .get("/deletedNotes")
      .then((res) => {
        setDeletedNotes(res.data);
      })
      .catch((error) => {
        console.error("Error fetching deleted notes:", error);
      });
  };

  const ArchivedNotes = async () => {
    axiosClient
      .get("/getArchivedNotes")
      .then((res) => {
        setArchieveNote(res.data);
      })
      .catch((error) => {
        console.error("Error fetching archived notes:", error);
      });
  };

  useEffect(() => {
    fetchApiData();
    DeletedNotes();
    ArchivedNotes();
  }, []);

  return (
    <noteContext.Provider
      value={
        {
          ArchivedNotes,
          Ispinned,
          setIspinned,
          archievedNote,
          setArchieveNote,
          items,
          fetchApiData,
          deletedNotes,
          DeletedNotes,
        } as noteContextprops
      }
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
