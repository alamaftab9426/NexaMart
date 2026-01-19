import React from "react";
import Layout from "./Layout";
import { Mail, Phone, MapPin, Facebook, Instagram, Send } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
const ContactPage = () => {
  return (
    <Layout>
      {/* ==================== TOP BANNER ==================== */}
     <div id="contact" className="relative w-full overflow-hidden font-[Quicksand]">
        <img
          src="./images/bgcat.png"
          alt="Cart Banner"
          className="w-full h-[160px] md:h-[250px] object-cover"
        />

        <div className="absolute inset-0 bg-[#EFF4F7]/35"></div>

        <img
          src="./images/left.png"
          alt="Left Decoration"
          className="absolute left-0 bottom-0 w-[140px] md:w-[250px] object-contain animate__animated animate__fadeInLeft"
        />

        <img
          src="./images/right.png"
          alt="Right Decoration"
          className="absolute right-0 bottom-0 w-[140px] md:w-[250px] object-contain animate__animated animate__fadeInRight"
        />

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 text-gray-500">
           Contact Us
          </h1>

          <p className="text-base font-[Poppins]">
            <Link to="/" className="text-[#4B9097]">Home</Link>
            <span className="text-gray-500 mx-2">&gt;&gt;</span>
            <span className="text-gray-500">Contact Us</span>
          </p>
        </div>
      </div>

      {/* ==================== CONTACT SECTION ==================== */}
      <div className="w-full bg-white py-10 px-4 md:px-20 font-[Quicksand]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 ">

          {/* LEFT SIDE INFO */}
          <div className="space-y-6 bg-[#F7FAFB] px-4 md:px-10  py-3  rounded-md">
            <h2 className="text-2xl md:text-3xl font-bold text-[#2d8c91]">
              Get In Touch
            </h2>
            <p className="text-gray-600">
              Feel free to contact us for any support or business-related help.
              Our team is always ready to assist you.
            </p>

            {/* Address */}
            <div className="flex items-start gap-4">
              <MapPin size={28} className="text-[#2d8c91]" />
              <p className="text-gray-700">
                123 Market Road, Delhi, India – 110001
              </p>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <Phone size={28} className="text-[#2d8c91]" />
              <p className="text-gray-700">+91 98765 43210</p>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <Mail size={28} className="text-[#2d8c91]" />
              <p className="text-gray-700">support@example.com</p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-5 mt-5">
              <Facebook size={28} className="text-gray-600 hover:text-[#2d8c91] cursor-pointer" />
              <Instagram size={28} className="text-gray-600 hover:text-[#2d8c91] cursor-pointer" />
            </div>
          </div>

          {/* RIGHT SIDE FORM */}
          <div className=" p-6 md:p-8 rounded-xl border space-y-5">
            <h2 className="text-2xl font-bold text-gray-700">Send Message</h2>

            <div>
              <label className="text-sm text-gray-600 font-semibold">Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full p-3 border rounded-lg mt-1"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 font-semibold">Email Address</label>
              <input
                type="email"
                placeholder="Enter email"
                className="w-full p-3 border rounded-lg mt-1"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 font-semibold">Message</label>
              <textarea
                rows="5"
                placeholder="Write your message..."
                className="w-full p-3 border rounded-lg mt-1"
              ></textarea>
            </div>

            <button className="w-full flex items-center justify-center gap-2 bg-[#2d8c91] text-white py-3 rounded-lg font-semibold hover:bg-[#256f73]">
              Send Message <Send size={18} />
            </button>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
