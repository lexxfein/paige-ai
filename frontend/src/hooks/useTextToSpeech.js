export default function useTextToSpeech() {

  const speak = (text, onEnd) => {

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      console.log("AI speaking...");
    };

    utterance.onend = () => {
      console.log("AI finished speaking");

      if (onEnd) {
        onEnd();
      }
    };

    speechSynthesis.speak(utterance);
  };

  return { speak };
}