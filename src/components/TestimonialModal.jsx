import { useState } from "react";
import { X, Star } from "lucide-react";

import { createTestimonial } from "../services/testimonial.api";

export default function TestimonialModal({ open, onClose }) {
  const [form, setForm] = useState({
    name: "",
    role: "",
    message: "",
    rating: 5,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRating = (rating) => {
    setForm((prev) => ({
      ...prev,
      rating,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await createTestimonial(form);

      setSuccess("Your testimonial has been submitted for review.");

      setForm({
        name: "",
        role: "",
        message: "",
        rating: 5,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to submit testimonial.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-5">
      <div className="w-full max-w-xl bg-white rounded-3xl p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-black"
        >
          <X />
        </button>

        <h2 className="text-3xl font-bold">Share Your Experience</h2>

        <p className="text-gray-500 mt-2">
          Your testimonial will be reviewed before publishing.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 mt-8">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border rounded-xl px-4 py-4"
          />

          <input
            type="text"
            name="role"
            placeholder="Your Role / Profession"
            value={form.role}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-4"
          />

          <textarea
            name="message"
            placeholder="Your experience..."
            value={form.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full border rounded-xl px-4 py-4 resize-none"
          />

          <div>
            <p className="font-semibold mb-3">Rating</p>

            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => handleRating(star)}
                >
                  <Star
                    size={28}
                    className={
                      star <= form.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-xl font-bold"
          >
            {loading ? "Submitting..." : "Submit Testimonial"}
          </button>

          {success && (
            <p className="text-green-600 text-sm font-medium">{success}</p>
          )}

          {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
        </form>
      </div>
    </div>
  );
}
