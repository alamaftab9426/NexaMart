import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { TiStarburst } from "react-icons/ti";
import { useInView } from "react-intersection-observer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { MdShoppingBag } from "react-icons/md";
import 'animate.css';


const vendors = [

    {
        id: 1,
        name: "A1 Superstore",
        desc: "Trending fashion store with new clothes explore.",
        images: "./images/compny1.jpg",
        products: [
            { id: 1, name: "Leather Purchase", price: "200", image: "./images/leatherpurse.jpg" },
            { id: 2, name: "Cowboy Hats", price: "250", image: "./images/cowhate.jpg" },
            { id: 3, name: "Women Jackates", price: "350", image: "./images/womenjacket.jpg" },
            { id: 4, name: "Long Shoes", price: "450", image: "./images/longshoes.jpg" },
            { id: 5, name: "Leather Belts", price: "120", image: "./images/leatherbelt.jpg" },
            { id: 6, name: "Leather Belts", price: "120", image: "./images/leatherbelt.jpg" },

        ],
    },
    {
        id: 2,
        name: "Xcart Store",
        desc: "Explore more perfume fragrance with your style.",
        images: "./images/compny2.jpg",
        products: [
            { id: 1, name: "Men Perfume", price: "299", image: "./images/bestpamue.jpg" },
            { id: 2, name: "Organic Costmatic", price: "150", image: "./images/organicostmatic.jpg" },
            { id: 3, name: "Make Kit", price: "450", image: "./images/makeupkit.jpg" },
            { id: 4, name: "Best Clothes", price: "299", image: "./images/bestcloth.jpg" },
            { id: 5, name: "Stylish Shoes", price: "299", image: "./images/stylesshoes.jpg" },
            { id: 6, name: "Leather Belts", price: "150", image: "./images/leatherbelt.jpg" },
            { id: 6, name: "Stylish Shoes", price: "499", image: "./images/stylesshoes.jpg" },
        ],
    },
    {
        id: 3,
        name: "Minia Mart",
        desc: "Get your stylish shoes with the minia mart store.",
        images: "./images/compny3.jpg",
        products: [
            { id: 1, name: "High Heals", price: "69", image: "./images/highheals.jpg" },
            { id: 2, name: "Girls Sandals", price: "89", image: "./images/girlssandle.jpg" },
            { id: 3, name: "Febric Bags ", price: "99", image: "./images/fabricbags.jpg" },
            { id: 4, name: "Antique Watches", price: "39", image: "./images/anticwatches.jpg" },
            { id: 5, name: "Wall Clock", price: "49", image: "./images/wallclock.jpg" },

            { id: 6, name: "Stylish Shoes", price: "99", image: "./images/stylesshoes.jpg" },
        ],
    },
    {
        id: 4,
        name: "Sprazo Shop",
        desc: "Make your style with Sprazo glasses store at $99.",
        images: "./images/compny4.jpg",
        products: [
            { id: 1, name: "Best Clothes", price: "59", image: "./images/bestcloth.jpg" },
            { id: 2, name: "Women Shoes", price: "69", image: "./images/womenshoes.jpg" },
            { id: 3, name: "Women Gown", price: "49", image: "./images/womengown.jpg" },
            { id: 4, name: "Classic Hats", price: "79", image: "./images/classichats.jpg" },
            { id: 5, name: "Modern Clothes", price: "99", image: "./images/moderncloths.jpg" },
            { id: 6, name: "Wall Clock", price: "49", image: "./images/wallclock.jpg" },
        ],
    },
];

