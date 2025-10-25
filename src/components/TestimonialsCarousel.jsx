import { motion } from "framer-motion";
import RatingStars from "./RatingStars";

export default function TestimonialsCarousel({ testimonials }) {
  if (!testimonials || testimonials.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-6">
        No reviews yet. Be the first to share your experience!
      </p>
    );
  }

  // Duplicate testimonials for seamless looping
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <div className="relative overflow-hidden py-10">
      {/* subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-white/30 pointer-events-none" />

      <motion.div
        className="flex space-x-6"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 25,
            ease: "linear",
          },
        }}
      >
        {duplicatedTestimonials.map((t, index) => (
          <div
            key={t.id || index}
            className="relative min-w-[280px] max-w-[320px] flex-shrink-0 rounded-2xl shadow-lg border border-white/20 overflow-hidden"
          >
            {/* Background: image if available, else blurred glass */}
            {t.imageUrl ? (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${t.imageUrl})`,
                  filter: "blur(8px) brightness(0.6)",
                }}
              />
            ) : (
              <div className="absolute inset-0 backdrop-blur-md bg-white/10" />
            )}

            {/* Gradient overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />

            {/* Foreground content */}
            <div className="relative z-10 p-6 text-white text-center">
              {t.imageUrl && (
                <img
                  src={t.imageUrl}
                  alt={t.name}
                  className="w-16 h-16 rounded-full object-cover mx-auto mb-3 border-2 border-white/40"
                />
              )}
              <h4 className="text-lg font-semibold mb-1">{t.name}</h4>
              <div className="flex justify-center mb-2">
                <RatingStars rating={t.rating} />
              </div>
              <p className="text-sm opacity-90 italic">“{t.comment}”</p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
