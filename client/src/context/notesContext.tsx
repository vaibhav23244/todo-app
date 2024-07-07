import React, { createContext, useContext, useState, useCallback } from "react";

interface Note {
  _id: string;
  todo: string;
}

interface NoteContextType {
  notes: Note[];
  isLoading: boolean;
  getNotes: () => Promise<void>;
  createNote: (todo: string) => Promise<Note | null>;
  updateNote: (id: string, todo: string) => Promise<Note | null>;
  deleteNote: (id: string) => Promise<boolean>;
  clearNotes: () => void;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export const useNoteContext = () => {
  const context = useContext(NoteContext);
  if (context === undefined) {
    throw new Error("useNoteContext must be used within a NoteProvider");
  }
  return context;
};

export const NoteProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL = "https://todo-app-backend-tkcy.onrender.com/note";

  const getAuthHeaders = () => {
    const user = localStorage.getItem("user");
    if (user) {
      const token = JSON.parse(user).token;
      return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
    }
  };

  const getNotes = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        setIsLoading(false);
        throw new Error("Failed to fetch notes");
      }
      setIsLoading(false);
      const data = await response.json();
      setNotes(Array.isArray(data.message) ? data.message : []);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching notes:", error);
      setNotes([]);
    }
  }, []);

  const createNote = useCallback(async (todo: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ todo }),
      });
      if (!response.ok) {
        setIsLoading(false);
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create note");
      }
      setIsLoading(false);
      const data = await response.json();
      setNotes((prevNotes) =>
        Array.isArray(prevNotes) ? [...prevNotes, data.message] : [data.message]
      );
      return data.message;
    } catch (error) {
      setIsLoading(false);
      console.error("Error creating note:", error);
      throw error;
    }
  }, []);

  const updateNote = useCallback(async (id: string, todo: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ todo }),
      });
      if (!response.ok) {
        setIsLoading(false);
        throw new Error("Failed to update note");
      }
      setIsLoading(false);
      const data = await response.json();
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note._id === id ? data.note : note))
      );
      return data.note;
    } catch (error) {
      setIsLoading(false);
      console.error("Error updating note:", error);
      return null;
    }
  }, []);

  const deleteNote = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        setIsLoading(false);
        throw new Error("Failed to delete note");
      }
      setIsLoading(false);
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
      return true;
    } catch (error) {
      setIsLoading(false);
      console.error("Error deleting note:", error);
      return false;
    }
  }, []);

  const clearNotes = () => {
    setNotes([]);
  };

  const value = {
    notes,
    getNotes,
    isLoading,
    createNote,
    updateNote,
    deleteNote,
    clearNotes,
  };

  return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
};

export default NoteProvider;
