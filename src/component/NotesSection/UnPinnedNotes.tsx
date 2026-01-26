import { useNavbar } from "../../Context/navbarContext";
import type { NoteType } from "../../types/Note.types";
import Note from "../Note/Note";

const UnpinnedNotes = ({
  unpinnedNotes,
  pinnedNotes,
}: {
  unpinnedNotes: NoteType[];
  pinnedNotes: NoteType[];
}) => {
  const { layout } = useNavbar();
  return (
    <>
      {unpinnedNotes.length > 0 && (
        <div>
          {pinnedNotes.length > 0 && (
            <div className="flex pl-3 mb-4">
              <h1 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Others
              </h1>
            </div>
          )}
          <div
            className={` ${!layout ? "columns-1" : "columns-1 notes-sm:columns-2 notes-lg:columns-3 notes-xl:columns-4 2xl:columns-5"}
                    gap-4 space-y-4`}
          >
            {unpinnedNotes.map((item: NoteType) => (
              <div key={item.id} className="break-inside-avoid">
                <Note
                  id={item.id || 0}
                  title={item.title || ""}
                  description={item.description || ""}
                  NotePinned={item.pinned || false}
                  image={item.image}
                  hasReminder={item.hasReminder || false}
                  list={item?.list || []}
                  category={item?.category || ""}
                  BgColor={item?.bgColor || ""}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default UnpinnedNotes;
