import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Star, Sparkles } from "lucide-react";

const features = [
  {
    name: "Fashion Collection",
    image: "./images/collection1.jpg",
    price: "200",
  },
  {
    name: "Glasses Collection",
    image: "./images/collection2.jpg",
    price: "600",
  },
  {
    name: "Shoes Collection",
    image: "./images/collection3.jpg",
    price: "500",
  },
  {
    name: "Perfume Collection",
    image: "./images/collection4.jpg",
    price: "300",
  },
  {
    name: "Watch Collection",
    image: "./images/collection5.jpg",
    price: "800",
  },
];

const FeatureCollection = () => {
  return (
    <section className="relative bg-[#F7FAFB] py-7 font-[Poppins,sans-serif] overflow-hidden  ">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-10 z-0 "
        style={{
          backgroundImage: "url('./images/shape-1.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "30%",
          backgroundPosition: "bottom center",
        }}
      ></div>

      {/* Section Title */}
      <div className="relative text-center mb-20 z-10 ">
        <p className="text-[#4B9097] font-medium md:text-xl flex justify-center items-center gap-2 ">
          <Sparkles
            size={20}
            strokeWidth={2}
            className="text-gray-500 animate-rotate font-[Quicksand] "
          />{" "}
          Browse The Products
        </p>
        <h2 className="text-2xl md:text-4xl font-semibold text-gray-500 md:mt-2 font-[Quicksand]">
          Our Features Collection
        </h2>
      </div>

      {/* Swiper Wrapper */}
      <div className="relative z-10 px-6 md:px-28 md:-mt-20 -mt-16 ">
        <Swiper
          modules={[Pagination]}
          spaceBetween={30}
          grabCursor={true}
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 20 },
            640: { slidesPerView: 2, spaceBetween: 25 },
            1024: { slidesPerView: 4, spaceBetween: 30 }, 
          }}
          className=" pt-[25%] md:pt-[10%] "
        >
          {features.map((item, i) => (
            <SwiperSlide key={i}>
              <div className="relative bg-white border border-dashed border-[#b6dfe3] rounded-2xl text-center shadow-[0_4px_20px_rgba(0,0,0,0.05)] pt-20 pb-6 ">
                {/* Floating Image */}
                <div className="absolute left-1/2 -top-[80%] translate-y-1/2 -translate-x-1/2 w-[400px] md:w-[250px] h-[250px] overflow-hidden rounded-xl shadow-lg bg-white">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 rounded-xl"
                  />
                </div>

                {/*  Card Content */}
                <div className="mt-[90px]">
                  <h3 className="text-xl font-semibold text-gray-700 mb-2 font-[Quicksand]">
                    {item.name}
                  </h3>
                  <div className="flex justify-center mb-3">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        size={18}
                        className="text-[#4B9097] fill-[#4B9097]"
                      />
                    ))}
                  </div>
                  <p className="text-gray-500 text-sm">
                    Starts From:{" "}
                    <span className="text-gray-800 font-semibold">
                      ₹ {item.price}
                    </span>
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        
      </div>
      
    </section>
  );
};

export default FeatureCollection;
