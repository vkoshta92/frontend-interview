/* Code Splitting */

import "./App.css";
import {
  BrowserRouter,
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter,
} from "react-router-dom";
import AppLayout from "./components/app-layout";
import Context from "./context/context";
import {Suspense, lazy} from "react";
import Header from "./components/header";

const Home = lazy(() => import("./pages/home"));
const Cart = lazy(() => import("./pages/cart"));

// const router = createBrowserRouter([
//   {
//     element: <AppLayout />,

//     children: [
//       {
//         path: "/",
//         element: (
//           <Suspense fallback={<div>Loading...</div>}>
//             <Home />
//           </Suspense>
//         ),
//       },
//       {
//         path: "/cart",
//         element: (
//           <Suspense fallback={<div>Loading...</div>}>
//             <Cart />
//           </Suspense>
//         ),
//       },
//     ],
//   },
// ]);

// const App = () => {
//   return (
//     <Context>
//       <RouterProvider router={router} />
//     </Context>
//   );
// };

function App() {
  return (
    <Context>
      <BrowserRouter>
        <Header />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </Context>
  );
}

export default App;
