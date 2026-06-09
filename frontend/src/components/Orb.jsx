import { motion } from "framer-motion";

export default function Orb({ state = "idle" }) {
  const colors = {
    idle: "#3b82f6",
    listening: "#06b6d4",
    thinking: "#a855f7",
    speaking: "#22c55e",
  };

  const color = colors[state];

  return (
    <div className="relative flex items-center justify-center">
      {/* Ambient Glow */}
      <motion.div
        animate={{
          scale:
            state === "listening"
              ? [1, 1.15, 1]
              : state === "speaking"
              ? [1, 1.1, 1]
              : [1, 1.05, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute w-72 h-72 rounded-full blur-[80px] opacity-20"
        style={{
          background: color,
        }}
      />

      {/* Liquid Glass Orb */}
      <motion.div
        animate={{
          scale:
            state === "listening"
              ? [1, 1.08, 1]
              : state === "speaking"
              ? [1, 1.12, 1]
              : [1, 1.03, 1],

          rotate: [0, 3, -3, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative w-64 h-64 rounded-full overflow-hidden"
        style={{
          background: `
            radial-gradient(
              circle at 30% 30%,
              rgba(255,255,255,0.95),
              ${color} 45%,
              rgba(255,255,255,0.15) 100%
            )
          `,
          boxShadow: `
            0 0 40px ${color}40
          `,
        }}
      >
        {/* Moving Shine */}
        <motion.div
          animate={{
            x: [-80, 80, -80],
            y: [-40, 40, -40],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-40 h-40 rounded-full bg-white/20 blur-3xl"
        />

        {/* Top Highlight */}
        <div className="absolute top-8 left-10 w-16 h-16 rounded-full bg-white/40 blur-xl" />

        {/* Glass Overlay */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "linear-gradient(to bottom right, rgba(255,255,255,.35), transparent 60%)",
          }}
        />
      </motion.div>
    </div>
  );
}