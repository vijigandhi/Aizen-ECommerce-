import React, { useState, useRef, useEffect } from 'react';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ selectedMenuTitle }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleUserIconClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleToSiteClick = () => {
    navigate('/aizen/all-categories');
    setIsDropdownOpen(false);
  };

  const handleLockAccountClick = () => {
    // Logout functionality
    localStorage.removeItem('token');
    setIsDropdownOpen(false);
    navigate('/aizen'); // Redirect to login page
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white h-14 shadow-md p-4 flex justify-between items-center">
      <div className="title text-xl text-green-900 font-semibold">
        Master Control / {selectedMenuTitle}
      </div>
      <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
        <UserCircleIcon
          className="h-10 w-10 text-green-900 cursor-pointer"
          onClick={handleUserIconClick}
        />
        {/* {isDropdownOpen && (
          <div className="absolute right-0 top-10 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10">
            <button
              className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
              onClick={handleToSiteClick}
            >
              To Site
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
              onClick={handleLockAccountClick}
            >
              Lock Account
            </button>
          </div>
        )} */}
      </div>
    </header>
  );
};

export default Navbar;

