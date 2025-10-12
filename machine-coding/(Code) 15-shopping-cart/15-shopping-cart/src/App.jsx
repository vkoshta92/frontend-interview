/* Design and Implement E-Commerce Filters using React JS.

Requirements:
  - Fetch a list of products and render them on the page.
  https://dummyjson.com/products?limit=100
  - Add a filter to sort the products by price
  - Add a filter to show/hide out of stock products
  - Ability to Search products
  - Add a filter to show products above certain rating
  - Production grade state management

  Bonus -
  - Ability to share the state of page (applied filters) with other users
  - Implement Pagination with respect to the filters applied
*/

import "./App.css";
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import AppLayout from "./components/app-layout";
import Home from "./pages/home";
import Context from "./context/context";
import Cart from "./pages/cart";

const router = createBrowserRouter([
  {
    element: <AppLayout />,

    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
    ],
  },
]);

const App = () => {
  return (
    <Context>
      <RouterProvider router={router} />
    </Context>
  );
};

export default App;
