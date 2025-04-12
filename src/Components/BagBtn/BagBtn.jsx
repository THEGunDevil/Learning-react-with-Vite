import React, { useContext, useState } from "react";
import { FaBagShopping } from "react-icons/fa6";
import { productContext } from "../Contexts/ProductContext";
function BagBtn() {
  const { listedProducts } = useContext(productContext);
  const { cartListActive, setCartListActive } = useContext(productContext);
  const handleCartListSec = () => {
    setCartListActive(!cartListActive);
  };
  return (
    <div
      onClick={handleCartListSec}
      className={
        cartListActive
          ? `hidden`
          : `fixed bottom-10 cursor-pointer right-10 z-20`
      }
    >
      <div className="relative">
        <div
          className={
            listedProducts.length > 0
              ? `text-[35px] text-blue-400 bg-white p-4 rounded-full shadow animate-glow-pulse`
              : `text-[35px] text-blue-400 bg-white p-4 rounded-full shadow`
          }
        >
          <FaBagShopping />
        </div>
      </div>
      <style>{`
  @keyframes glow-pulse {
    0% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(96, 165, 250, 0.7);
    }
    70% {
      transform: scale(1.02);
      box-shadow: 0 0 0 10px rgba(96, 165, 250, 0);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(96, 165, 250, 0);
    }
  }
  @keyframes glow-pulse-hover {
    0% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
    }
    70% {
      transform: scale(1.02);
      box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
    }
  }
  .animate-glow-pulse {
    animation: glow-pulse 1.4s infinite cubic-bezier(0.4, 0, 0.6, 1);
  }
  .animate-glow-pulse:hover {
    animation: glow-pulse-hover 1.4s infinite cubic-bezier(0.4, 0, 0.6, 1);
  }
`}</style>
    </div>
  );
}
export default BagBtn;
