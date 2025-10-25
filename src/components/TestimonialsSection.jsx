import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db, storage } from "../firebase/config";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import TestimonialsCarousel from "./TestimonialsCarousel";
import RatingStars from "./RatingStars";

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newReview, setNewReview] = useState({
    name: "",
    comment: "",
    rating: 0,
    file: null,
  });

  // 🔹 Live Fetch Testimonials (Realtime sync)
  useEffect(() => {
    const q = query(collection(db, "testimonials"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTestimonials(list);
    });
    return () => unsub();
  }, []);

  // 🔹 Average Rating
  const averageRating =
    testimonials.length > 0
      ? (
          testimonials.reduce((acc, t) => acc + (t.rating || 0), 0) /
          testimonials.length
        ).toFixed(1)
      : 0;

  // 🔹 Rating Breakdown
  const ratingCounts = [5, 4, 3, 2, 1].map(
    (star) => testimonials.filter((t) => t.rating === star).length
  );

  // 🔹 Add Review
  const handleAddReview = async (e) => {
    e.preventDefault();

    if (!newReview.name || !newReview.comment || newReview.rating === 0) {
      alert("Please complete all fields and select a rating.");
      return;
    }

    try {
      setIsSubmitting(true);
      let imageUrl = "";

      // ✅ Upload image if provided
      if (newReview.file) {
        if (!newReview.file.type.startsWith("image/")) {
          alert("Only image files are allowed.");
          setIsSubmitting(false);
          return;
        }

        if (newReview.file.size > 2 * 1024 * 1024) {
          alert("Image too large (max 2MB).");
          setIsSubmitting(false);
          return;
        }

        const fileRef = ref(
          storage,
          `testimonials/${Date.now()}_${newReview.file.name}`
        );

        await uploadBytes(fileRef, newReview.file);
        imageUrl = await getDownloadURL(fileRef);
      }

      // ✅ Add to Firestore
      const newDoc = {
        name: newReview.name.trim(),
        comment: newReview.comment.trim(),
        rating: newReview.rating,
        imageUrl,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "testimonials"), newDoc);

      // ✅ Optimistic UI update
      setTestimonials((prev) => [
        { id: docRef.id, ...newDoc, createdAt: new Date() },
        ...prev,
      ]);

      alert("✅ Review submitted successfully!");
      setNewReview({ name: "", comment: "", rating: 0, file: null });
    } catch (error) {
      console.error("❌ Error adding review:", error);
      alert("Something went wrong. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative w-full py-20 overflow-hidden">
      {/* 🔮 Animated Gradient Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[color:var(--brand-light)] via-[color:var(--aqua)] to-[color:var(--lavender)]"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 30,
          ease: "linear",
          repeat: Infinity,
        }}
        style={{
          backgroundSize: "200% 200%",
          opacity: 0.4,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 z-10">
        {/* 🟢 Card 1: Average Rating */}
        <div className="h-full bg-gradient-to-br from-[color:var(--brand-light)] to-white/30 backdrop-blur-xl border border-[color:var(--brand)] rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center">
          <h3 className="text-xl font-bold text-[color:var(--brand-dark)] mb-4">
            Average Rating
          </h3>
          <RatingStars rating={parseFloat(averageRating)} />
          <p className="text-4xl font-extrabold text-[color:var(--brand)] mt-2">
            {averageRating}
          </p>
          <span className="text-sm text-gray-800 mt-2">
            {testimonials.length} reviews
          </span>
        </div>

        {/* 🟡 Card 2: Breakdown */}
        <div className="h-full bg-gradient-to-br from-[color:var(--accent)]/30 to-[color:var(--accent-dark)]/10 backdrop-blur-lg border border-[color:var(--accent-dark)] rounded-2xl shadow-lg p-6 flex flex-col justify-center">
          <h3 className="text-xl font-bold text-[color:var(--accent-dark)] mb-4 text-center">
            Ratings Breakdown
          </h3>
          {ratingCounts.map((count, idx) => {
            const star = 5 - idx;
            const percent =
              testimonials.length > 0 ? (count / testimonials.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center mb-2">
                <span className="w-12 text-sm font-medium">{star}★</span>
                <div className="flex-1 h-3 bg-white/40 rounded-full overflow-hidden mx-2">
                  <div
                    className="h-full bg-[color:var(--aqua)] transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="w-8 text-sm">{count}</span>
              </div>
            );
          })}
        </div>

        {/* 🔵 Card 3: Carousel */}
        <div className="h-full bg-gradient-to-br from-[color:var(--lavender)]/30 to-white/20 backdrop-blur-xl border border-[color:var(--lavender)] rounded-2xl shadow-lg p-1 flex flex-col">
          <h3 className="text-xl font-bold text-[color:var(--lavender)] mb-4 text-center">
            Student Testimonials
          </h3>

          <div className="flex-1 overflow-hidden">
            {testimonials.length > 0 ? (
              <TestimonialsCarousel testimonials={testimonials} />
            ) : (
              <p className="text-gray-700 text-center italic mt-10">
                No testimonials yet.
              </p>
            )}
          </div>
        </div>

        {/* 📝 Card 4: Add Review */}
        <div className="h-full bg-gradient-to-br from-white/40 to-[color:var(--brand-light)]/30 backdrop-blur-xl border border-[color:var(--brand-light)] rounded-2xl shadow-lg p-6 flex flex-col">
          <h3 className="text-xl font-bold text-[color:var(--brand-dark)] mb-4 text-center">
            Share Your Experience
          </h3>

          <form onSubmit={handleAddReview} className="flex-1 flex flex-col justify-between space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              value={newReview.name}
              onChange={(e) =>
                setNewReview((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-3 py-2 rounded-lg border-2 border-transparent focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand-light)] bg-white/70 backdrop-blur-sm shadow-sm"
              required
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setNewReview((prev) => ({ ...prev, file: e.target.files[0] }))
              }
              className="w-full px-3 py-2 rounded-lg border-2 border-dashed border-[color:var(--lavender)] bg-white/60 text-sm cursor-pointer"
            />

            <textarea
              placeholder="Your Comment"
              value={newReview.comment}
              onChange={(e) =>
                setNewReview((prev) => ({ ...prev, comment: e.target.value }))
              }
              className="w-full px-3 py-2 rounded-lg border-2 border-transparent focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand-light)] bg-white/70 backdrop-blur-sm shadow-sm resize-none"
              rows={3}
              required
            />

            <div className="flex justify-center">
              <RatingStars
                rating={newReview.rating}
                editable
                onRatingChange={(r) =>
                  setNewReview((prev) => ({ ...prev, rating: r }))
                }
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 px-4 font-bold rounded-lg shadow-md transition transform flex justify-center items-center gap-2 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[color:var(--brand)] text-white hover:bg-[color:var(--brand-dark)] hover:scale-[1.02] active:scale-95"
              }`}
            >
              {isSubmitting && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                  ></path>
                </svg>
              )}
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
