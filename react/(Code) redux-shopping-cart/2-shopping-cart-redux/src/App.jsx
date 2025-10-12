/* Implement Redux Toolkit in Shopping Cart App */

import "./App.css";
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import AppLayout from "./components/app-layout";
import Home from "./pages/home";
import Cart from "./pages/cart";
import {Provider} from "react-redux";
import store from "./store";

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
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
};

export default App;
