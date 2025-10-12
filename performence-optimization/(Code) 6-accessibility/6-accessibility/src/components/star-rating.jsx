/* eslint-disable react/prop-types */
import {useState} from "react";

const StarRating = ({rating, onChange, size = 5}) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleStarHover = (hoveredRating) => {
    if (onChange) setHoveredRating(hoveredRating);
  };

  const handleKeyDown = (event, starValue) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onChange(starValue);
    }
  };

  return (
    <div className="star-rating" role="radiogroup" aria-label="Rating">
      {Array(size)
        .fill("")
        .map((_, index) => {
          const starValue = index + 1;
          let starClass = "star";

          if (hoveredRating >= starValue) {
            starClass += " hover";
          } else if (rating >= starValue) {
            starClass += " active";
          }
          return (
            <span
              key={index}
              role="radio"
              aria-checked={rating >= starValue}
              tabIndex={0}
              aria-label={`${starValue} of ${size} stars`}
              onKeyDown={(e) => handleKeyDown(e, starValue)}
              className={starClass}
              onClick={() => onChange(starValue)}
              onMouseEnter={() => {
                if (onChange) handleStarHover(starValue);
              }}
              onMouseLeave={() => {
                if (onChange) handleStarHover(0);
              }}
            >
              &#9733;
            </span>
          );
        })}
    </div>
  );
};

export default StarRating;
