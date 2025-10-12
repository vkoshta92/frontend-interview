/* eslint-disable react/prop-types */
import {useState} from "react";

const StarRating = ({rating, onChange}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = (newRating) => {
    if (onChange) onChange(newRating);
  };

  const handleStarHover = (hoveredRating) => {
    if (onChange) setHoverRating(hoveredRating);
  };

  const totalStars = 5;

  return (
    <div className="star-rating">
      {Array(totalStars)
        .fill("")
        .map((_, index) => {
          const starValue = index + 1;
          let starClass = "star";

          if (hoverRating >= starValue) {
            starClass += " hover";
          } else if (rating >= starValue) {
            starClass += " active";
          }

          // for (let i = 0; i < 10000000; i++) {
          //   // slow code
          // }

          return (
            <span
              key={starValue}
              className={starClass}
              onClick={() => handleStarClick(starValue)}
              onMouseEnter={() => handleStarHover(starValue)}
              onMouseLeave={() => handleStarHover(0)}
            >
              &#9733;
            </span>
          );
        })}
    </div>
  );
};

export default StarRating;
