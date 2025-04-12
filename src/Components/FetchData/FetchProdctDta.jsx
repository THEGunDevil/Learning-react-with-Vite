import React, { useContext, useEffect } from "react";
import { productContext } from "../Contexts/ProductContext";
import axios from "axios";
const FetchProdctDta = async (productId, setProductDets) => {
      try {
        const response = await axios.get(`https://fakestoreapi.com/products/${productId}`);
        setProductDets(response.data)
      } catch (error) {
        console.error("Error fetching products:", error);
  }
  return null
};

export default FetchProdctDta;

