// constant.ts

// ✅ API URL — has /api prefix for Nginx routing
export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:7777";

// ✅ Socket URL — NO /api prefix, connects to root
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL
    || (location.hostname === "localhost"
        ? "http://localhost:7777"
        : `${location.protocol}//${location.host}`);