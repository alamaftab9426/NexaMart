import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { FaStar, FaShoppingCart, FaEye, FaHeart } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useSlide } from "./context/SlideContext";
import { useCart } from "./context/CartContext";
import { useWishlist } from "./context/WishlistContext";
import axios from "axios";
import { toast } from "react-toastify";

import "swiper/css";
import "swiper/css/navigation";

const MAX_PRODUCTS = 8;

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const Bestproducts = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;

  const swiperRef = useRef(null);
  const { openView } = useSlide();
  const { addToCart } = useCart();
  const { addToWishlist, wishlist } = useWishlist();

  const [products, setProducts] = useState([]);

  const isInWishlist = (id) =>
    wishlist.some((item) => item._id === id);

  /* ================= FETCH BEST SELLER ================= */
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/products`);
      const allProducts = Array.isArray(res.data) ? res.data : [];

      const bestProducts = allProducts
        .filter(
          (p) =>
            Array.isArray(p.tagId) &&
            p.tagId.some((t) => t.label === "Best Seller")
        )
        .slice(0, MAX_PRODUCTS);

      bestProducts.forEach((p) => {
        if (!p.selectedColor && p.variants?.length > 0) {
          p.selectedColor = p.variants[0].color._id;
        }
      });

      setProducts(bestProducts);
    } catch (err) {
      console.error("Error fetching best products:", err);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ================= STOCK HELPERS ================= */
  const isSizeOutOfStock = (sizeObj) =>
    Number(sizeObj.quantity) <= 0;

  const isColorOutOfStock = (variant) =>
    !variant?.sizes?.length ||
    variant.sizes.every((s) => Number(s.quantity) <= 0);

  /* ================= HANDLERS ================= */
  const handleColorSelect = (productIndex, colorId) => {
    setProducts((prev) => {
      const updated = [...prev];
      updated[productIndex].selectedColor = colorId;
      updated[productIndex].selectedSize = null;
      return updated;
    });
  };

  const handleSizeSelect = (productIndex, sizeId) => {
    setProducts((prev) => {
      const updated = [...prev];
      updated[productIndex].selectedSize = sizeId;
      return updated;
    });
  };

  /* ================= JSX ================= */
  return (
    <div className="px-4 md:px-28 md:mt-10 font-[Poppins,sans-serif] mb-10">

      {/* HEADER */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10"
      >
        <div>
          <h3 className="text-[#2d8c91] font-semibold md:text-lg flex gap-2 items-center">
            <Sparkles size={20} className="text-gray-400 animate-rotate" />
            Best Products
          </h3>
          <h1 className="text-2xl md:text-4xl text-gray-500 md:mt-2 font-bold font-[Quicksand]">
            Most popular products
          </h1>
        </div>

        <div className="flex gap-3 mt-4 md:mt-0">
          <button id="best-prev" className="w-10 h-10 rounded-full border">❮</button>
          <button id="best-next" className="w-10 h-10 rounded-full border">❯</button>
        </div>
      </motion.div>

      {/* SLIDER */}
      <Swiper
        modules={[Navigation, Pagination]}
        navigation={{ prevEl: "#best-prev", nextEl: "#best-next" }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = "#best-prev";
          swiper.params.navigation.nextEl = "#best-next";
        }}
        onSwiper={(s) => (swiperRef.current = s)}
        spaceBetween={20}
        breakpoints={{
          0: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
      >
        {products.map((product, index) => {
          const currentVariant =
            product.variants.find(
              (v) => v.color._id === product.selectedColor
            ) || product.variants[0];

          if (!currentVariant) return null;

          return (
            <SwiperSlide key={product._id}>
              <div className="bg-[#F7FBFE] rounded-2xl border group overflow-hidden">

                {/* IMAGE */}
                <div className="relative h-64">
                  <img
                    src={currentVariant.images?.[0]?.url || currentVariant.images?.[0]}
                    className="w-full h-full object-cover group-hover:opacity-0 transition"
                  />
                  {currentVariant.images?.[1] && (
                    <img
                      src={currentVariant.images[1]?.url || currentVariant.images[1]}
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition"
                    />
                  )}

                  {/* HOVER ICONS */}
                  <div className="absolute bottom-4 inset-x-0 flex justify-center gap-3 opacity-0 group-hover:opacity-100">
                    <div onClick={() => addToCart(product)} className="bg-black p-3 rounded-full text-white cursor-pointer"><FaShoppingCart /></div>
                    <div onClick={() => openView(product)} className="bg-black p-3 rounded-full text-white cursor-pointer"><FaEye /></div>
                    <div onClick={() => addToWishlist(product)} className="bg-black p-3 rounded-full text-white cursor-pointer">
                      <FaHeart className={isInWishlist(product._id) ? "text-red-500" : ""} />
                    </div>
                  </div>
                </div>

                {/* DETAILS */}
                <div className="p-4 bg-white">
                  <div className="flex justify-between items-center">
                                         <p className="text-sm text-gray-500">{product.subCategoryId?.name || product.subCategoryId}</p>
                                         <div className="flex">
                                           {[1, 2, 3, 4, 5].map(star => (
                                             <FaStar
                                               key={star}
                                               className="w-4 h-4"
                                               color={star <= 4 ? "#6FA6AC" : "#e5e7eb"}
                                             />
                                           ))}
                                         </div>
                                       </div>
                  
                  <h3 className="text-lg font-semibold text-gray-500">{product.name}</h3>
                  {/* PRICE */}
                  <div className="flex justify-between items-center">
                     <div className="flex gap-3 mt-2">
                    <span className="text-[#2D8C91] font-bold">
                      ₹{currentVariant.sizes.find(s => s.size._id === product.selectedSize)?.price || currentVariant.sizes[0]?.price}
                    </span>
                    <span className="line-through text-gray-400">
                      ₹{currentVariant.sizes[0]?.oldPrice}
                    </span>
                  </div>

                  {/* SIZES */}
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {currentVariant.sizes.map((sizeObj, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          if (isSizeOutOfStock(sizeObj)) {
                            toast.error("This size is not available");
                            return;
                          }
                          handleSizeSelect(index, sizeObj.size._id);
                        }}
                        className={`relative px-2 py-1 text-sm border border-gray-500 rounded
                          ${product.selectedSize === sizeObj.size._id ? "bg-[#2D8C91] text-white" : ""}
                          ${isSizeOutOfStock(sizeObj) ? "opacity-40 cursor-not-allowed" : ""}
                        `}
                      >
                        {sizeObj.size.name}
                        {isSizeOutOfStock(sizeObj) && (
                                  <span className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                                    {/* TL → BR */}
                                    <span
                                      className="absolute top-0 left-0 w-[140%] h-[1px] bg-gray-600 rotate-45 origin-top-left"
                                    ></span>

                                    {/* TR → BL */}
                                    <span
                                      className="absolute top-0 right-0 w-[140%] h-[1px] bg-gray-600 -rotate-45 origin-top-right"
                                    ></span>
                                  </span>
                                )}
                      </button>
                    ))}
                  </div>

                  </div>
                 

                  {/* COLORS */}
                  <div className="flex gap-2 mt-3">
                    {product.variants.map((variant, i) => {
                      const out = isColorOutOfStock(variant);
                      return (
                        <button
                          key={i}
                          onClick={() => {
                            if (out) {
                              toast.error("This color is not available in stock");
                              return;
                            }
                            handleColorSelect(index, variant.color._id);
                          }}
                          className={`relative w-6 h-6 rounded-full border-2
                            ${product.selectedColor === variant.color._id ? "border-[#2D8C91]" : ""}
                            ${out ? "opacity-40 cursor-not-allowed" : ""}
                          `}
                          style={{ backgroundColor: variant.color.code }}
                        >
                          {out && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <span className="w-7 h-[2px] bg-gray-700 rotate-45"></span>
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default Bestproducts;
