import {configureStore} from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import filterReducer from "./slices/filterSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    filter: filterReducer,
  },
});

export default store;
