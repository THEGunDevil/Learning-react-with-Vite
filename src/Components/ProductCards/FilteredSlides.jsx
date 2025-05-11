import  { useContext, useEffect, useState, useRef } from "react";
import { productContext } from "../../Contexts/ProductContext";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import StarRatings from "react-star-ratings";
import { truncateText } from "./ProductCards";
import FetchProdctDta from "../FetchData/FetchProdctDta";

function FilteredSlides({ category, title }) {
  const { products, setProductDets, setListedPrdcts } = useContext(productContext);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();
  const swiperRef = useRef(null);

  const handleProductDetails = async (id) => {
    await FetchProdctDta(id, setProductDets);
    navigate(`/products/${id}`);
  };

  useEffect(() => {
    if (category && products?.length) {
      const filtered = products.filter((product) => product.category === category);
      setFilteredProducts((prev) =>
        JSON.stringify(prev) !== JSON.stringify(filtered) ? filtered : prev
      );
    } else {
      setFilteredProducts([]);
    }
  }, [category, products]);

  useEffect(() => {
    return () => {
      if (swiperRef.current && swiperRef.current.destroy) {
        swiperRef.current.destroy(true, true);
      }
    };
  }, []);

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
    <div className="px-6 sm:px-6 md:px-6 lg:px-20 xl:px-20 mt-5 sm:mt-5 md:mt-10 lg:mt-10 xl:mt-10">
      <h1 className="text-4xl text-amber-400 font-specific">{title}</h1>
      {filteredProducts.length > 0 ? (
        <Swiper
          spaceBetween={30}
          slidesPerView={2.7}
          breakpoints={{
            370: { slidesPerView: 2.8 },
            420: { slidesPerView: 3 },
            560: { slidesPerView: 4 },
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          modules={[Navigation]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          className="mt-5"
        >
          {filteredProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="group xl:w-full lg:w-full md:w-full sm:w-full w-30 bg-white xl:rounded-xl lg:rounded-xl md:rounded-xl rounded shadow-sm hover:shadow-md border border-gray-100 overflow-hidden transition-all duration-300 ease-in-out flex flex-col hover:-translate-y-1">
                <div
                  className="w-full h-24 xl:h-64 lg:h-55 md:h-44 xl:p-5 lg:p-5 md:p-5 sm:p-5 p-2 flex items-center justify-center bg-gray-50 relative cursor-pointer"
                  onClick={() => handleProductDetails(product.id)}
                >
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

                <div className="xl:p-5 lg:p-5 md:p-5 p-3 xl:pt-4 lg:pt-4 md:pt-4 flex-grow flex flex-col">
                  <div className="mb-1.5 xl:mb-3 lg:mb-3 md:mb-3 sm:mb-3">
                    <h3 className="text-[11px] xl:text-lg md:text-lg lg:text-lg sm:text-[11px] font-medium text-gray-900 leading-snug">
                      {truncateText(product.title, 25)}
                    </h3>
                    <p className="text-sm text-gray-500 hidden xl:block mt-1 line-clamp-2">
                      {truncateText(product.description, 50)}
                    </p>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-center justify-between xl:mb-3 lg:mb-3 md:mb-3">
                      <div className="xl:flex sm:hidden hidden items-center">
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
                      <span className="xl:text-xl lg:text-xl md:text-xl sm:text-[14px] text-[14px] font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>

                    <div className="items-center text-sm text-gray-500 xl:mb-4 hidden xl:flex lg:flex md:flex sm:hidden">
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
                  className="relative cursor-pointer w-full group bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white font-medium xl:py-3.5 lg:py-3.5 md:py-3.5 sm:py-1.5 py-1 transition-all duration-300 flex items-center justify-center gap-1"
                  onClick={(e) => handleAddtoCartBtn(product, e)}
                >
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                  <svg
                    xmlns="http://www.w3.orgovernance/2000/svg"
                    className="h-3.5 xl:h-5 lg:h-5 md:h-5 sm:h-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                  <span className="text-[12px] xl:text-xl lg:text-xl md:text-xl">Add to Cart</span>
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