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
  bgColor?: string;
  collaborators?: {
    id: number;
    noteId: number;
    collaborator: string;
    role: string;
  }[];
  OwnerAttributes?: {
    id: number;
    name: string;
    email: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export type LoadingType = {
  intialLoading: boolean;
  deleteLoading: boolean;
  updateLoading: boolean;
  archiveLoading: boolean;
};
