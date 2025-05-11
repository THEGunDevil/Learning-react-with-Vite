import React, { useContext, useState } from "react";
import SearchBox from "./SearchBox/SearchBox";
import Navigation from "./Navigations/Navigation";
import { NavLink, useNavigate } from "react-router-dom";
import BagBtn from "./BagBtn/BagBtn";
import CartList from "./CartList";
import { FiMenu, FiSearch } from "react-icons/fi";
import DropDownNav from "./Navigations/DropDownNav";
import { HiOutlineFilter } from "react-icons/hi";
import Filter from "./Filter/Filter";
import { productContext } from "../Contexts/ProductContext";
import FetchProdctDta from "./FetchData/FetchProdctDta";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropSearchBox, setDropSearchBox] = useState(false);
  const [dropFilterBox, setDropFilterBox] = useState(false);
  const [InputTxt, setInputTxt] = useState("");
  const navigate = useNavigate();
  const { products, setProductDets } = useContext(productContext);
  const handleNavDropDwn = () => {
    setIsOpen(!isOpen);
  };
  const handleSearchDropDwn = () => {
    setDropSearchBox(!dropSearchBox);
  };
  const handleFilterDropDwn = () => {
    setDropFilterBox(!dropFilterBox);
  };
  const filteredData = products.filter((item) =>
    item.title.toLowerCase().includes(InputTxt.toLowerCase())
  );
  const handleProductDetails = async (id) => {
    await FetchProdctDta(id, setProductDets);
    navigate(`/products/${id}`);
    setInputTxt("");
  };
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 flex font-secondary items-center xl:px-20 md:px-6 lg:px-20 sm:px-6 px-4 justify-between h-18 shadow w-full bg-white">
        <div className="text-4xl font-extrabold">
          <NavLink to="/"><img src="Logo/ChatGPT Image May 12, 2025, 12_53_47 AM.png" alt="Logo." className="h-13 w-13 rounded-md" /></NavLink>
        </div>
        <button
          onClick={handleFilterDropDwn}
          className="h-9 absolute right-39 flex sm:hidden justify-center items-center "
        >
          <HiOutlineFilter className="text-amber-500 text-xl" />
        </button>
        <button
          className="flex absolute right-14 cursor-pointer bg-gray-50 items-center border rounded-2xl sm:hidden px-2.5 py-1.5"
          onClick={handleSearchDropDwn}
          aria-label="Toggle menu"
        >
          <FiSearch className="text-xl" />
          &nbsp;Search
        </button>

        <section className="flex items-center justify-center space-x-2">
          <div className="border focus-within:border-2 hidden sm:flex sm:w-85 md:flex md:w-100 lg:flex lg:w-100 xl:flex xl:w-120 h-9 items-center p-3 relative">
            <SearchBox InputTxt={InputTxt} setInputTxt={setInputTxt} />
          </div>

          <button
            onClick={handleFilterDropDwn}
            className="h-9 border px-2 hidden sm:flex justify-center items-center "
          >
            <HiOutlineFilter className="text-amber-500" />
            <span className="ml-1.5">Filter</span>
          </button>
        </section>

        {/* Menu navigation area */}
        <button
          className="block min-[1360px]:hidden p-2 cursor-pointer"
          onClick={handleNavDropDwn}
          aria-label="Toggle menu"
        >
          <FiMenu className="text-2xl" />
        </button>

        <div className="hidden min-[1360px]:flex ">
          <Navigation />
        </div>

        <BagBtn />
        <CartList />
      </nav>

      <section
        className={`fixed top-18 left-0 xl:hidden w-full bg-white transition-all duration-700 ease-in-out z-20 shadow-lg ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
        }`}
      >
        <DropDownNav isOpen={isOpen} setIsOpen={setIsOpen} />
      </section>
      <section
        className={`fixed top-18 left-0 w-full xl:hidden lg:hidden md:hidden sm:hidden h-15 flex justify-center items-center bg-white transition-all duration-700 ease-in-out z-10 shadow-lg ${
          dropSearchBox
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <div className="border focus-within:border-2 flex w-80 h-9 items-center p-3 relative">
          <SearchBox InputTxt={InputTxt} setInputTxt={setInputTxt} />
        </div>
      </section>
      <section
        className={`fixed top-18 left-0 w-full bg-white transition-all duration-700 ease-in-out z-10 shadow-lg ${
          dropFilterBox
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full"
        }`}
      >
        <Filter
          dropFilterBox={dropFilterBox}
          setDropFilterBox={setDropFilterBox}
        />
      </section>
      {InputTxt.length > 0 && (
        <div className="fixed top-35 w-[360px] bg-white xl:top-20 xl:w-4xl lg:top-20 lg:w-3xl md:top-20 md:w-xl sm:top-20 sm:w-md left-1/2 -translate-x-1/2  rounded-md shadow-lg z-2">
          <ul className=" max-h-90 xl:max-h-120 overflow-y-auto grid grid-cols-1 gap-3 p-4 scrollbar-hide">
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <li
                  key={item.id}
                  onClick={() => {
                    handleProductDetails(item.id)
                    setDropSearchBox(false)
                  }}
                  className="h-fit hover:bg-gray-200 transition-colors duration-300 py-1 flex items-center justify-between shadow cursor-pointer px-2"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={item.image}
                      alt={item.title}
                      className=" w-14 h-14 object-contain"
                    />
                    <h3 className="text-[13px] font-semibold text-gray-700 line-clamp-2">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-amber-600 font-bold">${item.price}</p>
                </li>
              ))
            ) : (
              <li className="col-span-full text-center text-gray-400 py-4">
                No results found.
              </li>
            )}
          </ul>
        </div>
      )}

      <div className="h-18"></div>
    </>
  );
};

export default Header;
