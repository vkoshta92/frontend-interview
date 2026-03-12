import { useId } from "react";

function Form() {
  const id = useId(); // stable unique id

  return (
    <>
      <label htmlFor={id}>Email</label>
      <input id={id} />
    </>
  );
}
