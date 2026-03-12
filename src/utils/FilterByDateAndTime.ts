import type { NoteType } from "../types/Note.types";

export const FilterByDateAndTime = (notes: NoteType[]) => {
  notes.sort((a, b) => {
    const dateA = new Date(a.updatedAt || 0).getTime();
    const dateB = new Date(b.updatedAt || 0).getTime();
    return dateA - dateB;
  });

  return notes;
};
