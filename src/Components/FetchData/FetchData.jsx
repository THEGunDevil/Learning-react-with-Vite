import React, { useContext, useEffect } from "react";
import { productContext } from "../Contexts/ProductContext";
import axios from "axios";
const FetchData = () => {
  const {setProducts} = useContext(productContext);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://fakestoreapi.com/products");
        setProducts(response.data)
        
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();
  }, []);
};

export default FetchData;
