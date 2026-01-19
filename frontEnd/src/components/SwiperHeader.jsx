import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const SwiperHeader = () => {
  const categories = [
    "50% Fashion",
    "10% Perfume",
    "15% Shoes",
    "30% Glasses",
    "22% Watches",
    "5% Jewellery",
  ];

  const slides = [
    {
      id: 1,
      title: "Top fashion collection for",
      highlight: "Women's Trend",
      desc: "Expand your business worldwide in just minutes with tailored currencies, languages, and customer experiences designed for every market.",
      image: "./images/1.jpg",
      button: "Shop Now",
    },
    {
      id: 2,
      title: "Discover the latest styles in",
      highlight: "Men's Fashion",
      desc: "Shop our newest collection of men's wear, featuring modern designs and quality fabrics that elevate your everyday style.",
      image: "./images/2.jpg",
      button: "Explore Now",
    },
  ];

  return (
    <>
      {/* === HERO SECTION === */}
      <div className="relative w-full h-full overflow-hidden bg-[#EFF4F7] before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:h-[50px] before:bg-[url('./images/shape-2.png')] before:bg-top before:bg-no-repeat before:bg-[length:100%_100%] before:rotate-180 before:z-[5] ">

        {/* === BACKGROUND IMAGE === */}
        <div
          className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-15 z-0 "
          style={{
            backgroundImage: "url('./images/imagesforbg.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "37%",
            backgroundPosition: "bottom center",
          }}
        ></div>

        {/* === SLIDER CONTENT === */}
        <div className="relative flex items-center justify-center py-20 z-10 ">
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            className="w-full h-full "
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-between h-full px-8 md:px-16 lg:px-24">
                  
                  {/* LEFT TEXT SECTION */}
                  <div className="flex flex-col justify-center text-left space-y-3 overflow-hidden">
                    {/* Heading */}
                    <motion.h2
                      className="text-4xl md:text-5xl font-normal text-gray-900 leading-tight font-[Quicksand]"
                      initial={{ opacity: 0, y: -40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                      {slide.title}{" "}
                      <span className="text-pink-500 font-bold">{slide.highlight}</span>
                    </motion.h2>

                    {/* Paragraph */}
                    <motion.p
                      className="text-gray-700 text-md max-w-md mt-5 font-[Quicksand]"
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
                    >
                      {slide.desc}
                    </motion.p>

                    {/* Button */}
                    <motion.button
                      className="bg-pink-500 text-white px-5 py-2 rounded-md font-semibold hover:bg-pink-600 transition-all duration-300 w-fit font-[Quicksand]"
                      initial={{ opacity: 0, y: 60 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
                    >
                      {slide.button}
                    </motion.button>
                  </div>

                  {/* RIGHT IMAGE SECTION */}
                  <div>
                    {/* For Medium and Large Screens */}
                    <div className="hidden md:flex relative mt-10 md:mt-0 pl-16">
                      <div className="relative bg-slate-200 w-[400px] h-[430px] rounded-xl"></div>
                      <img
                        src={slide.image}
                        alt={slide.highlight}
                        className="absolute top-[8%] right-[70px] rounded-md shadow-lg w-[320px] md:w-[420px] lg:w-[500px]"
                      />
                    </div>

                    {/* For Mobile Screens */}
                    <div className="flex flex-col md:hidden mt-10">
                      <img
                        src={slide.image}
                        alt={slide.highlight}
                        className="w-full object-cover rounded-md shadow-lg"
                      />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* === CATEGORY MARQUEE === */}
      <div className="border-t-2 border-b-2 w-full mt-5 ">
        <section className="py-6 overflow-hidden relative z-30">
          <div className="flex flex-col gap-3">
            <ul className="flex gap-10 animate-marquee text-black font-medium text-sm whitespace-nowrap">
              {categories.concat(categories).map((item, i) => (
                <li
                  key={`row1-${i}`}
                  className="flex items-center gap-5 font-semibold text-2xl font-[Quicksand] text-gray-500"
                >
                  <Sparkles size={20} strokeWidth={2} className="animate-rotate" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

    </>
  );
};

export default SwiperHeader;
