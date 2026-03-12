// count → current state

// dispatch → function to send action

// reducer → decides how state changes

// action.type → tells reducer what to do

// useReducer is used when state logic is complex or depends on previous state. It works like Redux reducer inside a component.


import React, { useReducer } from "react";

const initialState = 0;

const reducer = (state, action) => {
  switch (action.type) {
    case "Increment":
      return state + 1;

    case "Decrement":
      return state - 1;

    default:
      return state;
  }
};


function Counter() {
  const [count, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <h1>Count: {count}</h1>

      <button onClick={() => dispatch({ type: "Increment" })}>
        +
      </button>

      <button onClick={() => dispatch({ type: "Decrement" })}>
        -
      </button>
    </div>
  );
}

export default Counter;
