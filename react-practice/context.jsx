import { useContext } from "react";
import { CounterContext } from "./CounterContext";

function Child() {
  // Access value from Provider
  const { count, increment } = useContext(CounterContext);

  return (
    <>
      <p>{count}</p>
      <button onClick={increment}>+</button>
    </>
  );
}
