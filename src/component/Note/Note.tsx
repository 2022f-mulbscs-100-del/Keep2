import { useRef, useState, useEffect } from "react";
import SelectIcon from "./SelectIcon";
import NoteDescription from "./NoteDescription";
import ActionIcons from "./ActionIcons";
import NoteTitle from "./NoteTitle";
import { useNavigate } from "react-router-dom";
import { TiPin, TiPinOutline } from "react-icons/ti";

import { useNote } from "../../Context/noteContext";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import axiosClient from "../../api/axiosClient";

type NoteProps = {
  id: number;
  title: string;
  description: string;
  NotePinned: boolean;
  image?: string[];
};

const Note = ({ title, description, NotePinned, id, image }: NoteProps) => {
  const [LocalIsPinned, setLocalIsPinned] = useState(false);
  const [IsHover, setIsHover] = useState<boolean>(false);
  const NoteRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { fetchApiData, DeletedNotes } = useNote();

  useEffect(() => {
    setLocalIsPinned(NotePinned);
  }, [NotePinned]);

  useEffect(() => {
    const HandleHover = (e: MouseEvent) => {
      if (NoteRef.current && NoteRef.current.contains(e.target as Node)) {
        setIsHover(true);
      } else {
        setIsHover(false);
      }
    };

    document.addEventListener("mouseover", HandleHover);
    return () => {
      document.removeEventListener("mouseover", HandleHover);
    };
  }, []);

  const HandlePinned = () => {
    axiosClient
      .patch(`${import.meta.env.VITE_API_BASE_URL}/api/pinnedNotes/${id}`, {
        pinned: !NotePinned,
      })
      .then(() => {
        fetchApiData();
        DeletedNotes();
        setLocalIsPinned(!NotePinned);
      })
      .catch((error) => {
        console.error("Error updating note pin status:", error);
      });
  };

  const HandleClick = () => {
    navigate("/notes/" + id);
  };

  return (
    <div
      ref={NoteRef}
      className="relative w-full     shadow-md hover:shadow-xl transition-shadow duration-200 border rounded-lg border-borderColor break-words cursor-pointer overflow-hidden"
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
          onClick={HandlePinned}
          className={`rounded-full flex justify-center items-center cursor-pointer w-9 h-9 m-1 transition-opacity duration-200 ${
            IsHover || LocalIsPinned ? "opacity-100" : "opacity-0"
          }  dark:hover:bg-secondary`}
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
      <div className="p-4" onClick={HandleClick}>
        <NoteTitle title={title} IsHover={IsHover} />
        <NoteDescription description={description} />
      </div>

      {/* Action Icons */}
      <ActionIcons IsHover={IsHover} id={id} />
    </div>
  );
};

export default Note;
