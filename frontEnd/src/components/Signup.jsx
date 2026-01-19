import React, { useState } from "react";
import Layout from "./Layout";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Sparkles } from "lucide-react";
import axios from "axios";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const Signup = () => {
  const navigate = useNavigate();
const BASE_URL = import.meta.env.VITE_API_URL;
  const [isMatched, setIsMatched] = useState(null);

  const [formValue, setFormValue] = useState({
    name: "",
    lastname: "",
    emailaddress: "",
    mobileno: "",
    password: "",
    confirmpassword: "",
    gender: "",
    dob: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormValue((prev) => ({ ...prev, [name]: value }));

  
    if (name === "password") {
      const strength = checkPasswordStrength(value);
      setPasswordStrength(strength);
    }

    if (name === "password" || name === "confirmpassword") {
      const newPassword = name === "password" ? value : formValue.password;
      const newConfirm = name === "confirmpassword" ? value : formValue.confirmpassword;

      if (newPassword && newConfirm) {
        setIsMatched(newPassword === newConfirm);
      } else {
        setIsMatched(null);
      }
    }


    if (errors[name]) {
      const newErr = { ...errors };
      delete newErr[name];
      setErrors(newErr);
    }
  };


  const checkPasswordStrength = (password) => {
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!password) return "";
    if (password.length >= 8 && hasLower && hasUpper && hasNumber && hasSymbol)
      return "Strong";
    if ((hasLower && hasNumber) || (hasUpper && hasSymbol)) return "Medium";
    return "Weak";
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case "Weak":
        return "text-red-500 font-semibold";
      case "Medium":
        return "text-yellow-500 font-semibold";
      case "Strong":
        return "text-green-500 font-semibold";
      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formValue.name.trim()) newErrors.name = "First name required";
    if (!formValue.lastname.trim()) newErrors.lastname = "Last name required";

    if (!formValue.mobileno.trim()) newErrors.mobileno = "Contact required";
    else if (!/^\d{10}$/.test(formValue.mobileno))
      newErrors.mobileno = "Must be 10 digits";

    if (!formValue.emailaddress.trim())
      newErrors.emailaddress = "Email required";
    else if (!/\S+@\S+\.\S+/.test(formValue.emailaddress))
      newErrors.emailaddress = "Invalid email";

    if (!formValue.password.trim()) newErrors.password = "Password required";
    else if (formValue.password.length < 8)
      newErrors.password = "Must be at least 8 characters";

    if (!formValue.confirmpassword.trim())
      newErrors.confirmpassword = "Confirm your password";
    else if (formValue.confirmpassword !== formValue.password)
      newErrors.confirmpassword = "Passwords do not match";

    if (!formValue.gender) newErrors.gender = "Select gender";
    if (!formValue.dob) newErrors.dob = "Enter birth date";

    return newErrors;
  };


  const handleSubmit = async (e) => {
  e.preventDefault();
  const validationErrors = validateForm();
  setErrors(validationErrors);
  if (Object.keys(validationErrors).length > 0) {
    console.log("Validation Failed:", validationErrors);
    return;
  }
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/signup`, formValue);
    toast.success(" Signup Successfull ! !", {
         position: "top-center",
         autoClose: 3000,
         hideProgressBar: false,
         pauseOnHover: true,
         draggable: true,
         style: { backgroundColor: "#000", color: "#fff" },
         transition: Slide,
       });
    setTimeout(() => navigate("/login"), 3000);

  } catch (error) {
    console.error("Signup Error:", error.response?.data || error.message);
     toast.warn("Login Failed!", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            pauseOnHover: true,
            draggable: true,
            transition: Slide,
          });
  }
};

  return (
    <Layout>

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
            Signup Page
          </h1>

          <p className="text-base font-[Poppins]">
            <Link to="/login" className="text-[#4B9097]">
              Login
            </Link>
            <span className="text-gray-500 mx-2">&gt;&gt;</span>
            <span className="text-gray-500">Signup Page</span>
          </p>
        </div>
      </div>

      {/* FORM SECTION */}
      <div className="w-full flex justify-center bg-white py-3 md:py-10">
        <div className="w-full md:w-[1000px] rounded-2xl">
          {/* Title */}
          <div className="mb-5 text-center">
            <h3 className="text-[#2d8c91] font-semibold md:text-lg flex gap-2 justify-center items-center">
              <Sparkles size={20} className="text-gray-400 animate-rotate" />
              Register
            </h3>

            <h1 className="text-2xl  md:text-3xl text-gray-500 md:mt-2 font-bold">
              Best place to buy and sell digital <br /> products
            </h1>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className=" space-y-5 md:space-y-10  bg-[#F7FAFB] border px-10 py-10 pb-20 mb-10 md:mb-0  mx-4 md:mx-0 rounded-md shadow-sm font-[Quicksand] "
          >
           
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* First Name */}
              <div className="flex flex-col">
                <label className="text-gray-500 font-semibold mb-1 flex items-center gap-1">
                  First Name
                  <Sparkles size={15} className="text-gray-400 animate-rotate" />
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter Your First Name"
                  value={formValue.name}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl bg-white border"
                />
                {errors.name && (
                  <span className="text-red-500 text-sm ">{errors.name}</span>
                )}
              </div>

              {/* Last Name */}
              <div className="flex flex-col">
                <label className="text-gray-500 font-semibold mb-1 flex items-center gap-1">
                  Last Name
                  <Sparkles size={15} className="text-gray-400 animate-rotate" />
                </label>

                <input
                  type="text"
                  name="lastname"
                  placeholder="Enter Your Last Name"
                  value={formValue.lastname}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border"
                />
                {errors.lastname && (
                  <span className="text-red-500 text-sm">{errors.lastname}</span>
                )}
              </div>
            </div>

         
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Mobile */}
              <div className="flex flex-col">
                <label className="text-gray-500 font-semibold mb-1 flex items-center gap-1">
                  Mobile Number
                  <Sparkles size={15} className="text-gray-400 animate-rotate" />
                </label>

                <input
                  type="number"
                  name="mobileno"
                  placeholder="Enter Your Mobile Number"
                  value={formValue.mobileno}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border"
                />
                {errors.mobileno && (
                  <span className="text-red-500 text-sm">{errors.mobileno}</span>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <label className="text-gray-500 font-semibold mb-1 flex items-center gap-1">
                  Email Address
                  <Sparkles size={15} className="text-gray-400 animate-rotate" />
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
            </div>

         
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Password */}
              <div className="flex flex-col relative">
                <label className="text-gray-500 font-semibold mb-1 flex items-center gap-1">
                  Password
                  <Sparkles size={15} className="text-gray-400 animate-rotate" />
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

                {passwordStrength && (
                  <p className={`text-sm mt-1 ${getStrengthColor()}`}>
                    Password Strength: {passwordStrength}
                  </p>
                )}

                {errors.password && (
                  <span className="text-red-500 text-sm">
                    {errors.password}
                  </span>
                )}
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col relative">
                <div className="flex gap-2 items-center">
                  <label className="text-gray-500 font-semibold mb-1">
                    Confirm Password
                  </label>
                  <Sparkles size={15} className="text-gray-400 animate-rotate" />
                </div>

                <input
                  type="password"
                  name="confirmpassword"
                  placeholder="Re-enter Your Password"
                  value={formValue.confirmpassword}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border"
                />

                {/* LIVE MATCH MESSAGE */}
                {isMatched !== null && (
                  <span
                    className={`text-sm mt-1 ${
                      isMatched ? "text-green-500 font-semibold" : "text-red-600 font-semibold"
                    }`}
                  >
                    {isMatched
                      ? "Password Matched"
                      : "Password Not Matched"}
                  </span>
                )}

                {/* Submit-time error */}
                {errors.confirmpassword && (
                  <span className="text-red-500 text-sm">
                    {errors.confirmpassword}
                  </span>
                )}
              </div>
            </div>

            {/* ROW 4 — Gender + DOB */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Gender */}
              <div className="flex flex-col">
                <label className="text-gray-500 font-semibold mb-1 flex items-center gap-1">
                  Gender
                  <Sparkles size={15} className="text-gray-400 animate-rotate" />
                </label>

                <select
                  name="gender"
                  value={formValue.gender}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>

                {errors.gender && (
                  <span className="text-red-500 text-sm">{errors.gender}</span>
                )}
              </div>

              {/* DOB */}
              <div className="flex flex-col">
                <label className="text-gray-500 font-semibold mb-1 flex items-center gap-1">
                  Date Of Birth
                  <Sparkles size={15} className="text-gray-400 animate-rotate" />
                </label>

                <input
                  type="date"
                  name="dob"
                  value={formValue.dob}
                  onChange={handleChange}
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full p-3 rounded-xl border"
                />

                {errors.dob && (
                  <span className="text-red-500 text-sm">{errors.dob}</span>
                )}
              </div>
            </div>

            {/* SUBMIT */}
            <div className="flex mt-5 items-center justify-between">
              <p className="text-sm text-gray-700 mt-6">
                Already have an account?{" "}
                <Link to="/login" className="text-red-500">
                  Login
                </Link>
              </p>

              <button
                type="submit"
                className="bg-white text-[#2D8C91] px-3 py-2 md:px-4 md:py-2 text-sm md:text-md font-semibold rounded-md hover:bg-[#2d8c91] hover:text-white border-2 border-dotted border-[#2d8c91] mt-7"
              >
                Sign Up
              </button>
            </div>
          </form>
          
        </div>
      <ToastContainer />
      </div>
    </Layout>
  );
};

export default Signup;
