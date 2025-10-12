/* 
Suppose you're given a very long list of data (eg - 1,000,000 items) to be rendered in your app.
How will you effectively render it without compromising the performance?
*/

import "./App.css";
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import AppLayout from "./layouts/app-layout";
import Home from "./pages/home";
import PostComments from "./pages/post-comments";
import Error from "./components/error";
import Product from "./pages/product";
import PostListVirtualized, {postLoader} from "./pages/post-list-virtualized";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/posts",
        element: <PostListVirtualized />,
        loader: postLoader,
      },
      {
        path: "/posts/:postId",
        element: <PostComments />,
      },
      {
        path: "/product",
        element: <Product />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
