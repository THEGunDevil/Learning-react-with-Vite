import React from "react";
import FetchData from "../FetchData/FetchData";
import { useHandleFilteredPrdcts, useUniqueCategories } from "../..";
function Filter({ dropFilterBox, setDropFilterBox }) {
  FetchData();

  const uniqueCategories = useUniqueCategories();
  const handleFilteredPrdcts = useHandleFilteredPrdcts();

  return (
    <div className="xl:px-20 lg:px-20 p-4">
      {uniqueCategories?.map((category) => (
        <span
          key={category}
          onClick={() => {
            handleFilteredPrdcts(category);
            setDropFilterBox(false);
          }}
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
