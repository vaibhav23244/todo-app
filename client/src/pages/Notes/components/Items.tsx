import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useNoteContext } from "@/context/notesContext";

const Items = () => {
  const { notes, getNotes, updateNote, deleteNote, isLoading } =
    useNoteContext();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    getNotes();
  }, [getNotes]);

  const handleEdit = (id: string, currentTodo: string) => {
    setEditingId(id);
    setEditValue(currentTodo);
  };

  const handleUpdate = async (id: string) => {
    try {
      const updatedNote = await updateNote(id, editValue);
      if (updatedNote) {
        getNotes();
      }
      setEditingId(null);
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNote(id);
      getNotes();
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  return (
    <ScrollArea className="w-full max-w-3xl h-[calc(100vh-250px)]">
      {notes && notes.length > 0 ? (
        notes.map(
          (item, index) =>
            item && (
              <div
                key={item._id}
                className="flex flex-col gap-4 justify-center items-start p-4 border-b"
              >
                <div className="flex flex-row gap-3 items-center w-full">
                  <span className="tracking-tight text-xl font-semibold min-w-[24px]">
                    {index + 1}.
                  </span>
                  {editingId === item._id ? (
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-grow"
                    />
                  ) : (
                    <h2 className="tracking-tight text-xl font-semibold flex-grow">
                      {item.todo}
                    </h2>
                  )}
                </div>
                <div className="w-full flex flex-row justify-end gap-2">
                  {editingId === item._id ? (
                    <>
                      <Button
                        disabled={isLoading}
                        variant="link"
                        className="tracking-tight text-sm hover:text-red-500"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        disabled={isLoading}
                        variant="link"
                        className="tracking-tight text-sm hover:text-green-500"
                        onClick={() => handleUpdate(item._id)}
                      >
                        Save
                      </Button>
                    </>
                  ) : (
                    <Button
                      disabled={isLoading}
                      variant="link"
                      className="tracking-tight text-sm hover:text-violet-500"
                      onClick={() => handleEdit(item._id, item.todo)}
                    >
                      Edit
                    </Button>
                  )}
                  <Button
                    disabled={isLoading}
                    variant="link"
                    className="tracking-tight text-sm hover:text-violet-500"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            )
        )
      ) : (
        <div className="flex flex-col gap-7 justify-center items-center">
          <h1 className="tracking-tight text-4xl font-semibold">
            Nothing to show here.
          </h1>
          <h3 className="tracking-tight text-2xl font-semibold">
            Try creating your first note &uarr;
          </h3>
          <img src="/assets/empty.svg" alt="logo" width={435} />
        </div>
      )}
    </ScrollArea>
  );
};

export default Items;
