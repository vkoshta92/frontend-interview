import { forwardRef, useImperativeHandle, useRef } from "react";

const Child = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    sayHello() {
      alert("Hello");
    },
  }));

  return <div>Child</div>;
});

function Parent() {
  const ref = useRef();

  return (
    <>
      <Child ref={ref} />
      <button onClick={() => ref.current.sayHello()}>
        Call Child
      </button>
    </>
  );
}
