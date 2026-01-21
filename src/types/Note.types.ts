export interface NoteType {
  id?: number;
  title?: string;
  description?: string;
  pinned?: boolean;
  image?: [];
  isDeleted?: boolean;
  isArchived?: boolean;
  hasReminder?: boolean;
  category?: string;
  list?: { id: number; data: string }[];
}
