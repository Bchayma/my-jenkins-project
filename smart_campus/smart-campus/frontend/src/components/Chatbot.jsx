// src/components/Chatbot.jsx
'use client'
import { useState } from "react"
import axios from "axios"

const Chatbot = () => {
  const [message, setMessage] = useState("")
  const [conversation, setConversation] = useState([])

  const sendMessage = async () => {
    const userMsg = { sender: "user", text: message }
    setConversation((prev) => [...prev, userMsg])
    setMessage("")

    try {
      const res = await axios.post("http://localhost:8000/api/chatbot/", { message })
      const botMsg = { sender: "bot", text: res.data.reply }
      setConversation((prev) => [...prev, botMsg])
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="h-80 overflow-y-auto border p-2 rounded mb-2 bg-white">
        {conversation.map((msg, i) => (
          <div key={i} className={`text-${msg.sender === 'user' ? 'right' : 'left'}`}>
            <p><strong>{msg.sender}:</strong> {msg.text}</p>
          </div>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border p-2 w-full"
        placeholder="Pose ta question..."
      />
      <button onClick={sendMessage} className="bg-blue-500 text-white p-2 mt-2 w-full">Envoyer</button>
    </div>
  )
}

export default Chatbot
