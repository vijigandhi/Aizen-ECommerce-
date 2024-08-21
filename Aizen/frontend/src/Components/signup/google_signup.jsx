
import React, { useState } from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GoogleSignup = () => {
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState(null);
  const [roleId, setRoleId] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchUserId = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token not found. Please log in again.');
      return;
    }
  
    try {
      const response = await axios.get('http://localhost:8000/controller/Admin/getUserDetails.php', {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      console.log('API Response:', response.data);
  
      if (response.data.status === 'success') {
        setUserId(response.data.user.id);
        setEmail(response.data.user.email);
        setRoleId(response.data.user.role_id);
        console.log("Profile Details:",response.data.user );
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error('Error fetching user details:', err.response?.data || err.message);
      setError('Error fetching user details');
    }
  };
  
  

  const responseMessage = async (response) => {
    const { credential } = response;

    if (!credential) {
      console.error('No credential received');
      toast.error('No credential received from Google.');
      return;
    }

    console.log('Sending credential:', credential);

    try {
      const formData = new FormData();
      formData.append('key', credential);

      const res = await axios.post('http://localhost:8000/controller/signup/googlesignup.php', formData);

      console.log('Response:', res.data);

      if (res.status === 200) {
        const { jwt, message: successMessage, isNewUser, emailExists } = res.data;

        if (emailExists) {
          toast.error('Email already registered. Please log in.');
          navigate('/login');
        } else if (jwt) {
          localStorage.setItem('token', jwt);

          if (isNewUser) {
            toast.success('Registration successful! Please log in.');
            navigate('/login');
          } else {
            toast.success('Login successful!');
            fetchUserId(); // Fetch user details after successful login
            navigate('/home');
          }
        } else {
          toast.error('Login failed. JWT token is missing.');
        }
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error('Error:', error.message);
      toast.error('An error occurred during registration: ' + error.message);
    }

  };

  const errorMessage = (error) => {
    toast.error('Google login failed. Please try again.');
    console.error('Google login failed:', error);
  };

  return (
    <div className="flex items-center justify-center mt-2 flex-wrap">
      <GoogleOAuthProvider clientId="995387049773-1l8a7e3q87cp7d38i18lfr09au8027rr.apps.googleusercontent.com">
        <GoogleLogin
          onSuccess={responseMessage}
          onError={errorMessage}
          render={(renderProps) => (
            <button
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
              className="hover:scale-105 ease-in-out duration-300 shadow-lg p-1 rounded-lg m-1"
            >
              <img
                className="max-w-[20px]"
                src="https://ucarecdn.com/8f25a2ba-bdcf-4ff1-b596-088f330416ef/"
                alt="Google"
              />
            </button>
          )}
        />
      </GoogleOAuthProvider>
      <ToastContainer />

    </div>
  );
};

export default GoogleSignup;
