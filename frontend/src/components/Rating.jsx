import React, { useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import "../componentStyles/Rating.css";
const Rating = ({
  value = 0,
  onRatingChange,
  disable = false,
  reviewCount = 0,
}) => {
  const [hoverValue, setHoverValue] = useState(null);

  const displayValue = hoverValue !== null ? hoverValue : value;

  const handleClick = (ratingValue) => {
    if (!disable && onRatingChange) {
      onRatingChange(ratingValue);
    }
  };

  const handleMouseMove = (e, starIndex) => {
    if (disable) return;

    const { left, width } = e.target.getBoundingClientRect();
    const isHalf = e.clientX - left < width / 2;
    setHoverValue(isHalf ? starIndex - 0.5 : starIndex);
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  return (
    <div className="rating-wrapper">
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => {
          let icon;

          if (displayValue >= star) {
            icon = <FaStar />;
          } else if (displayValue >= star - 0.5) {
            icon = <FaStarHalfAlt />;
          } else {
            icon = <FaRegStar />;
          }

          return (
            <span
              key={star}
              className="star"
              onClick={() => handleClick(star)}
              onMouseMove={(e) => handleMouseMove(e, star)}
              onMouseLeave={handleMouseLeave}
            >
              {icon}
            </span>
          );
        })}
      </div>

      <span className="rating-text">
        {displayValue.toFixed(1)} / 5
      </span>

      {reviewCount > 0 && (
        <span className="review-count">
          ({reviewCount} reviews)
        </span>
      )}
    </div>
  );
};

export default Rating;