import NoteInput from "../../component/NoteMakingInputField/NoteInput";
import { useNote } from "../../Context/noteContext";
import { useEffect, useState } from "react";
// import Loader from "../../component/Note/Loader/Loader";
import FilterButton from "../../component/Buttons/FilterButton/FilterButton";
import type { NoteType } from "../../types/Note.types";
import type { FilterState } from "../../types/FilterType";
import NotesSection from "../../component/NotesSection/NotesSection";

export default function Home() {
  const { items, fetchApiData, loading } = useNote();

  const [filters, setFilters] = useState<FilterState>({
    archived: false,
    reminder: false,
    bin: false,
    labels: [],
  });
  const filteredItems = items?.filter((item: NoteType) => {
    // No filters selected → show normal notes only
    const noFilterSelected = !filters.archived && !filters.bin;

    if (noFilterSelected) {
      return !item.isDeleted && !item.isArchived;
    }

    if (filters.archived && item.isArchived) {
      return true;
    }

    if (filters.bin && item.isDeleted) {
      return true;
    }

    // if (filters.reminder && item.reminder) {
    //   return true;
    // }
  });

  useEffect(() => {
    fetchApiData();
  }, []);

  // if (loading) {
  //   return <Loader />;
  // }

  if (!loading && items.length === 0) {
    return (
      <>
        <div className="p-4">
          <NoteInput />
        </div>
        <div className="flex flex-col items-center justify-center mt-20">
          <h2 className="text-xl italic  opacity-50">
            No notes available. Start by creating a new note!
          </h2>
        </div>
      </>
    );
  }

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
      <NotesSection filteredItems={filteredItems} />
    </>
  );
}
