import { motion } from "framer-motion";

export default function PaigeAvatar({ listening, speaking }) {

  let color = "#3b82f6";
  let scale = 1;
  let glow = "0 0 40px rgba(59,130,246,0.5)";

  // LISTENING
  if (listening) {
    color = "#ef4444";
    scale = 1.2;
    glow = "0 0 60px rgba(239,68,68,0.8)";
  }

  // SPEAKING
  if (speaking) {
    color = "#22c55e";
    scale = 1.15;
    glow = "0 0 60px rgba(34,197,94,0.8)";
  }

  return (
    <div className="flex justify-center items-center">

      <motion.div
        animate={{
          scale: [1, scale, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
        className="relative w-44 h-44 rounded-full"
        style={{
          background: `radial-gradient(circle at 30% 30%, white, ${color})`,
          boxShadow: glow,
        }}
      >

        {/* INNER CORE */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="absolute inset-6 rounded-full bg-black/20 backdrop-blur-xl"
        />

      </motion.div>

    </div>
  );
}