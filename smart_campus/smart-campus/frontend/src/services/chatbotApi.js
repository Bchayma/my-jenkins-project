import axios from "axios"

export const sendMessageToBot = async (message) => {
  const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chatbot/`, { message })
  return res.data
}
