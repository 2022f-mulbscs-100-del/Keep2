import type { NoteType } from "../../types/Note.types";
import PinnedNotes from "./PinnedNotes";
import UnpinnedNotes from "./UnPinnedNotes";

const NotesSection = ({ filteredItems }: { filteredItems: NoteType[] }) => {
  const pinnedNotes = filteredItems.filter((item: NoteType) => item.pinned);
  const unpinnedNotes = filteredItems.filter((item: NoteType) => !item.pinned);

  return (
    <div className="px-4 mt-10">
      {/* Pinned Notes Section */}
      <PinnedNotes pinnedNotes={pinnedNotes} />

      {/* Unpinned Notes Section */}
      <UnpinnedNotes pinnedNotes={pinnedNotes} unpinnedNotes={unpinnedNotes} />
    </div>
  );
};

export default NotesSection;
