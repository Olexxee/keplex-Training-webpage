import { useState } from "react";

export default function RatingStars({
  rating = 0,
  editable = false,
  onRatingChange,
}) {
  const [hovered, setHovered] = useState(0);

  const handleClick = (value) => {
    if (editable && onRatingChange) onRatingChange(value);
  };

  return (
    <div className="flex gap-1 justify-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => handleClick(star)}
          onMouseEnter={() => editable && setHovered(star)}
          onMouseLeave={() => editable && setHovered(0)}
          className={`cursor-${
            editable ? "pointer" : "default"
          } text-2xl transition-colors duration-150 ${
            star <= (hovered || rating) ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
}
