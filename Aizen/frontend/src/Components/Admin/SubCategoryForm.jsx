import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SubCategoryForm = ({ onClose }) => {
  const [subCategoryName, setSubCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8000/controller/Admin/getCategories.php');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to fetch categories');
      }
    };

    fetchCategories();
  }, []);

  const validateForm = () => {
    const errors = {};

    if (!subCategoryName.trim()) {
      errors.subCategoryName = 'Subcategory name is required';
    }

    if (!description.trim()) {
      errors.description = 'Description is required';
    }

    if (!categoryId) {
      errors.categoryId = 'Please select a category';
    }

    if (!image) {
      errors.image = 'Image is required';
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
    formData.append('name', subCategoryName);
    formData.append('description', description);
    formData.append('category_id', categoryId);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await fetch('http://localhost:8000/controller/Admin/addSubCategory.php', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Subcategory added successfully!');
        setSubCategoryName('');
        setDescription('');
        setCategoryId('');
        setImage(null);
        onClose();
      } else {
        toast.error('Failed to add subcategory: ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  // Error clearing logic for each input
  const handleInputChange = (field, value) => {
    if (field === 'subCategoryName') {
      setSubCategoryName(value);
    } else if (field === 'description') {
      setDescription(value);
    } else if (field === 'categoryId') {
      setCategoryId(value);
    } else if (field === 'image') {
      setImage(value);
    }

    // Clear the error for the specific field if there was an error
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: '',
    }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="relative bg-white p-5 rounded-lg shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <h2 className="text-xl font-bold mb-4">Add New Subcategory</h2>
        <form className="max-w-md mx-auto p-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subCategoryName">
              Subcategory Name
            </label>
            <input
              type="text"
              id="subCategoryName"
              value={subCategoryName}
              onChange={(e) => handleInputChange('subCategoryName', e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <span className="block h-6">
              <p className={`text-red-500 text-xs ${errors.subCategoryName ? '' : 'hidden'}`}>
                {errors.subCategoryName}
              </p>
            </span>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <span className="block h-6">
              <p className={`text-red-500 text-xs ${errors.description ? '' : 'hidden'}`}>
                {errors.description}
              </p>
            </span>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category_id">
              Select Category
            </label>
            <select
              id="category_id"
              value={categoryId}
              onChange={(e) => handleInputChange('categoryId', e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select a category</option>
              {Array.isArray(categories) &&
                categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>
            <span className="block h-6">
              <p className={`text-red-500 text-xs ${errors.categoryId ? '' : 'hidden'}`}>
                {errors.categoryId}
              </p>
            </span>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
              Upload Image
            </label>
            <input
              type="file"
              id="image"
              onChange={(e) => handleInputChange('image', e.target.files[0])}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <span className="block h-6">
              <p className={`text-red-500 text-xs ${errors.image ? '' : 'hidden'}`}>
                {errors.image}
              </p>
            </span>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-primary-green hover:bg-green-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add Subcategory
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default SubCategoryForm;

