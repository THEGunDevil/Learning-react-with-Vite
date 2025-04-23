import React, { useContext, useEffect, useState } from "react";
import StarRatings from "react-star-ratings";
import { useNavigate, useLocation } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { productContext } from "../Contexts/ProductContext";
import FetchProdctDta from "./FetchData/FetchProdctDta";
const FilteredProducts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    filteredProducts,
    setFilteredProducts,
    setProductDets,
    setListedPrdcts,
    products,
  } = useContext(productContext);

  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 10;

  useEffect(() => {
    if (location.state?.category) {
      const filtered = products.filter(
        (product) => product.category === location.state.category
      );
      setFilteredProducts(filtered);
    }
  }, [location.state?.category, products, setFilteredProducts]);

  const truncateText = (string, maxLength) => {
    if (!string) return "";
    return string.length <= maxLength
      ? string
      : `${string.slice(0, maxLength)}...`;
  };

  const handleProductDetails = async (id) => {
    await FetchProdctDta(id, setProductDets);
    navigate(`/products/${id}`);
  };

  const pageCount = Math.ceil(filteredProducts.length / productsPerPage);
  const offset = currentPage * productsPerPage;
  const currentProducts = filteredProducts.slice(
    offset,
    offset + productsPerPage
  );

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const [counter] = useState(1);

  const handleAddtoCartBtn = (product, e) => {
    e.stopPropagation();

    if (!product) return;

    setListedPrdcts((prevProducts) => {
      const existingProduct = prevProducts.find(
        (p) => p.productId === product.id
      );

      let updatedProducts;

      if (existingProduct) {
        updatedProducts = prevProducts.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + counter }
            : item
        );
      } else {
        updatedProducts = [
          ...prevProducts,
          {
            ...product,
            productId: product.id,
            productImg: product.image,
            productName: product.title,
            productPrice: product.price,
            quantity: counter,
          },
        ];
      }

      localStorage.setItem("listedProducts", JSON.stringify(updatedProducts));
      return updatedProducts;
    });
  };

  return (
    <div className="relative">
      <div className="xl:px-20 md:px-6 lg:px-20 sm:px-6 px-4 py-4 bg-gray-50 border-b">
        <h2 className="text-xl font-semibold text-gray-800">
          {location.state?.category
            ? `Category: ${location.state.category}`
            : "All Products"}
        </h2>
        <p className="text-gray-600">
          Showing {filteredProducts.length} products
        </p>
      </div>

      <div className="grid xl:px-20 md:px-6 lg:px-20 sm:px-6 px-4 relative xl:pt-10 lg:pt-10 md:pt-10 sm:pt-5 pt-5 pb-16 grid-cols-2 place-items-center sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-8">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <div
              key={product.id}
              className="group xl:w-full lg:w-full md:w-full sm:w-full w-40 bg-white xl:rounded-xl lg:rounded-xl md:rounded-xl rounded shadow-sm hover:shadow-md border border-gray-100 overflow-hidden transition-all duration-300 ease-in-out flex flex-col hover:-translate-y-1"
            >
              <div
                className="h-24 xl:h-64 lg:h-55 md:h-44 xl:p-5 lg:p-5 md:p-5 sm:p-5 p-2 flex items-center justify-center bg-gray-50 relative cursor-pointer"
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
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 xl:h-5 lg:h-5 md:h-5 sm:h-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                <span className="text-[12px] xl:text-xl lg:text-xl md:text-xl">
                  Add to Cart
                </span>
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <h3 className="text-xl font-medium text-gray-700">
              No products found
            </h3>
            <p className="text-gray-500 mt-2">Try a different category</p>
          </div>
        )}
      </div>

      {filteredProducts.length > productsPerPage && (
        <div className="w-full absolute bottom-3.5 left-1/2 -translate-x-1/2 flex justify-center">
          <ReactPaginate
            previousLabel={<FaChevronLeft />}
            nextLabel={<FaChevronRight />}
            breakLabel="..."
            pageCount={pageCount}
            onPageChange={handlePageClick}
            containerClassName="flex items-center space-x-2 w-fit"
            pageClassName="flex items-center cursor-pointer justify-center w-8 h-8 rounded-full border"
            pageLinkClassName="w-full h-full flex items-center justify-center"
            activeClassName="bg-amber-500 cursor-pointer text-white border-amber-500"
            previousClassName="p-2 rounded-full border cursor-pointer"
            nextClassName="p-2 rounded-full border cursor-pointer"
            disabledClassName="opacity-50 cursor-pointer"
            breakClassName="px-2"
            marginPagesDisplayed={1}
            pageRangeDisplayed={3}
          />
        </div>
      )}
    </div>
  );
};

export default FilteredProducts;
