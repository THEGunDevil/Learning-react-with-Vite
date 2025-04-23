import React, { useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { productContext } from "../../Contexts/ProductContext";
import "swiper/css";
import "swiper/css/navigation";
import { useNavigate } from "react-router-dom";
import FetchProdctDta from "../FetchData/FetchProdctDta";

function SwiperBanner() {
  const { products, setProductDets } = useContext(productContext);
  const navigate = useNavigate();
  
  const featuredProducts = products
    .filter((p) => p.rating?.count >= 500)
    .slice(0, 5);

  const handleProductDetails = async (id) => {
    await FetchProdctDta(id, setProductDets);
    navigate(`/products/${id}`);
  };


  return (
    <div className="mt-5">
      {featuredProducts.length > 0 && (
        <Swiper
          speed={1000}
          spaceBetween={10}
          slidesPerView={1}
          modules={[Navigation, Autoplay]}
          navigation
          loop
          autoplay={{ delay: 3000 }}
          className="rounded-xl overflow-hidden"
        >
          {featuredProducts.map((p) => (
            <SwiperSlide key={p.id}>
              <div 
                className="h-70 sm:h-80 md:h-95 lg:h-110 xl:h-120 bg-gray-100 flex items-center justify-center cursor-pointer"
                onClick={() => handleProductDetails(p.id)}
              >
                <img
                  src={p.image}
                  alt={p.title}
                  className="h-full object-contain transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}

export default SwiperBanner;