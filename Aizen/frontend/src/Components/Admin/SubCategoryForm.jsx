import React, { useState, useEffect } from 'react';

const SubCategoryForm = () => {
  const [subCategoryName, setSubCategoryName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch('http://localhost:8000/controller/Admin/getCategories.php');
      const data = await response.json();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/controller/Admin/addSubCategory.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: subCategoryName,
          category_id: categoryId,
        }),
      });
      
      const result = await response.json();
      if (result.success) {
        alert('Subcategory added successfully!');
        setSubCategoryName('');
        setCategoryId('');
      } else {
        alert('Failed to add subcategory: ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form className="max-w-md mx-auto p-4 bg-white shadow-md rounded" onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subCategoryName">
          Subcategory Name
        </label>
        <input
          type="text"
          id="subCategoryName"
          value={subCategoryName}
          onChange={(e) => setSubCategoryName(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category_id">
          Select Category
        </label>
        <select
          id="category_id"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
          <option value="">Select a category</option>
          {Array.isArray(categories) && categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit" id='form-btn'
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add Subcategory
        </button>
      </div>
    </form>
  );
};

export default SubCategoryForm;
