import { forwardRef, useImperativeHandle } from "react";
import useSpeechToText from "../hooks/useSpeechToText";

const VoiceButton = forwardRef(({ onTranscript }, ref) => {

  const {
    startListening,
    stopListening,
    isListening,
  } = useSpeechToText(onTranscript);

  useImperativeHandle(ref, () => ({
    startListening,
    stopListening,
  }));

  return (
    <button
      onClick={startListening}
      className={`px-4 py-2 rounded-xl transition-all duration-300 ${
        isListening
          ? "bg-red-500 animate-pulse"
          : "bg-blue-500"
      } text-white`}
    >
      {isListening ? "🎙 Listening..." : "🎤 Talk"}
    </button>
  );
});

export default VoiceButton;