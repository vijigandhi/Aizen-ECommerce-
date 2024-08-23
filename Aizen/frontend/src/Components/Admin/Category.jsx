import React, { useState } from 'react';
import Categorieslist from './Categorieslist';
import Subcategorieslist from './Subcategorieslist';


const Category = () => {
    const [activeTab, setActiveTab] = useState('categorieslist');
  return (
    <div className="flex-1 min-h-full bg-white">
        {/* <div className='flex px-4 py-4 flex-col items-start'>
          <h2 className="text-3xl font-bold text-center text-green-900">Content Management</h2>
          <p className="text-md font-bold text-center text-gray-800">Manage all Categories efficiently</p>
        </div> */}
      <div className="top bg-white flex w-full border-b">
        <div
          onClick={() => setActiveTab('categorieslist')}
          className={`text-center w-2/12 py-3 font-semibold cursor-pointer transition duration-300 ${
            activeTab === 'categorieslist'
              ? 'text-green-900 border-b-4 border-primary-green'
              : 'text-gray-500 hover:text-green-900'
          }`}
        >
          Categories 
        </div>
        <div
          onClick={() => setActiveTab('subcategorieslist')}
          className={`text-center w-2/12 py-3 font-semibold cursor-pointer transition duration-300 ${
            activeTab === 'subcategorieslist'
              ? 'text-green-900 border-b-4 border-primary-green'
              : 'text-gray-500 hover:text-green-900'
          }`}
        >
          Sub Categories
        </div>
        
        {/* Add more tabs here if needed */}
      </div>
      <div className="bottom min-h-full bg-white shadow-md rounded-b-lg p-4">
        {activeTab === 'categorieslist' && <Categorieslist />}
        {activeTab === 'subcategorieslist' && <Subcategorieslist />}
        
        {/* Add more tab content here if needed */}
      </div>
    </div>
  )
}

export default Category;
