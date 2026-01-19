import React, { useState } from "react";
import {
  FaGooglePlay,
  FaAppStoreIos,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import { MdLocationOn, MdCall, MdEmail } from "react-icons/md";

const Footer = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="bg-[#f6f9fb] text-gray-700 pt-12 font-[Quicksand]">
      {/* ---------------- TOP SHAPE ---------------- */}
      <div className="relative bg-[#F6F9FB]">
        <div className="absolute top-0 left-0 w-full -translate-y-full">
          <img
            src="./images/shape-2.png"
            alt="footer shape"
            className="w-full h-20 object-cover"
          />
        </div>

        {/* ---------------- MAIN FOOTER CONTENT ---------------- */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 px-6 ">
          {/* ----------- LOGO SECTION ----------- */}
          <div className="flex flex-col items-start space-y-5">
            <h2 className="text-3xl font-bold text-gray-800">
              <img src="./images/logo.png" className="w-36"/>
            </h2>

            <p className="text-gray-600 leading-relaxed text-sm font-[Quicksand]">
              Sprazo is your one-stop marketplace. Get fresh, quality products
              and daily essentials delivered to your doorstep.
            </p>

            {/* App buttons */}
            <div className="flex flex-wrap gap-3 mt-2">
              <div className="bg-black text-white px-3 py-2 rounded-md flex items-center gap-2 text-sm cursor-pointer w-[140px] justify-center hover:scale-105 transition-transform duration-200">
                <FaGooglePlay className="text-lg" />
                <div className="flex flex-col leading-tight text-xs">
                  <span>GET IT ON</span>
                  <span className="font-semibold text-sm">Google Play</span>
                </div>
              </div>

              <div className="bg-black text-white px-3 py-2 rounded-md flex items-center gap-2 text-sm cursor-pointer w-[140px] justify-center hover:scale-105 transition-transform duration-200">
                <FaAppStoreIos className="text-lg" />
                <div className="flex flex-col leading-tight text-xs">
                  <span>Download on</span>
                  <span className="font-semibold text-sm">App Store</span>
                </div>
              </div>
            </div>
          </div>

          {/* ----------- FOOTER LINKS (Dropdowns in mobile) ----------- */}
          {[
            {
              title: "Category",
              links: [
                "Men",
                "Women",
                "Kids",
                "Bags",
                "Sunglasses",
                
              ],
            },
            {
              title: "Company",
              links: [
                "About Us",
                "Delivery",
                "Legal Notice",
                "Terms & Conditions",
                "Secure Payment",
                "Contact Us",
              ],
            },
            {
              title: "Account",
              links: [
                "Sign In",
                "View Cart",
                "Return Policy",
                "Become a Vendor",
                "Affiliate Program",
                "Payments",
              ],
            },
            {
              title: "Contact",
              links: [
                <span className="flex items-start gap-2" key="1">
                  <MdLocationOn className="text-teal-600 mt-1" />
                  Tedhipulia Lucknow 22012
                </span>,
                <span className="flex items-center gap-2" key="2">
                  <MdCall className="text-teal-600" /> +91 8853424605
                </span>,
                <span className="flex items-center gap-2" key="3">
                  <MdEmail className="text-teal-600" />alamaftab9426@gmail.com
                </span>,
              ],
            },
          ].map((section, index) => (
            <div key={index}>
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex justify-between items-center md:cursor-default md:pb-4 border-b md:border-none border-gray-300 py-2 md:py-0"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {section.title}
                </h3>
                <span className="md:hidden text-gray-600">
                  {openSection === section.title ? "−" : "+"}
                </span>
              </button>

              {/* Section Links */}
              <ul
                className={`overflow-hidden transition-all duration-300 ease-in-out text-gray-600 text-sm space-y-2 md:space-y-2 ${
                  openSection === section.title
                    ? "max-h-96 mt-2"
                    : "max-h-0 md:max-h-none"
                } md:max-h-none md:block`}
              >
                {section.links.map((link, i) => (
                  <li key={i} className="hover:text-teal-600 cursor-pointer">
                    {link}
                  </li>
                ))}

                {/* Social Icons for Contact */}
                {section.title === "Contact" && (
                  <div className="flex gap-4 mt-4">
                    <FaFacebookF className="text-gray-600 hover:text-teal-600 cursor-pointer" />
                    <FaTwitter className="text-gray-600 hover:text-teal-600 cursor-pointer" />
                    <FaLinkedinIn className="text-gray-600 hover:text-teal-600 cursor-pointer" />
                    <FaInstagram className="text-gray-600 hover:text-teal-600 cursor-pointer" />
                  </div>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- BOTTOM STRIP ---------------- */}
      <div className="bg-gray-800 text-white text-center mt-3 py-3 text-sm flex flex-col md:flex-row justify-between items-center px-8 md:mb-0 mb-14">
        <p>Copyright © 2025 EvalueWebsolution. All rights reserved.</p>
        <div className="flex justify-center gap-3 mt-2 md:mt-0">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
            alt="Visa"
            className="h-5"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/0e/Mastercard-logo.png"
            alt="MasterCard"
            className="h-5"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/0a/PayPal_logo_2014.svg"
            alt="PayPal"
            className="h-5"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/b/b7/Skrill_logo.svg"
            alt="Skrill"
            className="h-5"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
