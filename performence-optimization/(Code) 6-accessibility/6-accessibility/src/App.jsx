/* Accessibility also known as A11y */
/* Web accessibility means that websites, tools, and technologies are designed and developed 
so that people with disabilities can use them. */

import "./App.css";
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import Context from "./context/context";
import {Suspense, lazy} from "react";
import AppLayout from "./components/app-layout";

import Home from "./pages/home";
const Products = lazy(() => import("./pages/products"));
const Cart = lazy(() => import("./pages/cart"));

const router = createBrowserRouter([
  {
    element: <AppLayout />,

    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/products",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Products />
          </Suspense>
        ),
      },
      {
        path: "/cart",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Cart />
          </Suspense>
        ),
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
