import { useState, useRef } from "react";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

export default function useSpeechToText(onResult) {

  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef(null);

  const startListening = () => {

    // STOP SPEAKING BEFORE MIC STARTS
    window.speechSynthesis.cancel();

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    // CLEAN OLD INSTANCE
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      console.log("🎤 Listening...");
      setIsListening(true);
    };

    recognition.onend = () => {
      console.log("🛑 Stopped listening");
      setIsListening(false);
    };

    recognition.onerror = (event) => {

      console.log("Speech error:", event.error);

      setIsListening(false);

      // AUTO RECOVER
      if (event.error !== "aborted") {

        setTimeout(() => {
          startListening();
        }, 1000);

      }
    };

    recognition.onresult = (event) => {

      const transcript =
        event.results[0][0].transcript;

      console.log("USER:", transcript);

      setIsListening(false);

      onResult(transcript);
    };

    recognitionRef.current = recognition;

    recognition.start();
  };

  const stopListening = () => {

    recognitionRef.current?.stop();

    setIsListening(false);
  };

  return {
    startListening,
    stopListening,
    isListening,
  };
}