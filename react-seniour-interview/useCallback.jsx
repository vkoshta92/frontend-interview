import { useCallback, useState } from "react";

function Parent() {
  const [count, setCount] = useState(0);

  // Function reference preserved
  const increment = useCallback(() => {
    setCount((c) => c + 1);
  }, []);

  return <Child onClick={increment} />;
}
