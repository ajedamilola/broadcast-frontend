import { Route, Routes } from "react-router-dom";
import ChatRoom from "./pages/ChatRoom";
import Login from "./pages/Login";
import AppContextProvider from "./AppContext";

const App = () => {
  return (
    <AppContextProvider>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/messenger' element={<ChatRoom />} />
      </Routes>
    </AppContextProvider>
  );
};

export default App;
