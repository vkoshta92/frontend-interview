import {useEffect} from "react";
import {ShoppingCartState} from "../context/context";
import StarRating from "./star-rating";
import {useSearchParams} from "react-router-dom";

const filterMap = {
  sort: "SORT_BY_PRICE",
  byRating: "FILTER_BY_RATING",
  byStock: "FILTER_BY_STOCK",
  searchQuery: "FILTER_BY_SEARCH",
};

const Filters = () => {
  const {filterDispatch, filterState} = ShoppingCartState();

  const {byStock, sort, byRating} = filterState;

  let [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.size) {
      searchParams.forEach((value, key) => {
        filterDispatch({
          type: filterMap[key],
          payload: value,
        });
      });
    }
  }, []);

  useEffect(() => {
    setSearchParams(filterState);
  }, [filterState]);

  return (
    <div className="flex flex-col w-96 gap-2">
      <span className="font-bold">Filter Products:</span>
      <span>
        <input
          className="mr-2"
          id="Ascending"
          name="sort"
          type="radio"
          onChange={() =>
            filterDispatch({
              type: "SORT_BY_PRICE",
              payload: "lowToHigh",
            })
          }
          checked={sort === "lowToHigh" ? true : false}
        />
        <label htmlFor="Ascending">Ascending</label>
      </span>
      <span>
        <input
          className="mr-2"
          name="sort"
          type="radio"
          id="descending"
          onChange={() =>
            filterDispatch({
              type: "SORT_BY_PRICE",
              payload: "highToLow",
            })
          }
          checked={sort === "highToLow" ? true : false}
        />
        <label htmlFor="descending">Descending</label>
      </span>
      <span>
        <input
          className="mr-2"
          name="outOfStock"
          id="outofstock"
          type="checkbox"
          onChange={() =>
            filterDispatch({
              type: "FILTER_BY_STOCK",
              payload: !byStock,
            })
          }
          checked={byStock}
        />
        <label htmlFor="outofstock">Include Out of Stock</label>
      </span>
      <span className="flex items-center">
        <label style={{paddingRight: 10}}>Rating: </label>
        <StarRating
          rating={byRating}
          onChange={(i) =>
            filterDispatch({
              type: "FILTER_BY_RATING",
              payload: i,
            })
          }
        />
      </span>
      <button
        onClick={() =>
          filterDispatch({
            type: "CLEAR_FILTERS",
          })
        }
        className="bg-slate-500 text-white rounded-sm"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default Filters;
