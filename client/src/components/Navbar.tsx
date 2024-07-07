import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context";
import { useNoteContext } from "@/context/notesContext";

const Navbar = () => {
  const { clearNotes } = useNoteContext();
  const { isLogin, user, logout } = useAuthContext();
  const navigate = useNavigate();
  const handleLogOut = () => {
    logout();
    clearNotes();
  };
  return (
    <div className="w-full flex justify-between items-center px-20 py-5 fixed top-0 left-0">
      <Link to="/">
        <h1 className="tracking-tight text-2xl font-semibold">TODO-List</h1>
      </Link>
      <div className="flex flex-row items-center gap-7">
        {isLogin ? (
          <>
            <h3 className="tracking-tight text-lg font-semibold">
              Welcome <span className="text-violet-500 uppercase">{user}</span>
            </h3>
            <Button
              onClick={handleLogOut}
              className="bg-black text-white tracking-tight text-[15px] hover:bg-violet-500"
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => navigate("/auth")}
              className="bg-black text-white tracking-tight text-[15px] hover:bg-violet-500"
            >
              Login
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
