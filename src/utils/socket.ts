import io from 'socket.io-client'
import { BASE_URL } from './constant'

export const connectSocket = async ()=>{
    return io(BASE_URL)
}