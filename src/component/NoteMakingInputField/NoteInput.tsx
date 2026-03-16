import React, { useEffect, useRef, useState } from "react";
import { TiPinOutline } from "react-icons/ti";
import { TiPin } from "react-icons/ti";
import { FaImage } from "react-icons/fa";
import IconStyling from "../IconStyling";
import { CiViewList } from "react-icons/ci";
import { InputList } from "./InputList";
import IconsArray from "../../../public/Data";
import { useNote } from "../../Context/noteContext";
import axiosClient from "../../api/axiosClient";
import { Logger } from "../../utils/Logger";
import { useLocation, useParams } from "react-router";
import NotePills from "../Pills/NotePills";
import type { NoteType } from "../../types/Note.types";
import BackgroundPaletteModal from "../Note/BackgroundColorPaletteModal";
import { useModal } from "../../Context/ModalProvider";

export const NoteInput = () => {
  // Define initial state as a constant
  const INITIAL_NOTE_STATE: NoteType = {
    id: new Date().getTime() || 0,
    title: "",
    description: "",
    pinned: false,
    category: "",
    bgColor: "",
    collaborators: [],
    hasReminder: false,
    image: [],
    list: [],
    isDeleted: false,
    isArchived: false,
    OwnerAttributes: {
      id: 0,
      name: "",
      email: "",
    },
    createdAt: "",
    updatedAt: "",
  };

  // Local state for note data
  const [NotesData, setNotesData] = useState<NoteType>(INITIAL_NOTE_STATE);
  // const temporaryNotes = new Map<number, NoteType>();

  // Local state
  const inputRef = useRef<HTMLDivElement>(null);
  const [LocalIsPinned, setLocalIsPinned] = useState(false);
  const [InputClick, setInputClick] = useState(false);
  const [listClick, setListClick] = useState(false);
  const [listArray, setListArray] = useState<
    { id: number | null; data: string }[]
  >([
    {
      id: null,
      data: "",
    },
  ]);

  //Context state
  const { setNotes } = useNote();
  const { backgroundColorModal, setBackgroundColorModal } = useModal();

  const bgRef = useRef<HTMLDivElement | null>(null);
  const [color, setColor] = useState("");

  const { pathname } = useLocation();
  const { label } = useParams();

  const SHOW_LABEL_PILL = pathname.startsWith("/editlabel");

  // Handle input changes for title and description
  const HandleNoteData = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (e.target.name === "title" || e.target.name === "description") {
      setNotesData({
        ...NotesData,
        [e.target.name]: e.target.value,
        pinned: LocalIsPinned,
      });
    }
  };

  // Update category in NotesData when label or InputClick changes
  useEffect(() => {
    setNotesData({
      ...NotesData,
      category: NotesData.category ? NotesData.category : label || "",
    });
  }, [label, InputClick]);

  // Handle click outside to save note and reset state
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        NotesData.title === "" &&
        NotesData.description === "" &&
        listArray.length <= 1
      ) {
        setInputClick(false);
        setLocalIsPinned(false);
        setListClick(false);
        setListArray([]);
        setNotesData(INITIAL_NOTE_STATE);
        setBackgroundColorModal(null);
        return;
      }
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setNotes((prevNotes) => [
          ...prevNotes,
          {
            ...NotesData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]);
        const stableData = { ...NotesData };
        apiCall(stableData);
        setInputClick(false);
        setLocalIsPinned(false);
        setListClick(false);
        setListArray([]);
        setNotesData(INITIAL_NOTE_STATE);
        setBackgroundColorModal(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  // API call to save note
  const apiCall = async (NotesData: NoteType) => {
    if (listArray.length <= 1) {
      if (
        (NotesData.title ?? "").trim() === "" &&
        (NotesData.description ?? "").trim() === ""
      )
        return;
    }
    const sendNotwe = {
      title: NotesData.title,
      description: NotesData.description,
      id: NotesData.id,
      pinned: NotesData.pinned,
      category: NotesData.category,
      list: listArray.length > 0 && listArray[0].data !== "" ? listArray : [],
    };

    try {
      const response = await axiosClient.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/addnotes`,
        sendNotwe,
      );

      // Reconcile optimistic temporary id with the id returned by the API.
      const responseData = response?.data;
      const serverId = responseData?.id;
      console.log("API response:", responseData.id);

      if (serverId !== null && NotesData.id) {
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note.id === NotesData.id ? { ...note, id: serverId } : note,
          ),
        );
      }

      setNotesData(INITIAL_NOTE_STATE);
      setListArray([]);
      setLocalIsPinned(false);
      setListClick(false);
      setBackgroundColorModal(null);
    } catch (error) {
      Logger("Error in apiCall:", error);
    }
  };

  // Initialize list array when list icon is clicked
  useEffect(() => {
    if (listClick) {
      setListArray([
        {
          id: Date.now(),
          data: "",
        },
      ]);
    }
  }, [listClick]);

  useEffect(() => {
    setNotesData((prevData) => ({
      ...prevData,
      bgColor: color,
    }));
  }, [color]);

  return (
    <>
      <div className="flex justify-center items-center ">
        {!InputClick ? (
          <div className="shadow-lg w-full max-w-[600px] py-2  px-4 border rounded-[5px] border-borderColor flex flex-col gap-2">
            <div className="flex w-full ">
              <input
                className="w-full outline-none "
                type="text"
                name="title"
                placeholder="Take a note"
                onChange={HandleNoteData}
                value={NotesData.title}
                onClick={() => {
                  setInputClick(true);
                }}
              />

              <div className="flex items-center gap-6 ">
                <div
                  onClick={() => {
                    setListClick(true);
                    setInputClick(true);
                  }}
                >
                  <IconStyling id={1} icon={CiViewList} />
                </div>

                <IconStyling id={2} icon={FaImage} />
              </div>
            </div>
          </div>
        ) : (
          // open input field
          <div
            ref={inputRef}
            className={`shadow-lg w-full max-w-[600px] py-2  px-4 border rounded-[5px] border-borderColor flex flex-col gap-2 ${color}`}
          >
            {/* title input field */}
            <div className="flex w-full px-4">
              <input
                onChange={HandleNoteData}
                autoComplete="off"
                className="w-full outline-none "
                type="text"
                placeholder="Title"
                name="title"
                value={NotesData.title}
              />

              {/* pinned icon */}
              {LocalIsPinned ? (
                <div
                  className="rounded-full  cursor-pointer w-[25px] h-[25px] p-1 hover:bg-secondary"
                  onClick={() => {
                    setNotesData({ ...NotesData, pinned: false });
                    setLocalIsPinned(false);
                  }}
                >
                  <TiPin className=" " />
                </div>
              ) : (
                <div
                  className="rounded-full  cursor-pointer w-[25px] h-[25px] p-1 hover:bg-secondary"
                  onClick={() => {
                    setNotesData({ ...NotesData, pinned: true });
                    setLocalIsPinned(true);
                  }}
                >
                  <TiPinOutline className="cursor-pointer mr-8" />
                </div>
              )}
            </div>

            {/* description input field */}
            {!listClick ? (
              <div className="px-4">
                <textarea
                  onChange={HandleNoteData}
                  autoComplete="off"
                  value={NotesData.description}
                  className="w-full outline-none resize-none"
                  rows={2}
                  name="description"
                  id=""
                  placeholder="Take a note..."
                ></textarea>
              </div>
            ) : (
              // input list
              <>
                <InputList listArray={listArray} setListArray={setListArray} />
              </>
            )}
            {/* list of icon */}
            {SHOW_LABEL_PILL && label && (
              <div className="ml-2">
                <NotePills title={label} color="" />
              </div>
            )}
            <div className=" flex items-center  justify-between px-4">
              <div className=" flex justify-between items-center gap-8 ">
                {IconsArray.map((item) => {
                  return (
                    <IconStyling
                      key={item.id}
                      id={item.id}
                      icon={item.icon}
                      onclick={(e: React.MouseEvent<HTMLDivElement>) => {
                        switch (item.id) {
                          case 2:
                            {
                              e?.stopPropagation();
                              console.log("Image icon clicked", NotesData.id);
                              setBackgroundColorModal(NotesData.id || 0);
                            }
                            break;
                          default:
                            break;
                        }
                      }}
                    />
                  );
                })}
              </div>
              {backgroundColorModal === NotesData.id && (
                <div className="absolute top-[305px] right-[780px] z-10">
                  <BackgroundPaletteModal
                    noteID={NotesData.id}
                    iconRef={bgRef}
                    setColor={setColor}
                  />
                </div>
              )}
              {/* close icon */}
              <div
                className="pr-6 cursor-pointer hover:bg-secondary px-5 py-2"
                onClick={() => {
                  setListArray([]);
                  apiCall(NotesData);
                  setNotesData(INITIAL_NOTE_STATE);
                  setInputClick(false);
                  setBackgroundColorModal(null);
                }}
              >
                close
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default NoteInput;
