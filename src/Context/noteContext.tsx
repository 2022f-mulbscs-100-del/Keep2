import React, { useContext, useState, createContext, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { Logger } from "../utils/Logger";
import type { LoadingType, NoteType } from "../types/Note.types";

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
  loading: LoadingType;
  getNotes: () => Promise<void>;
  setItems: React.Dispatch<React.SetStateAction<NoteType[]>>;
  UpdateNote: (id: number, updatedNote: NoteType) => Promise<void>;
};

const noteContext = createContext<noteContextprops | undefined>(undefined);

export const NoteContext = ({ children }: { children: React.ReactNode }) => {
  const [archievedNote, setArchieveNote] = useState<NoteType[]>([]);
  const [Ispinned, setIspinned] = useState<boolean>(false);
  const [items, setItems] = useState<NoteType[]>([]);
  const [deletedNotes, setDeletedNotes] = useState<NoteType[]>([]);
  const [loading, setLoading] = useState<LoadingType>({
    intialLoading: false,
    deleteLoading: false,
    updateLoading: false,
    archiveLoading: false,
  });

  const fetchApiData = async () => {
    setLoading((prev) => ({ ...prev, intialLoading: true }));
    axiosClient
      .get("/notes")
      .then((res) => {
        setItems(res.data);
        setLoading((prev) => ({ ...prev, intialLoading: false }));
      })
      .catch((error) => {
        Logger("Error fetching notes:", error);
        setLoading((prev) => ({ ...prev, intialLoading: false }));
      });
  };

  const getNotes = async () => {
    axiosClient
      .get("/notes")
      .then((res) => {
        setItems(res.data);
      })
      .catch((error) => {
        Logger("Error fetching notes:", error);
      });
  };

  const UpdateNote = async (id: number, updatedNote: NoteType) => {
    try {
      setLoading((prev) => ({ ...prev, updateLoading: true }));
      await axiosClient.put(`/UpdateNotes/${id}`, updatedNote).then(() => {
        setLoading((prev) => ({ ...prev, updateLoading: false }));
      });
    } catch (error) {
      setLoading((prev) => ({ ...prev, updateLoading: false }));
      Logger("Error updating note:", error);
    }
  };

  const DeletedNotes = async () => {
    setLoading((prev) => ({ ...prev, deleteLoading: true }));
    axiosClient
      .get("/deletedNotes")
      .then((res) => {
        setDeletedNotes(res.data);
        setLoading((prev) => ({ ...prev, deleteLoading: false }));
      })
      .catch((error) => {
        Logger("Error fetching deleted notes:", error);
        setLoading((prev) => ({ ...prev, deleteLoading: false }));
      });
  };

  const ArchivedNotes = async () => {
    setLoading((prev) => ({ ...prev, archiveLoading: true }));
    axiosClient
      .get("/getArchivedNotes")
      .then((res) => {
        setLoading((prev) => ({ ...prev, archiveLoading: false }));
        setArchieveNote(res.data);
      })
      .catch((error) => {
        setLoading((prev) => ({ ...prev, archiveLoading: false }));
        Logger("Error fetching archived notes:", error);
      });
  };

  useEffect(() => {
    fetchApiData();
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
          setItems,
          UpdateNote,
          getNotes,
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
