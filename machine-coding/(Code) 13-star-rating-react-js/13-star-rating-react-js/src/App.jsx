/* Design and implement a "Star Rating" component using React.

Requirements:
  - Ensure the component is fully functional and displays a visual representation of a star 
  rating system, with 5 stars that users can click to set a rating.
  - Enhance the component to be more user-friendly and visually appealing. This can involve 
  adding the hover effect, or changing the star icons' appearance when active/hovered.
  - Write the component in a way that it can easily be reused across different parts of an
  application and can accept different sizes, current rating, etc for the stars as props.
*/

import {useState} from "react";
import "./App.css";
import StarRating from "./components/star-rating";

const App = () => {
  const [currentRating, setCurrentRating] = useState(3);

  const handleRatingChange = (newRating) => {
    setCurrentRating(newRating);
  };

  return (
    <div>
      <h2>Star Rating</h2>
      <StarRating
        size={5}
        rating={currentRating}
        onChange={handleRatingChange}
      />
      <p>Current Rating: {currentRating}</p>
    </div>
  );
};

export default App;
