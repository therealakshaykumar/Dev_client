import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:7777';
console.log("API Base URL:", BASE_URL);

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});