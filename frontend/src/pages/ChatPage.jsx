import { useState } from "react";
import API from "../services/api";

function ChatPage() {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {

    if (!message.trim()) return;

    const userMessage = {
      role: "user",
      content: message,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {

      const res = await API.post("/chat", {
        message,
      });

      const aiMessage = {
        role: "assistant",
        content: res.data.reply,
      };

      setMessages((prev) => [...prev, aiMessage]);

    } catch (err) {
      console.log(err);
    }

    setMessage("");
  };

  return (
    <div className="h-screen bg-[#0f0f0f] text-white flex">

      {/* Sidebar */}
      <div className="w-72 border-r border-zinc-800 p-4">
        <h1 className="text-2xl font-bold">
          PAIGE AI
        </h1>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto space-y-4">

            {messages.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.role === "user"
                    ? "bg-white text-black p-4 rounded-2xl ml-auto w-fit max-w-xl"
                    : "bg-zinc-900 p-4 rounded-2xl w-fit max-w-xl"
                }
              >
                {msg.content}
              </div>
            ))}

          </div>
        </div>

        {/* Input */}
        <div className="border-t border-zinc-800 p-4">
          <div className="max-w-3xl mx-auto flex gap-3">

            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              placeholder="Message Paige AI..."
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
            />

            <button
              onClick={sendMessage}
              className="bg-white text-black px-6 rounded-xl font-medium"
            >
              Send
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}

export default ChatPage;