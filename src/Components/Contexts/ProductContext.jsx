import React, { createContext, useEffect, useState } from "react";
export const productContext = createContext();
const ProductProvider = ({ children }) => {
  const [cartListActive, setCartListActive] = useState(false);
  const [listedProducts, setListedPrdcts] = useState(() => {
    try {
      const saved = localStorage.getItem("listedProducts");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error parsing listedProducts", error);
      return [];
    }
  });
  const [productId, setProductId] = useState([]);
  const [products, setProducts] = useState([]);
  const [productDets, setProductDets] = useState(() => {
    const stored = localStorage.getItem("productDets");
    return stored ? JSON.parse(stored) : {};
  });

  useEffect(() => {
    if (productDets && Object.keys(productDets).length !== 0) {
      localStorage.setItem("productDets", JSON.stringify(productDets));
    }
  }, [productDets]);
  useEffect(() => {
    try {
      localStorage.setItem("listedProducts", JSON.stringify(listedProducts));
    } catch (error) {
      console.error("Error saving to localStorage", error);
    }
  }, [listedProducts]);

  const [filteredProducts, setFilteredProducts] = useState([]);
  return (
    <productContext.Provider
      value={{
        products,
        setProducts,
        productId,
        setProductId,
        productDets,
        setProductDets,
        listedProducts,
        setListedPrdcts,
        cartListActive,
        setCartListActive,
        filteredProducts,
        setFilteredProducts,
      }}
    >
      {children}
    </productContext.Provider>
  );
};

export default ProductProvider;
