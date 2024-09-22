import { Route, Routes } from "react-router-dom";
import ChatRoom from "./pages/ChatRoom";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<ChatRoom />} />
      </Routes>
    </div>
  );
};

export default App;
