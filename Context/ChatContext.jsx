import { createContext, useContext, useState, useEffect } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [roomId, setRoomId] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  // Restore from localStorage on mount
  useEffect(() => {
    setRoomId(localStorage.getItem("roomId") || "");
    setCurrentUser(localStorage.getItem("currentUser") || "");
    setConnected(JSON.parse(localStorage.getItem("connected")) || false);
    setLoading(false);
  }, []);

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

  if (loading) return null; // or show a spinner / splash screen

  return (
    <ChatContext.Provider
      value={{ roomId, currentUser, connected, setRoomId, setCurrentUser, setConnected }}
    >
      {children}
    </ChatContext.Provider>
  );
};

const useChatContext = () => useContext(ChatContext);
export default useChatContext;
