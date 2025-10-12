import "./App.css";
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import AppLayout from "./layouts/app-layout";
import Home from "./pages/home";
import PostList, {postLoader} from "./pages/post-list";
import PostComments from "./pages/post-comments";
import Error from "./components/error";
import Login from "./components/login";
import Signup from "./components/signup";
import RequireAuth from "./components/require-auth";
import Product from "./pages/product";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "/auth",
        element: <Home />,
        children: [
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "signup",
            element: <Signup />,
          },
        ],
      },
      {
        path: "/posts",
        element: (
          <RequireAuth>
            <PostList />
          </RequireAuth>
        ),
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

// Ques. Convert Modern Approach to Traditional Approach ( or vise versa )
// function App() {
//   return (
//     <BrowserRouter>
//       <Header />
//       <Routes>
//         <Route index element={<Home />} />
//         <Route path="/posts" element={<PostList />} />
//         <Route path="/posts/:postId" element={<PostComments />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// Ques. Create a login form and onSubmit route them to a different page

// Ques. Design a Error / 404 Not Found Route

// Ques. Give the example of a nested route in react router dom

// Ques. Create Protected Route which Redirects to a login page

// Ques. How will you design a product page where user selects the specs and shares the
//     link to other users, it opens exact way as it was for original user ?

export default App;
