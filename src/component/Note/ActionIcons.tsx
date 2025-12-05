import { IoMdArchive } from "react-icons/io";
import IconStyling from "../IconStyling";
import { useNote } from "../../Context/noteContext";
import IconsArray, { DeleteIconsArray } from "../../../public/Data.js";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useRef, type ChangeEvent } from "react";
type ActionIconsProps = {
  IsHover: boolean;
  id: number;
  onClick?: () => void;
};

const ActionIcons = ({ IsHover, id, onClick }: ActionIconsProps) => {
  const { fetchApiData, DeletedNotes } = useNote();
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    StoreNoteChange,
    setStoreNoteChange,
    setremainderNote,
    ArchivedNotes,
  } = useNote();

  const deleteNote = (id: number) => {
    axios
      .put(`http://localhost:2404/api/UpdateNotes/${id}`, {
        isDeleted: true,
      })
      .then(() => {
        fetchApiData();
        ArchivedNotes();
        if (onClick) onClick();
        toast.success("Note trashed");
      })
      .catch((error) => {
        console.error("Error deleting note:", error);
      });
  };

  const RestoreNote = (id: number) => {
    axios
      .put(`http://localhost:2404/api/UpdateNotes/${id}`, {
        isDeleted: false,
      })
      .then(() => {
        DeletedNotes();
        if (onClick) onClick();
        toast.success("Note restored");
      })
      .catch((error) => {
        console.error("Error deleting note:", error);
      });
  };

  const ArchieveDescion = (id: number) => {
    if (pathname === "/archieve") {
      UnarchievedNote(id);
    } else {
      archieveNote(id);
    }
  };

  const ForeverDelete = (id: number) => {
    axios
      .delete(`http://localhost:2404/api/deleteNotes/${id}`)
      .then(() => {
        DeletedNotes();
        toast.success("Note deleted permanently");
      })
      .catch((error) => {
        console.error("Error deleting note:", error);
      });
  };

  const archieveNote = (id: number) => {
    axios
      .put(`http://localhost:2404/api/UpdateNotes/${id}`, {
        isArchived: true,
      })
      .then(() => {
        fetchApiData();
        if (onClick) onClick();
        toast.success("Note archived successfully");
      })
      .catch((error) => {
        console.error("Error archiving note:", error);
      });
  };

  const RemainderNote = (id: number) => {
    const PushRemainderNote = StoreNoteChange.find((item) => item.id === id);

    if (PushRemainderNote) {
      PushRemainderNote.catgeory = "/reminders";
      setremainderNote((prev) => [...prev, PushRemainderNote]);
    }
    const updateNote = StoreNoteChange.filter((item) => {
      return item.id !== id;
    });
    setStoreNoteChange(updateNote);
  };

  const openFileDialog = (id: number) => {
    inputRef.current?.click();
    console.log("Open file dialog", id);
  };
  const UploadOnClaudinary = async (e: ChangeEvent<HTMLInputElement>) => {
    console.log("File input changed");
    console.log("e.target.files:", e.target.files);
    let arrayOfFiles: File[] = [];
    arrayOfFiles = Array.from(e.target.files ? e.target.files : []);
    console.log("arrayOfFiles length:", arrayOfFiles.length);
    console.log("Upload on claudinary", arrayOfFiles);

    // const backendImageUrl = arrayOfFiles.map(async(file:File)=>{
    //   const data = new FormData();
    //   //eslint-disable-next-line
    //   data.append("file",file as any);
    //   data.append("upload_preset", "keepNote");
    //   data.append("cloud_name", "dxxbj1gjf");

    // console.log("files uploading to claudinary",file)

    //  await axios.post("https://api.cloudinary.com/v1_1/dxxbj1gjf/image/upload", data)
    //     .then((response) => {
    //       setFile(response.data.url);
    //       return response.data.url;

    //     })
    //     .catch((error) => {
    //       console.error("Error uploading file:", error);
    //     });

    // })

    // const fileUrl = await Promise.all(backendImageUrl);
    // console.log("fileUrl",fileUrl)
    //  UploadToBackend(id, backendImageUrl.());

    const backendImageUrl = arrayOfFiles.map(async (file: File) => {
      const data = new FormData();
      //eslint-disable-next-line
      data.append("file", file as any);
      data.append("upload_preset", "keepNote");
      data.append("cloud_name", "dxxbj1gjf");

      console.log("files uploading to cloudinary", file);

      try {
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dxxbj1gjf/image/upload",
          data,
        );
        return response.data.url;
      } catch (error) {
        console.error("Error uploading file:", error);
        return null;
      }
    });

    const fileUrl = await Promise.all(backendImageUrl);
    if (fileUrl) {
      UploadToBackend(id, fileUrl);
    }
  };

  const UploadToBackend = (id: number, fileUrl: string[]) => {
    console.log("Uploading to backend with fileUrl:", fileUrl);
    axios
      .put(`http://localhost:2404/api/UpdateNotes/${id}`, {
        imageUrl: fileUrl,
      })
      .then(() => {
        fetchApiData();
        toast.success("Image uploaded to note successfully");
      })
      .catch((error) => {
        console.error("Error uploading image to note:", error);
      });
  };
  const UnarchievedNote = (id: number) => {
    axios
      .put(`http://localhost:2404/api/UpdateNotes/${id}`, {
        isArchived: false,
      })
      .then(() => {
        ArchivedNotes();
        if (onClick) onClick();
        toast.success("Note unarchived successfully");
      })
      .catch((error) => {
        console.error("Error unarchiving note:", error);
      });
  };

  const { pathname } = useLocation();

  return (
    <>
      <div
        className={` flex ${pathname != "/bin" ? "justify-between" : "justify-start"}  items-center gap-2 px-2 py-1  transition-all duration-500 opacity-0 ${IsHover && `opacity-100`}`}
      >
        {pathname != "/bin"
          ? IconsArray.map((item) => {
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.id === 6) {
                      deleteNote(id);
                    }
                    if (item.id === 5) {
                      ArchieveDescion(id);
                    }
                    if (item.id === 3) {
                      RemainderNote(id);
                    }
                    if (item.id === 4) {
                      openFileDialog(id);
                    }
                  }}
                >
                  {pathname === "/archieve" && item.id === 5 ? (
                    <div>
                      <IconStyling
                        tooltip="Unarchive"
                        id={item.id}
                        icon={IoMdArchive}
                      />
                    </div>
                  ) : (
                    <IconStyling
                      tooltip={item.tooltip}
                      id={item.id}
                      icon={item.icon}
                    />
                  )}
                </div>
              );
            })
          : DeleteIconsArray.map((item) => {
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.id === 1) {
                      ForeverDelete(id);
                    }
                    if (item.id === 2) {
                      RestoreNote(id);
                    }
                  }}
                >
                  <IconStyling
                    tooltip={item.tooltip}
                    id={item.id}
                    icon={item.icon}
                  />
                </div>
              );
            })}
        <input
          ref={inputRef}
          multiple
          accept="image/*"
          onChange={UploadOnClaudinary}
          type="file"
          className="hidden"
        />
      </div>
    </>
  );
};

export default ActionIcons;
