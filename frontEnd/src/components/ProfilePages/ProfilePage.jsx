import React, { useState, useEffect } from "react";
import Layout from "../Layout";
import { motion, AnimatePresence } from "framer-motion";

import ProfilePanel from "./ProfilePanel";
import Allorders from "./Allorders";
import AllAddress from "./AllAddress";
import UserWishlist from "./UserWishlist";

import {
  FaUserCircle,
  FaBoxOpen,
  FaHeart,
  FaCog,
  FaSignOutAlt,
  FaMapMarkerAlt,
  FaBars,
} from "react-icons/fa";
import { IoCloseCircleOutline } from "react-icons/io5";

/* ---------------- TABS ---------------- */
const tabs = [
  { key: "profile", label: "My Profile", icon: <FaUserCircle /> },
  { key: "orders", label: "My Orders", icon: <FaBoxOpen /> },
  { key: "address", label: "My Address", icon: <FaMapMarkerAlt /> },
  { key: "wishlist", label: "Wishlist", icon: <FaHeart /> },
  { key: "settings", label: "Settings", icon: <FaCog /> },
  { key: "logout", label: "Logout", icon: <FaSignOutAlt /> },
];

const sidebarAnim = {
  hidden: { x: -320 },
  visible: { x: 0 },
  exit: { x: -320 },
};

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [user, setUser] = useState({
    name: "",
    email: "",
    image: null,
  });

  /* -------- resize -------- */
  useEffect(() => {
    const resize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const isDesktop = windowWidth >= 768;
  const sidebarVisible = isDesktop || sidebarOpen;

  return (
    <Layout>
      <div className="w-full bg-white min-h-screen py-10 md:px-28 px-4">
        <div className="flex gap-6">

          {/* ================= DESKTOP SIDEBAR ================= */}
          <AnimatePresence>
            {sidebarVisible && isDesktop && (
              <motion.aside
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ duration: 0.3 }}
                className="w-80 hidden md:block"
              >
                <div className="bg-[#EFF4F7] border rounded-md p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden border">
                      {user.image && (
                        <img
                          src={user.image}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <nav className="space-y-2">
                    {tabs.map((t) => (
                      <button
                        key={t.key}
                        onClick={() => setActiveTab(t.key)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition ${
                          activeTab === t.key
                            ? "bg-teal-50 border-l-4 border-teal-500"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <span className="text-teal-600 text-lg">
                          {t.icon}
                        </span>
                        <span className="font-medium text-gray-700">
                          {t.label}
                        </span>
                      </button>
                    ))}
                  </nav>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* ================= MOBILE FLOAT BUTTON ================= */}
          {!isDesktop && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="fixed bottom-28 left-3 z-50 bg-[#2D8C91] text-white p-3 rounded-full shadow-lg"
            >
              <FaBars size={18} />
            </button>
          )}

          {/* ================= MOBILE SIDEBAR ================= */}
          <AnimatePresence>
            {sidebarOpen && !isDesktop && (
              <>
                {/* overlay */}
                <motion.div
                  className="fixed inset-0 bg-black/40 z-40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSidebarOpen(false)}
                />

                <motion.aside
                  variants={sidebarAnim}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="fixed left-0 top-0 z-50 w-72 h-full bg-white p-4 overflow-auto"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border">
                        {user.image && (
                          <img
                            src={user.image}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <button onClick={() => setSidebarOpen(false)}>
                      <IoCloseCircleOutline size={24} />
                    </button>
                  </div>

                  <nav className="space-y-2">
                    {tabs.map((t) => (
                      <button
                        key={t.key}
                        onClick={() => {
                          setActiveTab(t.key);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition ${
                          activeTab === t.key
                            ? "bg-teal-50 border-l-4 border-teal-500"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <span className="text-teal-600 text-lg">
                          {t.icon}
                        </span>
                        <span className="font-medium text-gray-700">
                          {t.label}
                        </span>
                      </button>
                    ))}
                  </nav>
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          {/* ================= RIGHT CONTENT ================= */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {activeTab === "profile" && (
                <ProfilePanel onProfileLoaded={setUser} />
              )}
              {activeTab === "orders" && <Allorders />}
              {activeTab === "address" && <AllAddress />}
              {activeTab === "wishlist" && <UserWishlist />}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
