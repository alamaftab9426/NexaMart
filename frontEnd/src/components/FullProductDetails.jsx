import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import Layout from "./Layout";

const FullProductDetails = () => {
    // Static Product Data
    const product = {
        name: "Nike Air Max",
        category: "Shoes",
        rating: 4,
        description: [
            "is simply dummy text of the printing and typesetting industry...",
            "It has survived not only five centuries, but also the leap into electronic typesetting It has survived not only five centuries, but also the leap into electronic typesetting It has survived not only five centuries, but also the leap into electronic typesetting It has survived not only five centuries, but also the leap into electronic typesetting"
        ],
        variants: [
            {
                color: "red",
                sizes: [
                    { size: "M", price: 2000, oldPrice: 2500, image: ["/images/shirt1.jpg", "/images/red2.jpg"] },
                    { size: "L", price: 2000, oldPrice: 2500, image: ["/images/shirt2.jpg", "/images/red2.jpg"] },
                ],
            },
            {
                color: "blue",
                sizes: [
                    { size: "M", price: 2100, oldPrice: 2600, image: ["/images/blue1.jpg", "/images/blue2.jpg"] },
                    { size: "L", price: 2100, oldPrice: 2600, image: ["/images/blue1.jpg", "/images/blue2.jpg"] },
                ],
            },
        ],
    };

    // State for selected variant
    const [selectedVariant, setSelectedVariant] = useState({
        color: product.variants[0].color,
        size: product.variants[0].sizes[0].size,
        image: product.variants[0].sizes[0].image[0],
    });

    const currentVariant = product.variants.find(v => v.color === selectedVariant.color);
    const currentSize = currentVariant.sizes.find(s => s.size === selectedVariant.size);

    return (
        <Layout>
            <div className="flex flex-col md:flex-row gap-8 p-5 md:p-10 md:px-28">

                {/* Left Side - Thumbnails + Main Image */}
                <div className="flex md:w-1/2 gap-4">
                    {/* Thumbnails Vertical */}
                    <div className="flex flex-col gap-3 overflow-y-auto max-h-[500px] px-2 py-20">
                        {currentVariant.sizes.flatMap(s => s.image).map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                alt={`${product.name}-${idx}`}
                                className={`w-20 h-20 object-cover rounded-lg cursor-pointer transition-transform duration-200  ${selectedVariant.image === img
                                    ? "border-2 border-[#2D8C91] scale-105 shadow-md"
                                    : "border border-gray-300 hover:border-[#2D8C91]"
                                    }`}
                                onClick={() => setSelectedVariant(prev => ({ ...prev, image: img }))}
                            />
                        ))}
                    </div>

                    {/* Main Image - Centered */}
                    <div className="w-full h-[500px] border rounded-lg overflow-hidden p-2 bg-white  flex items-center justify-center">
                        <img
                            src={selectedVariant.image}
                            alt={product.name}
                            className="max-w-full max-h-full object-contain rounded-lg"
                        />
                    </div>
                </div>


                {/* Right Side - Product Details */}
                <div className="md:w-1/2 flex flex-col gap-3">

                    <div>
                        <h1 className="text-2xl md:text-4xl font-bold">{product.name}</h1>
                        <p className="text-gray-500">{product.category}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-[#2D8C91] text-xl font-bold">₹{currentSize.price}</span>
                        <span className="line-through text-gray-400">₹{currentSize.oldPrice}</span>
                    </div>

                    {product.description.map((desc, idx) => (
                        <p key={idx} className="text-gray-600 text-justify leading-5">{desc}</p>
                    ))}

                    {/* Color Selection */}
                    <div className="flex gap-3 items-center mt-2">
                        <span className="font-semibold">Colors:</span>
                        {product.variants.map((v, idx) => (
                            <button
                                key={idx}
                                style={{ backgroundColor: v.color }}
                                className={`w-8 h-8 rounded-full border-2 transition-all ${selectedVariant.color === v.color ? "border-[#2D8C91] scale-110 shadow-md" : "border-gray-300 hover:border-[#2D8C91]"
                                    }`}
                                onClick={() => setSelectedVariant({
                                    color: v.color,
                                    size: v.sizes[0].size,
                                    image: v.sizes[0].image[0]
                                })}
                            />
                        ))}
                    </div>

                    {/* Size Selection */}
                    <div className="flex gap-2 items-center mt-2">
                        <span className="font-semibold">Sizes:</span>
                        {currentVariant.sizes.map((s, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedVariant(prev => ({ ...prev, size: s.size, image: s.image[0] }))}
                                className={`px-3 py-1 border rounded-md transition-all ${selectedVariant.size === s.size ? "bg-[#2D8C91] text-white border-[#2D8C91]" : "border-gray-300 text-gray-600 hover:border-[#2D8C91]"
                                    }`}
                            >
                                {s.size}
                            </button>
                        ))}
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-3 mt-3">
                        <span className="font-semibold">Quantity:</span>
                        <div className="flex items-center border rounded-md overflow-hidden">
                            <button
                                className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
                                onClick={() => setSelectedVariant(prev => ({
                                    ...prev,
                                    quantity: prev.quantity > 1 ? prev.quantity - 1 : 1
                                }))}
                            >
                                -
                            </button>
                            <span className="px-4 py-1">{selectedVariant.quantity || 1}</span>
                            <button
                                className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
                                onClick={() => setSelectedVariant(prev => ({
                                    ...prev,
                                    quantity: (prev.quantity || 1) + 1
                                }))}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-5 mt-5">
                        <button
                            className="bg-[#2D8C91] text-white px-6 py-2 rounded-lg hover:bg-[#1F6B6F] transition-all"
                            onClick={() => console.log("Add to Cart:", selectedVariant)}
                        >
                            Add to Cart
                        </button>
                        <button
                            className="bg-[#2D8C91] text-white px-6 py-2 rounded-lg hover:bg-[#1F6B6F] transition-all"
                            onClick={() => console.log("Buy Now:", selectedVariant)}
                        >
                            Buy Now
                        </button>
                    </div>
                </div>

            </div>
        </Layout>
    );
};

export default FullProductDetails;
