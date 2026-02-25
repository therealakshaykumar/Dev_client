import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { connectSocket } from "../utils/socket";
import { useStore } from "zustand";
import { userStore } from "../store/userStore";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "../utils/axios";

interface IMessage {
  id: string;
  message: string;
  timestamp: number;
}

const Chat = () => {
  const { toUserId } = useParams();
  const { user } = useStore(userStore);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName,setUserName] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!user?._id || !toUserId) return;

    const getMessages = async () => {
      try {
        setLoading(true);
        const USER = await apiClient.get(`/user/profile/${toUserId}`)
        if(USER) setUserName(USER.data.firstName)
        const messageData = await apiClient.get(`/chat/all/${toUserId}`);

        // ✅ FIX: senderId is an OBJECT { _id, firstName, lastName }
        // Extract senderId._id to get the actual string ID
        const fetchedMessages = messageData.data.messages.map((msg: any) => ({
          id: typeof msg.senderId === "object" 
            ? msg.senderId._id    // ← API returns { _id, firstName, lastName }
            : msg.senderId,       // ← fallback if it's already a string
          message: msg.text,      // ← your API uses "text", not "message"
          timestamp: new Date(msg.createdAt).getTime(),
        }));

        setMessages(fetchedMessages);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setLoading(false);
      }
    };

    getMessages();

    return () => {
      setMessages([]);
    };
  }, [user?._id, toUserId]);

  useEffect(() => {
    if (!user?._id || !toUserId) return;

    const socket = connectSocket();

    const handleJoin = () => {
      socket.emit("joinChat", { toId: toUserId, user: user._id });
    };

    if (socket.connected) {
      handleJoin();
    } else {
      socket.on("connect", handleJoin);
    }

    const handleNewMessage = (data: { id: string; message: string }) => {
      setMessages((prev) => {
        const isDuplicate = prev.some(
          (msg) =>
            msg.message === data.message &&
            msg.id === data.id &&
            Date.now() - msg.timestamp < 1000
        );
        if (isDuplicate) return prev;
        return [...prev, { ...data, timestamp: Date.now() }];
      });
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("connect", handleJoin);
      socket.off("newMessage", handleNewMessage);
    };
  }, [user?._id, toUserId]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const socket = connectSocket();
    socket.emit("sendMessage", {
      toId: toUserId,
      user: user?._id,
      message: input,
    });
    setInput("");
  };

  return (
    <div className="flex flex-col mt-20 h-[calc(100vh-100px)] bg-orange-100 max-w-2xl mx-auto border-x border-gray-200 overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-pink text-white p-4 flex items-center shadow-md z-10"
      >
        {/* <div className="w-10 h-10 bg-gray-300 rounded-full mr-3 border border-white/20" /> */}
        <img src={user?.imageUrl ?? 'men.svg'} alt="" className="w-10 h-10 rounded-full mr-3 border border-white/20" />
        <div>
          <h2 className="font-bold text-sm">{userName}</h2>
          <span className="text-[10px] opacity-80">online</span>
        </div>
      </motion.div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {loading && (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-400 text-sm">Loading messages...</p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, index) => (
            <motion.div
              key={`${msg.timestamp}-${index}`}
              layout
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
                mass: 1,
              }}
              className={`flex ${
                msg.id === user?._id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm relative ${
                  msg.id === user?._id
                    ? "bg-[#dcf8c6] text-gray-800 rounded-tr-none"
                    : "bg-white text-gray-800 rounded-tl-none"
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.message}</p>
                <span className="text-[9px] text-gray-400 block text-right mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-[#f0f0f0] p-3 flex items-center gap-2 border-t border-gray-200"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message"
          className="flex-1 p-2 px-5 rounded-full border-none bg-white focus:outline-none shadow-sm text-sm"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={sendMessage}
          className="bg-[#00a884] text-white p-2 rounded-full w-10 h-10 flex items-center justify-center shadow-md"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z" />
          </svg>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Chat;