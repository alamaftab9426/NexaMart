import React, { useState, useContext } from "react";
import { GoChevronDown } from "react-icons/go";
import { FaUser, FaHeart, FaShoppingCart, FaPlus, FaMinus, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { FaSquareInstagram } from "react-icons/fa6";
import { IoLogoTwitter } from "react-icons/io5";
import { FaFacebookSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { MdAssignment, MdLocationOn } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MainMenu = () => {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logoutUser } = useContext(UserContext)
    const isLoggedIn = false;
    const [isUserOpen, setIsUserOpen] = useState(false);
    const toggleDropdown = (menu) => {
        setOpenDropdown(openDropdown === menu ? null : menu);
    };

    const dropdownVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
    };

    const sidebarVariants = {
        hidden: { x: "-100%" },
        visible: { x: 0 },
        exit: { x: "-100%" },
    };
    const closeAllMenus = () => {
        setOpenDropdown(null);
        setSidebarOpen(false);
    };
    const navigate = useNavigate();
    const closeDropdown = () => setOpenDropdown(null);
    const handleScrollTo = (sectionId) => {
        navigate("/");

        setTimeout(() => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: "smooth" });
            }

            closeAllMenus()
        }, 100);
    };
    
 const logoutFun = () => {
    logoutUser();
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    toast.success("Logout Successful !", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      pauseOnHover: true,
      draggable: true,
      style: { backgroundColor: "#000", color: "#fff", fontSize:'15px' },
      transition: Slide,
    });
    setTimeout(() => {
      navigate("/login");
    }, 3000);
  };

    return (
        <div className="bg-white border-t relative border-gray-200 shadow-sm lg:z-20 px-4 md:px-28 py-3  ">
            {/* Desktop Navbar */}
            <nav className="hidden md:flex justify-between items-center lg:max-w-[1280px] mx-auto">
                <ul className="flex justify-center gap-8 py-3 font-medium text-gray-600 text-md">
                    {["home", "categories", "products", "pages", "blog"].map((menu) => (
                        <li key={menu} className="relative cursor-pointer select-none">
                            <div
                                onClick={() => toggleDropdown(menu)}
                                className="flex items-center gap-1 hover:text-teal-500"
                            >
                                {menu.charAt(0).toUpperCase() + menu.slice(1)}
                                <motion.span
                                    animate={{ rotate: openDropdown === menu ? 180 : 0 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <GoChevronDown />
                                </motion.span>
                            </div>

                            <AnimatePresence>
                                {openDropdown === menu && (
                                    <motion.ul
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        variants={dropdownVariants}
                                        transition={{ duration: 0.25 }}
                                        className="absolute bg-white text-gray-500 mt-2 shadow-lg rounded-md text-sm overflow-hidden w-40"
                                    >
                                        {/* Sample dropdown content */}
                                        {menu === "home" && (
                                            <>
                                                <li className="hover:bg-gray-100 px-4 py-2" onClick={() => { navigate("/"); }}>Home 1</li>

                                            </>
                                        )}
                                        {menu === "categories" && (
                                            <>
                                                <li className="hover:bg-gray-100 px-4 py-2 " onClick={() => { navigate("/category") }}>Men</li>
                                                <li className="hover:bg-gray-100 px-4 py-2" onClick={() => { navigate("/category") }}>Women</li>
                                                <li className="hover:bg-gray-100 px-4 py-2" onClick={() => { navigate("/category") }}>Kids</li>
                                            </>
                                        )}
                                        {menu === "products" && (
                                            <>
                                                <li
                                                    className="hover:bg-gray-100 px-4 py-2 cursor-pointer"
                                                    onClick={() => handleScrollTo("products")}
                                                >
                                                    New Arrival
                                                </li>

                                                <li
                                                    className="hover:bg-gray-100 px-4 py-2 cursor-pointer"
                                                    onClick={() => handleScrollTo("products")}
                                                >
                                                    Top Rated
                                                </li>

                                                <li
                                                    className="hover:bg-gray-100 px-4 py-2 cursor-pointer"
                                                    onClick={() => handleScrollTo("best")}
                                                >
                                                    Best Product
                                                </li>



                                            </>
                                        )}
                                        {menu === "pages" && (
                                            <>
                                                <li
                                                    className="hover:bg-gray-100 px-4 py-2 cursor-pointer"
                                                    onClick={() => handleScrollTo("about")}
                                                >
                                                    About
                                                </li>

                                                <li
                                                    className="hover:bg-gray-100 px-4 py-2 cursor-pointer"
                                                    onClick={() => navigate("/contact")}
                                                >
                                                    Contact
                                                </li>

                                                <li
                                                    className="hover:bg-gray-100 px-4 py-2 cursor-pointer"
                                                    onClick={() => handleScrollTo("/faq")}
                                                >
                                                    FAQ
                                                </li>
                                            </>
                                        )}

                                        {menu === "blog" && (
                                            <>
                                                <li
                                                    className="hover:bg-gray-100 px-4 py-2 cursor-pointer"
                                                    onClick={() => handleScrollTo("blog")}
                                                >
                                                    FAQ
                                                </li>
                                                <li className="hover:bg-gray-100 px-4 py-2" onClick={() => handleScrollTo("best")}>Popular</li>

                                            </>
                                        )}
                                    </motion.ul>
                                )}
                            </AnimatePresence>
                        </li>
                    ))}
                    <li className="hover:text-teal-500 cursor-pointer select-none" onClick={() => handleScrollTo("offer")}>Offers</li>
                </ul>

                <div className="relative w-full max-w-[200px]">
                    <MdLocationOn className="absolute left-2 top-1/2 transform -translate-y-1/2 text-teal-600 text-lg" />
                    <input
                        type="text"
                        placeholder="Location"
                        className="pl-8 pr-3 py-1.5 w-full border border-gray-300 rounded-full text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                </div>

            </nav>

            {/* Mobile Navbar */}
            <div className="flex md:hidden justify-center gap-8 py-3 text-2xl text-gray-700">
                <div
                    className="relative"
                    onMouseEnter={() => setIsUserOpen(true)}
                    onMouseLeave={() => setIsUserOpen(false)}
                >

                    <div className="text-xl text-gray-700">
                        <FaUser className="" />

                        <div className="flex flex-col leading-tight">

                            <span className="text-sm font-medium text-gray-800 hover:text-teal-500">
                                {isLoggedIn ? "" : ""}
                            </span>
                        </div>
                    </div>

                    {/* USER DROPDOWN */}
                    {isUserOpen && (
                        <div className="absolute top-6 left-[-65px] w-40 bg-white shadow-xl rounded-lg py-2 z-50 border">
                            {user ? (
                                <>
                                    {/* PROFILE */}
                                    <div
                                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => navigate("/profile")}
                                    >
                                        Profile
                                    </div>

                                

                                    {/* CART */}
                                    <div
                                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => navigate("/cartpage")}
                                    >
                                        Cart
                                    </div>

                                    {/* LOGOUT */}
                                    <div
                                        className="px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer font-medium border-t"
                                        onClick={logoutFun}
                                    >
                                        Logout
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* LOGIN */}
                                    <div
                                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => navigate("/login")}
                                    >
                                        Login
                                    </div>

                                    {/* SIGNUP */}
                                    <div
                                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => navigate("/signup")}
                                    >
                                        Signup
                                    </div>
                                </>
                            )}
                        </div>
                    )}
