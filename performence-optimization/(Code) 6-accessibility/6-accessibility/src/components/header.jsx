import {ShoppingCartState} from "../context/context";
import {Link} from "react-router-dom";

const Header = () => {
  const {
    state: {cart},
    filterState: {searchQuery},
    filterDispatch,
  } = ShoppingCartState();

  return (
    <nav className="h-5 flex items-center justify-between">
      <Link to="/">
        <h2 className="text-2xl font-mono">RoadsideCoder Store</h2>
      </Link>
      <label htmlFor="search products" className="opacity-0">
        Search Box
      </label>
      <input
        type="text"
        id="search products"
        placeholder="eg. Perfume Oil"
        value={searchQuery}
        onChange={(e) =>
          filterDispatch({type: "FILTER_BY_SEARCH", payload: e.target.value})
        }
        className="p-2 hidden sm:flex"
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
