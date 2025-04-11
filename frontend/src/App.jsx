import {  Routes, Route } from "react-router-dom"; // Import Router and Switch
import Homepage from './pages/Homepage.jsx';
import ChatPage from './pages/ChatPage.jsx';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/chats" element={<ChatPage />} />
        <Route path="/chats/:chatId" element={<ChatPage />} />
      </Routes>
  );
}

export default App;
