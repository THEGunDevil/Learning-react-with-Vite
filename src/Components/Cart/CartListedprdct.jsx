import React, { useContext } from "react";
import QuantityBtn from "../QuantityBtn/QuantityBtn";
import { productContext } from "../../Contexts/ProductContext";
import { FaXmark } from "react-icons/fa6";
import { truncateText } from "../ProductCards/ProductCards";
export const formatPrice = (price) => {
  if (typeof price !== "number" || isNaN(price)) {
    return "$0.00";
  }
  return `$${price.toFixed(2)}`;
};
function CartListedprdct() {
  const { listedProducts, setListedPrdcts } = useContext(productContext);

  const handleQuantityChange = (productId, newQuantity) => {
    setListedPrdcts((prevProducts) =>
      prevProducts.map((product) =>
        product.productId === productId
          ? { ...product, quantity: Math.max(1, newQuantity) }
          : product
      )
    );
  };

  const removeListedProdct = (productId) => {
    setListedPrdcts((prevProducts) => {
      const updatedProducts = prevProducts.filter(
        (product) => product.productId !== productId
      );
      localStorage.setItem("listedProducts", JSON.stringify(updatedProducts));
      return updatedProducts;
    });
  };

  // Safe price formatting function

  if (!listedProducts || listedProducts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">Your cart is empty</div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {listedProducts.map((product) => {
        if (!product || typeof product !== "object") {
          console.error("Invalid product:", product);
          return null;
        }

        const {
          productId,
          productImg,
          productName,
          productPrice = 0,
          quantity = 1,
        } = product;

        const lineTotal = productPrice * quantity;

        return (
          <div
            key={productId}
            className="relative flex flex-row items-stretch sm:items-center gap-3 px-2 py-3 sm:px-4 sm:py-4 border border-gray-600 rounded-lg hover:bg-gray-800/50 transition-colors duration-200 group"
          >
            {/* Remove button */}
            <button
              onClick={() => removeListedProdct(productId)}
              className="absolute top-1 right-1 sm:top-2 sm:right-2 px-0.5 text-gray-300 hover:text-white transition-colors"
              aria-label={`Remove ${productName} from cart`}
            >
              <FaXmark className="text-lg" />
            </button>

            {/* Product image */}
            <div className="sm:w-20 w-12 sm:h-20 h-12 flex-shrink-0">
              <img
                src={productImg || ""}
                alt={productName || "Product image"}
                className="w-full h-full object-cover rounded"
                loading="lazy"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/80";
                  e.target.alt = "Placeholder image";
                }}
              />
            </div>

            {/* Product info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-[12px] sm:text-base font-medium text-white truncate">
                {truncateText(`${productName || "Unnamed product"}`,40)}
              </h3>
              <p className="text-xs mt-1 sm:text-sm text-gray-300">
                {formatPrice(productPrice)} each
              </p>
            </div>

            {/* Quantity controls */}
            <div className="flex items-center justify-between sm:justify-end gap-4">
              <div className="xl:w-24 lg:w-24 md:w-24 sm:w-24">
                <QuantityBtn
                  counter={quantity}
                  setCounter={(newQuantity) =>
                    handleQuantityChange(productId, newQuantity)
                  }
                  min={1}
                  max={10}
                />
              </div>

              {/* Line total */}
              <div className="xl:w-16 lg:w-16 md:w-16 sm:w-16 text-right">
                <p className="text-sm sm:text-base font-semibold text-white">
                  {formatPrice(lineTotal)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CartListedprdct;
