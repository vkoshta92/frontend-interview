import { useState } from "react";

function Counter() {
  // count → current state value
  // setCount → function to update state
  const [count, setCount] = useState(0); // 0 is initial value

  return (
    <>
      <h1>{count}</h1>

      {/* setCount updates state */}
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </>
  );
}
