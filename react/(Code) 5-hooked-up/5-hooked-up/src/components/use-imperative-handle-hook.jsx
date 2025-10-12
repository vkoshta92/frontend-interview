/* eslint-disable react/display-name */
import {forwardRef, useImperativeHandle, useRef} from "react";

const UseImperativeHandleHook = () => {
  const childRef = useRef(null);

  return (
    <div>
      <h3>
        <u>useImperativeHandle Hook</u>
      </h3>

      <h5>
        How do u call a function of child component from parent component?
      </h5>
      <button onClick={() => childRef.current.focusInput()}>
        Focus on input
      </button>
      <ChildComponent ref={childRef} />
    </div>
  );
};

const ChildComponent = forwardRef((props, ref) => {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current.focus();
  };

  useImperativeHandle(ref, () => {
    return {
      focusInput,
    };
  });

  return <input type="text" ref={inputRef} />;
});

export default UseImperativeHandleHook;