const TopVendor = () => {
    const { ref: offerRef, inView: offerInView } = useInView({
        triggerOnce: true,
        threshold: 0.2,
    });
    const fadeUp = {
        hidden: { opacity: 0, y: 60 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 1, ease: "easeOut" },
        },
    };
    const fadeUpWithDelay = (delay) => ({
        hidden: { opacity: 0, y: 80 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 1, delay, ease: "easeOut" },
        },
    });
    const [activeVendor, setActiveVendor] = useState(vendors[0]);
    const targetDate = new Date("2025-12-31T23:59:59");
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const difference = targetDate - now;

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / (1000 * 60)) % 60);
                const seconds = Math.floor((difference / 1000) % 60);

                setTimeLeft({ days, hours, minutes, seconds });
            } else {
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="py-12 bg-white text-center md:px-28 ">
            <div className="flex flex-col  md:items-center text-center mb-8 font-[Quicksand] ">
                <h3 className="text-[#2d8c91] font-semibold md:text-xl flex gap-2 items-center justify-center">
                    <Sparkles size={20} strokeWidth={2} className="text-gray-400 animate-rotate" />
                    Browse The Collection
                </h3>
                <h1 className="text-2xl md:text-4xl text-gray-500  md:mt-2 font-bold font-[Quicksand] md:mb-5">
                    Top Vendor
                </h1>
            </div>


            {/* Vendor Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 px-4 md:px-0 ">
                  {vendors.map((vendor) => (
                    <motion.button
                        key={vendor.id}
                        onClick={() => setActiveVendor(vendor)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className={`flex items-center  gap-4 rounded-xl border-2 p-2 md:p-4 w-full transition-all duration-300 text-left  ${activeVendor.id === vendor.id
                            ? "bg-teal-50 border-teal-500 shadow-md"
                            : "border-gray-200 bg-white hover:shadow"
                            }`}
                    >
                        {/* Left Image/Icon */}
                        <div className="flex-shrink-0">
                            <img
                                src={vendor.images}
                                alt={vendor.name}
                                className="w-14 h-14 object-cover rounded-lg border border-gray-200"
                            />
                        </div>

                        {/* Right Text */}
                        <div>
                            <h4 className="font-semibold text-gray-800">{vendor.name}</h4>
                            <p className="text-sm text-gray-500 mt-1 leading-snug">{vendor.desc}</p>
                        </div>
                    </motion.button>
                ))}
            </div>


            {/* Product Cards with Framer Motion Transition */}
            <div className="relative flex justify-center bg-[#F7FAFB]  rounded-md ">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeVendor.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-[1600px] px-5 py-3"
                    >
                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            spaceBetween={30}
                            slidesPerView={1}
                            breakpoints={{
                                640: { slidesPerView: 2 },
                                768: { slidesPerView: 3 },
                                1024: { slidesPerView: 4 },
                                1280: { slidesPerView: 5 },
                            }}
                            loop={true}

                            className="pb-10"
                        >
                            {activeVendor.products.map((item) => (
                                <SwiperSlide key={item.id}>
                                    <div className="rounded-2xl overflow-hidden shadow-lg group cursor-pointer relative bg-transparent">
                                        {/* Image Container */}
                                        <div className="relative w-full h-[270px] overflow-hidden bg-[#F7FAFB]">
                                            <motion.img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover select-none rounded transform transition-transform duration-500 hover:scale-110"

                                            />
                                        </div>

                                        {/* Price Tag */}
                                        <span className="absolute top-3 left-3 bg-[#2D8C91] text-white font-bold px-3 py-1 rounded-full text-sm shadow-lg z-10">
                                            ₹{item.price}
                                        </span>

                                        {/* Product Name */}
                                        <span className="absolute bottom-3 left-3 bg-white bg-opacity-90 text-gray-900 font-semibold px-3 py-1 rounded-xl text-sm z-10">
                                            {item.name}
                                        </span>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* last div Start */}

            {/*  Desktop & Tablet View */}
            <motion.div
            id="offer"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="w-full grid grid-cols-[65%_33%] mt-20 gap-[2%] relative hidden md:grid ">
                
                {/* Left Section */}
                <div className="relative rounded-md overflow-hidden flex bg-[#F8F9FA] border-dashed border border-[#4B9097]">
                    <div
                        className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-20"
                        style={{
                            backgroundImage: "url('/images/imagesforbg.png')",
                            backgroundSize: "60%",
                            backgroundRepeat: "repeat",
                        }}
                    ></div>

                    <div className="relative z-10 text-xl py-20">
                        <div className="px-24 relative z-20">
                            <h3 className="text-gray-600 font-semibold text-sm flex gap-1">
                                <Sparkles size={16} strokeWidth={2} className="text-gray-400 animate-rotate mt-1" />
                                Browse The Collection
                            </h3>
                            <h1 className="text-4xl text-gray-600 font-[Quicksand] mt-4 font-semibold">
                                Hurry Up! Offer ends in.
                            </h1>
                            <h2 className="text-[#4B9097] text-left mt-4 font-[Quicksand] text-4xl font-thin">
                                Get UP TO 80% OFF
                            </h2>

                            <div className="flex gap-4 mt-10 font-[Quicksand]">
                                {[
                                    { label: "Days", value: timeLeft.days },
                                    { label: "Hours", value: timeLeft.hours },
                                    { label: "Minutes", value: timeLeft.minutes },
                                    { label: "Seconds", value: timeLeft.seconds },
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex flex-col items-center justify-center w-24 h-24 font-[Poppins, sans-serif] rounded-lg bg-white border-dashed border border-black"
                                    >
                                        <span className="text-4xl font-bold text-gray-600">{item.value}</span>
                                        <span className="text-xs text-gray-500 font-semibold uppercase mt-1">
                                            {item.label}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <button className="px-5 py-3 mt-7 bg-[#4B9097] text-white font-[Quicksand] text-sm rounded-md flex font-extrabold hover:bg-gray-600">
                                <MdShoppingBag size={19} className="mr-2" /> Shop Now
                            </button>
                        </div>
                        <img src="./images/bggirlimage.png" className="absolute top-[7%] left-[78%] w-[350px]" />
                    </div>
                </div>

                {/* Right Section */}
                <motion.div
                    variants={fadeUp}
                    className="relative rounded-md overflow-hidden flex bg-[#F8F9FA] border-dashed border border-[#4B9097]">
                    <div
                        className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-10 z-0"
                        style={{
                            backgroundImage: "url('/images/imagesforbg.png')",
                            backgroundSize: "100%",
                            backgroundRepeat: "repeat",
                        }}
                    ></div>

                    <div className="relative z-10 px-16 text-left mt-16">
                        <h1 className="text-4xl text-gray-600 font-[Quicksand] font-semibold">Women's Gown</h1>
                        <h1 className="text-[#4B9097] text-left font-[Quicksand] text-4xl mt-2 font-thin">
                            100% Cotton
                        </h1>
                        <button className="px-5 py-3 mt-7 bg-[#4B9097] text-white font-[Quicksand] text-sm rounded-md flex font-extrabold hover:bg-gray-600">
                            <MdShoppingBag size={19} className="mr-2" /> Shop Now
                        </button>
                        <TiStarburst size={160} strokeWidth={2} className="text-[#4B9097] animate-rotate mt-16" />
                        <div
                          
                            className="absolute top-[64%] left-[28%] leading-none z-30 animate__animated animate__pulse animate__infinite animate__faster">
                            <p className="font-[Quicksand] text-white">Only</p>
                            <h3 className="text-white font-bold text-2xl font-[Quicksand]">₹ 1999</h3>
                        </div>
                        <img src="./images/img.png" className="w-[200px] absolute z-[-10] top-20 left-[47%]" />
                    </div>
                </motion.div>
            </motion.div>


            {/*Mobile View */}
            <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}

                className="w-full flex flex-col gap-6 mt-7 px-4 md:hidden">
                {/* Left Section (Mobile) */}
                <div className="relative rounded-md overflow-hidden bg-[#F8F9FA] border-dashed border border-[#4B9097] p-6 flex items-center justify-between">
                    {/* Background */}
                    <div
                        className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-20"
                        style={{
                            backgroundImage: "url('/images/imagesforbg.png')",
                            backgroundSize: "80%",
                            backgroundRepeat: "repeat",
                        }}
                    ></div>

                    {/* Left Content */}
                    <div className="relative z-10 w-1/2 text-left ">
                        <h3 className="text-gray-600 font-semibold text-xs flex items-center gap-1 whitespace-nowrap">
                            <Sparkles size={14} strokeWidth={2} className="text-gray-400 animate-rotate" />
                            <span>Browse The Collection</span>
                        </h3>

                        <h1 className="text-2xl text-gray-600 font-[Quicksand] font-semibold leading-tight whitespace-nowrap mt-1">
                            Hurry Up! Offer ends in.
                        </h1>

                        <h2 className="text-[#4B9097] font-[Quicksand] text-2xl font-thin leading-tight whitespace-nowrap mt-2">
                            Get UP TO 80% OFF
                        </h2>


                        <div className="flex flex-wrap gap-3 mt-3 font-[Quicksand] ">
                            {[
                                { label: "Days", value: timeLeft.days },
                                { label: "Hours", value: timeLeft.hours },
                                { label: "Minutes", value: timeLeft.minutes },
                                { label: "Seconds", value: timeLeft.seconds },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="flex flex-col items-center justify-center w-[80px] pb-1  rounded-lg bg-white border-dashed border border-black"
                                >
                                    <span className="text-2xl font-bold text-gray-600">{item.value}</span>
                                    <span className="text-[10px] text-gray-500 font-semibold uppercase ">
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <button className="px-3 py-2  mt-5 bg-[#4B9097] text-white font-[Quicksand] text-sm rounded-md flex items-center justify-center font-bold hover:bg-gray-600">
                            <MdShoppingBag size={18} className="mr-2" /> Shop Now
                        </button>
                    </div>


                    {/* Right Image */}
                    <div className="absolute top-[13%] left-[52%]   ">
                        <img
                            src="./images/bggirlimage.png"
                            alt="Offer"
                            className="w-[300px]"
                        />
                    </div>
                </div>

                {/* Right Section (Mobile) */}
                <motion.div
                    variants={fadeUpWithDelay(0.3)}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="relative rounded-md overflow-hidden bg-[#F8F9FA] border-dashed border border-[#4B9097] p-6 flex items-center justify-between">
                    <div
                        className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-10 z-0"
                        style={{
                            backgroundImage: "url('/images/imagesforbg.png')",
                            backgroundSize: "100%",
                            backgroundRepeat: "repeat",
                        }}
                    ></div>

                    {/* Left Text */}
                    <div className="relative z-10 w-1/2 text-left space-y-2">
                        <h1 className="text-2xl text-gray-600 font-[Quicksand] font-semibold leading-tight">
                            Women's Gown
                        </h1>
                        <h1 className="text-[#4B9097] font-[Quicksand] text-2xl font-thin leading-tight">
                            100% Cotton
                        </h1>

                        <div className="relative flex justify-start mt-6">
                            <TiStarburst size={110} strokeWidth={2} className="text-[#4B9097] animate-rotate" />
                            <div
                               
                                className="absolute top-[29%] left-[14%] transform -translate-x-1/2 text-center leading-none animate__animated animate__pulse animate__infinite animate__faster">
                                <p className="font-[Quicksand] text-white text-sm">Only</p>
                                <h3 className="text-white font-bold text-lg font-[Quicksand]">₹ 1999</h3>
                            </div>
                        </div>

                        <button className="px-4 py-2 mt-5 bg-[#4B9097] text-white font-[Quicksand] text-sm rounded-md flex items-center justify-center font-bold hover:bg-gray-600">
                            <MdShoppingBag size={18} className="mr-2" /> Shop Now
                        </button>
                    </div>

                    {/* Right Image */}
                    <div className="relative w-1/2 flex justify-center">
                        <img src="./images/img.png" alt="Gown" className="w-[180px]" />
                    </div>
                </motion.div>
            </motion.div>






        </div>
    );
};

export default TopVendor;
