import React, { useState } from "react";
import {  FaXmark } from "react-icons/fa6";

const SearchBox = () => {
  const [InputTxt, setInputTxt] = useState("");
  
  const handleCancelBtn = (e) => {
    e.preventDefault();
    setInputTxt("");
  };
  
  const handleSearchBox = (e) => {
    setInputTxt(e.target.value);
  };

  return (
    <>
      <input
        type="search"
        placeholder="Search here.."
        id="Search"
        value={InputTxt}
        className="md:w-75 sm:w-62 lg:w-75 xl:w-95 outline-0 no-cancel-btn pr-8"
        onChange={handleSearchBox}
      />
      

      <button
        onClick={handleCancelBtn}
        className={`absolute right-16 h-7 border-l cursor-pointer w-8 flex items-center justify-center
          transition-all duration-300 ease-in-out
          ${InputTxt.length > 0 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6 pointer-events-none"}`}
      >
        <FaXmark className="text-xl" />
      </button>
      
      <label
        htmlFor="Search"
        className="absolute right-0 cursor-pointer border-l h-7 w-16 flex items-center justify-center ml-2"
      >
        Search
      </label>
    </>
  );
};

export default SearchBox;