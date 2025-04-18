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
    navigate(`/cart/${id}`);
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
      <div className="px-6 py-4 bg-gray-50 border-b">
        <h2 className="text-xl font-semibold text-gray-800">
          {location.state?.category
            ? `Category: ${location.state.category}`
            : "All Products"}
        </h2>
        <p className="text-gray-600">
          Showing {filteredProducts.length} products
        </p>
      </div>

      <div className="grid px-6 py-16 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:p-20 xl:grid-cols-4 xl:p-20 gap-8">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden transition-all duration-300 ease-in-out h-full flex flex-col hover:-translate-y-1"
              onClick={() => handleProductDetails(product.id)}
            >
              {" "}
              <div className="w-full h-64 p-5 flex items-center justify-center bg-gray-50 overflow-hidden relative">
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
                className="relative cursor-pointer w-full group bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white font-medium py-3.5 px-4 rounded-lg overflow-hidden transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-500/30"
                onClick={(e) => {
                  handleAddtoCartBtn(product, e);
                }}
              >
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>

                <span className="relative group-hover:scale-110 transition-transform duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                </span>

                <span className="relative transform group-hover:-translate-y-0.5 transition-transform duration-300">
                  Add to Cart
                </span>

                <span className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-amber-300/30 group-active:border-amber-300/50 transition-all duration-300"></span>
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
