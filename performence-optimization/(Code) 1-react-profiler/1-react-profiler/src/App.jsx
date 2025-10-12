import {RouterProvider, createBrowserRouter} from "react-router-dom";
import AppLayout from "./components/app-layout";
import Home from "./pages/home";
import Cart from "./pages/cart";
import "./App.css";
import Context from "./context/context";

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

function App() {
  return (
    <Context>
      <RouterProvider router={router} />
    </Context>
  );
}

export default App;
