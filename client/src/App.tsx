import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Authentication from "./pages/Authentication/Authentication";
import Navbar from "./components/Navbar";
import Error from "./pages/Error/Error";
import Notes from "./pages/Notes/Notes";
import { AuthContextProvider } from "./context";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import NoteProvider from "./context/notesContext";

const App = () => {
  const [user, setUser] = useState<String | null>(null);
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      login(JSON.parse(user).user);
      setIsLogin(true);
    }
  }, []);

  const login = (user: String | null) => {
    setUser(user);
    setIsLogin(true);
  };

  const logout = () => {
    setIsLogin(false);
    localStorage.clear();
  };

  return (
    <div>
      <AuthContextProvider value={{ user, isLogin, login, logout }}>
        <NoteProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/auth"
              element={isLogin ? <Navigate to="/notes" /> : <Authentication />}
            />
            <Route
              path="/notes"
              element={isLogin ? <Notes /> : <Navigate to="/" />}
            />
            <Route path="/*" element={<Error />} />
          </Routes>
        </NoteProvider>
      </AuthContextProvider>
    </div>
  );
};

export default App;
