import { Route, Routes } from "react-router-dom";
import ChatRoom from "./pages/ChatRoom";
import Login from "./pages/Login";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/messenger' element={<ChatRoom />} />
      </Routes>
    </div>
  );
};

export default App;
