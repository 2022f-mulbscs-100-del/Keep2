import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNote } from "../../Context/noteContext";
import { useTheme } from "../../Context/themeSwitcherContext";
import ActionIcons from "./ActionIcons";
import axiosClient from "../../api/axiosClient";
import { Logger } from "../../utils/Logger";
import type { NoteType } from "../../types/Note.types";

export default function NoteModal() {
  const [showModal, setShowModal] = useState(true);
  const { fetchApiData } = useNote();
  const { theme } = useTheme();
  const [value, setValue] = useState<NoteType>({
    id: 0,
    title: "",
    description: "",
    pinned: false,
    image: "",
    isDeleted: false,
    isArchived: false,
  });
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, []);

  const { id } = useParams();
  useEffect(() => {
    const fetchNote = async () => {
      setShowModal(true);
      try {
        axiosClient.get(`/notes/${id}`).then((res) => setValue(res.data));
      } catch (error) {
        Logger("Error fetching note:", error);
      }
    };
    fetchNote();
  }, [id]);
  if (!showModal) return null;

  // Overlay click handler
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setShowModal(false);
      navigate(-1);
    }
  };

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value: fieldValue } = e.target;

    const updatedNote = {
      ...value,
      [name]: fieldValue,
    };

    setValue(updatedNote);

    try {
      axiosClient.put(`/notes/${id}`, updatedNote);
      fetchApiData();
    } catch (error) {
      Logger("Error updating note:", error);
    }
  };

  const image = value.image ? JSON.parse(value.image) : [];
  return (
    <div
      className="fixed bg-black/60 top-0 left-0 w-full h-full flex justify-center items-center z-100"
      onClick={handleOverlayClick}
    >
      <div
        ref={ref}
        className={` border-borderColor border rounded-[8px] w-[90%] md:w-[60%] lg:w-[40%] p-4  ${theme !== "dark" ? " bg-white" : " bg-black"} relative`}
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
          <textarea
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
