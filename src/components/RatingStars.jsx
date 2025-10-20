import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

export default function RatingStars({
  rating,
  editable = false,
  onRatingChange,
}) {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          size={20}
          className={
            star <= rating
              ? "text-[color:var(--accent-dark)] cursor-pointer"
              : "text-gray-300 cursor-pointer"
          }
          onClick={editable ? () => onRatingChange(star) : undefined}
        />
      ))}
    </div>
  );
}
