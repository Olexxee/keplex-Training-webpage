import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RatingStars from "./RatingStars";

export default function TestimonialsCarousel({ testimonials }) {
  const [index, setIndex] = useState(0);

  // Auto-slide
  useEffect(() => {
    if (testimonials.length > 1) {
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % testimonials.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [testimonials]);

  if (!testimonials || testimonials.length === 0) {
    return <p className="text-center text-gray-500">No reviews yet.</p>;
  }

  const current = testimonials[index];

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden flex items-center justify-center">
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute inset-0"
        style={{ zIndex: -1 }}
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 30, ease: "linear", repeat: Infinity }}
      >
        <div className="w-full h-full bg-gradient-to-br from-[color:var(--brand-light)] via-[color:var(--aqua)] to-[color:var(--lavender)] opacity-40" />
      </motion.div>

      {/* Testimonial Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl mx-auto bg-white/60 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg flex flex-col items-center text-center"
        >
          {current.imageUrl && (
            <img
              src={current.imageUrl}
              alt={current.name}
              className="w-16 h-16 rounded-full object-cover mb-3 border-2 border-[color:var(--brand)]"
            />
          )}
          <h4 className="text-lg font-semibold text-[color:var(--brand-dark)]">
            {current.name}
          </h4>
          <div className="flex justify-center my-2">
            <RatingStars rating={current.rating} />
          </div>
          <p className="text-sm text-gray-700">{current.comment}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
