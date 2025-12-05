import axios from "axios";
import React, { useContext, useState, createContext, useEffect } from "react";

type Note = {
  note: string;
  description: string;
  id: number;
  catgeory: string;
  pinned: boolean;
};

type list = {
  data: string;
  id: number;
  catgeory: string;
  pinned: boolean;
};

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
  StoreNoteChange: Note[];
  setStoreNoteChange: React.Dispatch<React.SetStateAction<Note[]>>;
  listData: list;
  setlistData: React.Dispatch<React.SetStateAction<list>>;
  storeListData: list[];
  setStoreListData: React.Dispatch<React.SetStateAction<list[]>>;
  remainderNote: Note[];
  setremainderNote: React.Dispatch<React.SetStateAction<Note[]>>;
  archievedNote: NoteType[];
  setArchieveNote: React.Dispatch<React.SetStateAction<NoteType[]>>;
  ArchivedNotes: () => Promise<void>;
  NoteChange: Note;
  setNoteChange: React.Dispatch<React.SetStateAction<Note>>;
  Ispinned: boolean;
  setIspinned: React.Dispatch<React.SetStateAction<boolean>>;
  fetchApiData: () => Promise<void>;
  items: NoteType[];
  deletedNotes: NoteType[];
  DeletedNotes: () => Promise<void>;
};

const noteContext = createContext<noteContextprops | undefined>(undefined);

export const NoteContext = ({ children }: { children: React.ReactNode }) => {
  const [StoreNoteChange, setStoreNoteChange] = useState<Note[]>([]);
  const [storeListData, setStoreListData] = useState<list[]>([]);
  const [remainderNote, setremainderNote] = useState<Note[]>([]);
  const [NoteChange, setNoteChange] = useState<Note>({
    note: "",
    description: "",
    id: Date.now(),
    pinned: false,
    catgeory: "",
  });
  const [listData, setlistData] = useState({
    id: Date.now(),
    data: "",
    pinned: false,
    catgeory: "",
  });
  const [archievedNote, setArchieveNote] = useState<NoteType[]>([]);
  const [Ispinned, setIspinned] = useState<boolean>(false);
  const [items, setItems] = useState<NoteType[]>([]);
  const [deletedNotes, setDeletedNotes] = useState<NoteType[]>([]);
  const fetchApiData = async () => {
    fetch("http://localhost:2404/api/notes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setItems(data);
        console.log(data);
      });
  };

  const DeletedNotes = async () => {
    axios
      .get("http://localhost:2404/api/deletedNotes")
      .then((res) => {
        setDeletedNotes(res.data);
        console.log("Deleted notes fetched:", res.data);
      })
      .catch((error) => {
        console.error("Error fetching deleted notes:", error);
      });
  };

  const ArchivedNotes = async () => {
    axios
      .get("http://localhost:2404/api/getArchivedNotes")
      .then((res) => {
        setArchieveNote(res.data);
        console.log("Archived notes fetched:", res.data);
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
          storeListData,
          setStoreListData,
          listData,
          setlistData,
          setremainderNote,
          remainderNote,
          NoteChange,
          setNoteChange,
          StoreNoteChange,
          setStoreNoteChange,
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
