import React, { useState, useContext } from "react";
import { FaSearch, FaUser, FaHeart, FaShoppingCart, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { CgMenuGridR } from "react-icons/cg";
import { GoChevronDown } from "react-icons/go";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext"
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const MiddleBar = () => {
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Fashion");
  const { user, logoutUser } = useContext(UserContext)
  const categories = ["Fashion", "Watches", "Electronics", "Mobile", "Home"];

  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const cartCount = cart.length;
  const wishlistCount = wishlist.length;

  const isLoggedIn = false;
  const navigate = useNavigate();
  const menuRoutes = {
    Home: "/",
    Shop: "/category",
    Fashion: "/category",
    Watches: "/category",
    Contact: "/contact",

  };

  const logoutFun = () => {
    toast.success("Logout Successful!", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      pauseOnHover: true,
      draggable: true,
      style: { backgroundColor: "#000", color: "#fff" },
      transition: Slide,
    });
    setTimeout(() => {

    }, 3000)
    logoutUser()
  }
  return (
    <>
      {/*  Desktop Layout */}
      <div className="hidden md:flex bg-[#EFF4F7] justify-between items-center py-4 shadow-sm px-28 z-30 relative ">

        {/* Logo */}
        <div className="flex font-extrabold gap-1 ">
          <img src="./images/logo.png" className="w-40 object-cover" />
        </div>

        {/* Search Bar */}
        <div className="flex items-center border border-gray-300 rounded-full px-4 py-4 mx-8 w-2/5 relative bg-white" >
          <div
            onClick={() => setOpenDropdown(!openDropdown)}
            className="flex items-center gap-1 cursor-pointer text-gray-700 text-sm mr-3 select-none relative"
          >
            <span>{selectedCategory}</span>
            <motion.span
              animate={{ rotate: openDropdown ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <GoChevronDown />
            </motion.span>

            <AnimatePresence>
              {openDropdown && (
                <motion.ul
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="absolute top-full left-0 mt-1 bg-white border border-gray-200 shadow-lg rounded-lg w-32 z-30"
                >
                  {categories.map((cat) => (
                    <li
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setOpenDropdown(false);
                      }}
                      className="px-4 py-2 text-gray-700 text-sm hover:bg-blue-100 cursor-pointer"
                    >
                      {cat}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search products..."
            className="flex-1 bg-transparent focus:outline-none text-gray-700 text-sm"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-10">

          {/* USER DROPDOWN */}
          <div
            className="relative"
            onMouseEnter={() => setIsUserOpen(true)}
            onMouseLeave={() => setIsUserOpen(false)}
          >
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="text-xl text-gray-700">
                <FaUser />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-xs text-gray-500">Account</span>
                <span className="text-sm font-medium text-gray-800 hover:text-teal-500">
                  {isLoggedIn ? "My Profile" : "Login"}
                </span>
              </div>
            </div>

            {/* DROPDOWN MENU */}
            {isUserOpen && (
              <div className="absolute top-9 -left-2 w-40 bg-white shadow-xl rounded-lg py-2 z-50 border">

                {/* NOT LOGGED IN OPTIONS */}
                {!user && (
                  <>
                    <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                      <Link to="/login" className="">Login</Link>
                    </div>
                    <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                      <Link to="/signup" className="">Register</Link>
                    </div>
                  </>
                )}

                {/* LOGGED IN OPTIONS */}
                {user && (

                  <>
                    <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                      <Link to="/profile" className="">Profile</Link>
                    </div>

                    <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                      <Link to="/cartpage" className="">Cart</Link>
                    </div>

                    <div className="px-4 py-2 text-sm text-red-600 hover:bg-red-100 cursor-pointer" onClick={logoutFun}>
                      <Link to="/login" className="">Logout</Link>
                    </div>

                  </>
                )}

              </div>
            )}
          </div>

          {/* WATCHLIST */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/wishlist")}>

            <div className="text-xl text-gray-700">
              <FaHeart />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xs text-gray-500">Wishlist {wishlistCount}</span>
              <span className="text-sm font-medium text-gray-800 hover:text-teal-500">
                Wishlist
              </span>
            </div>
          </div>

          {/* CART */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/cartpage")}>
            <div className="text-xl text-gray-700">
              <FaShoppingCart />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xs text-gray-500">Cart {cartCount}</span>
              <span className="text-sm font-medium text-gray-800 hover:text-teal-500">
                Cart
              </span>
            </div>
          </div>

        </div>
        <ToastContainer />

      </div>

      {/*  Mobile Layout */}
      <div className="md:hidden bg-white shadow-sm px-4 py-3 relative z-20 ">
        <div className="flex justify-between items-center">
          <img src="./images/logo.png" className="w-40 object-cover" />
          <button onClick={() => setMenuOpen(true)}>
            <CgMenuGridR className="text-3xl text-gray-700" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center border border-gray-300 rounded-full px-4 py-3 mt-3 relative">
          <div
            onClick={() => setOpenDropdown(!openDropdown)}
            className="flex items-center gap-1 cursor-pointer text-gray-700 text-sm mr-3 select-none relative"
          >
            <span>{selectedCategory}</span>
            <motion.span
              animate={{ rotate: openDropdown ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <GoChevronDown />
            </motion.span>

            <AnimatePresence>
              {openDropdown && (
                <motion.ul
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="absolute top-full left-0 mt-1 bg-white border border-gray-200 shadow-lg rounded-lg w-32 z-30"
                >
                  {categories.map((cat) => (
                    <li
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setOpenDropdown(false);
                      }}
                      className="px-4 py-2 text-gray-700 text-sm hover:bg-blue-100 cursor-pointer"
                    >
                      {cat}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search products..."
            className="flex-1 bg-transparent focus:outline-none text-gray-700 text-sm"
          />
        </div>
      </div>

      {/* Mobile Bottom Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.4 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg z-50 p-5 mx-5"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Main Menu</h2>
                <FaTimes
                  className="text-2xl text-gray-700 cursor-pointer"
                  onClick={() => setMenuOpen(false)}
                />
              </div>

              <ul className="space-y-4 text-gray-700 font-medium text-base">
                {Object.keys(menuRoutes).map((item) => (
                  <li
                    key={item}
                    className="hover:text-blue-500 cursor-pointer"
                    onClick={() => navigate(menuRoutes[item])}
                  >
                    {item}
                  </li>
                ))}
              </ul>


            </motion.div>
          </>
        )}
      </AnimatePresence>

    </>

  );
};

export default MiddleBar;
