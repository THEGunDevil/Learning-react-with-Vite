import React, { useContext } from "react";
import { productContext } from "../Contexts/ProductContext";
import { useNavigate } from "react-router-dom";
import FetchData from "../FetchData/FetchData";
function Filter() {
  FetchData();

  const { products } = useContext(productContext);
  const navigate = useNavigate();

  const uniqueCategories = [...new Set(products?.map((p) => p.category))];

  const handleFilteredPrdcts = (category) => {
    const filtered = products.filter(
      (product) => product.category === category
    );
    localStorage.setItem("filteredProducts", JSON.stringify(filtered));
    navigate("/filteredprdcts", {
      state: { category },
      replace: true,
    });
  };

  return (
    <div className="xl:px-20 lg:px-20 p-4">
      {uniqueCategories?.map((category) => (
        <span
          key={category}
          onClick={() => handleFilteredPrdcts(category)}
          className="
            inline-block 
            px-4 py-1.5
             
            mr-3 mb-3 
            bg-gray-50 
            rounded-full 
            cursor-pointer 
            border border-gray-200
            text-gray-700
            transition-all 
            duration-300 
            ease-in-out
            hover:bg-indigo-50 
            hover:text-indigo-600
            hover:border-indigo-300
            hover:shadow-sm
            active:bg-indigo-100
            active:scale-95
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-indigo-400
            focus-visible:ring-offset-2
          "
        >
          {category}
        </span>
      ))}
    </div>
  );
}

export default Filter;
