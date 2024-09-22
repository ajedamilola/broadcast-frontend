import React, { useState } from "react";
import Navbar from "../components/Navbar";

const ChatRoom = () => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey there!",
      sender: "user",
    },
    {
      id: 2,
      text: "Hi! How are you?",
      sender: "other",
    },
    {
      id: 3,
      text: "I'm doing great, thanks! ",
      sender: "user",
    },
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (newMessage.trim() !== "") {
      setMessages([
        ...messages,
        { id: messages.length + 1, text: newMessage, sender: "user" },
      ]);

      setNewMessage("");
    }
  };

  return (
    <div className='w-full'>
      <div className='fixed w-full'>
        <Navbar />
      </div>

      <div className='mx-auto flex h-screen max-w-5xl flex-col font-montserrat'>
        <div className='searched flex-1 overflow-y-auto p-4'>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 ${
                message.sender === "user" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block rounded-lg p-2 ${
                  message.sender === "user"
                    ? "bg-primary text-white"
                    : "bg-white text-black"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className='flex p-3'>
          <input
            type='text'
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className='flex-1 border px-4 py-2 outline-none'
            placeholder='Type a message...'
          />

          {/* Send button */}
          <button
            onClick={handleSend}
            className='bg-primary px-4 py-2 text-white'
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
