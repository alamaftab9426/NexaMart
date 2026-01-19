import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Layout from "../Layout";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import LeftSideBar from "./LeftSideBar";
import RightCarts from "./RightCarts";
import { MdMenuOpen } from "react-icons/md";
import { IoCloseCircleOutline } from "react-icons/io5";

// ---------------- CATEGORY DATA ----------------
const categories = [
  { name: "All", image: "/images/Shirts.jpg" },
  { name: "Shirts", image: "/images/Shirts.jpg" },
  { name: "T-shirts", image: "/images/tshirt2.jpg" },
  { name: "Watches", image: "/images/Watch.jpg" },
  { name: "Gowns", image: "/images/blue.jpg" },
  { name: "Sunglasses", image: "/images/Glass.jpg" },
  { name: "Caps", image: "/images/Caps.jpg" },
  { name: "Shoes", image: "/images/Shoes.jpg" },
];

const CategoryMainPage = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [dynamicFilters, setDynamicFilters] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilter, setShowFilter] = useState(false);
  const rightCartRef = useRef(null);
  // NEW STATES
  const [topCategory, setTopCategory] = useState("All");
  const [activeSubCategory, setActiveSubCategory] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");

  // FILTERS FOR BRANDS
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [brands, setBrands] = useState([]);

  const [colors, setColors] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);


  const closeFilter = () => setShowFilter(false);

  //  FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/products`);
        setAllProducts(res.data);
      } catch (err) {
        console.error("Product fetch error", err);
      }
    };
    fetchProducts();
  }, []);



  useEffect(() => {
    if (!allProducts.length) return;
    const filters = {};
    const brandSet = new Set();
    const colorMap = new Map();

    allProducts.forEach(product => {
      const mainCat = product.subCategoryId?.name;
      if (!mainCat) return;

      // Tags
      if (!filters[mainCat]) filters[mainCat] = new Set();
      if (Array.isArray(product.tagId)) {
        product.tagId.forEach(tag => {
          if (tag?.label) filters[mainCat].add(tag.label);
        });
      }

      // Brands
      if (product.brandId?.name) brandSet.add(product.brandId.name);

      // Colors
      if (Array.isArray(product.variants)) {
        product.variants.forEach(v => {
          if (v.color?.code) {
            colorMap.set(v.color.code, {
              name: v.color.name,
              code: v.color.code,
            });
          }
        });
      }

    });

    setDynamicFilters(
      Object.fromEntries(
        Object.entries(filters).map(([cat, tags]) => [cat, Array.from(tags)])
      )
    );
    setBrands(Array.from(brandSet));
    setColors([...colorMap.values()]);

  }, [allProducts]);


  //FILTER PRODUCTS
  const filteredProducts = allProducts.filter((p) => {
    const topMatch =
      topCategory === "All" || p.tagId?.some((t) => t.label === topCategory);

    const subCatMatch =
      activeSubCategory === "All" || p.subCategoryId?.name === activeSubCategory;

    const tagMatch =
      selectedTag === "All" || p.tagId?.some((t) => t.label === selectedTag);

    const brandMatch =

      selectedBrands.length === 0 ||
      selectedBrands.includes(p.brandId?.name);

    const colorMatch =
      selectedColors.length === 0 ||
      p.variants?.some(v =>
        selectedColors.includes(v.color?.code)
      );


    return topMatch && subCatMatch && tagMatch && brandMatch && colorMatch;
  });


  useEffect(() => {
    filteredProducts.forEach(p => {
    });
  }, [filteredProducts]);





  return (
    <Layout>
      {/* HERO SECTION */}
      <div className="relative w-full overflow-hidden font-[Quicksand]">
        <img
          src="./images/bgcat.png"
          alt="Shop Banner"
          className="w-full h-[160px] md:h-[250px] object-cover"
        />
        <div className="absolute inset-0 bg-[#EFF4F7]/35"></div>
        <img
          src="./images/left.png"
          alt="Left Decoration"
          className="absolute left-0 bottom-0 w-[140px] md:w-[250px] object-contain"
        />
        <img
          src="./images/right.png"
          alt="Right Decoration"
          className="absolute right-0 bottom-0 w-[140px] md:w-[250px] object-contain"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 text-gray-500">Shop Page</h1>
          <p className="text-base">
            <Link to="/" className="text-md text-[#4B9097]">Home</Link>
            <span className="text-gray-500 mx-2">&gt;&gt;</span>
            <span className="text-gray-500">Shop Page</span>
          </p>
        </div>
      </div>

      {/* CATEGORY SLIDER */}
      <motion.section className="py-10 md:py-20 md:px-28"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="px-6">
          <Swiper
            modules={[Pagination]}
            spaceBetween={30}
            grabCursor
            breakpoints={{ 0: { slidesPerView: 2 }, 640: { slidesPerView: 3 }, 1024: { slidesPerView: 5 } }}
          >
            {categories.map((item, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  className={`relative pt-[70px] bg-[#F7FAFB] pb-[20px] rounded-[10px] border border-dashed cursor-pointer text-center mt-10 transition-all duration-300 ${selectedCategory.toLowerCase() === item.name.toLowerCase()
                    ? "border-[#2d8c91] text-[#2d8c91]"
                    : "border-gray-300 text-gray-700"
                    }`}
                  onClick={() => {
                    setTopCategory(item.name);
                    setActiveSubCategory("All");
                    setSelectedTag("All");
                    rightCartRef.current?.scrollIntoView({ behavior: "smooth" });
                  }}

                >
                  <div className="flex items-center left-[50%] translate-x-[-50%] justify-center absolute w-[100px] h-[100px] top-[-50px] rounded-[14px]
                    before:content-[''] before:absolute before:h-[50%] before:w-full before:border before:border-dashed before:border-[#2d8c91] before:rounded-bl-[14px] before:rounded-br-[14px] before:border-t-0 before:bottom-0 before:left-0">
                    <img src={item.image} alt={item.name} className="w-auto" />
                  </div>
                  <h3 className="text-gray-700 font-semibold text-lg mt-3">{item.name}</h3>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </motion.section>

      {/* PRODUCT GRID + FILTER */}
      <div className="mt-2 md:mt-10 w-full min-h-screen mb-8 px-6 md:px-28 md:flex gap-6">
        {/* MOBILE FILTER BUTTON */}
        <button
          className="md:hidden fixed bottom-32 left-1 bg-[#2D8C91] p-2 text-white rounded-full z-50"
          onClick={() => setShowFilter(true)}
        >
          <MdMenuOpen className="text-3xl" />
        </button>

{/* MOBILE SIDEBAR SLIDE */}
        <AnimatePresence>
          {showFilter && (
            <>
              {/* BACKDROP */}
              <motion.div
                className="fixed inset-0 bg-black/40 z-40 md:hidden"
                onClick={closeFilter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />

              {/* SIDEBAR */}
              <motion.div
                className="fixed top-0 left-0 h-screen w-[85%] max-w-[320px] bg-[#F7FAFB] shadow-2xl z-50 md:hidden flex flex-col"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {/* HEADER */}
                <div className="flex items-center justify-between px-4 py-3 border-b bg-[#F7FAFB] sticky top-0 z-10">
                  <h3 className="text-lg font-semibold text-gray-700 font-[Quicksand]">
                    Filters
                  </h3>
                  <button onClick={closeFilter}>
                    <IoCloseCircleOutline className="text-2xl text-gray-600 hover:text-black" />
                  </button>
                </div>

                {/* CONTENT */}
                <div className="flex-1 overflow-y-auto">
                  <LeftSideBar
                    closeFilter={closeFilter}
                    dynamicFilters={dynamicFilters}
                    brands={brands}
                    selectedBrands={selectedBrands}
                    setSelectedBrands={setSelectedBrands}
                    colors={colors}
                    selectedColors={selectedColors}
                    setSelectedColors={setSelectedColors}
                    setActiveSubCategory={setActiveSubCategory}
                    setSelectedTag={setSelectedTag}
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>


        {/* DESKTOP SIDEBAR */}
        <div className="hidden md:block w-[260px]">
          <LeftSideBar
            dynamicFilters={dynamicFilters}
            setActiveSubCategory={setActiveSubCategory}
            setSelectedTag={setSelectedTag}
            closeFilter={closeFilter}
            brands={brands}
            selectedBrands={selectedBrands}
            setSelectedBrands={setSelectedBrands}
            colors={colors}
            selectedColors={selectedColors}
            setSelectedColors={setSelectedColors}
          />


        </div>

        {/* PRODUCTS GRID */}
        <div className="flex-1" ref={rightCartRef}>
          <RightCarts productsData={filteredProducts} selectedCategory={selectedCategory} />
        </div>
      </div>
    </Layout>
  );
};

export default CategoryMainPage;
