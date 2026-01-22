import { IoMdArchive } from "react-icons/io";
import IconStyling from "../IconStyling";
import { useNote } from "../../Context/noteContext";
import IconsArray, { DeleteIconsArray } from "../../../public/Data.js";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useRef, type ChangeEvent } from "react";
import axiosClient from "../../api/axiosClient.js";
import axios from "axios";
import { Logger } from "../../utils/Logger.js";
import { useModal } from "../../Context/ModalProvider.js";
import { BiSolidBellMinus } from "react-icons/bi";

type ActionIconsProps = {
  IsHover: boolean;
  id: number;
  onClick?: () => void;
  hasReminder?: boolean;
};

const ActionIcons = ({
  IsHover,
  id,
  onClick,
  hasReminder,
}: ActionIconsProps) => {
  const { getNotes, DeletedNotes } = useNote();
  const inputRef = useRef<HTMLInputElement>(null);

  const { setReminderModal, setNoteId } = useModal();
  const deleteNote = (id: number) => {
    axiosClient
      .put(`${import.meta.env.VITE_API_BASE_URL}/api/UpdateNotes/${id}`, {
        isDeleted: true,
      })
      .then(() => {
        getNotes();
        if (onClick) onClick();
        toast.success("Note trashed");
      })
      .catch((error) => {
        Logger("Error deleting note:", error);
      });
  };

  const RestoreNote = (id: number) => {
    axiosClient
      .put(`${import.meta.env.VITE_API_BASE_URL}/api/UpdateNotes/${id}`, {
        isDeleted: false,
      })
      .then(() => {
        DeletedNotes();
        if (onClick) onClick();
        toast.success("Note restored");
      })
      .catch((error) => {
        Logger("Error restoring note:", error);
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
    axiosClient
      .delete(`${import.meta.env.VITE_API_BASE_URL}/api/deleteNotes/${id}`)
      .then(() => {
        DeletedNotes();
        toast.success("Note deleted permanently");
      })
      .catch((error) => {
        Logger("Error permanently deleting note:", error);
      });
  };

  const archieveNote = (id: number) => {
    axiosClient
      .put(`${import.meta.env.VITE_API_BASE_URL}/api/UpdateNotes/${id}`, {
        isArchived: true,
      })
      .then(() => {
        getNotes();
        if (onClick) onClick();
        toast.success("Note archived successfully");
      })
      .catch((error) => {
        Logger("Error archiving note:", error);
      });
  };

  const openFileDialog = () => {
    inputRef.current?.click();
  };
  const UploadOnClaudinary = async (e: ChangeEvent<HTMLInputElement>) => {
    let arrayOfFiles: File[] = [];
    arrayOfFiles = Array.from(e.target.files ? e.target.files : []);
    // const backendImageUrl = arrayOfFiles.map(async(file:File)=>{
    //   const data = new FormData();
    //   //eslint-disable-next-line
    //   data.append("file",file as any);
    //   data.append("upload_preset", "keepNote");
    //   data.append("cloud_name", "dxxbj1gjf");
    //  await axios.post("https://api.cloudinary.com/v1_1/dxxbj1gjf/image/upload", data)
    //     .then((response) => {
    //       setFile(response.data.url);
    //       return response.data.url;

    //     })
    //     .catch((error) => {
    //     Logger("Error uploading file:", error);
    //     });

    // })

    // const fileUrl = await Promise.all(backendImageUrl);

    //  UploadToBackend(id, backendImageUrl.());

    const backendImageUrl = arrayOfFiles.map(async (file: File) => {
      const data = new FormData();
      //eslint-disable-next-line
      data.append("file", file as any);
      data.append("upload_preset", "keepNote");
      data.append("cloud_name", "dxxbj1gjf");

      try {
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dxxbj1gjf/image/upload",
          data,
        );
        return response.data.url;
      } catch (error) {
        Logger("Error uploading file:", error);
        return null;
      }
    });

    const fileUrl = await Promise.all(backendImageUrl);
    if (fileUrl) {
      UploadToBackend(id, fileUrl);
    }
  };

  const UploadToBackend = (id: number, fileUrl: string[]) => {
    axiosClient
      .put(`${import.meta.env.VITE_API_BASE_URL}/api/UpdateNotes/${id}`, {
        imageUrl: fileUrl,
      })
      .then(() => {
        getNotes();
        toast.success("Image uploaded to note successfully");
      })
      .catch((error) => {
        Logger("Error uploading image to note:", error);
      });
  };
  const UnarchievedNote = (id: number) => {
    axiosClient
      .put(`${import.meta.env.VITE_API_BASE_URL}/api/UpdateNotes/${id}`, {
        isArchived: false,
      })
      .then(() => {
        if (onClick) onClick();
        toast.success("Note unarchived successfully");
      })
      .catch((error) => {
        Logger("Error unarchiving note:", error);
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
                    if (item.id === 4) {
                      openFileDialog();
                    }
                    if (item.id === 3) {
                      if (pathname === "/reminders") {
                        // Remove reminder logic here
                      }
                      setReminderModal(true);
                      setNoteId(id);
                    }
                  }}
                >
                  {hasReminder === true && item.id === 3 ? (
                    <div>
                      <IconStyling
                        tooltip="Remove Reminder"
                        id={item.id}
                        icon={BiSolidBellMinus}
                      />
                    </div>
                  ) : pathname === "/archieve" && item.id === 5 ? (
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
