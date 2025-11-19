import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNote } from "../../Context/noteContext";
import { useTheme } from "../../zustand/ThemeSwitcherStore";

interface NoteType {
  _id: number;
  title: string;
  description: string;
}

export default function NoteModal() {
  const [showModal, setShowModal] = useState(true);
const {fetchApiData} = useNote();
const {theme}= useTheme();

  const [value, setValue] = useState<NoteType>({
    _id: 0,
    title: "",
    description: "",
  });
  const ref = useRef<HTMLDivElement>(null);
const navigate = useNavigate();
const textAreaRef = useRef<HTMLTextAreaElement> (null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, []);

const {id} = useParams();
  useEffect(() => { 
const fetchNote = async () => {
  try {
    const response = await fetch(`http://localhost:2404/api/notes/${id}`,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
    setValue(data);
  } catch (error) {
    console.error("Error fetching note:", error);
  }
};
fetchNote();
  }, [id])
  if (!showModal) return null;


  // Overlay click handler
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      console.log("Clicked outside modal");
      setShowModal(false);
      navigate("/");
    }
  };


const handleChange = async (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const { name, value: fieldValue } = e.target;


  const updatedNote = {
    ...value,
    [name]: fieldValue,
  };

setValue(updatedNote);
  console.log("Updating note with ID:", id, "and data:", updatedNote);
  try {
    const response = await fetch(`http://localhost:2404/api/UpdateNotes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedNote),
    });
    fetchApiData();
    const data = await response.json();
    console.log("Note updated:", data);
  } catch (error) {
    console.error("Error updating note:", error);
  }
};

  return (
    <div
      className="fixed bg-black/60 top-0 left-0 w-full h-full flex justify-center items-center z-100"
      onClick={handleOverlayClick} 
    >
      <div
        ref={ref}
        className={` border-[#5F6368] border rounded-[8px] w-[90%] md:w-[60%] lg:w-[40%] h-[500px] p-4  ${theme !== "dark" ? "text-black bg-white" : "text-white bg-[#121212]"} relative`}
      >
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
          <textarea
            className="border-0 w-full h-full bg-transparent resize-none focus:outline-none customScrollBar "
            value={value?.description}
            name="description"
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}
