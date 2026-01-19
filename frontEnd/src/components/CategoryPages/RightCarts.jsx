import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingCart, FaEye, FaHeart, FaStar } from "react-icons/fa";
import { useSlide } from "../context/SlideContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { toast } from "react-toastify";

const RightCarts = ({ productsData = [] }) => {
  const { openView } = useSlide();
  const { addToCart } = useCart();
  const { addToWishlist, wishlist } = useWishlist();

  const productsPerPage = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const sectionRef = useRef(null);
  const [products, setProducts] = useState([]);

  /* ================= INIT PRODUCTS ================= */
  useEffect(() => {
    const updated = productsData.map((p) => ({
      ...p,
      selectedColor: p.selectedColor || p.variants?.[0]?.color?._id || null,
      selectedSize: p.selectedSize || null,
    }));
    setProducts(updated);
    setCurrentPage(1);
  }, [productsData]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(products.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const visibleProducts = products.slice(
    startIndex,
    startIndex + productsPerPage
  );

  useEffect(() => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentPage]);

  /* ================= HELPERS ================= */
  const isInWishlist = (id) =>
    wishlist.some((item) => item._id === id);

  const isColorOutOfStock = (variant) =>
    !variant?.sizes?.length ||
    variant.sizes.every((s) => Number(s.quantity) <= 0);

  const isSizeOutOfStock = (sizeObj) =>
    Number(sizeObj.quantity) <= 0;

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
    <div className="min-h-screen pb-4 px-4 md:px-6">
      <div
        ref={sectionRef}
        className="w-full px-3 py-3 rounded-md border flex justify-between items-center bg-[#F7FAFB]"
      >
        <h2 className="text-gray-700 font-semibold text-lg">
          Showing Products ({products.length})
        </h2>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6"
        >
          {visibleProducts.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No products found
            </div>
          ) : (
            visibleProducts.map((product, index) => {
              const productIndex = startIndex + index;

              const currentVariant =
                product.variants.find(
                  (v) => v.color._id === product.selectedColor
                ) || product.variants[0];

              return (
                <motion.div
                  key={product._id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-[#F7FBFE] rounded-2xl overflow-hidden group border"
                >
                  {/* IMAGE */}
                  <div className="relative h-64">
                    <img
                      src={currentVariant.images?.[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:opacity-0"
                    />
                    {currentVariant.images?.[1] && (
                      <img
                        src={currentVariant.images[1]}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-700"
                      />
                    )}

                    {/* HOVER ICONS */}
                    <div className="absolute bottom-4 inset-x-0 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-700">
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-black p-3 rounded-full text-white hover:bg-[#2D8C91]"
                      >
                        <FaShoppingCart />
                      </button>
                      <button
                        onClick={() => openView(product)}
                        className="bg-black p-3 rounded-full text-white hover:bg-[#2D8C91]"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => addToWishlist(product)}
                        className="bg-black p-3 rounded-full text-white hover:bg-[#2D8C91]"
                      >
                        <FaHeart
                          className={
                            isInWishlist(product._id)
                              ? "text-red-500"
                              : "text-white"
                          }
                        />
                      </button>
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
                    <h3 className="text-lg font-semibold text-gray-600">
                      {product.name}
                    </h3>



                    <div className="flex justify-between items-center">
                      {/* PRICE */}
                      <div className="flex gap-3 items-center mt-2">
                        <span className="text-[#2D8C91] font-bold">
                          ₹{currentVariant.sizes?.[0]?.price}
                        </span>
                        {currentVariant.sizes?.[0]?.oldPrice && (
                          <span className="line-through text-gray-400">
                            ₹{currentVariant.sizes[0].oldPrice}
                          </span>
                        )}
                      </div>

                      {/* SIZES */}
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {currentVariant.sizes.map((sizeObj, i) => {
                          const out = isSizeOutOfStock(sizeObj);

                          return (
                            <button
                              key={i}
                              onClick={() => {
                                if (out) {
                                  toast.error("This size is not available");
                                  return;
                                }
                                handleSizeSelect(
                                  productIndex,
                                  sizeObj.size._id
                                );
                              }}
                              className={`relative px-2 py-1 text-sm rounded-md border
                              ${product.selectedSize === sizeObj.size._id
                                  ? "bg-[#2D8C91] text-white border-[#2D8C91]"
                                  : "border-gray-400"
                                }
                              ${out
                                  ? "opacity-40 cursor-not-allowed"
                                  : "hover:border-[#2D8C91]"
                                }
                            `}
                            >
                              {sizeObj.size.name}

                              {out && (
                                <span className="absolute inset-0 pointer-events-none">
                                  <span className="absolute top-1/2 left-[-25%] w-[150%] h-[2px] bg-gray-600 rotate-45"></span>
                                  <span className="absolute top-1/2 right-[-25%] w-[150%] h-[2px] bg-gray-600 -rotate-45"></span>
                                </span>
                              )}
                            </button>
                          );
                        })}
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
                                toast.error("This color is out of stock");
                                return;
                              }
                              handleColorSelect(
                                productIndex,
                                variant.color._id
                              );
                            }}
                            className={`relative w-6 h-6 rounded-full border-2
                              ${product.selectedColor === variant.color._id
                                ? "border-[#2D8C91]"
                                : "border-gray-300"
                              }
                              ${out
                                ? "opacity-40 cursor-not-allowed"
                                : ""
                              }
                            `}
                            style={{ backgroundColor: variant.color.code }}
                          >
                            {out && (
                              <span className="absolute inset-0 pointer-events-none">
                                <span className="absolute top-1/2 left-[-25%] w-[150%] h-[1px] bg-gray-700 rotate-45"></span>
                                <span className="absolute top-1/2 right-[-25%] w-[150%] h-[1px] bg-gray-700 -rotate-45"></span>
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </AnimatePresence>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${currentPage === i + 1
                  ? "bg-[#2D8C91] text-white"
                  : "bg-white"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RightCarts;
