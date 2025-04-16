import React, { useContext, useEffect, useState } from "react";
import { productContext } from "../Contexts/ProductContext";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import StarRatings from "react-star-ratings";
import { truncateText } from "./ProductCards";
import FetchProdctDta from "../FetchData/FetchProdctDta";

function FilteredSlides({ category, title }) {
  const { products, setProductDets, setListedPrdcts } =
    useContext(productContext);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();
  const handleProductDetails = async (id) => {
    await FetchProdctDta(id, setProductDets);
    navigate(`/cart/${id}`);
  };
  useEffect(() => {
    if (category && products?.length) {
      const filtered = products.filter(
        (product) => product.category === category
      );
      setFilteredProducts(filtered);
    }
  }, [category, products]);

  const handleAddtoCartBtn = (product, e) => {
    e.stopPropagation();
    setListedPrdcts((prevProducts) => {
      const existing = prevProducts.find((p) => p.productId === product.id);
      const updated = existing
        ? prevProducts.map((p) =>
            p.productId === product.id ? { ...p, quantity: p.quantity + 1 } : p
          )
        : [
            ...prevProducts,
            {
              ...product,
              productId: product.id,
              productImg: product.image,
              productName: product.title,
              productPrice: product.price,
              quantity: 1,
            },
          ];
      localStorage.setItem("listedProducts", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="px-6 sm:px-6 md:px-6 lg:px-20 xl:px-20 mt-10">
      <h1 className="text-4xl text-amber-400 font-specific">{title}</h1>
      {filteredProducts.length > 0 ? (
        <Swiper
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          modules={[Navigation]}
          navigation
          loop
          className="rounded-xl mt-6"
        >
          {filteredProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="group bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden transition-all duration-300 ease-in-out flex flex-col hover:-translate-y-1 mx-2">
                <div
                  className="w-full h-64 p-5 flex items-center justify-center bg-gray-50 relative cursor-pointer"
                  onClick={() => handleProductDetails(product.id)}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/10 z-10"></div>
                  <img
                    className="h-full object-contain transition-transform duration-500 group-hover:scale-105 mix-blend-multiply"
                    src={product.image}
                    alt={product.title}
                    loading="lazy"
                  />
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-medium px-2.5 py-1 rounded-full shadow-sm z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Quick View
                  </span>
                </div>

                <div className="p-5 pt-4 flex-grow flex flex-col">
                  <div className="mb-3">
                    <h3 className="text-lg font-medium text-gray-900 leading-snug">
                      {truncateText(product.title, 50)}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {truncateText(product.description, 80)}
                    </p>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <StarRatings
                          rating={product.rating?.rate || 0}
                          starDimension="16px"
                          starSpacing="1px"
                          starRatedColor="#f59e0b"
                          starEmptyColor="#d1d5db"
                        />
                        <span className="text-xs text-gray-500 ml-1.5">
                          ({product.rating?.count || 0})
                        </span>
                      </div>
                      <span className="text-xl font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <span
                        className={`w-2 h-2 rounded-full mr-2 ${
                          product.rating?.count > 0
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></span>
                      {product.rating?.count > 0 ? "In Stock" : "Out of Stock"}
                    </div>
                  </div>
                </div>

                <button
                  className="relative w-full group bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white font-medium py-3.5 px-4 transition-all duration-300 flex items-center justify-center gap-2"
                  onClick={(e) => handleAddtoCartBtn(product, e)}
                >
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                  <span>Add to Cart</span>
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="h-96 bg-gray-100 flex items-center justify-center rounded-xl">
          <p className="text-gray-500">No products found in this category</p>
        </div>
      )}
    </div>
  );
}

export default FilteredSlides;
