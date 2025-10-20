import RatingStars from "./RatingStars";

export default function TestimonialsCarousel({ testimonials }) {
  if (!testimonials || testimonials.length === 0) {
    return <p className="text-center text-gray-500">No reviews yet.</p>;
  }

  return (
    <div className="overflow-x-auto flex space-x-4 pb-2">
      {testimonials.map((t) => (
        <div
          key={t.id}
          className="min-w-[250px] max-w-[300px] bg-white border-2 border-[color:var(--neutral-mid)] rounded-lg p-4 shadow-md flex-shrink-0"
        >
          {t.imageUrl && (
            <img
              src={t.imageUrl}
              alt={t.name}
              className="w-16 h-16 rounded-full object-cover mx-auto mb-2 border-2 border-[color:var(--brand)]"
            />
          )}
          <h4 className="text-lg font-semibold text-center text-[color:var(--brand-dark)]">
            {t.name}
          </h4>
          <div className="flex justify-center my-2">
            <RatingStars rating={t.rating} />
          </div>
          <p className="text-sm text-gray-600 text-center">{t.comment}</p>
        </div>
      ))}
    </div>
  );
}
