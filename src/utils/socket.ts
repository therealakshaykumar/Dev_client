import { io, Socket } from "socket.io-client";
import { BASE_URL } from "./constant";

export const connectSocket = (): Socket => {
    const socket = io(BASE_URL, {
      withCredentials: true,
      autoConnect: true
    });
  return socket;
};