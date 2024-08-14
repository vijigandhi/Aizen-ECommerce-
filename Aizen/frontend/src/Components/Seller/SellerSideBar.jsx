import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaStore, FaUsers, FaClipboardList } from 'react-icons/fa';

const Sidebarnav = ({ setSelectedMenuTitle }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const location = useLocation();

  // Function to format path keys into route paths
  const formatPath = (path) =>
    path.replace(/([A-Z])/g, '-$1').replace(/\s+/g, '-').toLowerCase();

  // Define menu items
  const adminMenu = [
    { title: 'Dashboard', key: 'dashboard', icon: <FaTachometerAlt />,},
    { title: 'Product Management', key: 'productmanagement', icon: <FaStore /> },
    { title: 'Sales Statistics', key: 'statistics', icon: <FaUsers /> },
 
    // Add more items as needed
  ];

  const handleMenuClick = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <div className="h-full fixed w-56 bg-green-900 text-white overflow-y-auto">
      <Link to="/aizen-seller">
        <div className="title p-4 pt-4 text-xl font-bold cursor-pointer hover:text-primary-green">
          <img src="../../src/assets/a2-logo-w.png" alt="Logo" className="h-15 w-auto" />
        </div>
      </Link>
      <ul>
        {adminMenu.map((menu) => {
          const menuPath = formatPath(menu.key);
          const isActiveMenu = location.pathname.includes(menuPath);

          return (
            <li key={menu.key}>
              <div
                className={`flex items-center w-full justify-start my-1 py-2 px-4 transition-colors duration-200 rounded-md ${
                  isActiveMenu ? 'bg-white bg-opacity-10' : 'hover:bg-white hover:bg-opacity-10'
                }`}
                onClick={() => setSelectedMenuTitle(menu.title)} // Update title on click
              >
                <Link to={`/aizen-seller/${menuPath}`} className="flex-1 text-center">
                  <button
                    className={`w-full flex items-center text-sm  text-left text-white  ${
                      isActiveMenu ? 'text-white text-lg font-semibold' : 'text-white text-lg font-normal'
                    }`}
                  >
                    <span className="mr-2">{menu.icon}</span>
                    {menu.title}
                  </button>
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebarnav;
