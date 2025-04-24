import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Components/Layout.jsx";
import { CartProvider } from "react-use-cart";
import RegistrationPage from "./Components/RegistrationPage/RegistrationPage.jsx";
import UserProvider from "./Contexts/UserContext.jsx";
import SignInPage from "./Components/SignInPage/SignInPage.jsx";
import { ToastContainer } from "react-toastify";
import AddProduct from "./Components/AddProduct/AddProduct.jsx";
import ProductProvider from "./Contexts/ProductContext.jsx";
import ChangePassword from "./Components/ChangePassword/ChangePassword.jsx";
import ErrorBoundary from "./Components/ErrorBoundary.jsx"

function RouterWrapper() {
  const ProductDets = lazy(() => import("./Components/ProductDetails.jsx"));
  const Profile = lazy(() => import("./Components/Profile/Profile.jsx"));
  const Home = lazy(() => import("./Components/Home/Home.jsx"));
  const FilteredProducts = lazy(() =>
    import("./Components/FilteredProducts.jsx")
  );
  const Dashboard = lazy(() => import("./Components/Dashboard/Dashboard.jsx"));
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
          path: "/profile",
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
          path: "/product",
          element: (
            <Suspense
              fallback={
                <div className="flex py-10 justify-center items-center">
                  <div className="w-12 h-12 border-4 border-indigo-500 border-dashed rounded-full animate-spin"></div>
                </div>
              }
            >
              <ProductDets />
            </Suspense>
          ),
        },
        {
          path: "/products/:productId",
          element: (
            <Suspense
              fallback={
                <div className="flex py-10 justify-center items-center">
                  <div className="w-12 h-12 border-4 border-indigo-500 border-dashed rounded-full animate-spin"></div>
                </div>
              }
            >
              <ProductDets />
            </Suspense>
          ),
        },
        {
          path: "/filteredprdcts",
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
          path: "/register",
          element: <RegistrationPage />,
        },
        {
          path: "/signin",
          element: <SignInPage />,
        },
        {
          path: "/changepassword",
          element: <ChangePassword />,
        },
        {
          path: "/dashboard",
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
          path: "/addproduct",
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
          <ErrorBoundary fallback={<h1>Something broke!</h1>}>
            <RouterWrapper />
            <ToastContainer />
          </ErrorBoundary>
        </CartProvider>
      </ProductProvider>
    </UserProvider>
  </StrictMode>
);
