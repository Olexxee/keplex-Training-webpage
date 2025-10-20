import RatingStars from "./RatingStars";

export default function TestimonialCard({ testimonial }) {
  return (
    <div className="bg-white/90 border border-[color:var(--neutral-mid)] rounded-xl shadow p-6 text-center">
      {testimonial.photoURL && (
        <img
          src={testimonial.photoURL}
          alt={testimonial.name}
          className="w-16 h-16 rounded-full mx-auto mb-4 border-2 border-[color:var(--brand)]"
        />
      )}
      <h4 className="text-lg font-semibold text-[color:var(--brand-dark)]">
        {testimonial.name}
      </h4>
      <RatingStars rating={testimonial.rating} />
      <p className="mt-2 text-[color:var(--neutral-dark)] italic">
        "{testimonial.comment}"
      </p>
    </div>
  );
}
