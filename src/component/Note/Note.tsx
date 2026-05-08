import React, { useRef, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import SelectIcon from "./SelectIcon";
import NoteDescription from "./NoteDescription";
import ActionIcons from "./ActionIcons";
import NoteTitle from "./NoteTitle";

import { TiPin, TiPinOutline } from "react-icons/ti";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import NotePills from "../Pills/NotePills";
import BackgroundPaletteModal from "./BackgroundColorPaletteModal";
import { useModal } from "../../Context/ModalProvider";
import { useNotesApi } from "../CustomHooks/useNotesApi";
import { useSelectedNotes } from "../../Context/SelectedNotes";

type NoteProps = {
  id: number;
  title: string;
  description: string;
  NotePinned: boolean;
  image?: string[];
  hasReminder?: boolean;
  list?: { id: number; data: string }[];
  category?: string;
  BgColor?: string;
};

const Note = React.memo((props: NoteProps) => {
  const {
    title,
    description,
    NotePinned,
    id,
    image,
    hasReminder,
    list,
    category,
    BgColor,
  } = props;

  const [LocalIsPinned, setLocalIsPinned] = useState(NotePinned);
  const [color, setColor] = useState(BgColor || "");

  const NoteRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);

  const [, setSearchParams] = useSearchParams();
  const { updateNote } = useNotesApi();
  const { backgroundColorModal } = useModal();
  const { setSelectedNotes, selectedNotes } = useSelectedNotes();

  // keep local pin in sync (IMPORTANT FIX)
  useEffect(() => {
    setLocalIsPinned(NotePinned);
  }, [NotePinned]);

  // pin toggle
  const handlePinned = useCallback(async () => {
    try {
      const newValue = !LocalIsPinned;

      await updateNote(id, {
        pinned: newValue,
      });

      setLocalIsPinned(newValue);
    } catch (error) {
      console.error("Error updating pin status:", error);
    }
  }, [id, LocalIsPinned, updateNote]);

  // open note
  const handleClick = useCallback(() => {
    setSearchParams({ note: String(id) });
  }, [id, setSearchParams]);

  // select toggle
  const toggleSelect = useCallback(() => {
    setSelectedNotes((prev: number[]) =>
      prev.includes(id)
        ? prev.filter((noteId) => noteId !== id)
        : [...prev, id],
    );
  }, [id, setSelectedNotes]);

  const isSelected = selectedNotes.includes(id);

  return (
    <div className="relative">
      <div
        ref={NoteRef}
        className={`group relative w-full ${color} shadow-md hover:shadow-xl transition-all duration-300 border rounded-lg border-borderColor break-words cursor-pointer overflow-hidden`}
      >
        {/* SELECT */}
        <div className="absolute top-0 left-0 z-10" onClick={toggleSelect}>
          <SelectIcon isSelected={isSelected} />
        </div>

        {/* PIN */}
        <div className="absolute top-0 right-0 z-10">
          <div
            data-tooltip-id={`pin-tooltip${id}`}
            data-tooltip-content={LocalIsPinned ? "Unpin note" : "Pin note"}
            onClick={handlePinned}
            className={`
              rounded-full flex justify-center items-center cursor-pointer w-9 h-9 m-1
              transition-opacity duration-200 opacity-0 group-hover:opacity-100
              ${LocalIsPinned ? "opacity-100" : ""}
              dark:hover:bg-secondary
            `}
          >
            {LocalIsPinned ? (
              <TiPin className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            ) : (
              <TiPinOutline className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            )}
            <Tooltip id={`pin-tooltip${id}`} place="bottom" />
          </div>
        </div>

        {/* IMAGES */}
        {image && image.length > 0 && (
          <div
            className={`grid gap-1 ${
              image.length === 1 ? "grid-cols-1" : "grid-cols-2"
            }`}
          >
            {image.map((item, index) => (
              <img
                key={index}
                className={`object-cover w-full ${
                  image.length === 1 ? "max-h-[300px]" : "max-h-[150px]"
                }`}
                src={item}
                alt=""
                loading="lazy"
              />
            ))}
          </div>
        )}

        {/* CONTENT */}
        <div className="p-4" onClick={handleClick}>
          <NoteTitle title={title} />
          <NoteDescription description={description} list={list} />
        </div>

        {/* PILLS */}
        <div className="p-4 pb-0 flex flex-wrap gap-2">
          {category && <NotePills title={category} color="" />}
          {hasReminder && <NotePills title="Reminder Set" color="" />}
        </div>

        {/* ACTIONS */}
        <ActionIcons bgRef={bgRef} id={id} hasReminder={hasReminder} />
      </div>

      {/* MODAL */}
      {backgroundColorModal === id && (
        <BackgroundPaletteModal
          noteID={id}
          iconRef={bgRef}
          setColor={setColor}
        />
      )}
    </div>
  );
});

export default Note;
