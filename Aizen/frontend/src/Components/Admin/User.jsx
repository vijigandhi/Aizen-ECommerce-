import React, { useState } from 'react';
import Userlist from './Userlist';
import Sellerlist from './Sellerlist';

const User = () => {
  const [activeTab, setActiveTab] = useState('userslist');

  return (
    <div className="flex-1 min-h-full bg-gray-100">
      <div className="top bg-white flex w-full border-b">
        <div
          onClick={() => setActiveTab('userslist')}
          className={`text-center w-3/12 py-3 font-semibold cursor-pointer transition duration-300 ${
            activeTab === 'userslist'
              ? 'text-green-900 border-b-4 border-primary-green'
              : 'text-gray-500 hover:text-green-900'
          }`}
        >
          Users List
        </div>
        <div
          onClick={() => setActiveTab('sellerslist')}
          className={`text-center w-3/12 py-3 font-semibold cursor-pointer transition duration-300 ${
            activeTab === 'sellerslist'
              ? 'text-green-900 border-b-4 border-primary-green'
              : 'text-gray-500 hover:text-green-900'
          }`}
        >
          Sellers List
        </div>
        {/* Add more tabs here if needed */}
      </div>
      <div className="bottom min-h-full bg-white shadow-md rounded-b-lg p-4">
        {activeTab === 'userslist' && <Userlist />}
        {activeTab === 'sellerslist' && <Sellerlist />}
        {/* Add more tab content here if needed */}
      </div>
    </div>
  );
};

export default User;
