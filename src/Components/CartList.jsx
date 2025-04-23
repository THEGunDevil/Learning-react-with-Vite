import React, { useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import CheckOutBtn from "./Cart/CheckOutBtn";
import CartListedprdct from "./Cart/CartListedprdct";
import { productContext } from "../Contexts/ProductContext";
import { FaXmark } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";

function CartList() {
  const { listedProducts, setListedPrdcts, cartListActive, setCartListActive } =
    useContext(productContext);

  useEffect(() => {
    const savedCart = localStorage.getItem("listedProducts");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setListedPrdcts(parsedCart);
      } catch (error) {
        console.error("Error parsing cart data:", error);
      }
    }
  }, [setListedPrdcts]);

  const grandTotal =
    listedProducts?.reduce(
      (total, product) =>
        total + (product.productPrice || 0) * (product.quantity || 1),
      0
    ) || 0;

  const handleCloseCartList = () => {
    setCartListActive(false);
  };

  return (
    <section
      aria-modal="true"
      role="dialog"
      aria-label="Shopping cart"
      className={`fixed top-0 right-0 h-screen z-30 flex flex-col bg-gray-800 transition-all duration-300 ease-in-out ${
        cartListActive
          ? "w-full sm:w-120 opacity-100 translate-x-0"
          : "w-0 opacity-0 translate-x-full"
      }`}
    >
      <header className="sticky top-0 bg-gray-800 z-10 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <NavLink
            to="/"
            className="text-2xl font-extrabold text-white hover:text-indigo-300 transition-colors"
            onClick={handleCloseCartList}
          >
            LoGo.
          </NavLink>
          <button
            onClick={handleCloseCartList}
            className="p-2 text-gray-300 hover:text-white transition-colors"
            aria-label="Close cart"
          >
            <FaXmark className="text-xl" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-2 scrollbar-hide">
        {listedProducts?.length > 0 ? (
          <CartListedprdct />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <FaShoppingCart className="text-5xl text-gray-500 mb-4" />
            <h3 className="text-xl font-medium text-gray-300 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-400 mb-6">Start shopping to add items</p>
            <NavLink
              to="/"
              onClick={handleCloseCartList}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
            >
              Browse Products
            </NavLink>
          </div>
        )}
      </main>

      {listedProducts?.length > 0 && (
        <footer className="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-4">
          <div className="grid grid-cols-2 gap-y-2 text-white mb-4">
            <span className="text-gray-300">Items:</span>
            <span className="text-right">{listedProducts.length}</span>
            <span className="text-gray-300">Subtotal:</span>
            <span className="text-right">${grandTotal.toFixed(2)}</span>
            <span className="text-gray-300">Shipping:</span>
            <span className="text-right">Calculated at checkout</span>
          </div>
          <div className="flex flex-col space-y-2">
            <CheckOutBtn />
            <button
              onClick={handleCloseCartList}
              className="w-full text-center text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </footer>
      )}
    </section>
  );
}

export default CartList;