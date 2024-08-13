import React, { useState } from 'react';

const CategoryForm = () => {
  const [categoryName, setCategoryName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/controller/Admin/addCategory.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: categoryName,
        }),
      });
      
      const result = await response.json();
      if (result.success) {
        alert('Category added successfully!');
        setCategoryName('');
      } else {
        alert('Failed to add category: ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form className="max-w-md mx-auto p-4 bg-white shadow-md rounded" onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoryName">
          Category Name
        </label>
        <input
          type="text"
          id="categoryName"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit" id='form-btn'
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add Category
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;
