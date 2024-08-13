import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import NewRequests from './NewRequests';
import Rejected from './Rejected';

const Requests = () => {
  return (
    <div className="flex-1 min-h-full bg-gray-100">
      <div className="top flex flex-wrap w-full">
        <Link
          to="newrequests"  // Relative path
          className="text-center text-green-900 font-semibold cursor-pointer w-1/2 py-3 bg-white hover:bg-primary-green transition duration-300"
        >
          New Requests
        </Link>
        <Link
          to="rejected"  // Relative path
          className="text-center text-green-900 font-semibold cursor-pointer w-1/2 py-3 bg-white hover:bg-primary-green transition duration-300"
        >
          Rejected List
        </Link>
      </div>
      <div className="bottom min-h-full bg-white shadow-md rounded-b-lg">
        <Routes>
        <Route path="/" element={<NewRequests />} />
          <Route path="newrequests" element={<NewRequests />} />
          <Route path="rejected" element={<Rejected />} />
          {/* Add more routes for other components like RejectedList if needed */}
        </Routes>
      </div>
    </div>
  );
};

export default Requests;
