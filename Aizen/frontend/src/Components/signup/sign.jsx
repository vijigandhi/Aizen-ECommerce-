
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import GoogleSignup from "./google_signup"; // Ensure you have this component created
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Login_image from "../../assets/sign.png";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [serverEmailError, setServerEmailError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const responseMessage = (response) => {
    console.log("Google sign-up successful:", response);
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });

    if (id === "email") {
      if (!value) {
        setErrors((prevErrors) => ({ ...prevErrors, email: "Email is required" }));
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        setErrors((prevErrors) => ({ ...prevErrors, email: "Email address is invalid" }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true); // Set loading to true before making the request

    try {
      const response = await axios.post(
        "http://localhost:8000/controller/signup/signup.php",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      let responseData;
      if (typeof response.data === 'string') {
        try {
          responseData = JSON.parse(response.data);
        } catch (error) {
          console.error("Error parsing JSON response:", error);
          setServerEmailError("An unexpected error occurred. Please try again.");
          return;
        }
      } else {
        responseData = response.data;
      }

      if (responseData.status === 'success') {
        toast.success('Registration successful!');
        setServerEmailError("");
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setLoading(false); // Set loading to false before navigating
        navigate("/login"); // Redirect to login page after successful registration
      } else {
        setServerEmailError(responseData.message || "Registration failed. Please try again.");
        setLoading(false); // Set loading to false in case of error
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setServerEmailError("An unexpected error occurred. Please try again.");
      setLoading(false); // Set loading to false in case of error
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex max-w-5xl w-full bg-white border shadow sm:rounded-lg">
        <div className="w-1/2 p-8 flex flex-col items-center">
          <div className="bg-white border border-gray-200 rounded-lg shadow p-6 w-full max-w-sm">
            <div className="flex justify-center items-center">
              <img src="../../src/assets/a2-logo.png" alt="Logo" className="h-12 w-auto" onClick={handleHomeClick} />
            </div>
            <p className="text-xs text-gray-500 mb-4">Enter your details to create your account</p>
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5 relative">
              <div className="relative">
                <input
                  className={`w-full px-3 py-2 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white ${
                    errors.name ? "border-red-500" : ""
                  }`}
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
                {errors.name && <p className="absolute text-red-500 text-xs">{errors.name}</p>}
              </div>
              <div className="relative">
                <input
                  className={`w-full px-3 py-2 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="absolute text-red-500 text-xs">
                    {errors.email}
                  </p>
                )}
                {serverEmailError && (
                  <p className="absolute text-red-500 text-xs">
                    {serverEmailError}
                  </p>
                )}
              </div>
              <div className="relative">
                <input
                  className={`w-full px-3 py-2 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer"
                  onClick={toggleShowPassword}
                >
                  {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                </div>
                {errors.password && <p className="absolute text-red-500 text-xs">{errors.password}</p>}
              </div>
              <div className="relative">
                <input
                  className={`w-full px-3 py-2 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer"
                  onClick={toggleShowConfirmPassword}
                >
                  {showConfirmPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                </div>
                {errors.confirmPassword && <p className="absolute text-red-500 text-xs">{errors.confirmPassword}</p>}
              </div>
              <button
                type="submit"
                className="mt-4 tracking-wide font-semibold bg-[#4CAF50] text-gray-100 min-w-[120px] py-2 px-4 rounded-lg hover:bg-['#4CAF50'] transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                disabled={loading} // Disable button while loading
              >
                {loading ? (
                  <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path d="M4 12a8 8 0 0116 0 8 8 0 01-16 0" fill="none" stroke="currentColor" strokeWidth="4"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <path d="M20 8v6M23 11h-6" />
                  </svg>
                )}
                <span className="text-sm">Sign Up</span>
              </button>
              <div className="flex items-center justify-center mt-2 flex-wrap">
                <GoogleSignup onSuccess={responseMessage} />
              </div>
              <p className="mt-4 text-xs text-gray-600 text-center">
                Already have an account?{" "}
                <a href="login">
                  <span className="text-[#4CAF50] font-semibold">Log in</span>
                </a>
              </p>
            </form>
            <ToastContainer />
          </div>
        </div>
        <div className="w-1/2">
          <img src={Login_image} alt="Signup" className="w-full h-full" />
        </div>
      </div>   
    </div>
  );
};

export default SignupForm;
