import { createContext, useContext, useState, useEffect } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [roomId, setRoomId] = useState(() => localStorage.getItem("roomId") || "");
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem("currentUser") || "");
  const [connected, setConnected] = useState(() => JSON.parse(localStorage.getItem("connected")) || false);

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("roomId", roomId);
  }, [roomId]);

  useEffect(() => {
    localStorage.setItem("currentUser", currentUser);
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("connected", JSON.stringify(connected));
  }, [connected]);

  return (
    <ChatContext.Provider value={{ roomId, currentUser, connected, setRoomId, setCurrentUser, setConnected }}>
      {children}
    </ChatContext.Provider>
  );
};

const useChatContext = () => useContext(ChatContext);
export default useChatContext;
