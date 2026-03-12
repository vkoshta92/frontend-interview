//.......... npm install zustand

import { create } from "zustand";

const useCounterStore = create((set) => ({
  count: 0,

  increment: () =>
    set((state) => ({ count: state.count + 1 })),

  decrement: () =>
    set((state) => ({ count: state.count - 1 })),
}));

export default useCounterStore;


//............
import React from "react";
import useCounterStore from "./store";

function Counter() {
  const { count, increment, decrement } = useCounterStore();

  return (
    <div>
      <h1>Count: {count}</h1>

      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}

export default Counter;



// zustand in reducer style
const useCounterStore = create((set) => ({
  count: 0,
  dispatch: (action) =>
    set((state) => {
      switch (action.type) {
        case "Increment":
          return { count: state.count + 1 };
        case "Decrement":
          return { count: state.count - 1 };
        default:
          return state;
      }
    }),
}));
