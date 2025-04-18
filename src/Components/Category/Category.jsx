import React from "react";
import { useHandleFilteredPrdcts, useUniqueCategories } from "../..";

function Category() {
  const uniqueCategories = useUniqueCategories();
  const handleFilteredPrdcts = useHandleFilteredPrdcts();

  // Map categories to actual image URLs (replace with your own):
  const categoryImages = {
    electronics: "/images/categories/electronics.jpg",
    books: "/images/categories/books.jpg",
    // …
  };

  return (
    <>
      <h1 className="text-4xl text-amber-400 px-6 py-16 font-specific xl:px-20 lg:px-20">Category</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-20">
        {uniqueCategories.map((category) => (
          <button
            key={category}
            onClick={() => handleFilteredPrdcts(category)}
            className="group relative block overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-left focus:outline-none"
          >
            <div className="aspect-w-4 aspect-h-3">
              <img
                src={
                  categoryImages[category] || "/images/categories/default.jpg"
                }
                alt={category}
                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
              <h3 className="text-xl uppercase font-bold text-white drop-shadow-md">
                {category}
              </h3>
              <span className="inline-block mt-2 px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-full">
                Shop Now
              </span>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

export default Category;
