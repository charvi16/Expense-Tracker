import "./Chatbot.css";
import { useState } from "react";

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! Ask me anything about your finances 🧠" },
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = { from: "user", text: input.trim() };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    // TODO: POST /api/chatbot/message
    // TODO: Append bot response to messages
    setMessages((prev) => [
      ...prev,
      newMsg,
      { from: "bot", text: "This is a placeholder response from backend." },
    ]);
  };

  return (
    <div className="page chatbot-page">
      <h2>Chatbot</h2>
      <p className="chatbot-subtitle">
        Chat with your finance assistant about budgets, goals, and plans.
      </p>

      <div className="chat-window">
        <div className="chat-messages">
          {messages.map((m, index) => (
            <div
              key={index}
              className={`chat-bubble ${
                m.from === "user" ? "user" : "bot"
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>

        <form className="chat-input-row" onSubmit={handleSend}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}
