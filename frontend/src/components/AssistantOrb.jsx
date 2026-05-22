export default function AssistantOrb({
  isListening,
  isSpeaking,
}) {

  return (

    <div className="flex justify-center items-center">

      <div
        className={`
          w-44
          h-44
          rounded-full
          transition-all
          duration-300
          animate-pulse

          ${
            isListening
              ? "bg-blue-500 scale-110 shadow-[0_0_80px_#3b82f6]"
              : isSpeaking
              ? "bg-purple-500 scale-105 shadow-[0_0_80px_#a855f7]"
              : "bg-zinc-700 shadow-[0_0_40px_#27272a]"
          }
        `}
      />

    </div>
  );
}