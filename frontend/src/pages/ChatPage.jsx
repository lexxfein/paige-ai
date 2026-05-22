import { useState, useEffect, useRef } from "react";
import API from "../services/api";
import VoiceButton from "../components/VoiceButton";
import useTextToSpeech from "../hooks/useTextToSpeech";
import PaigeAvatar from "../components/PaigeAvatar";

function ChatPage() {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const { speak } = useTextToSpeech();

  const messagesEndRef = useRef(null);
  const voiceButtonRef = useRef(null);

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);

  const sendMessage = async (customMessage) => {

    const finalMessage = customMessage || message;

    if (!finalMessage.trim()) return;

    // STOP LISTENING STATE
    setIsListening(false);

    // USER MESSAGE
    const userMessage = {
      role: "user",
      content: finalMessage,
    };

    setMessages((prev) => [...prev, userMessage]);

    // CLEAR INPUT
    if (!customMessage) {
      setMessage("");
    }

    // THINKING MESSAGE
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "Thinking...",
        loading: true,
      },
    ]);

    try {

      const res = await API.post("/chat", {
        message: finalMessage,
      });

      // REMOVE THINKING
      setMessages((prev) =>
        prev.filter((msg) => !msg.loading)
      );

      // AI MESSAGE
      const aiMessage = {
        role: "assistant",
        content: res.data.reply,
      };

      setMessages((prev) => [...prev, aiMessage]);

      // SPEAK RESPONSE
      if (res.data.reply) {

        setIsSpeaking(true);

        speak(res.data.reply, () => {

          setIsSpeaking(false);

          // RESTART MIC
          setTimeout(() => {

            setIsListening(true);

            voiceButtonRef.current?.startListening();

          }, 500);

        });

      }

    } catch (err) {

      console.log(err);

      setMessages((prev) =>
        prev.filter((msg) => !msg.loading)
      );

      setIsSpeaking(false);
      setIsListening(false);
    }
  };

  const handleTranscript = async (text) => {

    console.log("User said:", text);

    setIsListening(false);

    await sendMessage(text);
  };

  return (

    <div className="h-screen bg-[#0f0f0f] text-white flex">

      {/* SIDEBAR */}
      <div className="w-72 border-r border-zinc-800 p-4">

        <h1 className="text-2xl font-bold">
          PAIGE AI
        </h1>

      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* AVATAR */}
        <div className="pt-8">

          <PaigeAvatar
            listening={isListening}
            speaking={isSpeaking}
          />

        </div>

        {/* MESSAGES */}
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

            <div ref={messagesEndRef} />

          </div>

        </div>

        {/* INPUT */}
        <div className="border-t border-zinc-800 p-4">

          <div className="max-w-3xl mx-auto flex gap-3">

            <VoiceButton
              ref={voiceButtonRef}
              onTranscript={handleTranscript}
            />

            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              type="text"
              placeholder="Message Paige AI..."
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
            />

            <button
              onClick={() => sendMessage()}
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