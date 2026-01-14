import NoteInput from "../../component/NoteMakingInputField/NoteInput";
import Note from "../../component/Note/Note";
import { useNote } from "../../Context/noteContext";
import { useEffect, useState } from "react";
import Loader from "../../component/Note/Loader/Loader";
import FilterButton from "../../component/Buttons/FilterButton/FilterButton";
import type { NoteType } from "../../types/Note.types";
import type { FilterState } from "../../types/FilterType";

export default function Home() {
  const { items, fetchApiData, loading } = useNote();

  const [filters, setFilters] = useState<FilterState>({
    archived: false,
    reminder: false,
    bin: false,
    labels: [],
  });

  const filteredItems = items?.filter((item: NoteType) => {
    // if(filters.pinned && !item.pinned) return false;
    if (filters.archived && !item?.isArchived) return false;
    return true;
  });

  console.log("Filtered Items:", filteredItems);

  useEffect(() => {
    fetchApiData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (!loading && items.length === 0) {
    return (
      <>
        <div className="p-4">
          <NoteInput />
        </div>
        <div className="flex flex-col items-center justify-center mt-20">
          <h2 className="text-xl font-semibold text-gray-500">
            No notes available. Start by creating a new note!
          </h2>
        </div>
      </>
    );
  }

  const pinnedNotes = filteredItems.filter((item: NoteType) => item.pinned);
  const unpinnedNotes = filteredItems.filter((item: NoteType) => !item.pinned);

  return (
    <>
      <div
        className="flex justify-end 
    md:p-4
    xsm:p-2
    "
      >
        <FilterButton filters={filters} setFilters={setFilters} />
      </div>
      <div className="p-4">
        <NoteInput />
      </div>

      <div className="px-4 mt-10">
        {/* Pinned Notes Section */}
        {pinnedNotes.length > 0 && (
          <div className="mb-8">
            <div className="flex pl-3 mb-4">
              <h1 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Pinned
              </h1>
            </div>
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-4 space-y-4">
              {pinnedNotes.map((item: NoteType) => (
                <div key={item.id} className="break-inside-avoid">
                  <Note
                    id={item.id}
                    title={item.title}
                    description={item.description}
                    NotePinned={item.pinned}
                    image={JSON.parse(item.image)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Unpinned Notes Section */}
        {unpinnedNotes.length > 0 && (
          <div>
            {pinnedNotes.length > 0 && (
              <div className="flex pl-3 mb-4">
                <h1 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Others
                </h1>
              </div>
            )}
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-4 space-y-4">
              {unpinnedNotes.map((item: NoteType) => (
                <div key={item.id} className="break-inside-avoid">
                  <Note
                    id={item.id}
                    title={item.title}
                    description={item.description}
                    NotePinned={item.pinned}
                    image={JSON.parse(item.image)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
