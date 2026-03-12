import axiosClient from "../../api/axiosClient";
import { Logger } from "../../utils/Logger";
import type { NoteType } from "../../types/Note.types";
import { useNote } from "../../Context/noteContext";

interface UseNotesApiReturn {
  fetchNotes: () => Promise<void>;
  fetchDeletedNotes: () => Promise<void>;
  fetchArchivedNotes: () => Promise<void>;
  getNotes: () => Promise<void>;
  deleteNoteApi: (id: number) => Promise<void>;
  restoreNoteApi: (id: number) => Promise<void>;
  archieveNoteApi: (id: number) => Promise<void>;
  unArchieveNoteApi: (id: number) => Promise<void>;
  deleteForever: (id: number) => Promise<void>;
  updateNote: (id: number, updatedNote: Partial<NoteType>) => Promise<void>;
}

export const useNotesApi = (): UseNotesApiReturn => {
  const { setArchivedNotes, setDeletedNotes, setNotes, setLoading } = useNote();

  const fetchNotes = async () => {
    setLoading((prev) => ({ ...prev, intialLoading: true }));
    try {
      const res = await axiosClient.get("/notes");
      setNotes(res.data);
    } catch (error) {
      Logger("Error fetching notes:", error);
    } finally {
      setLoading((prev) => ({ ...prev, intialLoading: false }));
    }
  };

  const getNotes = async () => {
    try {
      const res = await axiosClient.get("/notes");
      setNotes(res.data);
    } catch (error) {
      Logger("Error fetching notes:", error);
    }
  };

  const updateNote = async (id: number, updatedNote: Partial<NoteType>) => {
    setLoading((prev) => ({ ...prev, updateLoading: true }));
    try {
      await axiosClient.put(`/UpdateNotes/${id}`, updatedNote);
    } catch (error) {
      Logger("Error updating note:", error);
      throw error;
    } finally {
      setLoading((prev) => ({ ...prev, updateLoading: false }));
    }
  };

  const fetchDeletedNotes = async () => {
    setLoading((prev) => ({ ...prev, deleteLoading: true }));
    try {
      const res = await axiosClient.get("/deletedNotes");
      setDeletedNotes(res.data);
    } catch (error) {
      Logger("Error fetching deleted notes:", error);
    } finally {
      setLoading((prev) => ({ ...prev, deleteLoading: false }));
    }
  };

  const fetchArchivedNotes = async () => {
    setLoading((prev) => ({ ...prev, archiveLoading: true }));
    try {
      const res = await axiosClient.get("/archivedNotes");
      console.log(res.data);
      setArchivedNotes(res.data);
    } catch (error) {
      Logger("Error fetching archived notes:", error);
    } finally {
      setLoading((prev) => ({ ...prev, archiveLoading: false }));
    }
  };

  const deleteNoteApi = async (id: number) => {
    setLoading((prev) => ({ ...prev, deleteLoading: true }));
    try {
      await axiosClient.put(`/UpdateNotes/${id}`, {
        isDeleted: true,
      });
    } catch (error) {
      Logger("Error deleting note:", error);
    } finally {
      setLoading((prev) => ({ ...prev, deleteLoading: false }));
    }
  };

  const restoreNoteApi = async (id: number) => {
    try {
      await axiosClient.put(`/UpdateNotes/${id}`, {
        isDeleted: false,
      });
    } catch (error) {
      Logger("Error restoring note:", error);
    }
  };

  const archieveNoteApi = async (id: number) => {
    try {
      await axiosClient.put(`/UpdateNotes/${id}`, {
        isArchived: true,
      });
    } catch (error) {
      Logger("Error archiving note:", error);
    }
  };

  const unArchieveNoteApi = async (id: number) => {
    try {
      await axiosClient.put(`/UpdateNotes/${id}`, {
        isArchived: false,
      });
    } catch (error) {
      Logger("Error unarchiving note:", error);
    }
  };

  const deleteForever = async (id: number) => {
    try {
      await axiosClient.delete(`/deleteNotes/${id}`);
    } catch (error) {
      Logger("Error permanently deleting note:", error);
    }
  };
  return {
    fetchNotes,
    fetchDeletedNotes,
    fetchArchivedNotes,
    updateNote,
    getNotes,
    restoreNoteApi,
    archieveNoteApi,
    unArchieveNoteApi,
    deleteNoteApi,
    deleteForever,
  };
};
