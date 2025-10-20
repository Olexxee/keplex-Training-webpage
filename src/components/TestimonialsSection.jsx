import { useEffect, useState } from "react";
import { db, storage } from "../firebase/config";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import TestimonialsCarousel from "./TestimonialsCarousel";
import RatingStars from "./RatingStars";

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [newReview, setNewReview] = useState({
    name: "",
    comment: "",
    rating: 0,
    file: null,
  });

  // 🔹 Fetch testimonials live
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "testimonials"), (snapshot) => {
      setTestimonials(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    });
    return () => unsub();
  }, []);

  // 🔹 Average rating
  const averageRating =
    testimonials.length > 0
      ? (
          testimonials.reduce((acc, t) => acc + (t.rating || 0), 0) /
          testimonials.length
        ).toFixed(1)
      : 0;

  // 🔹 Rating breakdown (5–1 stars)
  const ratingCounts = [5, 4, 3, 2, 1].map(
    (star) => testimonials.filter((t) => t.rating === star).length
  );

  // 🔹 Add new review
  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment || newReview.rating === 0) return;

    try {
      let imageUrl = "";
      if (newReview.file) {
        const fileRef = ref(
          storage,
          `testimonials/${Date.now()}_${newReview.file.name}`
        );
        await uploadBytes(fileRef, newReview.file);
        imageUrl = await getDownloadURL(fileRef);
      }

      await addDoc(collection(db, "testimonials"), {
        name: newReview.name,
        comment: newReview.comment,
        rating: newReview.rating,
        imageUrl,
        createdAt: serverTimestamp(),
      });

      setNewReview({ name: "", comment: "", rating: 0, file: null });
    } catch (err) {
      console.error("Error adding review:", err);
    }
  };

  return (
    <section className="relative w-full py-16 bg-[color:var(--neutral-light)]">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        {/* Card 1: Average Rating */}
        <div className="bg-white/80 border-2 border-[color:var(--brand)] rounded-xl shadow-lg p-6 flex flex-col items-center">
          <h3 className="text-xl font-bold text-[color:var(--brand-dark)] mb-4">
            Average Rating
          </h3>
          <RatingStars rating={parseFloat(averageRating)} />
          <p className="text-3xl font-extrabold text-[color:var(--brand)] mt-2">
            {averageRating}
          </p>
          <span className="text-sm text-gray-500">
            {testimonials.length} reviews
          </span>
        </div>

        {/* Card 2: Breakdown */}
        <div className="bg-white/80 border-2 border-[color:var(--accent-dark)] rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-[color:var(--accent-dark)] mb-4">
            Ratings Breakdown
          </h3>
          {ratingCounts.map((count, idx) => {
            const star = 5 - idx;
            const percent =
              testimonials.length > 0 ? (count / testimonials.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center mb-2">
                <span className="w-12 text-sm font-medium">{star}★</span>
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden mx-2">
                  <div
                    className="h-full bg-[color:var(--aqua)]"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="w-8 text-sm">{count}</span>
              </div>
            );
          })}
        </div>

        {/* Card 3: Carousel + Add Review */}
        <div className="bg-white/80 border-2 border-[color:var(--lavender)] rounded-xl shadow-lg p-6 flex flex-col">
          <h3 className="text-xl font-bold text-[color:var(--lavender)] mb-4 text-center">
            Student Testimonials
          </h3>
          <div className="flex-1 mb-6">
            <TestimonialsCarousel testimonials={testimonials} />
          </div>

          {/* Add Review Form */}
          <form onSubmit={handleAddReview} className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              value={newReview.name}
              onChange={(e) =>
                setNewReview((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-3 py-2 rounded-lg border-2 border-transparent focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand-light)] bg-white/60 backdrop-blur-sm shadow-sm"
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setNewReview((prev) => ({ ...prev, file: e.target.files[0] }))
              }
              className="w-full px-3 py-2 rounded-lg border-2 border-dashed border-[color:var(--lavender)] bg-white/50 text-sm cursor-pointer"
            />
            <textarea
              placeholder="Your Comment"
              value={newReview.comment}
              onChange={(e) =>
                setNewReview((prev) => ({ ...prev, comment: e.target.value }))
              }
              className="w-full px-3 py-2 rounded-lg border-2 border-transparent focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand-light)] bg-white/60 backdrop-blur-sm shadow-sm resize-none"
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
              className="w-full py-2 px-4 bg-[color:var(--brand)] text-white font-bold rounded-lg shadow-md hover:bg-[color:var(--brand-dark)] hover:scale-[1.02] active:scale-95 transition transform"
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
