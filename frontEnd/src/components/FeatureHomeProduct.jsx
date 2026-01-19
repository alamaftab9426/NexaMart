import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { FaStar, FaShoppingCart, FaEye, FaHeart } from "react-icons/fa";
import { Truck, Headphones, RefreshCcw, ShieldCheck } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useSlide } from "./context/SlideContext";
import { useCart } from "./context/CartContext";
import { Pagination } from "swiper/modules";
import axios from "axios";
import { toast } from "react-toastify";

import { useWishlist } from "./context/WishlistContext";

const MAX_PRODUCTS = 6;

const FeatureHomeProducts = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const { addToCart } = useCart();
  const { openView } = useSlide();
  const { addToWishlist, wishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState("new");
  const [products, setProducts] = useState({ new: [], best: [], top: [] });

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/products`);
      const allProducts = Array.isArray(res.data) ? res.data : [];

      const categorized = {
        new: allProducts
          .filter(p => p.tagId?.some(t => t.label === "New Arrival"))
          .slice(0, MAX_PRODUCTS),

        best: allProducts
          .filter(p => p.tagId?.some(t => t.label === "Best Seller"))
          .slice(0, MAX_PRODUCTS),

        top: allProducts
          .filter(p => p.tagId?.some(t => t.label === "Top Rated"))
          .slice(0, MAX_PRODUCTS),
      };

      // default selected color
      Object.keys(categorized).forEach(tabKey => {
        categorized[tabKey].forEach(p => {
          if (!p.selectedColor && p.variants?.length > 0) {
            p.selectedColor = p.variants[0].color._id;
          }
        });
      });

      setProducts(categorized);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts({ new: [], best: [], top: [] });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const tabs = [
    { key: "new", label: "New Arrivals" },
    { key: "best", label: "Best Sellers" },
    { key: "top", label: "Top Rated" },
  ];

  const handleColorSelect = (tabKey, productIndex, color) => {
    setProducts(prev => {
      const updated = { ...prev };
      updated[tabKey][productIndex].selectedColor = color;
      updated[tabKey][productIndex].selectedSize = null;
      return updated;
    });
  };

  const handleSizeSelect = (tabKey, productIndex, size) => {
    setProducts(prev => {
      const updated = { ...prev };
      updated[tabKey][productIndex].selectedSize = size;
      return updated;
    });
  };

  const isInWishlist = (id) => wishlist.some((item) => item._id === id);

  const isSizeOutOfStock = (sizeObj) => {
    return Number(sizeObj.quantity) <= 0;
  };

  const isColorOutOfStock = (variant) => {
    if (!variant?.sizes?.length) return true;

    return variant.sizes.every(
      (s) => Number(s.quantity) <= 0
    );
  };

  return (
    <motion.div
      className="px-4 md:px-28 -mt-[190px] md:-mt-0 font-[Poppins,sans-serif]"
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      id="products"
    >
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
        <div>
          <h3 className="text-[#2d8c91] font-semibold md:text-lg flex gap-2 items-center">
            <Sparkles size={20} className="text-gray-400 animate-rotate" />
            Feature Products
          </h3>
          <h1 className="text-2xl md:text-4xl text-gray-500 md:mt-2 font-bold font-[Quicksand]">
            Our Featured Collection
          </h1>
        </div>

        {/* TABS */}
        <div className="flex gap-3 mt-3 md:mt-0 flex-wrap">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2 rounded-md border transition-all ${activeTab === tab.key
                ? "bg-[#2D8C91] text-white border-[#2D8C91]"
                : "bg-white text-gray-500 border-gray-300 hover:border-[#2D8C91]"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCT SLIDER */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Swiper
            modules={[Pagination]}
            spaceBetween={20}
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
          >
            {products[activeTab].map((product, index) => {
              const currentVariant =
                product.variants.find(v => v.color._id === product.selectedColor) ||
                product.variants[0];

              return (
                <SwiperSlide key={product.slug || product._id}>
                  <div className="relative bg-[#F7FBFE] rounded-2xl overflow-hidden group transition-all duration-300 border">
                    {/* Product Image */}
                    <div className="relative w-full h-64 overflow-hidden group">
                      <img
                        src={
                          typeof currentVariant.images[0] === "string"
                            ? currentVariant.images[0]
                            : currentVariant.images[0]?.url
                        }
                        alt={product.name}
                        className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:opacity-0"
                      />
                      {currentVariant.images[1] && (
                        <img
                          src={
                            typeof currentVariant.images[1] === "string"
                              ? currentVariant.images[1]
                              : currentVariant.images[1]?.url
                          }
                          alt={product.name}
                          className="w-full h-full object-cover absolute top-0 left-0 opacity-0 transition-all duration-700 ease-in-out group-hover:opacity-100"
                        />
                      )}

                      {/* Hover Icons */}
                      <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out">
                        <div className="bg-black p-3 rounded-full text-white hover:bg-[#2D8C91] cursor-pointer" onClick={() => addToCart(product)}><FaShoppingCart /></div>
                        <div className="bg-black p-3 rounded-full text-white hover:bg-[#2D8C91] cursor-pointer" onClick={() => openView(product)}><FaEye /></div>
                        <div className="bg-black p-3 rounded-full text-white hover:bg-[#2D8C91] cursor-pointer" onClick={() => addToWishlist(product)}>
                          <FaHeart className={isInWishlist(product._id) ? "text-red-500" : "text-white"} />
                        </div>
                      </div>

                      {/* Product Tag */}
                      {product.tagId.length > 0 && (
                        <span className="absolute top-3 left-3 bg-[#2D8C91] text-white text-xs px-2 py-1 rounded-md">
                          {product.tagId[0].label || product.tagId[0]}
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="p-4 md:p-5 bg-white">
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

                      <h3 className="text-lg font-semibold text-gray-500 mt-1">{product.name}</h3>

                      {/* Price & Size */}
                      <div className="mt-3 flex md:flex-row justify-between items-start md:items-center gap-3">
                        <div className="flex items-center gap-3">
                          <span className="text-[#2D8C91] font-bold">
                            ₹{currentVariant.sizes.find(s => s.size._id === product.selectedSize)?.price || currentVariant.sizes[0]?.price}
                          </span>
                          <span className="text-gray-400 line-through">
                            ₹{currentVariant.sizes.find(s => s.size._id === product.selectedSize)?.oldPrice || currentVariant.sizes[0]?.oldPrice}
                          </span>
                        </div>

                        {/* Size Options */}
                        {currentVariant.sizes.length > 0 && (
                          <div className="flex gap-2 flex-wrap">
                            {currentVariant.sizes.map((sizeObj, i) => (
                              <button
                                key={i}
                                onClick={() => {
                                  if (isSizeOutOfStock(sizeObj)) {
                                    toast.error("This size is not available");
                                    return;
                                  }
                                  handleSizeSelect(activeTab, index, sizeObj.size._id);
                                }}
                                className={`
                                               relative px-2 py-1 text-sm rounded-md border transition-all
                                               
                                 ${product.selectedSize === sizeObj.size._id
                                    ? "bg-[#2D8C91] text-white border-[#2D8C91]"
                                    : "border-gray-500 text-gray-900 hover:border-[#2D8C91]"}
                                 ${isSizeOutOfStock(sizeObj) ? "opacity-50 cursor-not-allowed" : ""}
                                  `}
                              >
                              
                                <span className="relative z-10">
                                  {sizeObj.size.name}
                                </span>

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
                        )}
                      </div>

                      {/* Color Options */}
                      {product.variants.length > 0 && (
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {product.variants.map((variant, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                if (isColorOutOfStock(variant)) {
                                  toast.error("This color is not available in stock");
                                  return;
                                }
                                handleColorSelect(activeTab, index, variant.color._id);
                              }}

                              className={`w-6 h-6 rounded-full border-2 transition-all ${product.selectedColor === variant.color._id
                                ? "border-[#2D8C91] scale-110"
                                : "border-gray-300"
                                }`}
                              style={{ backgroundColor: variant.color.code }}
                              title={variant.color.name}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </motion.div>
      </AnimatePresence>

      {/* Support Section */}
      <section className="bg-[#F7FAFB] py-10 px-6 md:px-20 mt-0 md:mt-12 rounded-2xl shadow-sm border border-dashed border-[#BFD8DB] font-[Quicksand]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { icon: <Truck className="text-[#4B9097]" size={32} />, title: "Free Shipping", desc: "Free shipping on all US orders or orders above ₹2000" },
            { icon: <Headphones className="text-[#4B9097]" size={32} />, title: "24x7 Support", desc: "Contact us 24 hours live support, 7 days a week" },
            { icon: <RefreshCcw className="text-[#4B9097]" size={32} />, title: "30 Days Return", desc: "Simply return it within 30 days for an exchange" },
            { icon: <ShieldCheck className="text-[#4B9097]" size={32} />, title: "Payment Secure", desc: "Your payments are safe and protected" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center justify-center space-y-3 hover:-translate-y-1 transition-transform duration-300">
              <div className="bg-white w-16 h-16 flex items-center justify-center rounded-full shadow-sm border border-[#DDECEC]">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-500">{item.title}</h3>
              <p className="text-md text-gray-500 max-w-[220px]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};

export default FeatureHomeProducts;
