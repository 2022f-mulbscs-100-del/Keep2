
import React, { useContext, useState ,createContext } from "react";

 type Note={
        note:string,
        description:string,
     id:number,
     catgeory:string,
        pinned:boolean
    }

    type list={
        data:string,
        id:number,
        catgeory:string,
        pinned:boolean
    }

type noteContextprops = {

     StoreNoteChange: Note[];
   setStoreNoteChange : React.Dispatch<React.SetStateAction<Note[]>>;
   listData:list;
   setlistData: React.Dispatch<React.SetStateAction<list>>;
   storeListData: list[];
   setStoreListData : React.Dispatch<React.SetStateAction<list[]>>;
    remainderNote: Note[];
   setremainderNote : React.Dispatch<React.SetStateAction<Note[]>>;
    archievedNote: Note[];
   setArchieveNote : React.Dispatch<React.SetStateAction<Note[]>>;
     deletedNotes: Note[];
   setDeletedNotes : React.Dispatch<React.SetStateAction<Note[]>>;
 NoteChange : Note;
setNoteChange: React.Dispatch<React.SetStateAction<Note>>;
    Ispinned: boolean;
    setIspinned: React.Dispatch<React.SetStateAction<boolean>>;
}

const noteContext = createContext<noteContextprops | undefined>(undefined);


export const NoteContext = ({ children }: { children: React.ReactNode }) => {

   
const[deletedNotes, setDeletedNotes] =useState<Note[]>([])
    const [StoreNoteChange, setStoreNoteChange] = useState<Note[]>([]);
    const [storeListData, setStoreListData] = useState<list[]>([]);
    const [remainderNote , setremainderNote] = useState<Note[]>([]);
     const [archievedNote , setArchieveNote] = useState<Note[]>([]);
    const [NoteChange, setNoteChange] = useState<Note>( {
        note:"",
        description:"",
        id:Date.now(),
        pinned:false,
        catgeory:""
    }
    );
    const [listData, setlistData] = useState({
      id:Date.now(),
      data: '',
       pinned:false,
        catgeory:""
    });
    const [Ispinned, setIspinned] = useState<boolean>(false);
    
    return (
        <noteContext.Provider value={{storeListData,setStoreListData,listData,setlistData ,deletedNotes,setDeletedNotes, setremainderNote,remainderNote, NoteChange, setNoteChange, StoreNoteChange, setStoreNoteChange, Ispinned, setIspinned, archievedNote , setArchieveNote}}>
            {children}
        </noteContext.Provider>
    )
}


export const useNote = () => {
    const context = useContext(noteContext);
     if (!context) {
    throw new Error("useNote must be used within a noteProvider");
  }
  return context;
}