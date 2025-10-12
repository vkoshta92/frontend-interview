import {useEffect, useRef, useState} from "react";

const UseRefHook = () => {
  const [count, setCount] = useState(0);
  const ref = useRef(0);

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div>
      <h3>
        <u>useRef Hook</u>
      </h3>

      <h5>Question 1: What is useRef in React?</h5>
      {/*
        - useRef is a hook used to create a mutable reference that persists across renders.
        - It returns a mutable object with a .current property.
    */}
      <p>ref value: {ref.current}</p>
      <button
        onClick={() => {
          ref.current += 1;
        }}
      >
        Increment Ref
      </button>
      <p>state value: {count}</p>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        Increment State
      </button>

      <h5>Question 2: When would you use useRef?</h5>
      {/* 
        - Accessing DOM elements or managing focus.
        - Storing mutable values that persist without causing re-renders.
        - Caching values to avoid re-initialization on re-renders.
      */}
      <button
        onClick={() => {
          inputRef.current.focus();
          inputRef.current.value = 5;
        }}
      >
        Set Focus
      </button>

      <h5>Question 3: How do you access a DOM element using useRef?</h5>
      <input ref={inputRef} />

      <h5>Question 4: Difference between useState and useRef?</h5>
      {/* 
        - useState
            Manages state and triggers re-renders when its value changes. When you update it using 
            setStateValue, the component re-renders, and the updated value is reflected in the UI.
        - useRef
            Holds a mutable value (current) that persists across renders without causing re-renders. 
            When you update it (refValue.current = ...), the component doesn't re-render, 
            but the updated value is stored and accessible across renders.
      */}
    </div>
  );
};

export default UseRefHook;
