import { useRef, useEffect } from "react";

/**
 * deps compare karne ke liye helper
 * bilkul React useMemo jaisa shallow compare
 */
const areEqual = (prevDeps, nextDeps) => {
  // first render case
  if (prevDeps === null) return false;

  // length mismatch → deps change
  if (prevDeps.length !== nextDeps.length) return false;

  // ek bhi dependency change hui to false
  for (let i = 0; i < prevDeps.length; i++) {
    if (prevDeps[i] !== nextDeps[i]) {
      return false;
    }
  }

  return true; // sab deps same hai
};

const useCustomMemo = (cb, deps) => {
  /**
   * memoizedRef.current structure:
   * {
   *   value: computedValue,
   *   deps: []
   * }
   */
  const memoizedRef = useRef(null);

  // deps change hui ya first time render
  if (
    !memoizedRef.current ||
    !areEqual(memoizedRef.current.deps, deps)
  ) {
    console.log("🔁 Recalculating memo value");

    memoizedRef.current = {
      value: cb(), // expensive calculation
      deps
    };
  } else {
    console.log("✅ Using cached memo value");
  }

  // cleanup (learning purpose)
  useEffect(() => {
    return () => {
      console.log("🧹 Clearing memoized value");
      memoizedRef.current = null;
    };
  }, []);

  // memoised value return
  return memoizedRef.current.value;
};

export default useCustomMemo;
