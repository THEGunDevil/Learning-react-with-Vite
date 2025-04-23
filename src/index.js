import { useContext, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { productContext } from "./Contexts/ProductContext";
export const useUniqueCategories = () => {
  const { products } = useContext(productContext);
  return [...new Set(products?.map((p) => p.category))];
};

export const useHandleFilteredPrdcts = () => {
  const navigate = useNavigate();
  const { products } = useContext(productContext);
  const handleFilteredPrdcts = useCallback((category) => {
    const filtered = products.filter(
      (product) => product.category === category
    );
    localStorage.setItem("filteredProducts", JSON.stringify(filtered));
    navigate("/filteredprdcts", {
      state: { category },
      replace: true,
    });
  }, [products, navigate]);

  return handleFilteredPrdcts;
};
