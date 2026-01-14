import React, { useContext, useState, createContext, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { Logger } from "../utils/Logger";
import type { NoteType } from "../types/Note.types";

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
  loading: boolean;
};

const noteContext = createContext<noteContextprops | undefined>(undefined);

export const NoteContext = ({ children }: { children: React.ReactNode }) => {
  const [archievedNote, setArchieveNote] = useState<NoteType[]>([]);
  const [Ispinned, setIspinned] = useState<boolean>(false);
  const [items, setItems] = useState<NoteType[]>([]);
  const [deletedNotes, setDeletedNotes] = useState<NoteType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const fetchApiData = async () => {
    setLoading(true);
    axiosClient
      .get("/notes")
      .then((res) => {
        setItems(res.data);
        setLoading(false);
      })
      .catch((error) => {
        Logger("Error fetching notes:", error);
        setLoading(false);
      });
  };

  const DeletedNotes = async () => {
    setLoading(true);
    axiosClient
      .get("/deletedNotes")
      .then((res) => {
        setDeletedNotes(res.data);
        setLoading(false);
      })
      .catch((error) => {
        Logger("Error fetching deleted notes:", error);
        setLoading(false);
      });
  };

  const ArchivedNotes = async () => {
    setLoading(true);
    axiosClient
      .get("/getArchivedNotes")
      .then((res) => {
        setLoading(false);
        setArchieveNote(res.data);
      })
      .catch((error) => {
        setLoading(false);
        Logger("Error fetching archived notes:", error);
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
          loading,
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
