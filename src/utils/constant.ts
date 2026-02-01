// export const BASE_URL = 'http://localhost:7777'
// export const BASE_URL = 'https://dev-server-bice.vercel.app'
// export  const BASE_URL = "/api";
export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:7777';