import { TbLabelFilled } from "react-icons/tb";
import { NoteInput } from "../../component/NoteMakingInputField/NoteInput";
import Loader from "../../component/Note/Loader/Loader";
import { useEffect, useState } from "react";
import { useNavbar } from "../../Context/navbarContext";
import Note from "../../component/Note/Note";
import { useParams } from "react-router-dom";
import { useNote } from "../../Context/noteContext";
import { toast } from "react-toastify";

const EditLabels = () => {
  const { layout } = useNavbar();
  const [loading, setLoading] = useState<boolean>(false);
  const { label } = useParams();
  const { fetchApiData, items } = useNote();

  useEffect(() => {
    setLoading(true);
    try {
      fetchApiData();
      setLoading(false);
    } catch (_error) {
      toast.error(_error as string);
      setLoading(false);
    }
  }, [label]);

  const filteredNotes = items.filter((item) => {
    return (
      item.category === label &&
      item.isDeleted === false &&
      item.isArchived === false
    );
  });

  return (
    <>
      <div className="p-4">
        <NoteInput />
      </div>

      <div className="px-4 mt-10">
        {loading ? (
          <Loader />
        ) : filteredNotes.length >= 0 ? (
          <div
            className={`${!layout ? "columns-1" : "columns-1 notes-sm:columns-2 notes-lg:columns-3 notes-xl:columns-4 2xl:columns-5"}
                      gap-4 space-y-4 transition-all ease-in duration-300`}
          >
            {filteredNotes.length > 0 &&
              filteredNotes.map(
                (noteItem) =>
                  noteItem && (
                    <div key={noteItem?.id} className="break-inside-avoid ">
                      <Note
                        id={noteItem?.id || 0}
                        title={noteItem?.title || ""}
                        description={noteItem?.description || ""}
                        NotePinned={noteItem?.pinned || false}
                        image={noteItem?.image || []}
                        hasReminder={noteItem?.hasReminder || undefined}
                        list={noteItem?.list || []}
                        category={noteItem?.category || ""}
                      />
                    </div>
                  ),
              )}
          </div>
        ) : (
          <div className="mt-50 flex flex-col justify-center items-center gap-4">
            <TbLabelFilled className="h-[100px] w-[100px] text-[#37383A]" />
            <h1 className="text-2xl font-bold text-[#9AA0A6]">
              {" "}
              No notes with this label yet
            </h1>
          </div>
        )}
      </div>
    </>
  );
};

export default EditLabels;
