import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "animate.css";
import { CiHeart } from "react-icons/ci";
import FeatureHomeProducts from "./FeatureHomeProduct";

const FeatureProduct = () => {
  const data = [
    {
      id: 1,
      image: "./images/imageswipe.jpg",
      caption: "Women's Fashion 15% Off",
    },
    {
      id: 2,
      image: "./images/imageswipe1.jpg",
      caption: "Men's Fashion 15% Off",
    },
    {
      id: 3,
      image: "./images/imageswipe2.jpg",
      caption: "Kid's Fashion 15% Off",
    },
    {
      id: 4,
      image: "./images/imageswipe2.jpg",
      caption: "Kid's Fashion 15% Off",
    },
  ];

  return (
    <div className=" md:py-10 w-full h-full pt-0 md:pt-5 overflow-hidden ">
   
      <div className="relative h-[500px] ">
        <div className="bg-[#EFF4F7] h-[250px] px-2 md:px-28 ">
        <Swiper
  modules={[Pagination]}
  spaceBetween={30}
  slidesPerView={3}
  slidesPerGroup={1}
  grabCursor={true}
  centeredSlides={false}
  breakpoints={{
    0: { slidesPerView: 1, spaceBetween: 10 },
    640: { slidesPerView: 2, spaceBetween: 20 },
    1024: { slidesPerView: 3, spaceBetween: 30 },
  }}
  className="w-full overflow-hidden px-2 md:px-0 "
>
  {data.map((item) => (
    <SwiperSlide key={item.id}>
      <div className="relative group bg-white rounded-2xl shadow-lg overflow-hidden mt-12 md:mt-24 ">
        {/*  Heart Button */}
        <button className="absolute top-2 right-2 md:top-3 md:right-3 bg-white rounded-full text-[#2D8C91] font-semibold p-2 md:p-3 shadow transition-all z-10 border-2 border-dotted border-[#2d8c91] hover:bg-[#2D8C91] hover:text-white">
          <CiHeart className="font-bold w-4 h-4 md:w-5 md:h-5" />
        </button>

        {/* Image Section */}
        <div className="relative w-full h-56 sm:h-64 md:h-80 overflow-hidden">
          <img
            src={item.image}
            alt={item.caption}
            className="w-full h-full object-cover transition-transform duration-[3000ms] ease-in-out group-hover:animate__animated group-hover:animate__headShake"
          />

          {/* Shop Now Button */}
          <button className="absolute top-2 left-2 md:top-3 md:left-3 bg-white text-[#2D8C91] px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm font-semibold rounded-md hover:bg-[#2D8C91] hover:text-white z-10 border-2 border-dotted border-[#2d8c91]">
            Shop Now
          </button>

          {/* Caption Box */}
          <div className="absolute bottom-3 left-3 w-[60%] md:w-1/2 bg-white py-2 md:py-2 px-1 text-center rounded-md shadow-inner">
            <p className="text-[16px] sm:text-[18px] md:text-[25px] font-semibold text-black tracking-wide leading-none font-[Quicksand]">
              {item.caption}
            </p>
          </div>
        </div>
      </div>
    </SwiperSlide>
  ))}
</Swiper>

          
        </div>
      </div>

      <FeatureHomeProducts/>
    </div>
  );
};

export default FeatureProduct;
