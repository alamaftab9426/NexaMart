import { Sparkles } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import 'animate.css';
import { useNavigate } from "react-router-dom";

const categories = [
  { name: "Shirts", image: "/images/Shirts.jpg" },
  { name: "Watches", image: "/images/Watch.jpg" },
  { name: "Gowns", image: "/images/blue.jpg" },
  { name: "Glasses", image: "/images/Glass.jpg" },
  { name: "Caps", image: "/images/Caps.jpg" },
  { name: "Shoes", image: "/images/Shoes.jpg" },
];

// Animation Variants
const sectionVariants = {
  hidden: { opacity: 0, y: 100 }, 
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,     
      ease: "easeOut", 
    },
  },
};

const CategorySection = () => {
   const navigate = useNavigate(); 
  return (
    <motion.section
      className=" py-10 md:py-20 bg-white font-[Poppins,sans-serif]"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"       
      viewport={{ once: true, amount: 0.2 }} 
    >
      {/* Title Section */}
      <div className="text-center mb-12 ">
        <p className="text-[#4B9097] font-medium md:text-xl flex justify-center items-center gap-2">
          <Sparkles size={20} strokeWidth={2} className="animate-rotate text-gray-500" />
          Categories
        </p>
        <h2 className="text-2xl md:text-4xl font-semibold text-gray-500 md:mt-2">
          Featured Top Categories
        </h2>
      </div>

      {/* Swiper Slider */}
      <div className="px-6 md:px-28 ">
        <Swiper
          modules={[Pagination]}
          spaceBetween={30}
          grabCursor={true}
          breakpoints={{
            0: { slidesPerView: 2 },
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 5 },
          }}
        >
          {categories.map((item, index) => (
            <SwiperSlide key={index}>
              <motion.div
                className="relative pt-[70px] bg-[#F7FAFB] pb-[20px] rounded-[10px] border border-dashed border-[#2d8c91] text-center mt-10"
                 onClick={() => navigate("/category")}
              >
                {/* Image Box */}
                <div className="flex items-center left-[50%] translate-x-[-50%] justify-center absolute w-[100px] h-[100px] top-[-50px] rounded-[14px]
                  before:content-[''] before:absolute before:h-[50%] before:w-full before:border before:border-dashed before:border-[#2d8c91] before:rounded-bl-[14px] before:rounded-br-[14px] before:border-t-0 before:bottom-0 before:left-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-auto transition-all "
                  />
                </div>
                <h3 className="text-gray-700 font-semibold text-lg mt-3 ">
                  {item.name}
                </h3>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      
    </motion.section>
  );
};

export default CategorySection;
