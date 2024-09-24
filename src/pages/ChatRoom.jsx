/* eslint-disable react/prop-types */
import { useCallback, useContext, useEffect, useLayoutEffect, useState, useRef, useMemo } from "react";
import Navbar from "../components/Navbar";
import { Contract } from "ethers";
import { messagingABI, messagingContractAddress } from "../constants";
import { AppContext } from "../AppContext";
import { Report } from "notiflix";
import Lottie from "lottie-react"
import gift from "../lottie/gift.json";
import gift_idle from "../lottie/gift_idle.json";

const Message = ({ message, address, handleReact, handleReply, scrollToMessage, reactingStates, messages }) => {
  const [showGiftAnimation, setShowGiftAnimation] = useState(false);

  const onReact = async () => {
    await handleReact(message.id);
    setShowGiftAnimation(true);
    setTimeout(() => setShowGiftAnimation(false), 3000); // Adjust time based on your animation duration
  };

  const replying = message.replying && messages.find(m => m.id == message.replying)

  return message.id != 0 && (
    <div
      className={`mb-8 ${message.address === address ? "text-right" : "text-left"}`}
    >
      {message.replying && message.replying !== "0" && (
        <div
          className="text-sm text-gray-500 mb-1 cursor-pointer hover:underline"
          onClick={() => scrollToMessage(parseInt(message.replying))}
        >
          Replying to: <span className="font-semibold">{replying.text.substring(0, 50)}{replying.text.length >= 50 && "..."}</span>
        </div>
      )}
      <div className="ms-auto">
        <img
          src={`https://api.dicebear.com/9.x/shapes/svg?seed=${message.sender}`}
          alt={message.sender}
          style={{ float: message.address != address ? "left" : "right" }}
          className="w-8 h-8 rounded-full mx-2"
        />
      </div>
      <div className="flex">
        <div
          className={`rounded-lg p-2 ${message.address === address
            ? "bg-primary text-white ms-auto"
            : "bg-white text-black"
            }`}
        >
          {message.text}
        </div>
      </div>
      <div className="mt-1 text-sm">
        <button
          onClick={onReact}
          className={`inline-flex items-center rounded-full text-xs font-medium opacity-70 disabled:opacity-100 bg-yellow-200 text-yellow-800 hover:bg-yellow-200 disabled:cursor-not-allowed pl-2 pr-3`}
          disabled={message.stars.includes(address) || reactingStates[message.id]}
        >
          {reactingStates[message.id] && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-yellow-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}

          <Lottie
            animationData={showGiftAnimation ? gift : gift_idle}
            loop
            style={{ width: 40, margin: "-4px 0px" }}
          />
          {message.stars.length}
        </button>
        <button onClick={() => handleReply(message.id)} className="text-blue-500 hover:text-blue-600 ml-2">
          Reply
        </button>
      </div>
    </div>
  );
};

const ChatRoom = () => {
  const [newMessage, setNewMessage] = useState("");
  const { ethersData, address } = useContext(AppContext)
  const contract = useMemo(() => new Contract(messagingContractAddress, messagingABI, ethersData?.signer), [ethersData?.signer])
  const [fetching, setFetching] = useState(false)
  const [sending, setSending] = useState(false)
  const [replying, setReplying] = useState("")
  const messagesEndRef = useRef(null)
  const messageRefs = useRef({})
  const [reactingStates, setReactingStates] = useState({})

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey there 👋, this application is still loading 🌚",
      sender: "user",
      stars: [],
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  console.log(messages);

  const handleSend = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;
    try {
      setSending(true);
      const currentDate = Math.floor(Number(Date.now() / 1000));
      console.log(newMessage, localStorage.getItem("username") || "Anonymous", currentDate, replying)
      const rawMessages = await contract.sendMessage(newMessage, localStorage.getItem("username") || "Anonymous", currentDate, replying);
      await rawMessages.wait()
      setMessages([
        ...messages,
        { id: messages.length + 1, text: newMessage, sender: localStorage.getItem("username") || "Anonymous", address: await ethersData.signer.getAddress(), stars: [], replying: replying },
      ]);
      setNewMessage("");
      setReplying(null);
    } catch (error) {
      console.log(error)
      Report.failure("Unable to send message")
    } finally {
      setSending(false);
    }
  };

  const handleReact = async (messageId) => {
    try {
      const message = messages.find(m => m.id == messageId);
      if (message.stars.includes(address)) return
      setReactingStates(prev => ({ ...prev, [messageId]: true }));
      const details = await contract.reactToMessage(messageId);
      await details.wait()
      setMessages(messages.map(msg =>
        msg.id === messageId ? { ...msg, stars: [...msg.stars, 1] } : msg
      ));
    } catch (error) {
      console.log(error);
      Report.failure("Unable to react to message");
    } finally {
      setReactingStates(prev => ({ ...prev, [messageId]: false }));
    }
  };

  const handleReply = (messageId) => {
    setReplying(messageId.toString());
  };

  const cancelReply = () => {
    setReplying("");
  };

  const scrollToMessage = (messageId) => {
    messageRefs.current[messageId]?.scrollIntoView({ behavior: "smooth" });
  };

  const InitData = useCallback(async () => {
    setSilentFetch(true)
    try {
      const rawMessagesString = await contract.getRecentMessages()
      const rawMessages = JSON.parse(rawMessagesString)
      rawMessages.reverse()
      setMessages(rawMessages.map(r => ({
        id: rawMessages.indexOf(r),
        text: r.content,
        sender: r.name,
        address: r.sender,
        stars: r.stars || [],
        replying: r.replying || "0",
      })))

    } catch (error) {
      console.log(error)
      Report.failure("Error", "Unable to get messages")
    } finally {
      setSilentFetch(false)
    }
  }, [contract])

  useLayoutEffect(() => {
    if (!ethersData || !ethersData?.signer || !ethersData?.provider) {
      location.href = "/"
    } else {
      setFetching(true)
      InitData().finally(() => setFetching(false))
    }
  }, [InitData, ethersData])
  const [silentFetch, setSilentFetch] = useState(false)


  useEffect(() => {
    const interval = setInterval(async () => {
      if (!silentFetch) {
        await InitData();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [InitData, silentFetch]);

  return (
    <div className='w-full'>
      <div className='fixed w-full'>
        <Navbar />
      </div>

      <div className='mx-auto flex h-screen max-w-5xl flex-col font-montserrat'>
        <div className='searched flex-1 overflow-y-auto p-4 pt-[100px]'>
          {fetching ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            messages.map((message) => (
              <Message
                messages={messages}
                key={message.id}
                message={message}
                address={address}
                handleReact={handleReact}
                handleReply={handleReply}
                scrollToMessage={scrollToMessage}
                reactingStates={reactingStates}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className='flex flex-col p-3'>
          {replying && (
            <div className="bg-gray-100 p-2 mb-2 rounded-lg flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Replying to: <b>{messages.find(m => m.id == replying)?.text.substring(0, 50)}...</b>
              </div>
              <button onClick={cancelReply} className="text-red-500 hover:text-red-600">
                Cancel
              </button>
            </div>
          )}
          <div className="flex">
            <input
              type='text'
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className='flex-1 border px-4 py-2 outline-none'
              placeholder='Type a message...'
              disabled={sending}
            />

            <button
              type="submit"
              className={`bg-primary px-4 py-2 text-white ${sending ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={sending}
            >
              {sending ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;