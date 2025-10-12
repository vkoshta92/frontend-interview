import {createSlice} from "@reduxjs/toolkit";

const filterSlice = createSlice({
  name: "filter",
  initialState: {
    byStock: false,
    byRating: 0,
    searchQuery: "",
  },
  reducers: {
    sortByPrice(state, action) {
      state.sort = action.payload;
    },
    filterByStock(state, action) {
      state.byStock = action.payload;
    },
    filterByRating(state, action) {
      state.byRating = action.payload;
    },
    filterBySearch(state, action) {
      state.searchQuery = action.payload;
    },
    clearFilters(state) {
      state.byStock = false;
      state.byRating = 0;
      state.searchQuery = "";
    },
  },
});

export const {
  sortByPrice,
  filterByStock,
  filterByRating,
  filterBySearch,
  clearFilters,
} = filterSlice.actions;
export default filterSlice.reducer;
