import { forwardRef, useImperativeHandle } from "react";
import useSpeechToText from "../hooks/useSpeechToText";

const VoiceButton = forwardRef(
  ({ onTranscript, onListeningStart }, ref) => {

    const {
      startListening,
      stopListening,
      isListening,
    } = useSpeechToText(onTranscript);

    const handleStartListening = () => {

      onListeningStart?.();

      startListening();
    };

    useImperativeHandle(ref, () => ({
      startListening: handleStartListening,
      stopListening,
    }));

    return (
      <button
        onClick={handleStartListening}
        className={`px-4 py-2 rounded-xl transition-all duration-300 ${
          isListening
            ? "bg-red-500 animate-pulse"
            : "bg-blue-500"
        } text-white`}
      >
        {isListening ? "🎙 Listening..." : "🎤 Talk"}
      </button>
    );
  }
);

export default VoiceButton;