import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (): Socket => {
    if (socket && socket.connected) {
        return socket;
    }

    if (socket) {
        socket.disconnect();
        socket = null;
    }

    // ✅ FIX: Socket connects to ROOT domain, NOT /api
    // API calls go to: https://gitogether.duckdns.org/api/...
    // Socket goes to:  https://gitogether.duckdns.org/socket.io/...
    const SOCKET_URL = location.hostname === "localhost"
        ? "http://localhost:7777"
        : `${location.protocol}//${location.host}`;
    //    ↑ This gives: https://gitogether.duckdns.org


    socket = io(SOCKET_URL, {
        // ✅ FIX: Default path — NOT /api/socket.io
        path: "/socket.io/",

        transports: ["websocket", "polling"],
        withCredentials: true,
        forceNew: true,

        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 20000,
    });

    socket.on("connect", () => {
        console.log("✅ Connected:", socket?.id);
    });

    socket.on("connect_error", (err) => {
        console.error("❌ Error:", err.message);
        if (err.message === "Session ID unknown") {
            socket?.disconnect();
            socket = null;
            setTimeout(() => connectSocket(), 1000);
        }
    });

    socket.on("disconnect", (reason) => {
        console.log("⚠️ Disconnected:", reason);
        if (reason === "io server disconnect") {
            socket = null;
        }
    });

    return socket;
};

export const disconnectSocket = (): void => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};