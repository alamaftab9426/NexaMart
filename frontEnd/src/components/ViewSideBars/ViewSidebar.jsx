import { motion, AnimatePresence } from "framer-motion";
import { useSlide } from "../context/SlideContext";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { FaCheck } from "react-icons/fa6";

export default function ViewSidebar() {
  const { viewProduct, closeView } = useSlide();
  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  if (!viewProduct) return null;

  // Extract colors & sizes
  const colors = Array.from(
    new Map(viewProduct.variants?.map((v) => [v.color?._id, v.color])).values() || []
  );

  const sizes = Array.from(
    new Set(
      viewProduct.variants
        ?.flatMap((v) => v.sizes?.map((s) => s.size?.name).filter(Boolean))
        .filter(Boolean) || []
    )
  );


  console.log(viewProduct)

  // SELECTED VARIANT IMAGES
  const selectedVariant =
    viewProduct.variants?.find((v) => v.color?._id === selectedColor) ||
    viewProduct.variants?.[0];

  const selectedSizeObj =
    selectedVariant?.sizes?.find((s) => s.size?.name === selectedSize) ||
    selectedVariant?.sizes?.[0]; // fallback first size

  const displayPrice = selectedSizeObj?.price ?? 0;
  const displayOldPrice = selectedSizeObj?.oldPrice ?? 0;

  const displayImages = selectedVariant?.images || [];

  return (
    <AnimatePresence>
      <>
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={closeView}
        />

        {/* Sidebar */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 80, damping: 18 }}
          className="fixed right-0 top-2 md:top-4 bottom-16 md:bottom-4 w-[400px] md:w-[450px] bg-white z-50 shadow-xl p-5 overflow-y-auto rounded-l-2xl font-[Quicksand]"
        >
          {/* IMAGE SWIPER */}
          <div className="w-full rounded-xl bg-gray-100">
            {displayImages.length > 0 ? (
              <Swiper
                spaceBetween={10}
                slidesPerView={1}
                modules={[Autoplay]}
                autoplay={{ delay: 2000, disableOnInteraction: false }}
                loop={true}
                className="w-full"
              >
                {displayImages.map((img, i) => (
                  <SwiperSlide key={i}>
                    <img
                      src={img}
                      alt={viewProduct.name}
                      className="w-full object-contain rounded-xl"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <img
                src={viewProduct.image || ""}
                alt={viewProduct.name}
                className="w-full object-contain rounded-xl"
              />
            )}
          </div>

          {/* TITLE */}
          <h2 className="text-2xl font-semibold mt-4 text-gray-700">
            {viewProduct.name}
          </h2>

          {/* DESCRIPTION */}
          <div className="mt-3 space-y-2">
            {viewProduct.description?.map((desc, i) => (
              <p key={i} className="text-gray-600 text-sm text-justify">
                {desc}
              </p>
            ))}
          </div>

        
          {/* PRICE */}
          <div className="mt-5">
            <h3 className="text-2xl font-bold text-gray-800">₹{displayPrice}</h3>
            {displayOldPrice ? (
              <p className="line-through text-gray-400 text-sm">₹{displayOldPrice}</p>
            ) : null}
          </div>




          {/* COLOR SELECTION */}
          {colors.length > 0 && (
            <div className="mt-5">
              <span className="font-semibold text-gray-700 block mb-2">Colors</span>
              <div className="flex flex-wrap gap-3">
                {colors.map((c) => (
                  <button
                    key={c._id}
                    title={c.name}
                    onClick={() =>
                      setSelectedColor(selectedColor === c._id ? null : c._id)
                    }
                    className={`relative w-10 h-8 rounded-xl border-2 transition-all duration-200 flex items-center justify-center
                      ${selectedColor === c._id
                        ? "border-[#2D8C91] ring-2 ring-[#2D8C91]/40 bg-white"
                        : "border-gray-300 hover:border-[#2D8C91]"
                      }`}
                  >
                    <span
                      className="absolute inset-[3px] rounded-lg"
                      style={{ backgroundColor: c.code }}
                    />
                    {selectedColor === c._id && (
                      <span className="absolute text-white text-sm z-10">
                        <FaCheck />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SIZE SELECTION */}
          {sizes.length > 0 && (
            <div className="mt-5">
              <span className="font-semibold text-gray-700 block mb-2">Sizes</span>
              <div className="flex flex-wrap gap-3">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() =>
                      setSelectedSize(selectedSize === s ? null : s)
                    }
                    className={`px-3 py-1 border rounded-lg text-sm font-medium transition-all
                      ${selectedSize === s
                        ? "border-[#2D8C91] bg-[#2D8C91] text-white"
                        : "border-gray-300 hover:border-[#2D8C91]"
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* QUANTITY + ADD TO CART */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button
                onClick={() => setQty((prev) => (prev > 1 ? prev - 1 : 1))}
                className="px-3 py-2 text-lg border-r"
              >
                -
              </button>
              <span className="px-4 py-2 text-lg font-semibold">{qty}</span>
              <button
                onClick={() => setQty((prev) => prev + 1)}
                className="px-3 py-2 text-lg border-l"
              >
                +
              </button>
            </div>

            <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900">
              <i className="ri-shopping-cart-2-line text-lg"></i>
              Add to Cart
            </button>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
}
