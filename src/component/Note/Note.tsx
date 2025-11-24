import { useRef, useState, useEffect } from "react";
import SelectIcon from "./SelectIcon";
import NoteDescription from "./NoteDescription";
import ActionIcons from "./ActionIcons";
import NoteTitle from "./NoteTitle";
import { useNavigate } from "react-router-dom";
import { TiPin, TiPinOutline } from "react-icons/ti";
import axios from "axios";
import { useNote } from "../../Context/noteContext";
import 'react-tooltip/dist/react-tooltip.css';

import { Tooltip } from "react-tooltip";
type NoteProps = {
  id: number;
  title: string;
  description: string;
  NotePinned: boolean;
};
const Note = ({ title, description, NotePinned, id }: NoteProps) => {
  // LOCAL STATES
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setLocalIsPinned] = useState(false);
  const [IsHover, setIsHover] = useState<boolean>(false);
  const NoteRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { fetchApiData,DeletedNotes } = useNote();

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
    axios.patch(`http://localhost:2404/api/pinnedNotes/${id}`, {
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
  }

  const HandleClick = () => {
    navigate("/notes/" + id);
  };




  return (
    <>
      <div
        ref={NoteRef}
        className={`relative w-[280px] h-min-[100px]   shadow-lg   border rounded-[8px] border-[#5F6368] break-words cursor-pointer `}
      >
        {/* Select Icon for selecting the note */}

        <SelectIcon IsHover={IsHover} />
        <div className="flex justify-end mr-2 ">
          {NotePinned ? (
            <div data-tooltip-id="pinned-tooltip"
              data-tooltip-content="Unpinned"
              onClick={HandlePinned}
              className="rounded-full flex justify-center  items-center  cursor-pointer w-[35px] h-[35px]   hover:bg-[#52535596] ">
              <TiPin
                className="size-6"
                
              />
              <Tooltip id="pinned-tooltip" place="top" />
            </div>
          ) : (
            <div
              data-tooltip-id="pinned-tooltip"
              data-tooltip-content="Pinned"
                onClick={HandlePinned}
              className="rounded-full flex justify-center  items-center  cursor-pointer w-[35px] h-[35px]   hover:bg-[#52535596] ">
              <TiPinOutline
                className="size-6"
              />
              <Tooltip id="pinned-tooltip" place="top" />
            </div>
          )}
        </div>

        {/* title and description of the note */}
        <div className="p-4" onClick={HandleClick}>
          {/* title of the note */}

          <NoteTitle title={title} IsHover={IsHover} />

          {/* description of the note */}
          <NoteDescription
            setLocalIsPinned={setLocalIsPinned}
            title={title}
            description={description}
            IsHover={IsHover}
            NotePinned={NotePinned}
          />
        </div>

        {/* Icons for note actions */}

        <ActionIcons IsHover={IsHover} id={id} />
      </div>
    </>
  );
};

export default Note;
