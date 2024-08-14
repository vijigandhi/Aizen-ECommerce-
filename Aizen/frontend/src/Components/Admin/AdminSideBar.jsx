import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaStore, FaUsers, FaClipboardList, FaMapMarkerAlt,FaTags, FaListAlt } from 'react-icons/fa';


const AdminSideBar = ({ setSelectedMenuTitle }) => {
  const location = useLocation();

  const formatPath = (path) => path.replace(/([A-Z])/g, '-$1').replace(/\s+/g, '-').toLowerCase();

  const adminMenu = [
    { title: 'Dashboard', key: 'dashboard', icon: <FaTachometerAlt /> },
    { title: 'Store Management', key: 'stores', icon: <FaStore /> },
    { title: 'User Management', key: 'users', icon: <FaUsers /> },
    { title: 'Request Management', key: 'requests', icon: <FaClipboardList /> },
    { title: 'Address Management', key: 'address', icon: <FaMapMarkerAlt />    },
    { title: 'Content Management', key: 'categories', icon: <FaTags />    }

    // Add more items as needed
  ];

  return (
    <div className="h-full fixed w-56 bg-green-900 text-white overflow-y-auto">
      <Link to="/aizen-admin">
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
                <Link to={`/aizen-admin/${menuPath}`} className="flex-1 text-center">
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

export default AdminSideBar;
