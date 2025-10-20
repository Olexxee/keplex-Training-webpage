import { motion } from "framer-motion";

export default function FeatureTextOverlay({ title, desc, isHovered }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
      <motion.h3
        className="text-2xl font-bold mb-2"
        animate={{ opacity: isHovered ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        {title}
      </motion.h3>

      <motion.p
        className="max-w-xs opacity-0"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {desc}
      </motion.p>
    </div>
  );
}
