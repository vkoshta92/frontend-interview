import {useDispatch, useSelector} from "react-redux";
// import {ShoppingCartState} from "../context/context";
import {Link} from "react-router-dom";
import {filterBySearch} from "../slices/filterSlice";

const Header = () => {
  // const {
  //   state: {cart},
  //   filterState: {searchQuery},
  //   filterDispatch,
  // } = ShoppingCartState();

  const filterDispatch = useDispatch();
  const {cart} = useSelector((state) => state.cart);
  const {searchQuery} = useSelector((state) => state.filter);

  return (
    <nav className="h-5 flex items-center justify-between">
      <Link to="/">
        <h2 className="text-2xl font-mono">RoadsideCoder Store</h2>
      </Link>
      <input
        type="text"
        placeholder="Search a Product..."
        value={searchQuery}
        onChange={(e) =>
          // filterDispatch({type: "FILTER_BY_SEARCH", payload: e.target.value})
          filterDispatch(filterBySearch(e.target.value))
        }
        className="p-2"
      />
      <Link to="/cart">
        <button className="px-4 py-2 bg-slate-500 text-white rounded-sm">
          Cart ({cart.length})
        </button>
      </Link>
    </nav>
  );
};

export default Header;
