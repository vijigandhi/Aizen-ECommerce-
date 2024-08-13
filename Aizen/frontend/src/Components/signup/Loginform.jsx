
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import GoogleSignup from "./google_signup";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Login_image from "../../assets/login.png";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const responseMessage = (response) => {
    console.log('Google sign-up successful:', response);
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });

    if (id === "email") {
      if (!validateEmail(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: 'Email address is invalid',
        }));
      } else {
        setErrors((prevErrors) => {
          const { email, ...otherErrors } = prevErrors;
          return otherErrors;
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTimeout(() => {
        setErrors({});
      }, 3000);
    } else {
      try {
        const response = await axios.post(
          'http://localhost:8000/controller/signup/login.php',
          formData,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.status === 'success') {
          toast.success('Login successful!');
          setErrorMsg('');
          setFormData({
            email: '',
            password: '',
          });
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('id', response.data.id);

          navigate('/home');
        } else {
          // Display the backend error message under the password field
          setErrors({ password: response.data.message || 'Login failed. Please check your credentials.' });
        }
      } catch (error) {
        setErrors({ password: 'An error occurred. Please try again.' });
        console.error('Error during login:', error);
      }
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen flex items-center justify-center px-5 lg:px-0 bg-gray-100">
      <div className="flex max-w-5xl w-full bg-white border shadow sm:rounded-lg relative">
        <div className="w-1/2 p-8 flex flex-col items-center relative">
          <div className="bg-white border border-gray-200 rounded-lg shadow p-6 w-full max-w-sm">
            <div className="flex justify-center items-center">
              <img src="../../src/assets/a2-logo.png" alt="Logo" className="h-12 w-auto cursor-pointer" onClick={handleHomeClick} />
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Enter your credentials to log in
            </p>
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5 relative">
              <div className="relative">
                <input
                  className="w-full px-3 py-2 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
                {errors.email && <p className="absolute text-red-500 text-xs">{errors.email}</p>}
              </div>
              <div className="relative">
                <input
                  className="w-full px-3 py-2 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
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
              <button className="mt-4 tracking-wide font-semibold bg-[#4CAF50] text-gray-100 min-w-[120px] py-2 px-4 rounded-lg hover:bg-[#4CAF50] transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <path d="M20 8v6M23 11h-6" />
                </svg>
                <span className="text-sm">Login</span>
              </button>
              <div className="flex items-center justify-center mt-2 flex-wrap">
                <GoogleSignup onSuccess={responseMessage} />
              </div>
              <p className="mt-4 text-xs text-gray-600 text-center">
                Don't have an account yet?{" "}
                <a href="sign">
                  <span className="text-[#4CAF50] font-semibold">Sign up</span>
                </a>
              </p>
            </form>
          </div>
          <ToastContainer />
        </div>
        <div className="w-1/2">
          <img src={Login_image} alt="Login" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
