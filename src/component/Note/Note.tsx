import { useRef, useState, useEffect, useCallback } from "react";
import SelectIcon from "./SelectIcon";
import NoteDescription from "./NoteDescription";
import ActionIcons from "./ActionIcons";
import NoteTitle from "./NoteTitle";
import { useLocation, useNavigate } from "react-router-dom";
import { TiPin, TiPinOutline } from "react-icons/ti";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import NotePills from "../Pills/NotePills";
import BackgroundPaletteModal from "./BackgroundColorPaletteModal";
import { useModal } from "../../Context/ModalProvider";
import { useNotesApi } from "../CustomHooks/useNotesApi";

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

const Note = ({
  title,
  description,
  NotePinned,
  id,
  image,
  hasReminder,
  list,
  category,
  BgColor,
}: NoteProps) => {
  const [LocalIsPinned, setLocalIsPinned] = useState(false);
  const [IsHover, setIsHover] = useState<boolean>(false);
  const NoteRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchNotes, updateNote } = useNotesApi();
  const { backgroundColorModal } = useModal();
  const [color, setColor] = useState(BgColor || "");

  useEffect(() => {
    setLocalIsPinned(NotePinned);
  }, [NotePinned]);

  // Handle hover state for showing icons
  useEffect(() => {
    const HandleHover = (e: MouseEvent) => {
      const isThisNote = backgroundColorModal === id;

      if (NoteRef.current && NoteRef.current.contains(e.target as Node)) {
        setIsHover(true);
      } else {
        if (!isThisNote) {
          setIsHover(false);
        }
      }
    };
    HandleHover(new MouseEvent("mouseover"));
    document.addEventListener("mouseover", HandleHover);
    return () => {
      document.removeEventListener("mouseover", HandleHover);
    };
  }, [backgroundColorModal]);

  // Handle pinning/unpinning the note
  const handlePinned = useCallback(async () => {
    try {
      await updateNote(id, {
        pinned: !LocalIsPinned,
      });
      setLocalIsPinned(!LocalIsPinned);
      fetchNotes();
    } catch (error) {
      console.error("Error updating pin status:", error);
    }
  }, [id, LocalIsPinned, updateNote, fetchNotes]);

  // Handle background color change
  const handleClick = useCallback(() => {
    navigate(`/notes/${id}`, {
      state: { backgroundLocation: location },
    });
  }, [id, location]);
  const bgRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="relative">
      <div
        ref={NoteRef}
        className={`relative w-full ${color}    shadow-md hover:shadow-xl transition-all transform duration-300 border rounded-lg border-borderColor break-words cursor-pointer overflow-hidden`}
      >
        {/* Select Icon for selecting the note */}
        <div className="absolute top-0 left-0 z-10">
          <SelectIcon IsHover={IsHover} />
        </div>

        {/* Pin Icon */}
        <div className="absolute top-0 right-0 z-10">
          <div
            data-tooltip-id={`pin-tooltip${id}`}
            data-tooltip-content={LocalIsPinned ? "Unpin note" : "Pin note"}
            onClick={handlePinned}
            className={`rounded-full flex justify-center items-center cursor-pointer w-9 h-9 m-1 transition-opacity duration-200 ${
              IsHover || LocalIsPinned ? "opacity-100" : "opacity-0"
            } dark:hover:bg-secondary`}
          >
            {LocalIsPinned ? (
              <TiPin className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            ) : (
              <TiPinOutline className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            )}
            <Tooltip id={`pin-tooltip${id}`} place="bottom" />
          </div>
        </div>

        {/* Images */}
        {image && image.length > 0 && (
          <div
            className={`grid gap-1 ${
              image.length === 1
                ? "grid-cols-1"
                : image.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-2"
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
              />
            ))}
          </div>
        )}

        {/* Title and Description */}
        <div className="p-4" onClick={handleClick}>
          <NoteTitle title={title} IsHover={IsHover} />
          <NoteDescription description={description} list={list} />
        </div>
        <div className="p-4 pb-0 flex flex-wrap gap-2 ">
          {category && <NotePills title={category} color="" />}
          {hasReminder && <NotePills title="Reminder Set" color="" />}
        </div>
        {/* Action Icons */}
        <ActionIcons
          bgRef={bgRef}
          IsHover={IsHover}
          setIsHover={setIsHover}
          id={id}
          hasReminder={hasReminder}
        />
      </div>
      {backgroundColorModal === id && (
        <BackgroundPaletteModal
          noteID={id}
          iconRef={bgRef}
          setColor={setColor}
        />
      )}
    </div>
  );
};

export default Note;
