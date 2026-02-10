import { createContext, useState } from "react";

export const CounterContext = createContext(null);

export function CounterProvider({ children }) {
  const [count, setCount] = useState(0);

  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1);

  return (
    <CounterContext.Provider
      value={{ count, increment, decrement }}
    >
      {children}
    </CounterContext.Provider>
  );
}



import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CounterProvider } from "./CounterContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <CounterProvider>
    <App />
  </CounterProvider>
);



import { useContext } from "react";
import { CounterContext } from "./CounterContext";

function Counter() {
  const { count, increment, decrement } =
    useContext(CounterContext);

  return (
    <div>
      <h1>Count: {count}</h1>

      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}

export default Counter;
