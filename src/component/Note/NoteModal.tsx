import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../../Context/themeSwitcherContext";
import ActionIcons from "./ActionIcons";
import axiosClient from "../../api/axiosClient";
import { Logger } from "../../utils/Logger";
import type { NoteType } from "../../types/Note.types";
import { useNote } from "../../Context/noteContext";
import { io, Socket } from "socket.io-client";
import { useUser } from "../../Context/UserContext";

export default function NoteModal() {
  const [showModal, setShowModal] = useState(true);
  const { theme } = useTheme();
  const { items } = useNote();
  const { id: noteId } = useParams();
  const FilterNote = items.find((note: NoteType) => note.id === Number(noteId));
  const { profileData } = useUser();
  const [value, setValue] = useState<NoteType | null>(
    FilterNote
      ? {
          id: FilterNote.id,
          title: FilterNote.title,
          description: FilterNote.description,
          pinned: FilterNote.pinned,
          image: FilterNote.image,
          isDeleted: FilterNote.isDeleted,
          isArchived: FilterNote.isArchived,
        }
      : null,
  );
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const didFocus = useRef(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (!didFocus.current && textAreaRef.current) {
      textAreaRef.current.focus();
      didFocus.current = true;
    }
  }, []);

  const { id } = useParams();
  useEffect(() => {
    const fetchNote = async () => {
      setShowModal(true);
      try {
        axiosClient.get(`/notes/${id}`).then((response) => {
          setValue(response.data);
        });
      } catch (error) {
        Logger("Error fetching note:", error);
      }
    };
    fetchNote();
  }, [id]);

  const socketRef = useRef<Socket | null>(null);
  useEffect(() => {
    if (!noteId || !items.length) return;

    const note = items.find((n) => n.id === Number(noteId));
    if (!note?.collaborators?.length) return;

    const socket = io("http://localhost:2404");
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      socket.emit("noteRoom", `note-${noteId}`);
    });

    const handleMessage = (data: {
      from: string;
      title: string;
      description: string;
    }) => {
      if (data.from === profileData?.email) return;

      setValue((prev) => ({
        ...prev,
        title: data.title,
        description: data.description,
      }));
    };

    socket.on("NoteRoomMessage", handleMessage);

    return () => {
      socket.off("NoteRoomMessage", handleMessage);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [noteId, items, profileData?.email]);

  // Overlay click handler
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    try {
      axiosClient.put(`/UpdateNotes/${id}`, value);
    } catch (error) {
      Logger("Error updating note:", error);
    }

    if (ref.current && !ref.current.contains(e.target as Node)) {
      setShowModal(false);
      navigate(-1);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value: fieldValue } = e.target;

    // 1️⃣ ALWAYS update local state immediately
    setValue((prev) => {
      const updated = {
        ...prev,
        [name]: fieldValue,
      };

      socketRef.current?.emit("NoteRoomMessage", {
        noteId: `note-${noteId}`,
        title: updated.title,
        description: updated.description,
        from: profileData?.email,
      });

      return updated;
    });
  };

  if (!showModal) return null;
  if (!value) return null; // Wait for note to load

  const image = value.image || [];
  return (
    <div
      className="fixed bg-black/10 top-0 left-0 w-full h-full flex justify-center items-center z-10"
      onClick={handleOverlayClick}
    >
      <div
        ref={ref}
        className={` border-borderColor border rounded-[8px] min-w-[600px] min-h-[200px]  m-8 p-4  ${theme !== "dark" ? " bg-white" : " bg-black"} relative`}
      >
        {image && image.length > 0 && (
          <div className="flex  items-center p-4 gap-4">
            {image.map((item: string, index: number) => (
              <img
                key={index}
                src={item}
                alt=""
                className="w-[100px] h-[100px] object-cover rounded-t-[8px]"
              />
            ))}
          </div>
        )}
        <div className="flex justify-between items-center">
          <input
            className="border-0 w-full h-full bg-transparent focus:outline-none text-xl font-semibold"
            type="text"
            name="title"
            value={value?.title}
            onChange={handleChange}
          />
        </div>

        <div className="mt-4 h-[420px] overflow-y-auto customScrollBar">
          {value.list && value.list.length > 0 && (
            <div className="mt-4  customScrollBar">
              <ul>
                {value.list.map((item, index) => (
                  <li key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      // You can add checked state and onChange handler here
                    />
                    <span className="break-words">{item.data}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <textarea
            ref={textAreaRef}
            className="border-0 w-full h-full bg-transparent resize-none focus:outline-none customScrollBar "
            value={value?.description}
            name="description"
            onChange={handleChange}
          />
        </div>

        <div className="">
          <ActionIcons
            IsHover={true}
            id={Number(id)}
            onClick={() => setShowModal(false)}
          />
        </div>
      </div>
    </div>
  );
}
