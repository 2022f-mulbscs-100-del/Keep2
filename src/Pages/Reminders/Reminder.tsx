import { FaBell } from "react-icons/fa";
import NoteInput from "../../component/NoteMakingInputField/NoteInput";
import Note from "../../component/Note/Note";
import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useNavbar } from "../../Context/navbarContext";
import Loader from "../../component/Note/Loader/Loader";
import type { AssociationNoteType } from "../../types/AsocciationNote.types";

const Reminder = () => {
  const [reminderNotes, setReminderNotes] = useState<AssociationNoteType[]>([]);
  const { layout } = useNavbar();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // window.document.title = "Reminders - Keep2";
    setLoading(true);
    axiosClient
      .get("/getRemainderNotes")
      .then((response) => {
        setLoading(false);
        setReminderNotes(response.data);
      })
      .catch((error) => {
        setLoading(false);
        setReminderNotes([]);
        console.error("Error fetching remainder notes:", error);
      });
  }, []);

  if (loading) {
    return (
      <>
        <div className="p-4">
          <NoteInput />
        </div>
        <div>
          <Loader />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="p-4">
        <NoteInput />
      </div>

      <div className="px-4 mt-10">
        {reminderNotes.length == 0 ? (
          <div className="mt-50 flex flex-col justify-center items-center gap-4">
            <FaBell className="h-[100px] w-[100px] text-[#37383A]" />
            <h1 className="text-2xl font-bold text-[#9AA0A6]">
              Notes with upcoming reminders appear here
            </h1>
          </div>
        ) : (
          <div
            className={`${!layout ? "columns-1" : "columns-1 notes-sm:columns-2 notes-lg:columns-3 notes-xl:columns-4 2xl:columns-5"}
                      gap-4 space-y-4 transition-all ease-in duration-300`}
          >
            {reminderNotes.length > 0 &&
              reminderNotes.map((noteItem) => (
                <div key={noteItem?.note.id} className="break-inside-avoid ">
                  <Note
                    id={noteItem?.note.id || 0}
                    title={noteItem?.note.title || ""}
                    description={noteItem?.note.description || ""}
                    NotePinned={noteItem?.note.pinned || false}
                    image={noteItem?.note.image || []}
                    hasReminder={noteItem?.note.hasReminder || undefined}
                    list={noteItem?.note.list || []}
                    category={noteItem?.note.category || ""}
                  />
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Reminder;
