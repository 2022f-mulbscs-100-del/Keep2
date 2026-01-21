import type { NoteType } from "./Note.types";

export interface AssociationNoteType {
  nextReminderDate: string;
  note: NoteType;
  remainderTime: string;
  reminderTitle: string;
}
