import { useNavbar } from "../../Context/navbarContext";
import type { NoteType } from "../../types/Note.types";
import Note from "../Note/Note";

const PinnedNotes = ({ pinnedNotes }: { pinnedNotes: NoteType[] }) => {
  const { layout } = useNavbar();
  return (
    <>
      {pinnedNotes.length > 0 && (
        <div className="mb-8">
          <div className="flex pl-3 mb-4">
            <h1 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Pinned
            </h1>
          </div>
          <div
            className={`${!layout ? "columns-1" : "columns-1 notes-sm:columns-2 notes-lg:columns-3 notes-xl:columns-4 2xl:columns-5"}
                      gap-4 space-y-4 transition-all ease-in duration-300`}
          >
            {pinnedNotes.map((item: NoteType) => (
              <div key={item.id} className="break-inside-avoid">
                <Note
                  id={item.id || 0}
                  title={item?.title || ""}
                  description={item?.description || ""}
                  NotePinned={item?.pinned || false}
                  image={item?.image || []}
                  hasReminder={item?.hasReminder || false}
                  list={item?.list || []}
                  category={item?.category || ""}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default PinnedNotes;
