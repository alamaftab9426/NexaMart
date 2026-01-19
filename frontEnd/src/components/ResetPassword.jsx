import React, { useState } from "react";
import Layout from "./Layout";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Sparkles } from "lucide-react";

// Toast
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_API_URL;

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const [formValue, setFormValue] = useState({
    password: "",
    confirmpassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [matchStatus, setMatchStatus] = useState(null);

  // 🔐 Password strength checker
  const checkStrength = (password) => {
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*]/.test(password);

    if (!password) return "";
    if (password.length >= 8 && hasLower && hasUpper && hasNumber && hasSymbol)
      return "Strong";
    if (password.length >= 6 && (hasLower || hasUpper) && hasNumber)
      return "Medium";
    return "Weak";
  };

  const getStrengthColor = () => {
    if (passwordStrength === "Strong") return "text-green-600";
    if (passwordStrength === "Medium") return "text-yellow-500";
    if (passwordStrength === "Weak") return "text-red-500";
    return "";
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formValue, [name]: value };
    setFormValue(updated);

    if (name === "password") {
      setPasswordStrength(checkStrength(value));
    }

    if (updated.password && updated.confirmpassword) {
      setMatchStatus(
        updated.password === updated.confirmpassword ? "matched" : "notmatched"
      );
    } else {
      setMatchStatus(null);
    }
  };
  
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formValue.password || !formValue.confirmpassword) {
    toast.error("All fields are required", { theme: "dark" });
    return;
  }

  if (formValue.password.length < 8) {
    toast.error("Password must be at least 8 characters", { theme: "dark" });
    return;
  }

  if (formValue.password !== formValue.confirmpassword) {
    toast.error("Passwords do not match", { theme: "dark" });
    return;
  }

  try {
    setLoading(true);

    const res = await axios.post(
      `${BASE_URL}/api/auth/reset-password/${token}`,
      {
        password: formValue.password,
        confirmpassword: formValue.confirmpassword,
      }
    );

    toast.success(res.data.message || "Password reset successful", {
      theme: "dark",
      transition: Bounce,
    });

    setTimeout(() => navigate("/login"), 2000);
  } catch (err) {
    toast.error(
      err.response?.data?.message || "Reset failed",
      { theme: "dark" }
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <Layout>

      <div className="relative w-full overflow-hidden font-[Quicksand]">
        <img
          src="/images/bgcat.png"
          className="w-full h-[160px] md:h-[250px] object-cover"
        />

        <img
          src="/images/left.png"
          className="absolute left-0 bottom-0 w-[140px] md:w-[250px] animate__animated animate__fadeInLeft"
        />

        <img
          src="/images/right.png"
          className="absolute right-0 bottom-0 w-[140px] md:w-[250px] animate__animated animate__fadeInRight"
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
      <div className="w-full py-12 flex justify-center font-[Quicksand]">
        <div className="w-full md:w-[520px] bg-[#F7FAFB] border rounded-xl p-10 shadow-sm mx-4">
          <h2 className="text-3xl font-bold text-gray-600 text-center mb-2">
            Create New Password
          </h2>
          <p className="text-center text-sm text-gray-500 mb-6">
            Your new password must be different from previous one.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div className="flex flex-col">
              <label className="font-semibold text-gray-600 flex items-center gap-1">
                New Password
                <Sparkles size={16} className="text-gray-400" />
              </label>

              <input
                type="password"
                name="password"
                value={formValue.password}
                onChange={handleChange}
                placeholder="Enter new password"
                className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#2D8C91]"
              />

              {passwordStrength && (
                <span className={`text-sm mt-1 font-medium ${getStrengthColor()}`}>
                  Strength: {passwordStrength}
                </span>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col">
              <label className="font-semibold text-gray-600 flex items-center gap-1">
                Confirm Password
                <Sparkles size={16} className="text-gray-400" />
              </label>

              <input
                type="password"
                name="confirmpassword"
                value={formValue.confirmpassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#2D8C91]"
              />

              {matchStatus === "matched" && (
                <span className="text-green-600 text-sm mt-1">
                  Passwords match ✔
                </span>
              )}
              {matchStatus === "notmatched" && (
                <span className="text-red-500 text-sm mt-1">
                  Passwords do not match ✖
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2D8C91] text-white py-3 rounded-xl hover:bg-[#247178] font-semibold disabled:opacity-60"
            >
              {loading ? "Resetting..." : "Reset Password"}
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

      <ToastContainer />
    </Layout>
  );
};

export default ResetPassword;
