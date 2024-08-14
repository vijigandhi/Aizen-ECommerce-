import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaEye, FaSortUp, FaSortDown } from 'react-icons/fa';
import { MdOutlineAddCircleOutline } from 'react-icons/md';
import CategoryForm from './CategoryForm';

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage, setCategoriesPerPage] = useState(5);

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

  const handleToggleActive = async (categoryId) => {
    try {
      const category = categories.find(cat => cat.id === categoryId);
      const updatedActiveStatus = category.is_active === '1' ? '0' : '1';

      const response = await axios.post('http://localhost:8000/controller/Admin/UpdateCategoryStatus.php', {
        category_id: categoryId,
        is_active: updatedActiveStatus
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setCategories(prevCategories =>
          prevCategories.map(cat =>
            cat.id === categoryId
              ? { ...cat, is_active: updatedActiveStatus }
              : cat
          )
        );
      } else {
        console.error('Failed to update category status:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating category status:', error);
    }
  };

  const handleTogglePopular = async (categoryId) => {
    try {
      const category = categories.find(cat => cat.id === categoryId);
      const updatedPopularStatus = category.is_popular === '1' ? '0' : '1';

      const response = await axios.post('http://localhost:8000/controller/Admin/UpdateCategoryStatus.php', {
        category_id: categoryId,
        is_popular: updatedPopularStatus
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setCategories(prevCategories =>
          prevCategories.map(cat =>
            cat.id === categoryId
              ? { ...cat, is_popular: updatedPopularStatus }
              : cat
          )
        );
      } else {
        console.error('Failed to update category popularity:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating category popularity:', error);
    }
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

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />;
    }
    return null;
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
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
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-200 text-gray-800 uppercase text-sm">
            <tr>
              <th
                className="py-3 px-6 text-left cursor-pointer"
                onClick={() => handleSort('id')}
              >
                Category ID {getSortIcon('id')}
              </th>
              <th
                className="py-3 px-6 text-left cursor-pointer"
                onClick={() => handleSort('name')}
              >
                Name {getSortIcon('name')}
              </th>
              <th
                className="py-3 px-6 text-center cursor-pointer"
                onClick={() => handleSort('is_active')}
              >
                Active {getSortIcon('is_active')}
              </th>
              <th
                className="py-3 px-6 text-center cursor-pointer"
                onClick={() => handleSort('is_popular')}
              >
                Popular {getSortIcon('is_popular')}
              </th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm h-48 max-h-48 overflow-y-auto">
            {currentCategories.map((category) => (
              <tr key={category.id} className="border-b border-gray-200 hover:bg-gray-100 transition duration-300">
                <td className="py-3 px-6">{category.id}</td>
                <td className="py-3 px-6">{category.name}</td>
                <td className="py-3 px-6 text-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={category.is_active === '1'}
                      onChange={() => handleToggleActive(category.id)}
                      className="sr-only"
                    />
                    <div className="w-11 h-6 bg-gray-300 rounded-full"></div>
                    <span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition transform"></span>
                  </label>
                </td>
                <td className="py-3 px-6 text-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={category.is_popular === '1'}
                      onChange={() => handleTogglePopular(category.id)}
                      className="sr-only"
                    />
                    <div className="w-11 h-6 bg-gray-300 rounded-full"></div>
                    <span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition transform"></span>
                  </label>
                </td>
                <td className="py-3 px-6 text-center">
                  <FaEye className="inline-block cursor-pointer text-green-600" onClick={() => handleViewClick(category)} />
                  <FaEdit className="inline-block cursor-pointer text-blue-600 ml-2" onClick={() => handleViewClick(category)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <nav className="flex justify-center">
          <ul className="flex space-x-2">
            {pageNumbers.map(number => (
              <li key={number}>
                <button
                  onClick={() => paginate(number)}
                  className={`py-2 px-4 border rounded ${currentPage === number ? 'bg-green-900 text-white' : 'bg-white text-green-900'}`}
                >
                  {number}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {showCategoryForm && <CategoryForm closeForm={toggleCategoryForm} />}
      {selectedCategory && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Category Details</h2>
            <p><strong>ID:</strong> {selectedCategory.id}</p>
            <p><strong>Name:</strong> {selectedCategory.name}</p>
            <p><strong>Status:</strong> {selectedCategory.is_active === '1' ? 'Active' : 'Inactive'}</p>
            <p><strong>Popularity:</strong> {selectedCategory.is_popular === '1' ? 'Popular' : 'Not Popular'}</p>
            <button onClick={handleCloseModal} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesList;
