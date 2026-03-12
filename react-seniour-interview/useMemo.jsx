import { useMemo, useState } from "react";

function ExpensiveCalc({ num }) {
  const result = useMemo(() => {
    // Runs only when num changes
    let sum = 0;
    for (let i = 0; i < 1e6; i++) sum += num;
    return sum;
  }, [num]);

  return <h1>{result}</h1>;
}
