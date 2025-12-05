import { useRef, useState, useEffect } from "react";
import SelectIcon from "./SelectIcon";
import NoteDescription from "./NoteDescription";
import ActionIcons from "./ActionIcons";
import NoteTitle from "./NoteTitle";
import { useNavigate } from "react-router-dom";
import { TiPin, TiPinOutline } from "react-icons/ti";
import axios from "axios";
import { useNote } from "../../Context/noteContext";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
type NoteProps = {
  id: number;
  title: string;
  description: string;
  NotePinned: boolean;
  image?: string[];
};
const Note = ({ title, description, NotePinned, id, image }: NoteProps) => {
  // LOCAL STATES

  const [LocalIsPinned, setLocalIsPinned] = useState(false);
  const [IsHover, setIsHover] = useState<boolean>(false);
  const NoteRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { fetchApiData, DeletedNotes } = useNote();
  useEffect(() => {
    setLocalIsPinned(NotePinned);
  }, []);
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
    axios
      .patch(`http://localhost:2404/api/pinnedNotes/${id}`, {
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
    <>
      <div
        ref={NoteRef}
        className={`relative w-[280px] h-min-[100px] overflow-hidden  shadow-lg   border rounded-[8px] border-[#5F6368] break-words cursor-pointer `}
      >
        {/* Select Icon for selecting the note */}

        <div className="absolute top-0">
          <SelectIcon IsHover={IsHover} />
        </div>
        <div className="flex justify-end mr-2 absolute top-0 right-0">
          <div
            data-tooltip-id={`pin-tooltip${id}`}
            data-tooltip-content={LocalIsPinned ? "Pinned" : "Unpinned"}
            onClick={HandlePinned}
            className="rounded-full flex justify-center  items-center  cursor-pointer w-[35px] h-[35px]   hover:bg-[#52535596] "
          >
            {LocalIsPinned ? (
              <TiPin className="size-6" />
            ) : (
              <TiPinOutline className="size-6" />
            )}
            <Tooltip id={`pin-tooltip${id}`} place="top" />
          </div>
        </div>
        <div>
          {image && image.length > 0 && (
            <div className="" onClick={HandleClick}>
              <img
                src={image[0]}
                alt="Note"
                className="w-full h-auto max-h-48 object-cover"
              />

              {image.length > 1 && (
                <div className="grid grid-cols-4   ">
                  {image.slice(1).map((item) => (
                    <img src={item} alt="" />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        {/* title and description of the note */}
        <div className="p-4" onClick={HandleClick}>
          {/* title of the note */}

          <NoteTitle title={title} IsHover={IsHover} />

          {/* description of the note */}
          <NoteDescription description={description} />
        </div>

        {/* Icons for note actions */}

        <ActionIcons IsHover={IsHover} id={id} />
      </div>
    </>
  );
};

export default Note;
