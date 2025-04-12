import React, { useContext, useMemo, useState } from "react";
import { FaHeart } from "react-icons/fa6";
import StarRatings from "react-star-ratings";
import QuantityBtn from "./QuantityBtn/QuantityBtn";
import { productContext } from "./Contexts/ProductContext";
const Cart = () => {
  const { productDets, setListedPrdcts } = useContext(productContext);
  const handleAddtoCartBtn = () => {
    if (!productData) return;

    setListedPrdcts((prevProducts) => {
      const existingProduct = prevProducts.find(
        (p) => p.productId === productData.productId
      );

      let updatedProducts;

      if (existingProduct) {
        updatedProducts = prevProducts.map((product) =>
          product.productId === productData.productId
            ? { ...product, quantity: product.quantity + counter }
            : product
        );
      } else {
        updatedProducts = [
          ...prevProducts,
          { ...productData, quantity: counter },
        ];
      }

      localStorage.setItem("listedProducts", JSON.stringify(updatedProducts));
      return updatedProducts;
    });
  };
  const productData = useMemo(() => {
    if (!productDets) return {};
    return {
      productImg: productDets.image,
      productName: productDets.title,
      productDes: productDets.description,
      productRating: productDets?.rating?.rate,
      productPrice: productDets.price,
      productId: productDets.id,
    };
  }, [productDets]);

  const [counter, setCounter] = useState(1);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-1/2 flex justify-center bg-white p-8 rounded-xl shadow-lg">
          <img
            src={productData.productImg}
            alt={productData.productName}
            className="max-h-96 object-contain"
          />
        </div>

        <div className="lg:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {productData.productName}
            </h1>
            <p className="text-gray-600 text-lg mb-6">
              {productData.productDes}
            </p>

            <div className="flex items-center mb-6">
              <StarRatings
                rating={productData.productRating}
                starDimension="24px"
                starSpacing="2px"
                starRatedColor="#f59e0b"
                starEmptyColor="#d1d5db"
              />
              <button className="ml-4 text-pink-500 hover:text-pink-600 transition-colors">
                <FaHeart className="text-2xl" />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <QuantityBtn counter={counter} setCounter={setCounter} />
              <div className="text-3xl font-bold text-green-600">
                ${productData.productPrice?.toFixed(2)}
              </div>
            </div>

            <button
              onClick={handleAddtoCartBtn}
              className="w-full py-4 bg-amber-400 hover:bg-amber-500 text-white font-bold text-lg rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <hr className="my-12 border-gray-200" />
    </div>
  );
};

export default Cart;
