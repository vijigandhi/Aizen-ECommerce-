import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CategoryForm = ({ onClose }) => {
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (!categoryName.trim()) {
      errors.categoryName = 'Category name is required';
    }

    if (!categoryDescription.trim()) {
      errors.categoryDescription = 'Description is required';
    }

    if (!categoryImage) {
      errors.categoryImage = 'Category image is required';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append('name', categoryName);
    formData.append('description', categoryDescription);
    formData.append('image', categoryImage);

    try {
      const response = await fetch('http://localhost:8000/controller/Admin/addCategory.php', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Category added successfully!');
        setCategoryName('');
        setCategoryDescription('');
        setCategoryImage(null);
        onClose();
      } else {
        toast.error('Failed to add category: ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while adding the category.');
    }
  };

  // Error clearing logic for each input
  const handleInputChange = (field, value) => {
    // Update the respective field value
    if (field === 'categoryName') {
      setCategoryName(value);
    } else if (field === 'categoryDescription') {
      setCategoryDescription(value);
    } else if (field === 'categoryImage') {
      setCategoryImage(value);
    }

    // Clear the error for the specific field if there was an error
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: '',
    }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="relative bg-white p-6 rounded-lg shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <h2 className="text-xl font-bold mb-4">Add New Category</h2>
        <form className="max-w-md mx-auto p-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoryName">
              Category Name
            </label>
            <input
              type="text"
              id="categoryName"
              value={categoryName}
              onChange={(e) => handleInputChange('categoryName', e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <span className="block h-6">
              <p className={`text-red-500 text-xs ${errors.categoryName ? '' : 'hidden'}`}>{errors.categoryName}</p>
            </span>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoryDescription">
              Description
            </label>
            <textarea
              id="categoryDescription"
              value={categoryDescription}
              onChange={(e) => handleInputChange('categoryDescription', e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <span className="block h-6">
              <p className={`text-red-500 text-xs ${errors.categoryDescription ? '' : 'hidden'}`}>{errors.categoryDescription}</p>
            </span>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoryImage">
              Category Image
            </label>
            <input
              type="file"
              id="categoryImage"
              onChange={(e) => handleInputChange('categoryImage', e.target.files[0])}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <span className="block h-6">
              <p className={`text-red-500 text-xs ${errors.categoryImage ? '' : 'hidden'}`}>{errors.categoryImage}</p>
            </span>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-primary-green hover:bg-green-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add Category
            </button>
          </div>
        </form>
      </div>
      {/* Add ToastContainer to enable Toastify notifications */}
      <ToastContainer />
    </div>
  );
};

export default CategoryForm;

