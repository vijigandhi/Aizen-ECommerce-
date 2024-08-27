import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaCartPlus, FaUser } from 'react-icons/fa';
import { BiSearch } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

const Header = ({ onSearch, onStoreChange }) => {
  const [stores, setStores] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [roleId, setRoleId] = useState(null);
  const [selectedStoreId, setSelectedStoreId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItemCount, setCartItemCount] = useState(0);
  const [userId, setUserId] = useState(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get('http://localhost:8000/controller/Admin/getStores.php');
        setStores(response.data);
      } catch (error) {
        console.error('Error fetching store data:', error);
      }
    };

    const fetchCartItemCount = async (userId) => {
      const token = localStorage.getItem('token');
      if (token && userId) {
        try {
          const response = await axios.get('http://localhost:8000/controller/getCartItemsCount.php', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            params: {
              user_id: userId,
            },
          });
          setCartItemCount(response.data.count || 0);
        } catch (error) {
          console.error('Error fetching cart item count:', error);
        }
      }
    };

    const checkAuth = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        setIsLoggedIn(true);
        try {
          const response = await axios.get('http://localhost:8000/controller/Admin/getUserDetails.php', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setRoleId(response.data.user.role_id);
          setUserId(response.data.user.id);
          fetchCartItemCount(response.data.user.id);

          console.log("role : ",response.data.user.role_id);
          console.log("user : ",response.data.user.id);
          
          // Set up polling to refresh cart item count periodically
          const intervalId = setInterval(() => {
            fetchCartItemCount(response.data.user.id);
          }, 1000); 

          // Clean up the interval on component unmount
          return () => clearInterval(intervalId);
        } catch (error) {
          console.error('Error fetching user details:', error);
          setRoleId(null);
        }
      } else {
        setIsLoggedIn(false);
        setRoleId(null);
      }
    };

    fetchStores();
    checkAuth();
  }, []);


  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleHomeClick = () => {
    navigate('/home');
  };

  const handleProductClick = () => {
    navigate('/aizen/all-categories');
  };

  const handleAboutClick = () => {
    navigate('/about');
  };

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };
  const handleOrderDetails = () => {
    navigate('/OrderDetails');
  };

  const handleViewProfile = () => {
    navigate('/profile');
  };

  const handleCartClick = () => {
    navigate('/home/cart');
  };

  const handleAdminPanelClick = () => {
    navigate('/aizen-admin/dashboard');
  };

  const handleSellerPortalClick = () => {
    navigate('/aizen-seller/dashboard');
  };
  const getActiveClass = (path) => {
    if (path === '/home') {
      return location.pathname === '/home' ? 'text-white font-bold' : 'text-green-900';
    }
    if (path === '/aizen/all-categories') {
      return location.pathname.startsWith('/aizen/all-categories') ? 'text-white font-bold' : 'text-green-900';
    }
    if (path === '/about') {
      return location.pathname === '/about' ? 'text-white font-bold' : 'text-green-900';
    }
    return 'text-green-900';
  };
  const handleStoreChange = (event) => {
    const storeId = event.target.value;
    setSelectedStoreId(storeId);
    if (typeof onStoreChange === 'function') {
      onStoreChange(storeId);
    } else {
      console.log("Error");
    }
    localStorage.setItem('selectedStoreId', storeId);
  };

  const handleSearchClick = () => {
    onSearch(searchTerm);
  };

  const handleSearchKeyPress = (event) => {
    if (event.key === 'Enter') {
      onSearch(searchTerm);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setRoleId(null);
    setUserId(null); // Clear user ID on logout
    setIsProfileDropdownOpen(false);
    navigate('/home'); // Redirect to home page
  };

  return (
    <div className="bg-gradient-to-r from-green-300 to-green-500  shadow-md text-white sticky top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center">
          <img src="../../src/assets/a2-logo.png" alt="Logo" className="h-12 w-auto" onClick={handleHomeClick} />
        </div>

        <div className="relative mx-4">
          <select
            className="bg-white text-green-900 font-semibold p-2 rounded"
            onChange={handleStoreChange}
            value={selectedStoreId}
          >
            <option value="">Select Store</option>
            {stores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>
        </div>

        <div className="relative mx-4 flex-grow w-80">
          <input
            type="text"
            placeholder="Search..."
            className="bg-white text-gray-700 p-2 rounded w-full pr-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleSearchKeyPress}
          />
          <BiSearch
            className="absolute right-2 top-2 text-xl text-gray-500 cursor-pointer"
            onClick={handleSearchClick}
          />
        </div>

        <div className="flex justify-center space-x-4">
  <div
    className={`cursor-pointer font-semibold ${getActiveClass('/home')}`}
    onClick={handleHomeClick}
  >
    Home
  </div>
  <div
    className={`cursor-pointer font-semibold ${getActiveClass('/aizen/all-categories')}`}
    onClick={handleProductClick}
  >
    All Products
  </div>
  <div
    className={`cursor-pointer font-semibold ${getActiveClass('/about')}`}
    onClick={handleAboutClick}
  >
    About
  </div>
</div>


        <div className="relative mx-4">
          <FaCartPlus className="text-2xl text-green-900 hover:text-white cursor-pointer" onClick={handleCartClick} />
          {cartItemCount > 0 && (
            <span className="absolute top-[-10px] right-[-10px] flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
              {cartItemCount}
            </span>
          )}
        </div>

        {isLoggedIn ? (
          <div className="relative mx-4" ref={dropdownRef}>
            <FaUser className="text-2xl cursor-pointer" onClick={handleProfileClick} />
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
                <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-200" onClick={handleViewProfile}>
                  View Profile
                </a>
                <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-200" onClick={handleOrderDetails}>
                  Your Orders
                </a>

                {roleId === 1 && (
                  <>
                    <div
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
                      onClick={handleAdminPanelClick}
                    >
                      Master Control
                    </div>
                    <div
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
                      onClick={handleSellerPortalClick}
                    >
                      Seller Portal
                    </div>
                  </>
                )}
                {roleId === 2 && (
                  <div
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
                    onClick={handleSellerPortalClick}
                  >
                    Seller Portal
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            className="mx-4 bg-white p-1 px-6 text-green-900 font-semibold rounded hover:bg-green-900 hover:text-white"
            onClick={handleLoginClick}
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;