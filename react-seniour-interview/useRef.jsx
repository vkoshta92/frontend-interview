import { useRef } from "react";

function InputFocus() {
  const inputRef = useRef(null);
  // inputRef.current persists without re-render

  const focusInput = () => {
    inputRef.current.focus(); // access DOM
  };

  return (
    <>
      <input ref={inputRef} />
      <button onClick={focusInput}>Focus</button>
    </>
  );
}
