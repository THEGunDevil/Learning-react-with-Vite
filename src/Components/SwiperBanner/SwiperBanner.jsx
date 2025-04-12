import React, { useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { productContext } from "../Contexts/ProductContext";
import "swiper/css";
import "swiper/css/navigation";

function SwiperBanner() {
  const { products } = useContext(productContext);

  const featuredProducts = products
    .filter((p) => p.rating?.count >= 500)
    .slice(0, 5);
console.log(featuredProducts);

    return (
        <div className="mt-6">
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
                  <div className="h-120 bg-gray-100 flex items-center justify-center">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="h-full object-contain"
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
