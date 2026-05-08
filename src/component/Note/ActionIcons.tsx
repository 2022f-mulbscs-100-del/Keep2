import { IoMdArchive } from "react-icons/io";
import IconStyling from "../IconStyling";
import { useNote } from "../../Context/noteContext";
import IconsArray, { DeleteIconsArray } from "../../../public/Data.js";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import React, { useRef } from "react";
import axiosClient from "../../api/axiosClient.js";
import axios from "axios";
import { Logger } from "../../utils/Logger.js";
import { useModal } from "../../Context/ModalProvider.js";
import { BiSolidBellMinus } from "react-icons/bi";
import { useNotesApi } from "../CustomHooks/useNotesApi.js";
import type { NoteType } from "../../types/Note.types.js";
import { useUser } from "../../Context/UserContext.js";

type ActionIconsProps = {
  id: number;
  onClick?: () => void;
  hasReminder?: boolean;
  bgRef?: React.RefObject<HTMLDivElement | null>;
};

const ActionIcons = React.memo(
  ({ id, hasReminder, bgRef }: ActionIconsProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const { setNotes, setDeletedNotes, setArchivedNotes } = useNote();
    const { profileData } = useUser();
    const {
      setReminderModal,
      setNoteId,
      setBackgroundColorModal,
      setCollaboratorModal,
    } = useModal();
    const isActiveSubscriber = profileData?.subscriptionStatus === "active";

    //Hooks
    const {
      getNotes,
      restoreNoteApi,
      archieveNoteApi,
      unArchieveNoteApi,
      deleteNoteApi,
      deleteForever,
    } = useNotesApi();

    const { pathname } = useLocation();

    const handlePremiumFeatureClick = (featureName: string) => {
      toast.info(
        `Upgrade to Pro to use ${featureName}. Go to Settings > Subscription to upgrade.`,
      );
    };

    // Delete Note
    const deleteNote = async (id: number) => {
      setNotes((prevNotes: NoteType[]) =>
        prevNotes.map((note) => {
          if (note.id === id) {
            return { ...note, isDeleted: true };
          }
          return note;
        }),
      );
      await deleteNoteApi(id);
    };

    // Restore Note from Bin
    const RestoreNote = (id: number) => {
      setDeletedNotes((prevNotes: NoteType[]) =>
        prevNotes.filter((note) => note.id !== id),
      );
      restoreNoteApi(id);
    };

    // Archieve Note
    const ArchieveDescion = (id: number) => {
      if (pathname === "/archieve") {
        UnarchievedNote(id);
      } else {
        archieveNote(id);
      }
    };

    // Permanently delete note from bin
    const ForeverDelete = async (id: number) => {
      setDeletedNotes((prevNotes: NoteType[]) =>
        prevNotes.filter((note) => note.id !== id),
      );
      await deleteForever(id);
    };

    // Archieve Note
    const archieveNote = async (id: number) => {
      setNotes((prevNotes: NoteType[]) =>
        prevNotes.map((note) => {
          if (note.id === id) {
            return { ...note, isArchived: true };
          }
          return note;
        }),
      );
      await archieveNoteApi(id);
    };

    // Unarchieve Note
    const UnarchievedNote = (id: number) => {
      setArchivedNotes((prevNotes: NoteType[]) =>
        prevNotes.filter((note) => note.id !== id),
      );
      unArchieveNoteApi(id);
    };

    //image upload to cloudinary and backend
    const openFileDialog = () => {
      inputRef.current?.click();
    };
    const UploadOnClaudinary = async (
      e: React.ChangeEvent<HTMLInputElement>,
    ) => {
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

    return (
      <div className="relative">
        <div
          className={` flex ${pathname != "/bin" ? "justify-between" : "justify-start"}  items-center gap-2 px-2 py-1  transition-all duration-500 opacity-0 group-hover:opacity-100`}
        >
          {pathname != "/bin"
            ? IconsArray.map((item) => {
                const isPremiumFeature = item.id === 3 || item.id === 7;
                const isDisabled = isPremiumFeature && !isActiveSubscriber;
                const featureName =
                  item.id === 3 ? "Reminders" : "Collaborators";
                return (
                  <div
                    ref={item.id === 2 ? bgRef : null}
                    key={item.id}
                    className={
                      isDisabled ? "opacity-50 cursor-not-allowed" : ""
                    }
                    onClick={(e) => {
                      if (isDisabled) {
                        e.stopPropagation();
                        handlePremiumFeatureClick(featureName);
                        return;
                      }

                      e.stopPropagation();
                      switch (item.id) {
                        case 2:
                          {
                            setBackgroundColorModal(id);
                          }
                          break;
                        case 3:
                          {
                            setReminderModal(true);
                            setNoteId(id);
                          }
                          break;
                        case 4:
                          openFileDialog();
                          break;
                        case 5:
                          ArchieveDescion(id);
                          break;
                        case 6:
                          deleteNote(id);
                          break;
                        case 7:
                          {
                            setCollaboratorModal(true);
                            setNoteId(id);
                          }
                          break;
                        default:
                      }
                    }}
                  >
                    {hasReminder === true && item.id === 3 ? (
                      <div>
                        <IconStyling
                          tooltip={
                            isDisabled
                              ? "Upgrade to Pro to use Reminders"
                              : "Remove Reminder"
                          }
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
                        tooltip={
                          isDisabled
                            ? `Upgrade to Pro to use ${featureName}`
                            : item.tooltip
                        }
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
      </div>
    );
  },
);

export default ActionIcons;
