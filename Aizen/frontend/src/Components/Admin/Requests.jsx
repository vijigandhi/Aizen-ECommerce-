import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import NewRequests from './NewRequests';
import Rejected from './Rejected';

const Requests = () => {
  const [activeTab, setActiveTab] = useState('newrequests');
  return (
    <div className="flex-1 min-h-full bg-gray-100">
      <div className="top bg-white flex w-full border-b">
        <div
          onClick={() => setActiveTab('newrequests')}
          className={`text-center w-3/12 py-3 font-semibold cursor-pointer transition duration-300 ${
            activeTab === 'newrequests'
              ? 'text-green-900 border-b-4 border-primary-green'
              : 'text-gray-500 hover:text-green-900'
          }`}
        >
          New Requests
        </div>
        <div
          onClick={() => setActiveTab('rejected')}
          className={`text-center w-3/12 py-3 font-semibold cursor-pointer transition duration-300 ${
            activeTab === 'rejected'
              ? 'text-green-900 border-b-4 border-primary-green'
              : 'text-gray-500 hover:text-green-900'
          }`}
        >
          Rejected Requests
        </div>
        {/* Add more tabs here if needed */}
      </div>
      <div className="bottom min-h-full bg-white shadow-md rounded-b-lg p-4">
        {activeTab === 'newrequests' && <NewRequests />}
        {activeTab === 'rejected' && <Rejected />}
        {/* Add more tab content here if needed */}
      </div>
    </div>
  );
};

export default Requests;
