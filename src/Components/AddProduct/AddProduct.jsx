import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { db, storage } from "../../Firebase";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  const auth = getAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [product, setProduct] = useState({
    title: "",
    price: 0.0,
    description: "",
    category: "",
    image: null,
    stock: 0,
    customCategory: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: name === "stock" ? parseInt(value) : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setProduct((prev) => ({ ...prev, image: e.target.files[0] }));
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!product.title.trim()) newErrors.title = "Product title is required";
    if (!product.price || product.price <= 0) newErrors.price = "Price must be greater than 0";
    if (!product.description.trim()) newErrors.description = "Description is required";
    if (!product.category) newErrors.category = "Category is required";
    if (product.category === "other" && !product.customCategory.trim()) {
      newErrors.customCategory = "Custom category is required";
    }
    if (!product.image) newErrors.image = "Product image is required";
    if (product.stock < 0) newErrors.stock = "Stock must be 0 or greater";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly.", { position: "bottom-center" });
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      toast.error("You must be signed in to add a product.", { position: "bottom-center" });
      navigate("/signin");
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      let imageUrl = "";

      if (product.image) {
        const imageRef = ref(storage, `product-images/${Date.now()}-${product.image.name}`);
        await uploadBytes(imageRef, product.image);
        imageUrl = await getDownloadURL(imageRef); // ✅ No CORS issue here
      }

      const payload = {
        title: product.title.trim(),
        price: parseFloat(product.price),
        description: product.description.trim(),
        category: product.category === "other" ? product.customCategory.trim() : product.category,
        stock: parseInt(product.stock),
        image: imageUrl,
        userId: user.uid,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "products"), payload);

      toast.success("Product added successfully!", { position: "top-center" });
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
      setErrors({});
      fileInputRef.current.value = "";
    } catch (error) {
      if (error.code === "storage/unauthorized") {
        toast.error("You don't have permission to upload images. Check storage rules.", {
          position: "bottom-center",
        });
      } else {
        toast.error(`Failed to add product: ${error.message}`, { position: "bottom-center" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add Product</h2>
      {success && (
        <div className="mb-4 p-2 bg-green-100 text-green-800 rounded" role="alert">
          Product added successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="title" className="block text-gray-700 mb-2">Title*</label>
          <input
            type="text"
            id="title"
            name="title"
            value={product.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            disabled={loading}
          />
          {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="price" className="block text-gray-700 mb-2">Price*</label>
          <input
            type="number"
            id="price"
            name="price"
            value={product.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full p-2 border rounded"
            required
            disabled={loading}
          />
          {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-gray-700 mb-2">Description*</label>
          <textarea
            id="description"
            name="description"
            value={product.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="3"
            required
            disabled={loading}
          ></textarea>
          {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
        </div>

        <div>
          <label htmlFor="category" className="block text-gray-700 mb-2">Category*</label>
          <select
            id="category"
            name="category"
            value={product.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            disabled={loading}
          >
            <option value="">Select a category</option>
            <option value="electronics">Electronics</option>
            <option value="fashion">Fashion</option>
            <option value="home">Home</option>
            <option value="other">Other</option>
          </select>
          {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
        </div>

        {product.category === "other" && (
          <div>
            <label htmlFor="customCategory" className="block text-gray-700 mb-2">Custom Category*</label>
            <input
              type="text"
              id="customCategory"
              name="customCategory"
              value={product.customCategory}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              disabled={loading}
            />
            {errors.customCategory && <p className="text-sm text-red-500 mt-1">{errors.customCategory}</p>}
          </div>
        )}

        <div>
          <label htmlFor="stock" className="block text-gray-700 mb-2">Stock*</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            min="0"
            className="w-full p-2 border rounded"
            required
            disabled={loading}
          />
          {errors.stock && <p className="text-sm text-red-500 mt-1">{errors.stock}</p>}
        </div>

        <div>
          <label htmlFor="image" className="block text-gray-700 mb-2">Product Image*</label>
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
            accept="image/*"
            ref={fileInputRef}
            required
            disabled={loading}
          />
          {product.image && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(product.image)}
                alt={product.title || "Product preview"}
                className="h-20 object-contain"
              />
            </div>
          )}
          {errors.image && <p className="text-sm text-red-500 mt-1">{errors.image}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
        >
          {loading ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}

export default AddProduct;
