import React from "react";
import "swiper/css";
import "swiper/css/navigation";
import SwiperBanner from "../SwiperBanner/SwiperBanner";
import ProductCards from "../ProductCards/ProductCards";
import FilteredSlides from "../ProductCards/FilteredSlides";
import Category from "../Category/Category";

const Home = () => {
  return (
    <>
      <div className="px-6 sm:px-6 md:px-6 lg:px-20 xl:px-20 mt-10">
        <h1 className="text-4xl text-amber-400 font-specific">featured.</h1>
        <SwiperBanner />
      </div>
      <FilteredSlides category={"women's clothing"} title={"Women's Clothing"}/>
      <FilteredSlides category={"men's clothing"} title={"Men's Clothing"} />
      <Category/>
      <ProductCards />
      
    </>
  );
};

export default Home;
