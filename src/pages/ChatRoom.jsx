import { useCallback, useContext, useEffect, useLayoutEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import { Contract } from "ethers";
import { messagingABI, messagingContractAddress } from "../constants";
import { AppContext } from "../AppContext";
import { Report } from "notiflix";

const ChatRoom = () => {
  const [newMessage, setNewMessage] = useState("");
  /**
 * @typedef {Object} EthersData
 * @property {import('ethers').BrowserProvider} provider - The Ethereum provider
 * @property {import('ethers').Signer} signer - The Ethereum signer
 */

  /**
   * @type {{ethersData:EthersData,setEthersData:(EthersData:EthersData)=>void,address:String}}
   */
  const { ethersData, address } = useContext(AppContext)
  const contract = new Contract(messagingContractAddress, messagingABI, ethersData?.signer)
  const [fetching, setFetching] = useState(false)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;
    try {
      setSending(true);
      const rawMessages = await contract.sendMessage(newMessage, localStorage.getItem("username") || "Anonymous")
      await rawMessages.wait()
      setMessages([
        ...messages,
        { id: messages.length + 1, text: newMessage, sender: localStorage.getItem("username") || "Anonymous", address: await ethersData.signer.getAddress() },
      ]);
      setNewMessage("");
    } catch (error) {
      console.log(error)
      Report.failure("Unable to send message")
    } finally {
      setSending(false);
    }
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
        address: r.sender
      })))

    } catch (error) {
      console.log(error)
      Report.failure("Error", "Unable to get messages")
    } finally {
      setSilentFetch(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
              <div
                key={message.id}
                className={`mb-4 ${message.address === address ? "text-right" : "text-left"
                  }`}
              >
                {message.address !== address && (
                  <div className="text-sm text-gray-500 mb-1">{message.sender}</div>
                )}
                <div
                  className={`inline-block rounded-lg p-2 ${message.address === address
                    ? "bg-primary text-white"
                    : "bg-white text-black"
                    }`}
                >
                  {message.text}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className='flex p-3'>
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
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;