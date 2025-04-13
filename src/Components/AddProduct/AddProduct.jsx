import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

function AddProduct() {
  const [product, setProduct] = useState({
    title: "",
    price: 0.0,
    description: "",
    category: "",
    image: null,
    stock: 0,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setProduct({ ...product, image: e.target.files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const payload = {
        title: product.title,
        price: product.price,
        description: product.description,
        category:
          product.category === "other"
            ? product.customCategory
            : product.category,
        stock: product.stock,
        image: product.image,
      };

      const response = await axios.post(
        "https://fakestoreapi.com/products",
        payload
      );
      console.log("Product added:", response.data);

      toast.success("Product Added!", { position: "top-center" });
        setSuccess(true);
      setProduct({
        title: "",
        price: 0.0,
        description: "",
        category: "",
        image: null,
        stock: 0,
        customCategory: "",
      });
    } catch (error) {
      toast.error("Something went wrong while adding the product.", {
        position: "bottom-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add Product</h2>
      {success && (
        <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">
          Product added successfully!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Product Title*</label>
          <input
            type="text"
            name="title"
            value={product.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Price* ($)</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Description*</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            rows="3"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Category*</label>
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select a category</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
            <option value="home">Home & Kitchen</option>
            <option value="other">Other</option>
          </select>
        </div>

        {product.category === "other" && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Custom Category</label>
            <input
              type="text"
              name="customCategory"
              value={product.customCategory}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter custom category"
              required
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Stock Quantity*</label>
          <input
            type="number"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            min="0"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Product Image*</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
            accept="image/*"
            required
          />
          {product.image && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(product.image)}
                alt={product.title}
                className="h-20 object-contain"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}

export default AddProduct;
