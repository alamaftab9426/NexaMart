import { useState, useEffect } from "react";
import Layout from "./Layout";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FaMicroblog } from "react-icons/fa6";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaArrowRightLong } from "react-icons/fa6";

const blogs = [
  {
    id: 1,
    img: "/images/classichats.jpg",
    title: "Fashion Trends",
    date: "01 Dec 2025",
    category: "Fashion",
    desc: 
    [
        "Discover latest fashion trends and boost your style.",
        "Discover latest fashion trends and boost your style. Discover latest fashion trends and boost your style.Discover latest fashion trends and boost your style.Discover latest fashion trends and boost your style.Discover latest fashion trends and boost your style.Discover latest fashion trends and boost your style.",


    ]
  },
  {
    id: 2,
    img: "/images/collection1.jpg",
    title: "E-Commerce Tips",
    date: "28 Nov 2025",
    category: "E-Commerce",
     desc: 
    [
        "Discover latest fashion trends and boost your style.",
        "Discover latest fashion trends and boost your style. Discover latest fashion trends and boost your style.Discover latest fashion trends and boost your style.Discover latest fashion trends and boost your style.Discover latest fashion trends and boost your style.Discover latest fashion trends and boost your style.",


    ]
  },
  {
    id: 3,
    img: "/images/collection2.jpg",
    title: "Shopping Guides",
    date: "26 Nov 2025",
    category: "Lifestyle",
     desc: 
    [
        "Discover latest fashion trends and boost your style.",
        "Discover latest fashion trends and boost your style. Discover latest fashion trends and boost your style.Discover latest fashion trends and boost your style.Discover latest fashion trends and boost your style.Discover latest fashion trends and boost your style.Discover latest fashion trends and boost your style.",


    ]
  },
  {
    id: 4,
    img: "/images/collection3.jpg",
    title: "Latest Online Selling Trends",
    date: "02 Dec 2025",
    category: "E-Commerce",
      desc: 
    [
        "Discover latest fashion trends and boost your style.",
        "Discover latest fashion trends and boost your style. Discover latest fashion trends and boost your style.Discover latest fashion trends and boost your style.Discover latest fashion trends and boost your style.Discover latest fashion trends and boost your style.Discover latest fashion trends and boost your style.",


    ]
  },
  {
    id: 5,
    img: "/images/collection2.jpg",
    title: "Top 10 Winter Fashion Styles",
    date: "30 Nov 2025",
    category: "Fashion",
      desc: 
    [
        "Discover latest fashion trends and boost your style.",
        "Discover latest fashion trends and boost your style. Discover latest fashion trends and boost your style.Discover latest fashion trends and boost your style.Discover latest fashion trends and boost your style.Discover latest fashion trends and boost your style.Discover latest fashion trends and boost your style.",


    ]
  },
  {
    id: 6,
    img: "/images/collection1.jpg",
    title: "Beginner Guide to Digital Ads",
    date: "28 Nov 2025",
    category: "Marketing",
     desc: 
    [
        "Discover latest fashion trends and boost your style.",
        "Discover latest fashion trends and boost your style. Discover latest fashion trends and boost your style.Discover latest fashion trends and boost your style.Discover latest fashion trends and boost your style.Discover latest fashion trends and boost your style.Discover latest fashion trends and boost your style.",


    ]
  },
];

