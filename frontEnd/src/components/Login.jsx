import React, { useState, useContext } from "react";
import Layout from "./Layout";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Sparkles } from "lucide-react";
import axios from "axios";
import { UserContext } from "./context/UserContext";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { user, updateUser, logoutUser } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formValue, setFormValue] = useState({
    emailaddress: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValue((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      const newErr = { ...errors };
      delete newErr[name];
      setErrors(newErr);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formValue.emailaddress.trim())
      newErrors.emailaddress = "Email required";
    else if (!/\S+@\S+\.\S+/.test(formValue.emailaddress))
      newErrors.emailaddress = "Invalid email format";
    if (!formValue.password.trim()) newErrors.password = "Password required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const res = await axios.post(
        `${BASE_URL}/api/auth/login`,
        {
          emailaddress: formValue.emailaddress,
          password: formValue.password,
        }
      );

      const data = res.data;
      updateUser(data.user);

      if (formValue.remember) {
        localStorage.setItem("token", data.token);
      } else {
        sessionStorage.setItem("token", data.token);
      }

      if (data.user.role === "admin") {
        toast.dark("Welcome Admin!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          pauseOnHover: true,
          draggable: true,
          transition: Slide,
        });
        setTimeout(() => {
          navigate("/admin");
        },);
      } else {
        toast.success("Login Successful!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          pauseOnHover: true,
          draggable: true,
          style: { backgroundColor: "#000", color: "#fff" },
          transition: Slide,
        });
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      toast.warn("Password Wrong Try Again", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
        transition: Slide,
      });
    }
  };

  const handleLogout = () => {
    logoutUser();
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    toast.success("Logout Successful!", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      pauseOnHover: true,
      draggable: true,
      style: { backgroundColor: "#000", color: "#fff" },
      transition: Slide,
    });
    setTimeout(() => {
      navigate("/login");
    }, 3000);
  };

  return (
    <Layout>
      <div className="w-full flex justify-center bg-white py-10">
        <div className="w-full md:w-[600px] rounded-2xl">
          {user ? (
            <div className="text-center p-10 bg-[#F7FAFB] rounded shadow">
              <h2 className="text-2xl font-semibold text-gray-500 mb-4">
                Welcome, {user?.name || "User"}!
              </h2>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-6 bg-[#F7FAFB] border px-4 md:px-10 py-10 mx-4 md:mx-0 rounded-md shadow-sm font-[Quicksand]"
            >
              {/* EMAIL */}
              <div className="flex flex-col">
                <label className="text-gray-500 font-semibold mb-1 flex items-center gap-1">
                  Email Address{" "}
                  <Sparkles
                    size={15}
                    className="text-gray-400 animate-rotate"
                  />
                </label>
                <input
                  type="email"
                  name="emailaddress"
                  placeholder="xyz@gmail.com"
                  value={formValue.emailaddress}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border"
                />
                {errors.emailaddress && (
                  <span className="text-red-500 text-sm">
                    {errors.emailaddress}
                  </span>
                )}
              </div>

              {/* PASSWORD */}
              <div className="flex flex-col">
                <label className="text-gray-500 font-semibold mb-1 flex items-center gap-1">
                  Password <Sparkles size={15} className="text-gray-400 animate-rotate" />
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter Your Password"
                    value={formValue.password}
                    onChange={handleChange}
                    className="w-full p-3 pr-12 rounded-xl border"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible size={22} />
                    ) : (
                      <AiOutlineEye size={22} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-red-500 text-sm">
                    {errors.password}
                  </span>
                )}
              </div>

              {/* REMEMBER  FORGOT */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-gray-600 text-sm">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={formValue.remember}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  Remember Me
                </label>
                <Link
                  to="/forgotpassword"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
                <p className="text-sm text-gray-700 text-center md:text-left">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-red-500 hover:underline">
                    Signup
                  </Link>
                </p>

                <button
                  type="submit"
                  className="bg-white text-[#2D8C91] px-4 py-2 text-md font-semibold rounded-md hover:bg-[#2d8c91] hover:text-white border-2 border-dotted border-[#2d8c91] w-full md:w-auto"
                >
                  Login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <ToastContainer />
    </Layout>
  );
};

export default Login;
