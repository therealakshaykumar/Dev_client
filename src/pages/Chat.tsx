import { useParams } from "react-router-dom"

const Chat = () => {
    const param = useParams()
    console.log(param)
  return (
    <div>Chat</div>
  )
}
export default Chat