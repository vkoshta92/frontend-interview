import { useEffect, useState } from "react";

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Runs AFTER render
    console.log("Component rendered");

    // Cleanup function (optional)
    return () => {
      console.log("Cleanup before next effect");
    };
  }, [count]); 
  // Dependency array
  // Runs only when count changes

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}
