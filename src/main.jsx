import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Components/Layout.jsx";
import Home from "./Components/Home/Home.jsx";
import { CartProvider } from "react-use-cart";
import RegistrationPage from "./Components/RegistrationPage/RegistrationPage.jsx";
import UserProvider from "./Contexts/UserContext.jsx";
import SignInPage from "./Components/SignInPage/SignInPage.jsx";
import { ToastContainer } from "react-toastify";
import FilteredProducts from "./Components/FilteredProducts.jsx";
import Dashboard from "./Components/Dashboard/Dashboard.jsx";
import AddProduct from "./Components/AddProduct/AddProduct.jsx";
import ProductProvider from "./Contexts/ProductContext.jsx";
Dashboard;
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
          element: (
            <Suspense
              fallback={
                <div className="flex py-10 justify-center items-center">
                  <div className="w-12 h-12 border-4 border-indigo-500 border-dashed rounded-full animate-spin"></div>
                </div>
              }
            >
              <Home />
            </Suspense>
          ),
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
          path: "product",
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
          path: "products/:productId",
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
        {
          path: "dashboard",
          element: (
            <Suspense
              fallback={
                <div className="flex py-10 justify-center items-center">
                  <div className="w-12 h-12 border-4 border-indigo-500 border-dashed rounded-full animate-spin"></div>
                </div>
              }
            >
              <Dashboard />
            </Suspense>
          ),
        },
        {
          path: "addproduct",
          element: (
            <Suspense
              fallback={
                <div className="flex py-10 justify-center items-center">
                  <div className="w-12 h-12 border-4 border-indigo-500 border-dashed rounded-full animate-spin"></div>
                </div>
              }
            >
              <AddProduct />
            </Suspense>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <ProductProvider>
        <CartProvider>
          <RouterWrapper />
        </CartProvider>
      </ProductProvider>
    </UserProvider>
    <ToastContainer />
  </StrictMode>
);
