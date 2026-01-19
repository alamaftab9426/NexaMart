import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// CONTEXT IMPORT
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

// Icons
import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiOutlineMenu,
} from "react-icons/ai";

import { FaTimes, FaPlus, FaMinus } from "react-icons/fa";
import { FaInstagramSquare, FaFacebookSquare, FaLinkedin } from "react-icons/fa";
import { IoLogoTwitter } from "react-icons/io";

const sidebarVariants = {
  hidden: { x: "-100%" },
  visible: { x: 0 },
  exit: { x: "-100%" },
};

const TopBar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
const [langOpen, setLangOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  const cartCount = cart.length;
  const wishlistCount = wishlist.length;

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const closeAllMenus = () => {
    setOpenDropdown(null);
    setSidebarOpen(false);
  };

  return (
    <>

   
      <div className="hidden md:flex w-full bg-[#1D1D1F] text-white py-2 px-6 justify-between items-center">
      {/* Left TEXT */}
      <span className="text-sm tracking-wide">
        Flat 50% Off On Grocery Shop.
      </span>

      {/* Right Menu */}
      <div className="flex items-center gap-6 text-sm font-medium">

        <button className="hover:text-teal-400">Help?</button>
        <button className="hover:text-teal-400">Track Order</button>

        {/* ------------------ LANGUAGE DROPDOWN ------------------ */}
        <div className="relative">
          <div
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1 hover:text-teal-400 cursor-pointer select-none"
          >
            <span>Language</span>
            <motion.span
              animate={{ rotate: langOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              ▾
            </motion.span>
          </div>

          <AnimatePresence>
            {langOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-32 bg-white text-black rounded shadow-lg py-2 z-50"
              >
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                  English
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                  Hindi
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ------------------ CURRENCY DROPDOWN ------------------ */}
        <div className="relative">
          <div
            onClick={() => setCurrencyOpen(!currencyOpen)}
            className="flex items-center gap-1 hover:text-teal-400 cursor-pointer select-none"
          >
            <span>Currency</span>
            <motion.span
              animate={{ rotate: currencyOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              ▾
            </motion.span>
          </div>

          <AnimatePresence>
            {currencyOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-32 bg-white text-black rounded shadow-lg py-2 z-50"
              >
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                  INR (₹)
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                  USD ($)
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
      {/* ===========================
           MOBILE BOTTOM NAVIGATION
      ============================ */}
      <div className="fixed bottom-0 left-0 right-0 bg-black text-white flex justify-around py-2 md:hidden z-50">
        <div
          className="flex flex-col items-center hover:text-teal-400 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <AiOutlineHome size={22} />
          <span className="text-xs mt-1">Home</span>
        </div>

        <div
          className="flex flex-col items-center hover:text-teal-400 cursor-pointer"
          onClick={() => navigate("/profile")}
        >
          <AiOutlineUser size={22} />
          <span className="text-xs mt-1">Account</span>
        </div>

        <div
          className="flex flex-col items-center hover:text-teal-400 cursor-pointer relative"
          onClick={() => navigate("/wishlist")}
        >
          <AiOutlineHeart size={22} />
          {wishlistCount > 0 && (
            <span className="absolute -top-1 right-3 bg-red-500 text-white text-[10px] rounded-full px-1">
              {wishlistCount}
            </span>
          )}
          <span className="text-xs mt-1">Wishlist</span>
        </div>

        <div
          className="flex flex-col items-center hover:text-teal-400 cursor-pointer relative"
          onClick={() => navigate("/CartPage")}
        >
          <AiOutlineShoppingCart size={22} />
          {cartCount > 0 && (
            <span className="absolute -top-1 right-3 bg-red-500 text-white text-[10px] rounded-full px-1">
              {cartCount}
            </span>
          )}
          <span className="text-xs mt-1">Cart</span>
        </div>

        <div
          className="flex flex-col items-center hover:text-teal-400 cursor-pointer"
          onClick={() => setSidebarOpen(true)}
        >
          <AiOutlineMenu size={22} />
          <span className="text-xs mt-1">Menu</span>
        </div>
      </div>

      {/* ===========================
    mobile
      ============================ */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50"
              onClick={closeAllMenus}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Sidebar */}
            <motion.div
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="fixed top-0 left-0 h-full w-72 bg-white shadow-lg z-[60] p-5 overflow-y-auto rounded-tr-md rounded-br-md flex flex-col justify-between mt-5"
            >
              <div>
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-lg font-semibold text-gray-700">
                    My Menu
                  </h2>
                  <FaTimes
                    className="cursor-pointer text-gray-600"
                    onClick={closeAllMenus}
                  />
                </div>

                <ul className="space-y-3 text-gray-700">
                  {["home", "categories", "products", "pages", "blog"].map(
                    (menu) => (
                      <li key={menu}>
                        <div
                          className="flex justify-between items-center cursor-pointer hover:text-teal-500 border py-3 px-2 rounded-md"
                          onClick={() => toggleDropdown(menu)}
                        >
                          <span className="font-medium">
                            {menu.charAt(0).toUpperCase() + menu.slice(1)}
                          </span>
                          {openDropdown === menu ? <FaMinus /> : <FaPlus />}
                        </div>

                        {/* Dropdown animation */}
                        <AnimatePresence>
                          {openDropdown === menu && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="ml-4 mt-2 space-y-2 text-sm text-gray-600"
                            >
                              {/* HOME */}
                              {menu === "home" && (
                                <li
                                  className="hover:text-teal-500"
                                  onClick={() => {
                                    navigate("/");
                                    closeAllMenus();
                                  }}
                                >
                                  Home
                                </li>
                              )}

                              {/* CATEGORY */}
                              {menu === "categories" &&
                                ["Men", "Women", "Kids"].map((cat) => (
                                  <li
                                    key={cat}
                                    className="hover:text-teal-500"
                                    onClick={() => {
                                      navigate("/category");
                                      closeAllMenus();
                                    }}
                                  >
                                    {cat}
                                  </li>
                                ))}

                              {/* PRODUCTS */}
                              {menu === "products" && (
                                <>
                                  <li className="hover:text-teal-500">
                                    New Arrivals
                                  </li>
                                  <li className="hover:text-teal-500">
                                    Best Sellers
                                  </li>
                                  <li className="hover:text-teal-500">
                                    Discounted
                                  </li>
                                </>
                              )}

                              {/* PAGES */}
                              {menu === "pages" && (
                                <>
                                  <li className="hover:text-teal-500">
                                    About
                                  </li>
                                  <li
                                    className="hover:text-teal-500"
                                    onClick={() => navigate("/contact")}
                                  >
                                    Contact
                                  </li>
                                  <li
                                    className="hover:text-teal-500"
                                    onClick={() => navigate("/faq")}
                                  >
                                    FAQ
                                  </li>
                                </>
                              )}

                              {/* BLOG */}
                              {menu === "blog" && (
                                <>
                                  <li className="hover:text-teal-500">
                                    Latest
                                  </li>
                                  <li className="hover:text-teal-500">
                                    Popular
                                  </li>
                                </>
                              )}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </li>
                    )
                  )}
                </ul>

                {/* Social Icons */}
                <div className="flex justify-center gap-5 text-2xl text-gray-600 mb-5 mt-6">
                  <FaInstagramSquare className="hover:text-pink-500 cursor-pointer" />
                  <IoLogoTwitter className="hover:text-sky-500 cursor-pointer" />
                  <FaFacebookSquare className="hover:text-blue-600 cursor-pointer" />
                  <FaLinkedin className="hover:text-blue-500 cursor-pointer" />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default TopBar;
