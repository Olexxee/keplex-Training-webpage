import { motion } from "framer-motion";
import KeplexImage from "../utils/KeplexImage";
import { useEffect, useState } from "react";
import { HeroModels } from "../constants/HeroModels";

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const model = HeroModels[current];

  // Auto-rotate every 8s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HeroModels.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Glow animation injected once
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
    @keyframes glowPulse {
      0% { 
        text-shadow: 0 0 3px rgba(255, 182, 193, 0.6), 0 0 5px rgba(255, 215, 0, 0.3); 
      }
      50% { 
        text-shadow: 0 0 6px rgba(255, 182, 193, 0.8), 0 0 8px rgba(255, 215, 0, 0.5); 
      }
      100% { 
        text-shadow: 0 0 3px rgba(255, 182, 193, 0.6), 0 0 5px rgba(255, 215, 0, 0.3); 
      }
    }
    .glow-text { 
      animation: glowPulse 4s ease-in-out infinite; 
    }
  `;

    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  return (
    <section
      className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden"
      aria-label="Keplex Training hero"
    >
      {/* Background image */}
      <motion.div
        key={model.id}
        className="absolute inset-0"
        initial={{ scale: 1, opacity: 0 }}
        animate={{ scale: 1.05, opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <KeplexImage
          name={model.image}
          alt={model.heading}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-black/20"></div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 px-6 md:px-12 flex flex-col items-center text-center max-w-3xl">
        <motion.h1
          key={model.heading}
          className="glow-text text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight mb-4 
                      bg-gradient-to-r from-[var(--brand)] via-[var(--aqua)] to-[var(--lavender)]
                      bg-clip-text text-transparent"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {model.heading}
        </motion.h1>

        <motion.p
          key={model.paragraph}
          className="text-md sm:text-lg md:text-xl text-gray-200 mb-8"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
        >
          {model.paragraph}
        </motion.p>

        {/* Dynamic buttons */}
        <motion.div
          className="flex items-center justify-center gap-4 flex-wrap"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.2 } },
          }}
        >
          {model.actions.map((action, i) => (
            <motion.a
              key={i}
              href={action.href}
              className={
                action.primary
                  ? "inline-block bg-[var(--brand)] hover:bg-[var(--brand-dark)] text-white px-6 py-3 rounded-md font-semibold shadow-md transition"
                  : "inline-block bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-md font-medium shadow-md transition"
              }
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 },
              }}
            >
              {action.label}
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