<ToastContainer/>

                </div>
                <FaHeart className="cursor-pointer hover:text-teal-500" onClick={() => { navigate("/wishlist") }} />
                <FaShoppingCart className="cursor-pointer hover:text-teal-500" onClick={() => { navigate("/cartpage") }} />
                <MdAssignment
                    className="cursor-pointer hover:text-teal-500"
                    onClick={() => setSidebarOpen(true)}
                />
            </div>

            {/* Sidebar (for mobile) */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50"
                            onClick={() => setSidebarOpen(false)}
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
                            className="fixed  mt-5 top-0 left-0 h-full w-72 bg-white shadow-lg z-[60] p-5 overflow-y-auto rounded-tr-md rounded-bl-md flex flex-col justify-between"
                        >

                            {/* Top Section - Menu */}
                            <div>
                                <div className="flex justify-between items-center mb-5 ">
                                    <h2 className="text-lg font-semibold text-gray-700">My Menu</h2>
                                    <FaTimes
                                        className="cursor-pointer text-gray-600"
                                        onClick={() => setSidebarOpen(false)}
                                    />
                                </div>

                                <ul className="space-y-3 text-gray-700">
                                    {["home", "categories", "products", "pages", "blog"].map((menu) => (
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

                                            <AnimatePresence>
                                                {openDropdown === menu && (
                                                    <motion.ul
                                                        initial="hidden"
                                                        animate="visible"
                                                        exit="exit"
                                                        variants={{
                                                            hidden: { opacity: 0, height: 0 },
                                                            visible: { opacity: 1, height: "auto" },
                                                            exit: { opacity: 0, height: 0 },
                                                        }}
                                                        transition={{ duration: 0.25 }}
                                                        className="ml-4 mt-2 space-y-2 text-sm text-gray-600  "
                                                    >
                                                        {menu === "home" && (
                                                            <>

                                                                <li className="hover:text-teal-500" onClick={() => {
                                                                    navigate("/"); closeAllMenus();
                                                                }}>Home </li>
                                                            </>
                                                        )}
                                                        {menu === "categories" && (
                                                            <>
                                                                <li className="hover:text-teal-500" onClick={() => {
                                                                    navigate("/category"); closeAllMenus();
                                                                }}>Men</li>
                                                                <li className="hover:text-teal-500" onClick={() => {
                                                                    navigate("/category"); closeAllMenus();
                                                                }}>Women</li>
                                                                <li className="hover:text-teal-500" onClick={() => {
                                                                    navigate("/category"); closeAllMenus();
                                                                }}>Kids</li>
                                                            </>
                                                        )}
                                                        {menu === "products" && (
                                                            <>
                                                                <li className="hover:text-teal-500" onClick={() => {
                                                                    handleScrollTo("products"); closeAllMenus();
                                                                }}>New Arrivals</li>
                                                                <li className="hover:text-teal-500" onClick={() => {
                                                                    handleScrollTo("products"); closeAllMenus();
                                                                }}>Best Sellers</li>
                                                                <li className="hover:text-teal-500" onClick={() => {
                                                                    handleScrollTo("best"); closeAllMenus();
                                                                }}>Discounted</li>
                                                            </>
                                                        )}
                                                        {menu === "pages" && (
                                                            <>
                                                                <li className="hover:text-teal-500" onClick={() => {
                                                                    handleScrollTo("about"); closeAllMenus();
                                                                }}>About</li>
                                                                <li className="hover:text-teal-500" onClick={() => {
                                                                    navigate("/contact"); closeAllMenus();
                                                                }}>Contact</li>
                                                                <li className="hover:text-teal-500" onClick={() => {
                                                                    navigate("/faq"); closeAllMenus();
                                                                }}>FAQ</li>
                                                            </>
                                                        )}
                                                        {menu === "blog" && (
                                                            <>
                                                                <li className="hover:text-teal-500" onClick={() => {
                                                                    handleScrollTo("blog"); closeAllMenus();
                                                                }}>Latest</li>
                                                                <li className="hover:text-teal-500" onClick={() => {
                                                                    handleScrollTo("best"); closeAllMenus();
                                                                }}>Popular</li>

                                                            </>
                                                        )}
                                                    </motion.ul>
                                                )}
                                            </AnimatePresence>
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex justify-center top-0 gap-5 text-2xl text-gray-600  mb-2 mt-5">
                                    <FaSquareInstagram className="hover:text-pink-500 cursor-pointer" />
                                    <IoLogoTwitter className="hover:text-sky-500 cursor-pointer" />
                                    <FaFacebookSquare className="hover:text-blue-600 cursor-pointer" />
                                    <FaLinkedin className="hover:text-blue-500 cursor-pointer" />
                                </div>
                            </div>

                       


                        </motion.div>
                    </>
                )}
            </AnimatePresence>


        </div>
    );
};

export default MainMenu;
