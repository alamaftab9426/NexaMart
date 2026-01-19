import React, { useState } from "react";
import Layout from "./Layout";
import { Link } from "react-router-dom";
import axios from "axios";
import { Sparkles } from "lucide-react";

// Toastify
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_API_URL;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email is required", {
        position: "top-center",
        theme: "dark",
        transition: Bounce,
      });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Invalid email format", {
        position: "top-center",
        theme: "dark",
        transition: Bounce,
      });
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${BASE_URL}/api/auth/forgot-password`,
        { emailaddress: email }
      );

      toast.success(
        res.data.message || "Password reset link sent to your email",
        {
          position: "top-center",
          theme: "dark",
          transition: Bounce,
        }
      );

      setEmail("");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Something went wrong",
        {
          position: "top-center",
          theme: "dark",
          transition: Bounce,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* ===== TOP BANNER (SAME DESIGN) ===== */}
      <div className="relative w-full overflow-hidden font-[Quicksand]">
        <img
          src="./images/bgcat.png"
          className="w-full h-[160px] md:h-[250px] object-cover"
          alt=""
        />

        <div className="absolute inset-0 bg-[#EFF4F7]/35"></div>

        <img
          src="./images/left.png"
          className="absolute left-0 bottom-0 w-[140px] md:w-[250px] animate__animated animate__fadeInLeft"
          alt=""
        />

        <img
          src="./images/right.png"
          className="absolute right-0 bottom-0 w-[140px] md:w-[250px] animate__animated animate__fadeInRight"
          alt=""
        />

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 text-gray-500">
            Forgot Password
          </h1>

          <p className="text-base font-[Poppins]">
            <Link to="/login" className="text-[#4B9097]">
              Login
            </Link>
            <span className="text-gray-500 mx-2">&gt;&gt;</span>
            <span className="text-gray-500">Forgot Password</span>
          </p>
        </div>
      </div>

      {/* ===== FORM CARD ===== */}
      <div className="w-full py-10 flex justify-center font-[Quicksand]">
        <div className="w-full md:w-[550px] bg-[#F7FAFB] border rounded-xl mx-4 md:mx-0 p-10 shadow-sm">
          <h1 className="text-3xl font-bold mb-2 text-gray-600 text-center">
            Forgot Password
          </h1>

          <p className="text-center text-sm text-gray-500 mb-6">
            Enter your registered email to receive password reset link.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* EMAIL */}
            <div className="flex flex-col">
              <label className="font-semibold text-gray-600 flex items-center gap-1">
                Email Address
                <Sparkles size={16} className="text-gray-400" />
              </label>

              <input
                type="email"
                placeholder="xyz@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#2D8C91]"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2D8C91] text-white py-3 rounded-xl hover:bg-[#247178] font-semibold disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <p className="text-center text-sm text-gray-600">
              Go back to{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Toast */}
      <ToastContainer />
    </Layout>
  );
};

export default ForgotPassword;
