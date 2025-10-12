import {useMemo, useRef} from "react";
import useIntersectionObserver from "../hooks/use-intersection-observer";

const IntersectionElement = () => {
  const ref = useRef(null);

  const options = useMemo(
    () => ({
      root: null,
      rootMargin: "0px",
      threshold: 0.5, // 50% visible
    }),
    []
  );

  const intersectionEntry = useIntersectionObserver(ref, options);

  console.log("isIntersecting", intersectionEntry?.isIntersecting);
  console.log("Intersection Ratio", intersectionEntry?.intersectionRatio);

  return (
    <div
      style={{
        height: "200vh",
        background: intersectionEntry?.isIntersecting ? "white" : "grey",
      }}
    >
      <div ref={ref} style={{height: "50vh", background: "lightblue"}}>
        <h2>Roadside Coder</h2>
      </div>
    </div>
  );
};

export default IntersectionElement;
