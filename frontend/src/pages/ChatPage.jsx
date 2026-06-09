import { useState, useEffect, useRef } from "react";
import API from "../services/api";
import VoiceButton from "../components/VoiceButton";
import useTextToSpeech from "../hooks/useTextToSpeech";
import Orb from "../components/Orb";

function ChatPage() {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const { speak } = useTextToSpeech();

  const messagesEndRef = useRef(null);
  const voiceButtonRef = useRef(null);

  const [orbState, setOrbState] = useState("idle");

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
    setOrbState("thinking");

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
        setOrbState("speaking");

        speak(res.data.reply, () => {

          setIsSpeaking(false);
          setOrbState("idle");

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
      setOrbState("idle");
    }
  };

  const handleTranscript = async (text) => {

    console.log("User said:", text);

    setIsListening(false);
    setOrbState("thinking");

    await sendMessage(text);
  };

  return (

    <div
      className="h-screen text-white flex"
      style={{
        background: `
        radial-gradient(
          circle at top center,
          rgba(59,130,246,0.18),
          transparent 35%
        ),
        linear-gradient(
          180deg,
          #020617,
          #030712,
          #000000
        )
        `,
      }}
    >

      {/* SIDEBAR */}
      <div className="w-72 m-4 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">

        <h1 className="text-3xl font-bold tracking-wide">
          PAIGE
        </h1>

        <p className="text-zinc-400 mt-2">
          Personal AI Guide Engine
        </p>

      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col items-center">

        {/* ORB */}
        <div className="flex flex-col items-center justify-center py-10">

          <Orb state={orbState} />

          <h1 className="text-4xl font-semibold text-white mt-8">
            PAIGE
          </h1>

          <p className="text-zinc-500 mt-3">
            {orbState === "idle" && "Ready"}
            {orbState === "listening" && "Listening"}
            {orbState === "thinking" && "Thinking"}
            {orbState === "speaking" && "Speaking"}
          </p>

        </div>

        {/* MESSAGES */}
        <div className="flex-1 w-full overflow-y-auto">

          <div className="max-w-4xl mx-auto space-y-4 px-8">

            {messages.length === 0 ? (

              <div className="text-center mt-16">
                <p className="text-zinc-500 text-lg">
                  Click the microphone or type a message to begin.
                </p>
              </div>

            ) : (

              messages.map((msg, index) => (

                <div
                  key={index}
                  className={
                    <div
                      key={index}
                      className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-3xl max-w-3xl"
                    >
                      <div className="text-xs uppercase text-zinc-400 mb-2">
                        {msg.role === "user" ? "You" : "Paige"}
                      </div>

                      {msg.content}
                    </div>
                  }
                >
                  {msg.content}
                </div>

              ))

            )}

            <div ref={messagesEndRef} />

          </div>

        </div>

        {/* INPUT */}
        <div className="p-6">

          <div className="
            max-w-3xl
            mx-auto
            flex
            gap-3
            bg-white/5
            backdrop-blur-xl
            border
            border-white/10
            rounded-3xl
            p-3
            ">

            <VoiceButton
              ref={voiceButtonRef}
              onTranscript={handleTranscript}
              onListeningStart={() => {
                setIsListening(true);
                setOrbState("listening");
              }}
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