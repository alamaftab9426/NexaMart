import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMinus, FaPlus } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";

const LeftSideBar = ({
  dynamicFilters = {},
  setActiveSubCategory,
  setSelectedTag,
  closeFilter,
  brands = [],
  selectedBrands = [],
  setSelectedBrands,
  colors = [],
  selectedColors = [],
  setSelectedColors,
}) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showMore, setShowMore] = useState(false);


  const [selectedTags, setSelectedTags] = useState({});

  const toggleDropdown = (menu) =>
    setOpenDropdown(openDropdown === menu ? null : menu);

  const brandsToShow = showMore ? brands : brands.slice(0, 6);

  return (
    <div className="h-full min-h-[500px] rounded-lg bg-[#F7FAFB] p-5 shadow-sm border">
      <h2 className="text-xl font-semibold text-gray-700 mb-4 font-[Quicksand]">
        Menus
      </h2>

      <ul className="space-y-3 text-gray-700 font-[Quicksand]">

        {/* ================= CATEGORIES ================= */}
        {["Mens", "Women", "Kids", "Watch"]
          .filter((cat) => Array.isArray(dynamicFilters[cat]))
          .map((mainCat) => (
            <li key={mainCat}>
              {/* Header */}
              <div
                className="flex justify-between items-center cursor-pointer hover:text-[#2D8C91] border-b py-3 px-3"
                onClick={() => toggleDropdown(mainCat)}
              >
                <span className="font-semibold">{mainCat}</span>
                {openDropdown === mainCat ? <FaMinus /> : <FaPlus />}
              </div>

              {/* Sub Categories */}
              <AnimatePresence>
                {openDropdown === mainCat && (
                  <motion.ul
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="ml-4 mt-2 space-y-2 text-sm"
                  >
                    {dynamicFilters[mainCat].map((tag) => {
                      const checked =
                        selectedTags[mainCat]?.includes(tag) || false;

                      return (
                        <li key={tag} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="accent-[#2D8C91]"
                            checked={checked}
                            onChange={(e) => {
                              setSelectedTags((prev) => {
                                const prevTags = prev[mainCat] || [];
                                const updated = e.target.checked
                                  ? [...prevTags, tag]
                                  : prevTags.filter((t) => t !== tag);


                                if (e.target.checked) {
                                  setActiveSubCategory(mainCat);
                                  setSelectedTag(tag);
                                } else {
                                  setSelectedTag(null);
                                }

                                return { ...prev, [mainCat]: updated };
                              });

                              closeFilter?.();
                            }}
                          />

                          <span className="cursor-pointer hover:text-[#2D8C91]">
                            {tag}
                          </span>
                        </li>
                      );
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>
          ))}

        {/* ================= BRANDS ================= */}
        <li className="border-b py-3 px-3">
          <span className="font-semibold block mb-2">Brands</span>
          <ul className="space-y-2 text-sm">
            {brandsToShow.map((brand) => (
              <li key={brand} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="accent-[#2D8C91]"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => {
                    setSelectedBrands((prev) =>
                      prev.includes(brand)
                        ? prev.filter((b) => b !== brand)
                        : [...prev, brand]
                    );
                    closeFilter?.();
                  }}

                />
                <span>{brand}</span>
              </li>
            ))}
          </ul>

          {brands.length > 6 && (
            <button
              onClick={() => setShowMore(!showMore)}
              className="mt-2 text-sm text-[#2D8C91] font-medium hover:underline"
            >
              {showMore ? "Show Less" : "Show More"}
            </button>
          )}
        </li>

        {/* ================= COLORS ================= */}
        <li className="border-b py-4 px-3">
          <span className="font-semibold block mb-3">Colors</span>

          <div className="flex flex-col gap-2">
            {colors.map((c) => (
              <button
                key={c.code}
                onClick={() => {
                  setSelectedColors((prev) =>
                    prev.includes(c.code)
                      ? prev.filter((code) => code !== c.code)
                      : [...prev, c.code]
                  );
                  closeFilter?.(); 
                }}

                className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-all
                  ${selectedColors.includes(c.code)
                    ? "border-[#2D8C91] bg-[#2D8C91]/10"
                    : "border-gray-300 hover:border-[#2D8C91]"
                  }`}
              >
                <div
                  className="relative w-4 h-4 rounded-full border"
                  style={{ backgroundColor: c.code }}
                >
                  {selectedColors.includes(c.code) && (
                    <span className="absolute inset-0 flex items-center justify-center text-white text-[10px]">
                      <FaCheck />
                    </span>
                  )}
                </div>

                <span className="text-sm font-medium">{c.name}</span>
              </button>
            ))}
          </div>
        </li>
      </ul>
    </div>
  );
};

export default LeftSideBar;
