import React, { useContext, useState } from 'react'

import ChatIcon from "../src/assets/massage.png"
import toast from 'react-hot-toast'
import { createRoom as createRoomApi, joinChatApi } from '../service/roomService'
import useChatContext from '../Context/ChatContext'
import { useNavigate } from 'react-router'
function JoinCreateRoom() {

  const [details, setDetails] = useState({
    roomId: "",
    userName: "",
  })
  // to use context

  const { roomId, currentUser, connected, setRoomId, setCurrentUser, setConnected } = useChatContext();
  const navigate = useNavigate();
  // it handle the input comming from user
  function handleInputChangeEvent(event) {
    setDetails({
      // it loads all the details from form
      ...details,
      // it dynamically update the values
      [event.target.name]: event.target.value
    })
  }
  //function to validate form
  function validateForm() {
    if (details.roomId === "" || details.userName === "") {
      toast.error("Invalid details...")
      return false;
    }
    return true;
  }
  // function for joining chat 
  async function joinChat() {

    if (validateForm()) {
      // backend api will be called
      try {
        // join chat api in the service
        const room = await joinChatApi(details.roomId)
        toast.success("Joined..")
        setCurrentUser(details.userName);
        setRoomId(details.roomId)
        setConnected(true)
        navigate("/chat")
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error("Room Not found..");

        }
        else {
          toast.error("Error in joining room...")
          // console.log(error);
        }
      }

    }


  }
  //function for create rooom
  async function createRoom() {
    if (validateForm()) {
      // console.log(details);
      // to call backend api
      try {
        const response = await createRoomApi(details.roomId)
        // console.log(response);
        toast.success("Room Successfully created")
        // Setting current user and room Id
        setCurrentUser(details.userName);
        setRoomId(response.roomId)
        setConnected(true)
        navigate("/chat")
        // join the room
        joinChat();

      } catch (error) {
        // console.log(error)
        if (error.response && error.response.status === 400) {
          toast.error("Room Already Exist..");

        } else {

          toast.error("Error in creating Room..")
        }

      }
    }
  }
  return (
    <div className="min-h-screen text-white  flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-md p-6 sm:p-10 border border-gray-700 rounded-lg sm:rounded-xl flex flex-col gap-6 bg-gray-900 dark:bg-gray-900 shadow-lg">
        {/* Logo */}
        <div className="flex justify-center">
          <img src={ChatIcon} alt="My Chat" className="w-20 sm:w-24" />
        </div>

        {/* Title */}
        <div className='text-center'>
            <h1 className="text-xl sm:text-2xl font-semibold text-center">
          Create and Join Room
        </h1>
        <h2>( This site may take 5 min to start ) </h2>
        </div>
        
        

        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block font-medium mb-2 text-sm sm:text-base">
            Your Name
          </label>
          <input
            onChange={handleInputChangeEvent}
            value={details.userName}
            name="userName"
            placeholder="Enter your name"
            type="text"
            id="name"
            className="w-full dark:bg-gray-800 bg-gray-800 px-3 sm:px-4 py-3 sm:py-4 border dark:border-gray-600 border-gray-600 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
        </div>

        {/* Room ID Input */}
        <div>
          <label htmlFor="room_id" className="block font-medium mb-2 text-sm sm:text-base">
            Room ID
          </label>
          <input
            name="roomId"
            onChange={handleInputChangeEvent}
            value={details.roomId}
            placeholder="Enter Room ID"
            type="text"
            id="room_id"
            className="w-full dark:bg-gray-800 bg-gray-800 px-3 sm:px-4 py-3 sm:py-4 border dark:border-gray-600 border-gray-600 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-5 mt-4">
          <button
            onClick={joinChat}
            className="px-4 py-2 text-sm sm:text-base bg-blue-600 text-white  dark:bg-blue-500 hover:bg-blue-700 hover:dark:bg-blue-700 rounded-xl"
          >
            Join Room
          </button>
          <button
            onClick={createRoom}
            className="px-4 py-2 text-sm sm:text-base  bg-orange-500 hover:bg-orange-800 text-white dark:text-white dark:bg-orange-500 hover:dark:bg-orange-700 rounded-xl"
          >
            Create Room
          </button>
        </div>
      </div>
    </div>

  )
}

export default JoinCreateRoom

// 37.00 continue