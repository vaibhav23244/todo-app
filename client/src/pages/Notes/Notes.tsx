import ToDoForm from "./components/ToDoForm";
import Items from "./components/Items";

const Notes = () => {
  return (
    <div className="w-full h-screen flex flex-col gap-7 items-center pt-24">
      <ToDoForm />
      {<Items />}
    </div>
  );
};

export default Notes;
