import React, { useEffect, useRef, useState } from 'react'

import SockJS from 'sockjs-client';
import { baseURL } from '../config/Axios';
import { Stomp } from '@stomp/stompjs';
import toast from 'react-hot-toast';
import useChatContext from '../Context/ChatContext';
import { useNavigate } from 'react-router';
import { getMessages } from '../service/roomService';



const ChatPage = () => {
  const {
    roomId,
    currentUser,
    connected,
    setConnected,
    setRoomId,
    setCurrentUser,
  } = useChatContext();
  // console.log(roomId);
  // console.log(currentUser);
  // console.log(connected);

  const navigate = useNavigate();
  useEffect(() => {
    if (!connected) {
      navigate("/");
    }
  }, [connected, roomId, currentUser]);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const chatBoxRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);



  //load messages
  useEffect(() => {
    async function loadMessages() {
      try {
        const messages = await getMessages(roomId);
        // console.log(messages);
        setMessages(messages);
      } catch (error) { }
    }
    if (connected) {
      loadMessages();
    }
  }, []);


  //scroll down
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scroll({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  //stomp client in it
  //subscibe
  useEffect(() => {
    const connectWebSocket = () => {
      ///SockJS
      const sock = new SockJS(`${baseURL}/chat`);
      const client = Stomp.over(sock);
      client.debug = () => { };

      client.connect({}, () => {
        setStompClient(client);

        toast.success("connected");

        client.subscribe(`/topic/room/${roomId}`, (message) => {
          // console.log(message);

          const newMessage = JSON.parse(message.body);

          setMessages((prev) => [...prev, newMessage]);

          //rest of the work after success receiving the message
        });
      });
    };

    if (connected) {
      connectWebSocket();
    }

    //stomp client
  }, [roomId]);


  //send message handle
  const sendMessage = async () => {
    console.log("hello");
    
    if (stompClient && connected && input.trim()) {
      // console.log(input);

      const message = {
        sender: currentUser,
        content: input,
        roomId: roomId,
      };

      stompClient.send(
        `/app/sendMessage/${roomId}`,
        {},
        JSON.stringify(message)
      );
      setInput("");
    }
    //
  };

  // logout
  function handleLogout() {
    // stompClient.disconnect();
    setConnected(false);
    setRoomId("");
    setCurrentUser("");
    navigate("/");
  }


  return (
    <div className="">
      {/* this is a header */}
      <header className="dark:border-gray-700 border-gray-700  fixed w-full dark:bg-gray-900 bg-grey-900 py-5 shadow flex justify-around items-center">
        {/* room name container */}
        <div>
          <h1 className="text-xl font-semibold text-white ">
            Room : <span>{roomId}</span>
          </h1>
        </div>
        {/* username container */}

        <div>
          <h1 className="text-xl font-semibold text-white ">
            User : <span>{currentUser}</span>
          </h1>
        </div>
        {/* button: leave room */}
        <div>
          <button
            onClick={handleLogout}
            className="dark:bg-red-500 bg-red-500 hover:bg-red-700 dark:hover:bg-red-700 px-3 py-2 rounded-full text-white "
          >
            Leave Room
          </button>
        </div>
      </header>

      <main
        ref={chatBoxRef}
        className="pt-24 pb-20 px-4 sm:px-6 md:px-10 w-full md:w-2/3 dark:bg-slate-600 bg-slate-700 mx-auto h-screen overflow-auto"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === currentUser ? "justify-end" : "justify-start"
              }`}
          >
            <div
              className={`my-2 ${message.sender === currentUser ? "bg-green-600 dark:bg-green-700 text-black dark:text-black" : "bg-gray-800  text-white "
                } p-2 max-w-[80%] sm:max-w-xs rounded break-words `}
            >
              <div className="flex items-start gap-2 ">
                <img
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-full"
                  src="https://avatar.iran.liara.run/public/43"
                  alt=""
                />
                <div className="flex flex-col gap-1">
                  <p className="text-xs sm:text-sm font-bold">{message.sender}</p>
                  <p className="text-sm sm:text-base">{message.content}</p>
                  <p className="text-[10px] sm:text-xs text-gray-400">
                   
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* input bar */}
      <div className="fixed bottom-4 w-full px-3 sm:px-6 text-white dark:text-black">
        <div className="h-14 flex items-center text-white  gap-3 rounded-full max-w-2xl mx-auto dark:bg-gray-900 bg-gray-900  px-3 sm:px-5">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            type="text"
            placeholder="Type your message..."
            className="flex-1 dark:border-gray-600 border-amber-900 bg-gray-900 dark:bg-gray-800 px-3 py-2 rounded-full focus:outline-none text-sm sm:text-base"
          />
          <button
            onClick={sendMessage}
            className="dark:bg-green-600 text-black dark:text-white bg-green-500 hover:bg-green-500 hover:dark:bg-green-700 h-10 px-4 flex justify-center items-center rounded-3xl text-sm sm:text-base"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};


export default ChatPage
