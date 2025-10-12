import {useSearchParams} from "react-router-dom";

const Product = () => {
  let [searchParams, setSearchParams] = useSearchParams();

  const updateSearchParams = (newParams) => {
    const paramsObject = Object.fromEntries(searchParams.entries());
    const mergedParams = {...paramsObject, ...newParams};
    setSearchParams(mergedParams);
  };

  return (
    <div>
      <h4>Colors</h4>
      <button onClick={() => updateSearchParams({color: "red"})}>red</button>
      <button onClick={() => updateSearchParams({color: "white"})}>
        white
      </button>

      <h4>Size</h4>
      <button onClick={() => updateSearchParams({size: 10})}>10</button>
      <button onClick={() => updateSearchParams({size: 11})}>11</button>
      <button>12</button>
    </div>
  );
};

export default Product;
