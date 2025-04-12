import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Components/Layout.jsx";
import Home from "./Components/Home/Home.jsx";
import ProductProvider from "./Components/Contexts/ProductContext.jsx";
import { CartProvider } from "react-use-cart";
import RegistrationPage from "./Components/RegistrationPage/RegistrationPage.jsx";
import UserProvider from "./Components/Contexts/UserContext.jsx";
import SignInPage from "./Components/SignInPage/SignInPage.jsx";
import { ToastContainer } from "react-toastify";
import FilteredProducts from "./Components/FilteredProducts.jsx";

function RouterWrapper() {
  const Cart = lazy(() => import("./Components/ProductDetails.jsx"));
  const Profile = lazy(() => import("./Components/Profile/Profile.jsx"));
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "profile",
          element: (
            <Suspense
              fallback={
                <div className="flex py-10 justify-center items-center">
                  <div className="w-12 h-12 border-4 border-indigo-500 border-dashed rounded-full animate-spin"></div>
                </div>
              }
            >
              <Profile />
            </Suspense>
          ),
        },
        {
          path: "cart",
          element: (
            <Suspense
              fallback={
                <div className="flex py-10 justify-center items-center">
                  <div className="w-12 h-12 border-4 border-indigo-500 border-dashed rounded-full animate-spin"></div>
                </div>
              }
            >
              <Cart />
            </Suspense>
          ),
        },
        {
          path: "cart/:productId",
          element: (
            <Suspense
              fallback={
                <div className="flex py-10 justify-center items-center">
                  <div className="w-12 h-12 border-4 border-indigo-500 border-dashed rounded-full animate-spin"></div>
                </div>
              }
            >
              <Cart />
            </Suspense>
          ),
        },
        {
          path: "filteredprdcts",
          element: (
            <Suspense
              fallback={
                <div className="flex py-10 justify-center items-center">
                  <div className="w-12 h-12 border-4 border-indigo-500 border-dashed rounded-full animate-spin"></div>
                </div>
              }
            >
              <FilteredProducts />
            </Suspense>
          ),
        },
        {
          path: "register",
          element: <RegistrationPage />,
        },
        {
          path: "signin",
          element: <SignInPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ProductProvider>
      <UserProvider>
        <CartProvider>
          <RouterWrapper />
        </CartProvider>
      </UserProvider>
    </ProductProvider>
    <ToastContainer />
  </StrictMode>
);
