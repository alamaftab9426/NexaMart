import React, { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { FaShoppingCart, FaEye, FaHeart } from "react-icons/fa";

const UserWishlist = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      image: ["./images/shirt1.jpg", "./images/shirt2.jpg"],
      name: "Check Shirt For Women",
      category: "Shirt",
      price: 80,
      oldPrice: 120,
      colors: ["#c1d3a4", "#b4c6b1", "#d8e2dc"],
      sizes: ["S", "M", "L", "XL"],
      tag: "NEW",
    },
    {
      id: 2,
      image: ["./images/sandale1.jpg", "./images/sandale2.jpg"],
      name: "Classic Sandals For Women",
      category: "Sandals",
      price: 80,
      oldPrice: 120,
      colors: ["#c1d3a4", "#b4c6b1", "#d8e2dc"],
      sizes: ["S", "M", "L", "XL"],
      tag: "NEW",
    },
    {
      id: 3,
      image: ["./images/watch1.jpg", "./images/watch2.jpg"],
      name: "Black Watch For Men",
      category: "Watch",
      price: 1900,
      oldPrice: 2000,
      colors: ["#f4cccc", "#f9cb9c"],
      sizes: [],
      tag: "NEW",
    },
    {
      id: 4,
      image: ["./images/bag1.jpg", "./images/bag2.jpg"],
      name: "Leather Bag",
      category: "Accessories",
      price: 1500,
      oldPrice: 1800,
      colors: ["#e4d1b9", "#d1c7b3"],
      sizes: [],
      tag: "NEW",
    },
    {
      id: 5,
      image: ["./images/shirt1.jpg", "./images/shirt2.jpg"],
      name: "Classic Tshirt For Men",
      category: "Tshirt",
      price: 999,
      oldPrice: 1300,
      colors: ["#f4cccc", "#f9cb9c"],
      sizes: ["M", "XL", "L"],
      tag: "NEW",
    },
  ]);

  const removeProduct = (id) => {
    setProducts(products.filter((item) => item.id !== id));
  };

  // Dummy handlers so component doesn't crash
  const addToCart = (product) => {
    alert(`Added ${product.name} to cart!`);
  };
  const openView = (product) => {
    alert(`Viewing ${product.name}`);
  };

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-6 border px-2">
      {products.map((product) => (
        <div
          key={product.id}
          className="relative bg-white rounded-2xl overflow-hidden transition-all duration-300 group border"
        >
          {/* Remove Button */}
          <button
            onClick={() => removeProduct(product.id)}
            className="absolute top-3 right-3 text-red-500 hover:text-red-700 z-10"
          >
            <FiTrash2 size={20} />
          </button>

          {/* Product Image */}
          <div className="relative w-full h-56 overflow-hidden">
            <img
              src={product.image[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-opacity duration-700 group-hover:opacity-0"
            />
            <img
              src={product.image[1]}
              alt={product.name}
              className="w-full h-full object-cover absolute top-0 left-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            />

            {/* Hover Icons */}
            <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out">
              <div
                className="bg-black p-3 rounded-full text-white hover:bg-[#2D8C91] cursor-pointer transition"
                onClick={() => addToCart(product)}
              >
                <FaShoppingCart />
              </div>
              <div
                className="bg-black p-3 rounded-full text-white hover:bg-[#2D8C91] cursor-pointer transition"
                onClick={() => openView(product)}
              >
                <FaEye />
              </div>
              <div className="bg-black p-3 rounded-full text-white hover:bg-[#2D8C91] cursor-pointer transition">
                <FaHeart />
              </div>
            </div>

            {product.tag && (
              <span className="absolute top-3 left-3 bg-[#2D8C91] text-white text-xs px-2 py-1 rounded-md">
                {product.tag}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="p-4">
            <p className="text-sm text-gray-500">{product.category}</p>
            <h3 className="text-lg font-semibold text-gray-700 mt-1 h-12">
              {product.name}
            </h3>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-[#2D8C91] font-bold text-lg">₹{product.price}</span>
              <span className="text-gray-400 line-through">₹{product.oldPrice}</span>
            </div>

            {/* Sizes */}
            {product.sizes.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-3">
                {product.sizes.map((size, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 text-sm border border-gray-300 rounded-md text-gray-600"
                  >
                    {size}
                  </span>
                ))}
              </div>
            )}

            {/* Colors */}
            {product.colors.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {product.colors.map((color, i) => (
                  <span
                    key={i}
                    className="w-6 h-6 rounded-full border border-gray-300"
                    style={{ backgroundColor: color }}
                  ></span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserWishlist;
