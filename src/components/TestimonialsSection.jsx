import { useEffect, useState } from "react";
import { MessageSquareQuote, Star } from "lucide-react";

import { getPublicTestimonials } from "../services/testimonial.api";

import TestimonialModal from "./TestimonialModal";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);

      const res = await getPublicTestimonials();

      setTestimonials(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return (
    <section id="testimonials" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div>
            <p className="uppercase tracking-[0.3em] text-sm text-gray-500">
              Testimonials
            </p>

            <h2 className="text-4xl font-extrabold mt-3">
              What our students say
            </h2>
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="bg-black text-white px-6 py-4 rounded-xl font-semibold"
          >
            Share Experience
          </button>
        </div>

        {loading ? (
          <div className="mt-12">
            <p>Loading testimonials...</p>
          </div>
        ) : testimonials.length ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.id}
                className="bg-white rounded-3xl shadow-sm border p-8"
              >
                <MessageSquareQuote className="text-gray-300" />

                <div className="flex gap-1 mt-5">
                  {Array.from({
                    length: testimonial.rating,
                  }).map((_, index) => (
                    <Star
                      key={index}
                      size={18}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <p className="text-gray-700 leading-relaxed mt-5">
                  "{testimonial.message}"
                </p>

                <div className="mt-8">
                  <p className="font-bold text-lg">{testimonial.name}</p>

                  {testimonial.role && (
                    <p className="text-gray-500 text-sm mt-1">
                      {testimonial.role}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-12">
            <p className="text-gray-500">No testimonials yet.</p>
          </div>
        )}
      </div>

      <TestimonialModal open={openModal} onClose={() => setOpenModal(false)} />
    </section>
  );
}
