export interface NoteType {
  id: number;
  title: string;
  description: string;
  pinned: boolean;
  image: string;
  isDeleted: boolean;
  isArchived: boolean;
}
