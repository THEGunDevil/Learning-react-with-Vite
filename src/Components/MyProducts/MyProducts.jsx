import React, { useContext } from "react";
import { productContext } from "../../Contexts/ProductContext";
import { truncateText } from "../ProductCards/ProductCards";
import { formatPrice } from "../Cart/CartListedprdct";

function MyProducts() {
  const { products } = useContext(productContext);

  return (
    <section className="border-t mt-16 pt-8 grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-8">
      <div>
        <h1 className=" text-2xl">My Products</h1>
        {products?.map((p) => (
          <div
            key={p.id}
            className="flex my-10 items-center shadow justify-between px-4 py-5 hover:bg-gray-200 transition-colors duration-200 rounded-md gap-4 mb-4"
          >
            <img
              src={p.image || "https://via.placeholder.com/150"}
              alt={p.title || "Product Image"}
              className="h-20 w-20 object-cover rounded-md"
            />
            <div className="flex flex-col flex-grow">
              <span className="text-indigo-500 font-bold text-xl">
                {truncateText(p.title, 30)}
              </span>
              <span>{p.stock} in stock</span>
            </div>
            <div className="text-lg font-semibold">{formatPrice(p.price)}</div>
          </div>
        ))}
      </div>

      <div className="h-px w-full bg-gray-300 sm:h-auto sm:w-px sm:mx-4 mx-0 my-4 sm:my-0" />

      <div>
        <h1 className="text-2xl">Recently Added</h1>
        {products?.map((p) => (
          <div
            key={`recent-${p.id}`}
            className="flex my-10 items-center shadow justify-between px-4 py-5 hover:bg-gray-200 transition-colors duration-200 rounded-md gap-4 mb-4"
          >
            <img
              src={p.image || "https://via.placeholder.com/150"}
              alt={p.title || "Product Image"}
              className="h-20 w-20 object-cover rounded-md"
            />
            <div className="flex flex-col flex-grow">
              <span className="text-indigo-500 font-bold text-xl">
                {truncateText(p.title, 30)}
              </span>
              <span>{p.stock} in stock</span>
            </div>
            <div className="text-lg font-semibold">{formatPrice(p.price)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MyProducts;