const BlogPage = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const openBlog = (blog) => {
    setSelectedBlog(blog);
    setShowSidebar(false);
  };

  return (
    <Layout>
      {/* ---------------- HERO SECTION ---------------- */}
      <div className="relative w-full overflow-hidden font-[Quicksand]">
        <img
          src="./images/bgcat.png"
          className="w-full h-[160px] md:h-[250px] object-cover"
          alt=""
        />

        <div className="absolute inset-0 bg-[#EFF4F7]/35"></div>

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 text-gray-500">
            Blog Page
          </h1>

          <p className="text-base font-[Poppins]">
            <Link to="/signup" className="text-[#4B9097]">
              Signup
            </Link>
            <span className="text-gray-500 mx-2">&gt;&gt;</span>
            <span className="text-gray-500">Blog Page</span>
          </p>
        </div>
      </div>

      {/* ---------------- MOBILE BUTTON ---------------- */}
      <button
        className="md:hidden fixed top-[40%] left-1 bg-[#2D8C91] p-2 text-white rounded-full z-50"
        onClick={() => setShowSidebar(true)}
      >
        <FaMicroblog className="text-3xl" />
      </button>

      {/* ---------------- MOBILE SIDEBAR ---------------- */}
      <AnimatePresence>
        {showSidebar && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={() => setShowSidebar(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="fixed top-0 left-0 w-[280px] h-full bg-white z-50 md:hidden p-4 overflow-y-auto"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-end mb-3">
                <IoCloseCircleOutline
                  className="text-3xl cursor-pointer"
                  onClick={() => setShowSidebar(false)}
                />
              </div>

              <BlogSidebar onOpen={openBlog} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ---------------- MAIN LAYOUT ---------------- */}
      <div className="w-full mt-10 mb-10 px-4 md:px-28 flex gap-6">

        {/* LEFT SIDEBAR (DESKTOP) */}
        <div className="hidden md:block w-[350px] py-5 bg-[#EFF4F7] px-6 rounded-md">
          <BlogSidebar onOpen={openBlog} />
        </div>

        {/* ---------------- RIGHT SECTION ---------------- */}
        <div className="flex-1">

          {/* FULL BLOG VIEW */}
          {selectedBlog ? (
            <div className="bg-white  rounded-lg pb-9">

              <button
                onClick={() => setSelectedBlog(null)}
                className="mb-4 px-3 py-1 bg-[#4B9097] text-white rounded-md"
              >
                ← Back to Blogs
              </button>

              <div className="overflow-hidden rounded-lg mb-4">
                <img
                  src={selectedBlog.img}
                  className="w-full h-[300px] object-cover transition-all duration-500 hover:scale-105"
                  alt=""
                />
              </div>

              <p className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#2D8C91] rounded-full"></span>
                {selectedBlog.category} • {selectedBlog.date}
              </p>

              <h2 className="text-2xl font-semibold text-gray-700">
                {selectedBlog.title}
              </h2>
              <p className="mt-2 text-gray-600 leading-none tracking-tight text-[15px] font-semibold">
                {selectedBlog.desc[0]}
              </p>

              <p className="mt-4 text-gray-600 leading-relaxed text-[15px]">
                {selectedBlog.desc[1]}
              </p>
            </div>
          ) : (
          
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
              {blogs.map((item) => (
                <div
                  key={item.id}
                  onClick={() => openBlog(item)}
                  className="bg-white rounded-2xl overflow-hidden"
                >
                  <div className="relative overflow-hidden rounded-md">
                    <img
                      src={item.img}
                      className="w-full h-60 object-cover rounded-md transform transition-transform duration-500 hover:scale-110"
                      alt=""
                    />
                  </div>

                  <div className="mt-3 pb-4">
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#2D8C91] rounded-full"></span>
                      <span className="text-[#2D8C91] font-semibold">
                        {item.category}
                      </span>{" "}
                      • {item.date}
                    </p>

                    <h3 className="text-lg font-semibold text-gray-500  hover:text-[#2D8C91] cursor-pointer leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mt-2 leading-none tracking-tighter">{item.desc[0]}</p>

                    <button className=" flex py-2 font-semibold gap-2 text-gray-600 mt-2 hover hover:text-[#2D8C91]">Continue Reading <FaArrowRightLong  className="mt-2"/></button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
};

/* ---------------- LEFT SIDEBAR COMPONENT ---------------- */
const BlogSidebar = ({ onOpen }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <input
        type="text"
        placeholder="Search blogs..."
        className="w-full mb-4 px-3 py-2 border rounded-md"
      />

      <p className="text-gray-700 font-semibold mb-3">Latest Blogs</p>

      <div className="flex flex-col gap-4">
        {blogs.slice(0, 3).map((b) => (
          <div
            key={b.id}
            onClick={() => onOpen(b)}
            className="flex gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-100"
          >
            <img
              src={b.img}
              className="w-20 h-20 rounded-md object-cover"
              alt=""
            />

            <div className="flex flex-col">
              <h4 className="text-gray-700 font-semibold">{b.title}</h4>

              <p className="text-sm text-gray-500">{b.date}</p>

              <p className="text-sm text-gray-500 flex items-center gap-1">
                <span className="w-2 h-2 bg-[#2D8C91] rounded-full"></span>
                {b.category}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
