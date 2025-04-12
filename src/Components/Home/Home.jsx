import React, { lazy, Suspense, useEffect } from "react";
import "swiper/css";
import "swiper/css/navigation";
import SwiperBanner from "../SwiperBanner/SwiperBanner";
import FetchData from "../Fetchdata/FetchData";
const Home = () => {
  
  const ProductCards = lazy(() => import("../ProductCards/ProductCards"));
  return (
    <>
      <div className="px-6 sm:px-6 md:px-6 lg:px-20 xl:px-20 mt-10">
        <h1 className="text-4xl text-amber-400 font-specific">featured.</h1>
        <SwiperBanner />
      </div>
      <Suspense
        fallback={
          <div className="flex py-10 justify-center items-center">
            <div className="w-12 h-12 border-4 border-indigo-500 border-dashed rounded-full animate-spin"></div>
          </div>
        }
      >
        <ProductCards />
      </Suspense>
    </>
  );
};

export default Home;
