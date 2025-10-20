import { motion } from "framer-motion";
import KeplexImage from "../utils/KeplexImage";


export default function FeatureCard({ feature, isHovered, setHovered }) {
  return (
    <motion.div
      className="relative w-full h-80 md:h-96 rounded-xl overflow-hidden shadow-lg cursor-pointer flex items-center justify-center"
      onHoverStart={() => setHovered(feature.title)}
      onHoverEnd={() => setHovered(null)}
    >
      {/* Background image */}
      <KeplexImage
        name={feature.image}
        alt={feature.title}
        className={`w-full h-full object-cover transition-transform duration-500 ${
          isHovered ? "scale-110" : ""
        }`}
      />

      {/* Overlay */}
      <motion.div
        className="absolute inset-0 bg-black/30"
        animate={{ opacity: isHovered ? 0.2 : 0.4 }}
        transition={{ duration: 0.3 }}
      />

      {/* Text / Description */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
        <motion.h3
          className="text-2xl md:text-3xl font-bold mb-2"
          animate={{ opacity: isHovered ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          {feature.title}
        </motion.h3>

        <motion.p
          className="max-w-sm opacity-0 text-sm md:text-base"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {feature.desc}
        </motion.p>
      </div>
    </motion.div>
  );
}