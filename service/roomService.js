import { httpClient } from "../config/Axios";

export const createRoom=async(roomDetails)=>{
    const response=await httpClient.post(`/api/v1/rooms`,roomDetails,{
        headers:{
            "Content-Type":"text/plain"
        }
    });
    return response.data;
}

export const joinChatApi= async(roomId)=>{
    const response=await httpClient.get(`/api/v1/rooms/${roomId}`)
    return response.data;
}

export const getMessages=async(roomId,size=50,page=0)=>{
    const response=await httpClient.get(`/api/v1/rooms/${roomId}/messages?size=${size}&page=${page}`);
    return response.data;
}