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
import { useParams } from "react-router";
import { toast } from "react-toastify";

export const NoteInput = () => {
  interface NoteType {
    id: number;
    title: string;
    description: string;
    pinned: boolean;
    catgeory: string;
  }

  const [NotesData, setNotesData] = useState<NoteType>({
    id: 0,
    title: "",
    description: "",
    pinned: false,
    catgeory: "",
  });

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
  const { fetchApiData } = useNote();

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

  const { label } = useParams();

  useEffect(() => {
    setNotesData({
      ...NotesData,
      catgeory: NotesData.catgeory ? NotesData.catgeory : label || "",
    });
  }, [label, InputClick]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        const stableData = { ...NotesData };
        apiCall(stableData);
        setInputClick(false);
        setLocalIsPinned(false);
        setListClick(false);
        setListArray([]);
        setNotesData({
          title: "",
          description: "",
          id: Date.now(),
          pinned: false,
          catgeory: "",
        });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const apiCall = (NotesData: NoteType) => {
    if (listArray.length <= 1) {
      if (
        NotesData.title.trim() === "" &&
        NotesData.description.trim() === ""
      ) {
        toast.info("Note is empty, not saved.");
        return;
      }
    }
    const sendNotwe = {
      title: NotesData.title,
      description: NotesData.description,
      id: NotesData.id,
      pinned: NotesData.pinned,
      catgeory: NotesData.catgeory,
      list: listArray.length > 0 && listArray[0].data !== "" ? listArray : [],
    };

    try {
      axiosClient
        .post(`${import.meta.env.VITE_API_BASE_URL}/api/addnotes`, sendNotwe)
        .then(() => {
          fetchApiData();
        })
        .catch((error) => {
          Logger("Error adding note:", error);
        });

      setNotesData({
        title: "",
        description: "",
        id: Date.now(),
        pinned: false,
        catgeory: "",
      });
      setListArray([]);
      setLocalIsPinned(false);
      setListClick(false);
    } catch (error) {
      Logger("Error in apiCall:", error);
    }
  };

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
  return (
    <>
      <div className="flex justify-center items-center">
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
            className="shadow-2xl min-w-[600px] py-4 border rounded-[8px] border-[#5F6368] flex flex-col gap-2"
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
            <div className=" flex items-center  justify-between px-4">
              <div className=" flex justify-between items-center gap-8 ">
                {IconsArray.map((item) => {
                  return (
                    <IconStyling key={item.id} id={item.id} icon={item.icon} />
                  );
                })}
              </div>

              {/* close icon */}
              <div
                className="pr-6 cursor-pointer hover:bg-secondary px-5 py-2"
                onClick={() => {
                  setListArray([]);
                  apiCall(NotesData);
                  setNotesData({
                    id: Date.now(),
                    title: "",
                    description: "",
                    pinned: false,
                    catgeory: "",
                  });
                  setInputClick(false);
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
