import NoteInput from "../../component/NoteMakingInputField/NoteInput";
import { useNote } from "../../Context/noteContext";
import { useEffect, useState } from "react";
import FilterButton from "../../component/Buttons/FilterButton/FilterButton";
import type { NoteType } from "../../types/Note.types";
import type { FilterState } from "../../types/FilterType";
import NotesSection from "../../component/NotesSection/NotesSection";
import Loader from "../../component/Note/Loader/Loader";
import axiosClient from "../../api/axiosClient";
import { Logger } from "../../utils/Logger";
import { FilterByDateAndTime } from "../../utils/FilterByDateAndTime";

export default function Home() {
  // Local state
  const [loadingState, setLoading] = useState(true);
  // State from context
  const { Notes, setNotes } = useNote();

  // Fetch notes on component mount
  useEffect(() => {
    setLoading(true);
    axiosClient
      .get("/notes")
      .then((res) => {
        setNotes(FilterByDateAndTime(res.data));
        setLoading(false);
      })
      .catch((error) => {
        Logger("Error fetching notes:", error);
        setLoading(false);
      });
  }, []);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    archived: false,
    reminder: false,
    bin: false,
    labels: [],
  });

  // Filter notes based on selected filters
  const filteredItems = Notes?.filter((item: NoteType) => {
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
  });

  return (
    <>
      <div
        className="flex justify-end 
    md:p-4
    xsm:p-2"
      >
        <FilterButton filters={filters} setFilters={setFilters} />
      </div>
      <div className="p-4">
        <NoteInput />
      </div>
      {loadingState ? (
        <div className="flex flex-col">
          <Loader />
        </div>
      ) : filteredItems.length > 0 ? (
        <NotesSection filteredItems={filteredItems} />
      ) : (
        <div className="flex flex-col items-center justify-center mt-20">
          <h2 className="text-xl italic  opacity-50">
            No notes available. Start by creating a new note!
          </h2>
        </div>
      )}
    </>
  );
}
