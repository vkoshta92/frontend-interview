/* eslint-disable react/prop-types */
import {createContext, useContext, useEffect, useReducer} from "react";
import {shoppingCartReducer, filterReducer} from "./reducer";

const ShoppingCart = createContext();

const Context = ({children}) => {
  const [state, dispatch] = useReducer(shoppingCartReducer, {
    products: [],
    cart: [],
  });

  const fetchProducts = async () => {
    const res = await fetch(`/products.json`);
    const data = await res.json();

    if (data && data.products) {
      dispatch({type: "FETCH_PRODUCTS", payload: data.products});
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const [filterState, filterDispatch] = useReducer(filterReducer, {
    byStock: false,
    byRating: 0,
    searchQuery: "",
  });

  return (
    <ShoppingCart.Provider
      value={{state, dispatch, filterState, filterDispatch}}
    >
      {children}
    </ShoppingCart.Provider>
  );
};

export const ShoppingCartState = () => {
  return useContext(ShoppingCart);
};

export default Context;
