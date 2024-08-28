import React, { useState } from 'react';
import Citieslist from './Citieslist';
import Statelist from './Statelist';
import Countrieslist from './Countrieslist';

const Address = () => {
    const [activeTab, setActiveTab] = useState('citieslist');
  return (
    <div className="flex-1 min-h-full bg-white">
        {/* <div className='flex px-4 py-4 flex-col items-start'>
          <h2 className="text-3xl font-bold text-center text-green-900">Address Management</h2>
          <p className="text-md font-bold text-center text-gray-800">Manage all stores efficiently</p>
        </div> */}
      <div className="top bg-white flex w-full border-b">
        <div
          onClick={() => setActiveTab('citieslist')}
          className={`text-center w-2/12 py-3 font-semibold cursor-pointer transition duration-300 ${
            activeTab === 'citieslist'
              ? 'text-green-900 border-b-4 border-primary-green'
              : 'text-gray-500 hover:text-green-900'
          }`}
        >
          Cities 
        </div>
        <div
          onClick={() => setActiveTab('stateslist')}
          className={`text-center w-2/12 py-3 font-semibold cursor-pointer transition duration-300 ${
            activeTab === 'stateslist'
              ? 'text-green-900 border-b-4 border-primary-green'
              : 'text-gray-500 hover:text-green-900'
          }`}
        >
          States 
        </div>
        <div
          onClick={() => setActiveTab('countrieslist')}
          className={`text-center w-2/12 py-3 font-semibold cursor-pointer transition duration-300 ${
            activeTab === 'countrieslist'
              ? 'text-green-900 border-b-4 border-primary-green'
              : 'text-gray-500 hover:text-green-900'
          }`}
        >
          Countries
        </div>
        {/* Add more tabs here if needed */}
      </div>
      <div className="bottom min-h-full bg-white shadow-md rounded-b-lg p-4">
        {activeTab === 'citieslist' && <Citieslist />}
        {activeTab === 'stateslist' && <Statelist />}
        {activeTab === 'countrieslist' && <Countrieslist />}
        {/* Add more tab content here if needed */}
      </div>
    </div>
  )
}

export default Address
