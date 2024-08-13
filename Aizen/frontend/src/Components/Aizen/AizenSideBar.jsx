import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { adminMenu } from './aizenMenu';
import { FaTachometerAlt, FaStore, FaUsers, FaClipboardList } from 'react-icons/fa';

const Sidebarnav = ({ setSelectedMenuTitle }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const location = useLocation();

  const formatPath = (path) => path.replace(/([A-Z])/g, '-$1').replace(/\s+/g, '-').toLowerCase();

  const handleMenuClick = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
    setSelectedMenuTitle(menu.title); // Set selected menu title
  };

  const renderSubItems = (subItems) => {
    if (!subItems) return null;
    return (
      <ul className="ml-4 mt-2">
        {subItems.map((subItem) => {
          const path = formatPath(subItem.key);
          const isActive = location.pathname.includes(path);
          return (
            <li key={subItem.key}>
              <Link to={`/aizen/${path}`}>
                <div
                  className={`p-2 transition-colors duration-200 rounded-l-3xl ${
                    isActive ? 'bg-primary-green text-white font-bold' : 'hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  {subItem.title}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className='  min-h-screen  overflow-y-auto bg-green-900 w-60'>
      <Link to="/aizen">
        <div className="title p-4 pt-10 text-xl font-bold cursor-pointer hover:text-primary-green">
       
        </div>
      </Link>
      <ul>
        {adminMenu.map((menu) => {
          const hasSubItems = menu.subItems && menu.subItems.length > 0;
          const menuPath = formatPath(menu.key);
          const isActiveMenu = location.pathname.includes(menuPath) || (menu.subItems?.some(subItem => location.pathname.includes(formatPath(subItem.key))) ?? false);

          return (
            <li key={menu.key}>
              <div className={`flex items-center w-full justify-start my-1 py-2 px-4 transition-colors duration-200 rounded-md ${
                isActiveMenu ? 'bg-white bg-opacity-10' : 'hover:bg-white hover:bg-opacity-10'
              }`}>
                <Link to={`/aizen/${menuPath}`} className="flex-1 text-center">
                  <button
                    className={`flex items-center text-left text-white font-semibold ${
                      isActiveMenu ? 'text-white text-lg font-bold' : ''
                    }`}
                    onClick={() => handleMenuClick(menu)}
                  >
                    {menu.icon && <span className="mr-2">{menu.icon}</span>}
                    {menu.title}
                  </button>
                </Link>
                {hasSubItems && (
                  <button onClick={() => handleMenuClick(menu.key)}>
                    {/* Consider adding an icon here */}
                  </button>
                )}
              </div>
              {openMenu === menu.key && hasSubItems && renderSubItems(menu.subItems)}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebarnav;
