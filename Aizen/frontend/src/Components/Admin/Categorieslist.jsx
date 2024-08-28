import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaEye } from 'react-icons/fa';
import { MdOutlineAddCircleOutline } from 'react-icons/md';
import CategoryForm from './CategoryForm';

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage, setCategoriesPerPage] = useState(10);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8000/controller/Admin/getcategoriesall.php');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleEditClick = (category) => {
    setEditingCategory({ ...category });
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.post('http://localhost:8000/controller/Admin/managecategories.php', {
        category_id: editingCategory.id,
        is_active: editingCategory.is_active,
        is_popular: editingCategory.is_popular
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setCategories(prevCategories =>
          prevCategories.map(cat =>
            cat.id === editingCategory.id ? editingCategory : cat
          )
        );
        setEditingCategory(null);
      } else {
        console.error('Failed to update category:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };
  const handleDeleteCategory = () => {
    // Confirmation before deleting
    if (window.confirm('Are you sure you want to delete this category?')) {
      // Assuming you have an API endpoint to delete the category
      fetch(`http://localhost:8000/controller/Admin/deleteCategories.php?id=${editingCategory.id}`, {
        method: 'DELETE',
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Handle successful deletion (e.g., remove the category from the list)
          removeCategoryFromList(editingCategory.id);
          setEditingCategory(null); // Close the modal after deletion
        } else {
          // Handle error
          console.error('Failed to delete category:', data.message);
        }
      })
      .catch(error => console.error('Error:', error));
    }
  };
  
  // Example of removing the category from the list after deletion
  const removeCategoryFromList = (id) => {
    setCategories(categories.filter(category => category.id !== id));
  };
  

  const handleToggleChange = (field) => {
    setEditingCategory(prevCategory => ({
      ...prevCategory,
      [field]: prevCategory[field] === '1' ? '0' : '1'
    }));
  };

  const handleViewClick = (category) => {
    setSelectedCategory(category);
  };

  const handleCloseModal = () => {
    setSelectedCategory(null);
  };

  const toggleCategoryForm = () => {
    setShowCategoryForm(!showCategoryForm);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedCategories = [...categories].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredCategories = sortedCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleCategoriesPerPageChange = (event) => {
    setCategoriesPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to first page when entries per page change
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredCategories.length / categoriesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="p-6 min-h-screen bg-white">
      <div className="flex justify-between items-center mb-8">
        <div className='flex flex-col items-start'>
          <h2 className="text-3xl font-bold text-center text-green-900">Category Management</h2>
          <p className="text-md font-bold text-center text-gray-800">Manage all categories efficiently</p>
        </div>
        <button
          onClick={toggleCategoryForm}
          className="bg-primary-green hover:bg-green-900 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <MdOutlineAddCircleOutline className="mr-2" /> Add New Category
        </button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search Category by Name"
          className="p-2 border border-gray-300 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div>
          <label htmlFor="entries" className="mr-2 text-gray-700">Show</label>
          <select
            id="entries"
            value={categoriesPerPage}
            onChange={handleCategoriesPerPageChange}
            className="border border-gray-300 rounded py-1 px-2 text-gray-700"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
          <label htmlFor="entries" className="ml-2 text-gray-700">entries</label>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border  rounded-lg shadow-md">
          <thead className="bg-gray-200 text-gray-800 uppercase text-sm">
            <tr>
              <th
                className="py-3 px-6 text-left cursor-pointer"
                onClick={() => handleSort('id')}
              >
                Category ID
              </th>
              <th
                className="py-3 px-6 text-left cursor-pointer"
                onClick={() => handleSort('name')}
              >
                Name
              </th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm border-0 h-45 max-h-45 overflow-y-auto">
            {currentCategories.map((category) => (
              <tr key={category.id} className="border-b border-r-0 border-gray-200 h-8 hover:bg-gray-100 transition duration-300">
                <td className="py-3  px-6">{category.id}</td>
                <td className="py-3 border-l-0 border-r-0 px-6">{category.name}</td>
                <td className="py-3 px-6 text-center">
                  <FaEye className="inline-block cursor-pointer text-green-600" onClick={() => handleViewClick(category)} />
                  <FaEdit className="inline-block cursor-pointer text-blue-600 ml-2" onClick={() => handleEditClick(category)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div>
          Showing {indexOfFirstCategory + 1} to {indexOfLastCategory > filteredCategories.length ? filteredCategories.length : indexOfLastCategory} of {filteredCategories.length} entries
        </div>
        <div className="flex space-x-1">
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-3 py-1 rounded ${currentPage === number ? 'bg-primary-green text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              {number}
            </button>
          ))}
        </div>
      </div>
      {showCategoryForm && 
       <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
       <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
         {/* Your SubCategoryForm content here */}
         <CategoryForm onClose={toggleCategoryForm} />
       </div>
     </div>}
      {selectedCategory && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white p-8 w-full max-w-lg rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Category Details</h2>
        <div className="mb-4">
          <p className="text-lg text-gray-700">
            <strong>ID:</strong> {selectedCategory.id}
          </p>
        </div>
        <div className="mb-4">
          <p className="text-lg text-gray-700">
            <strong>Name:</strong> {selectedCategory.name}
          </p>
        </div>
        <div className="mb-4">
          <p className="text-lg text-gray-700">
            <strong>Status:</strong> {selectedCategory.is_active === '1' ? 'Active' : 'Inactive'}
          </p>
        </div>
        <div className="mb-4">
          <p className="text-lg text-gray-700">
            <strong>Popularity:</strong> {selectedCategory.is_popular === '1' ? 'Popular' : 'Not Popular'}
          </p>
        </div>
        <button
          onClick={handleCloseModal}
          className="mt-6 bg-gray-600 hover:bg-gray-800 text-white font-bold px-6 py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
    
      )}
      {editingCategory && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Category</h2>
          
          <div className="flex items-center justify-between mb-6">
            <label className="text-gray-700 font-medium">Active Status:</label>
            <button
              onClick={() => handleToggleChange('is_active')}
              className={`py-2 px-6 rounded-full transition-all duration-300 ${
                editingCategory.is_active === '1' 
                  ? 'bg-green-600 text-white shadow-md' 
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {editingCategory.is_active === '1' ? 'On' : 'Off'}
            </button>
          </div>
      
          <div className="flex items-center justify-between mb-6">
            <label className="text-gray-700 font-medium">Popular Status:</label>
            <button
              onClick={() => handleToggleChange('is_popular')}
              className={`py-2 px-6 rounded-full transition-all duration-300 ${
                editingCategory.is_popular === '1' 
                  ? 'bg-green-600 text-white shadow-md' 
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {editingCategory.is_popular === '1' ? 'On' : 'Off'}
            </button>
          </div>
      
          <div className="flex justify-between space-x-4 mt-8">
            <button
              onClick={handleCancelEdit}
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold px-5 py-2 rounded-lg transition-all duration-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2 rounded-lg transition-all duration-300"
            >
              Save
            </button>
            <button
              onClick={handleDeleteCategory}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2 rounded-lg transition-all duration-300"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      
      
      )}
    </div>
  );
};

export default CategoriesList;
