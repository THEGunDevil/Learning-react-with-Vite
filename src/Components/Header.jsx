import React, { useContext, useState } from "react";
import SearchBox from "./SearchBox/SearchBox";
import Navigation from "./Navigations/Navigation";
import { NavLink } from "react-router-dom";
import BagBtn from "./BagBtn/BagBtn";
import CartList from "./CartList";
import { FiMenu, FiSearch } from "react-icons/fi";
import DropDownNav from "./DropDownNav/DropDownNav";
import { HiOutlineFilter } from "react-icons/hi";
import Filter from "./Filter/Filter";
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropSearchBox, setDropSearchBox] = useState(false);
  const [dropFilterBox, setDropFilterBox] = useState(false);
  const handleNavDropDwn = () => {
    setIsOpen(!isOpen);
  };
  const handleSearchDropDwn = () => {
    setDropSearchBox(!dropSearchBox);
  };
  const handleFilterDropDwn = () => {
    setDropFilterBox(!dropFilterBox);
  };
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 flex font-secondary items-center xl:px-20 md:px-6 lg:px-20 sm:px-6 px-4 justify-between h-18 shadow-xl w-full bg-white">
        <div className="text-4xl font-extrabold">
          <NavLink to="/">LoGo.</NavLink>
        </div>
        <button
          onClick={handleFilterDropDwn}
          className="h-9 border px-2 absolute right-48 flex sm:hidden justify-center items-center "
        >
          <HiOutlineFilter className="text-amber-500" />
          <span className="ml-1.5">Filter</span>
        </button>
        <button
          className="flex absolute right-20 cursor-pointer bg-gray-50 text-[18px] items-center border rounded-3xl sm:hidden px-3 py-1.5"
          onClick={handleSearchDropDwn}
          aria-label="Toggle menu"
        >
          <FiSearch className="text-xl" />
          &nbsp;Search
        </button>
        
        <section className="flex items-center justify-center space-x-2">
          <div className="border focus-within:border-2 hidden sm:flex sm:w-85 md:flex md:w-100 lg:flex lg:w-100 xl:flex xl:w-120 h-9 items-center p-3 relative">
            <SearchBox />
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
        <DropDownNav />
      </section>
      <section
          className={`fixed top-20 left-0 w-full xl:hidden lg:hidden md:hidden sm:hidden h-12 flex justify-center items-center bg-white transition-all duration-700 ease-in-out z-10 shadow-lg ${
            dropSearchBox
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-full pointer-events-none"
          }`}
        >
          <div className="border focus-within:border-2 flex w-80 h-9 items-center p-3 relative">
            <SearchBox />
          </div>
        </section>
      <section
        className={`fixed top-18 left-0 w-full bg-white transition-all duration-700 ease-in-out z-10 shadow-lg ${
          dropFilterBox ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
        }`}
      >
        <Filter />
      </section>
      <div className="h-15"></div>
    </>
  );
};

export default Header;
