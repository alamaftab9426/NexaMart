import React from "react";
import { FaGlobe, FaTrophy } from "react-icons/fa";

const AboutUs = () => {
    return (
        <div id="about" className="py-16 md:px-28 px-6 grid md:grid-cols-2 grid-cols-1 gap-10 ">
            {/* ==== LEFT SECTION ==== */}
            <div className="relative flex   mt-16 ">
                {/* Big Image */}
                <img
                    src="./images/imageshop.jpg"
                    alt="Main Store"
                    className="w-full max-w-[420px] h-auto rounded-[100px] object-cover shadow-lg"
                />

                {/* Small Image */}
                <img
                    src="./images/imageshop2.jpg"
                    alt="Team"
                    className="absolute bottom-[-30px] right-[25px] w-[55%] max-w-[300px] object-cover border-[10px] border-white  
          rounded-tl-[20px] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[150px]"
                />

                {/* Experience Badge */}
                <div className="absolute top-[143px] right-[47px] bg-[#2d8c91] text-white px-7 py-6 shadow-lg flex flex-col justify-center items-center w-[150px] h-[120px] rounded-tl-lg rounded-tr-full rounded-bl-md rounded-br-md font-[Quicksand]">
                    <h1 className="text-[40px] font-bold pr-5">15+</h1>
                    <p className="text-sm leading-tight text-center pr-6">
                        Years<br />Experience
                    </p>
                </div>

            </div>

            {/* ==== RIGHT SECTION ==== */}
            <div className="space-y-3">
                <h4 className="text-[#2d8c91] font-semibold text-lg">
                    * About Our Company
                </h4>

                <h1 className="text-4xl md:text-4xl font-bold leading-tight text-gray-500 font-[Quicksand]">
                    We Provide Cost Effective <br /> Solution For You
                </h1>

                <p className="font-[Quicksand] text-[17px] leading-relaxed text-gray-600  pt-5">
                    It is a long established fact that a reader will be distracted by the
                    readable content of a page when looking at its layout. The point of
                    using Lorem Ipsum is that it has a more-or-less normal distribution of
                    letters.
                </p>

                {/* ==== Info Boxes ==== */}
                <div className="space-y-6  pt-10">
                    {/* Box 1 */}
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center border-2 border-dotted border-[#2d8c91] rounded-md bg-slate-100">
                            <FaGlobe className="text-[#2d8c91] text-3xl" />
                        </div>
                        <div>
                            <h3 className="text-lg md:text-xl font-semibold text-gray-700">
                                Worldwide Services
                            </h3>
                            <p className="text-gray-600 text-sm md:text-[15px] mt-1">
                                We offer global support and solutions with years of trusted
                                service in multiple regions and industries.
                            </p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-b border-gray-300 w-full"></div>

                    {/* Box 2 */}
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center border-2 border-dotted border-[#2d8c91] rounded-md bg-slate-100">
                            <FaTrophy className="text-[#2d8c91] text-3xl" />
                        </div>
                        <div>
                            <h3 className="text-lg md:text-xl font-semibold text-gray-700">
                                Best Company Award Winner
                            </h3>
                            <p className="text-gray-600 text-sm md:text-[15px] mt-1">
                                Recognized for outstanding service and innovation, we are proud
                                to have received multiple excellence awards.
                            </p>
                        </div>
                    </div>
                </div>
                 <button className="mt-8 bg-[#2d8c91] text-white px-5 py-2 rounded-full text-lg font-semibold shadow-md hover:bg-[#256f74] transition duration-300 ">
          Learn More
        </button>

            </div>
        </div>
    );
};

export default AboutUs;
