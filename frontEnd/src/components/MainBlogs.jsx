import React from "react";
import { Link } from "react-router-dom"; 
import Layout from "./Layout";

const MainBlogs = () => {
  return (
    <Layout>
      <div className="relative w-full overflow-hidden font-[Quicksand]">
        {/* Background Image */}
        <img
          src="./images/bgcat.png"
          alt="Shop Banner"
          className="w-full h-[160px] md:h-[250px] object-cover"
        />

        {/* Overlay with soft color */}
        <div className="absolute inset-0 bg-[#EFF4F7]/40"></div>

        {/* Left Decorative Image */}
        <img
          src="./images/left.png"
          alt="Left Decoration"
          className="absolute left-0 bottom-0 w-[140px] md:w-[250px] object-contain animate__animated animate__fadeInLeft"
        />

        {/* Right Decorative Image */}
        <img
          src="./images/right.png"
          alt="Right Decoration"
          className="absolute right-0 bottom-0 w-[140px] md:w-[250px] object-contain animate__animated animate__fadeInRight"
        />

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 font-[Quicksand] text-gray-600">
         Blog Page
          </h1>
          <p className="text-base font-[Poppins,sans-serif]">
            <Link to="/" className="text-md text-[#4B9097] hover:underline">
              Home
            </Link>
            <span className="text-gray-500 mx-2">&gt;&gt;</span>
           
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default MainBlogs;
