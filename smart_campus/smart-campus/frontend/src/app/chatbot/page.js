'use client';
import { useState, useRef, useEffect } from 'react';
import Navbar from '../../components/Navrbar';

export default function ChatbotPage() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const handleSend = async () => {
    if (!prompt.trim()) return;

    const userMessage = { role: 'user', text: prompt };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await fetch(`http://localhost:8000/get-location-info?query=${prompt}`);
      const data = await res.json();
      const botMessage = { role: 'bot', text: data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: 'Une erreur est survenue !' },
      ]);
    }

    setPrompt('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-white">
      <Navbar />

      {/* Titre */}
      <div className="text-center my-6 px-4">
        <h2 className="text-3xl font-bold text-blue-800">🎓 Smart Campus Assistant</h2>
        <p className="text-gray-600">Pose ta question pour t’orienter sur le campus.</p>
      </div>

      {/* Chat container */}
      <div className="flex flex-col flex-1 max-w-3xl w-full mx-auto px-4">
        {/* Zone de messages scrollable */}
        <div className="flex-1 overflow-y-auto bg-white rounded-2xl shadow p-6 space-y-4 h-[500px]">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[75%] px-4 py-2 rounded-lg text-sm shadow ${
                msg.role === 'user'
                  ? 'bg-blue-100 self-end text-right ml-auto'
                  : 'bg-gray-200 self-start text-left mr-auto'
              }`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Zone de saisie fixée en bas */}
        <div className="sticky bottom-0 bg-white pt-4 pb-6">
          <div className="flex items-center gap-3 border-t pt-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Écris ta question ici..."
              className="flex-1 p-3 border rounded-full  shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 text-white text-sm px-5 py-2 rounded-full hover:bg-blue-700 transition"
            >
              Envoyer
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm py-6">
        &copy; 2025 Smart Campus. Tous droits réservés.
      </footer>
    </div>
  );
}
