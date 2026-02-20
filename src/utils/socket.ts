import { io, Socket } from "socket.io-client";
import { BASE_URL } from "./constant";

export const connectSocket = (): Socket => {
  let socket;
  if(location.hostname === 'localhost'){
   socket = io(BASE_URL);
  }else{
    socket = io(BASE_URL, {
      path: '/api/socket.io',
      transports: ['websocket','polling'],
      secure: true
    });
  }
  return socket;
};