import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiTrash2 } from "react-icons/fi";
import { FaShoppingCart, FaEye, FaStar } from "react-icons/fa";
import { useSlide } from "./context/SlideContext";
import { useCart } from "./context/CartContext";
import { useWishlist } from "./context/WishlistContext";

const Wishlist = () => {
  const { openView } = useSlide();
  const { addToCart } = useCart();
  const { wishlist, removeFromWishlist } = useWishlist();

  // 🔹 Local state synced with wishlist
  const [products, setProducts] = useState([]);

  /* ===== SYNC WITH WISHLIST ===== */
  useEffect(() => {
    const mapped = wishlist.map((p) => ({
      ...p,
      selectedColor: p.selectedColor || p.variants?.[0]?.color?._id,
      selectedSize: p.selectedSize || null,
    }));
    setProducts(mapped);
  }, [wishlist]);

  const handleColorSelect = (index, colorId) => {
    setProducts((prev) => {
      const updated = [...prev];
      updated[index].selectedColor = colorId;
      updated[index].selectedSize = null;
      return updated;
    });
  };

  const handleSizeSelect = (index, sizeId) => {
    setProducts((prev) => {
      const updated = [...prev];
      updated[index].selectedSize = sizeId;
      return updated;
    });
  };

  const isColorOutOfStock = (variant) =>
    !variant?.sizes?.length ||
    variant.sizes.every((s) => Number(s.quantity) <= 0);

  return (
    <Layout>
      {/* ===== BANNER ===== */}
    
          <div className="relative w-full overflow-hidden font-[Quicksand]">
            <img
              src="./images/bgcat.png"
              className="w-full h-[160px] md:h-[250px] object-cover"
              alt=""
            />
    
            <div className="absolute inset-0 bg-[#EFF4F7]/35"></div>
    
            <img
              src="./images/left.png"
              className="absolute left-0 bottom-0 w-[140px] md:w-[250px] animate__animated animate__fadeInLeft"
              alt=""
            />
    
            <img
              src="./images/right.png"
              className="absolute right-0 bottom-0 w-[140px] md:w-[250px] animate__animated animate__fadeInRight"
              alt=""
            />
    
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
              <h1 className="text-2xl md:text-4xl font-bold mb-2 text-gray-500">
               Wish List Page
              </h1>
    
              <p className="text-base font-[Poppins]">
                <Link to="/Category" className="text-[#4B9097]">
                  Category
                </Link>
                <span className="text-gray-500 mx-2">&gt;&gt;</span>
                <span className="text-gray-500">Wish List Page</span>
              </p>
            </div>
          </div>
    
      {/* ===== PRODUCTS ===== */}
      <div className="px-4 md:px-10 py-12">
        {products.length === 0 ? (
          <p className="text-center text-gray-500 text-xl">
            Your Wishlist is Empty 💔
          </p>
        ) : (
          <div
            className="
              grid gap-6
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              md:px-28
            "
          >
            {products.map((product, index) => {
              const currentVariant =
                product.variants?.find(
                  (v) => v.color._id === product.selectedColor
                ) || product.variants?.[0];

              return (
                <motion.div
                  key={product._id || index}
                  whileHover={{ scale: 1.02 }}
                  className="relative bg-[#F7FBFE] rounded-2xl overflow-hidden group border"
                >
                  {/* DELETE */}
                  <button
                    onClick={() =>
                      removeFromWishlist(product._id || product.id)
                    }
                    className="absolute top-3 right-3 z-10 bg-white p-2 rounded-full text-red-500 shadow"
                  >
                    <FiTrash2 />
                  </button>

                  {/* IMAGE */}
                  <div className="relative h-64">
                    <img
                      src={
                        currentVariant?.images?.[0]?.url ||
                        currentVariant?.images?.[0] ||
                        product.image?.[0]
                      }
                      className="w-full h-full object-cover transition-all duration-700 group-hover:opacity-0"
                    />
                    {currentVariant?.images?.[1] && (
                      <img
                        src={
                          currentVariant.images[1]?.url ||
                          currentVariant.images[1]
                        }
                        className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 group-hover:opacity-100"
                      />
                    )}

                    {/* HOVER BUTTONS */}
                    <div className="absolute bottom-4 inset-x-0 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all">
                      <div
                        className="bg-black p-3 rounded-full text-white hover:bg-[#2D8C91]"
                        onClick={() => addToCart(product)}
                      >
                        <FaShoppingCart />
                      </div>
                      <div
                        className="bg-black p-3 rounded-full text-white hover:bg-[#2D8C91]"
                        onClick={() => openView(product)}
                      >
                        <FaEye />
                      </div>
                    </div>
                  </div>

                  {/* DETAILS */}
                  <div className="p-4 bg-white">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm text-gray-500">
                        {product.subCategoryId?.name || product.subCategoryId}
                      </p>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <FaStar
                            key={s}
                            className="w-4 h-4"
                            color={s <= 4 ? "#6FA6AC" : "#e5e7eb"}
                          />
                        ))}
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-500">
                      {product.name}
                    </h3>

                    <div className="flex justify-between">
                      <div className="mt-3 flex items-center gap-2 ">
                      <span className="text-[#2D8C91] font-bold">
                        ₹{currentVariant?.sizes?.[0]?.price || product.price}
                      </span>
                      {currentVariant?.sizes?.[0]?.oldPrice && (
                        <span className="line-through text-gray-400">
                          ₹{currentVariant.sizes[0].oldPrice}
                        </span>
                      )}
                    </div>

                    {/* SIZES */}
                    {currentVariant?.sizes?.length > 0 && (
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {currentVariant.sizes.map((s, i) => (
                          <button
                            key={i}
                            disabled={s.quantity <= 0}
                            onClick={() =>
                              handleSizeSelect(index, s.size._id)
                            }
                            className={`px-2 py-1 text-sm rounded-md border
                              ${
                                product.selectedSize === s.size._id
                                  ? "bg-[#2D8C91] text-white"
                                  : "border-gray-300"
                              }
                              ${
                                s.quantity <= 0
                                  ? "opacity-40 line-through cursor-not-allowed"
                                  : ""
                              }`}
                          >
                            {s.size.name}
                          </button>
                        ))}
                      </div>
                    )}
                      </div>

                    

                    {/* COLORS */}
                    {product.variants?.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {product.variants.map((v, i) => {
                          const out = isColorOutOfStock(v);
                          return (
                            <button
                              key={i}
                              disabled={out}
                              onClick={() =>
                                !out &&
                                handleColorSelect(index, v.color._id)
                              }
                              className={`w-6 h-6 rounded-full border-2 ${
                                product.selectedColor === v.color._id
                                  ? "border-[#2D8C91]"
                                  : "border-gray-300"
                              } ${out ? "opacity-40" : ""}`}
                              style={{ backgroundColor: v.color.code }}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Wishlist;
