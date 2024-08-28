import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaEye, FaSortUp, FaSortDown } from 'react-icons/fa';
import { MdOutlineAddCircleOutline } from 'react-icons/md';
import SubCategoryForm from './SubCategoryForm';

const SubcategoriesList = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [showSubCategoryForm, setShowSubCategoryForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [subcategoriesPerPage, setSubcategoriesPerPage] = useState(10);
  const [editingSubcategory, setEditingSubcategory] = useState(null);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await fetch('http://localhost:8000/controller/Admin/getSubCategories.php');
        const data = await response.json();
        setSubcategories(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchSubcategories();
  }, []);

  const handleEditClick = (subcategory) => {
    setEditingSubcategory({ ...subcategory });
  };

  const handleCancelEdit = () => {
    setEditingSubcategory(null);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.post('http://localhost:8000/controller/Admin/manageSubcategories.php', {
        subcategory_id: editingSubcategory.id,
        is_active: editingSubcategory.is_active,
        is_popular: editingSubcategory.is_popular
      }, {
        headers: {
          'Content-Type': 'application/json'

        }
      });

      if (response.data.success) {
        setSubcategories(prevSubcategories =>
          prevSubcategories.map(sub =>
            sub.id === editingSubcategory.id ? editingSubcategory : sub
          )
        );
        setEditingSubcategory(null);
      } else {
        console.error('Failed to update subcategory:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating subcategory:', error);
    }
  };

  const handleDeleteSubcategory = () => {
    if (window.confirm('Are you sure you want to delete this subcategory?')) {
      fetch(`http://localhost:8000/controller/Admin/manageSubCategories.php?id=${editingSubcategory.id}`, {
        method: 'DELETE',
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          removeSubcategoryFromList(editingSubcategory.id);
          setEditingSubcategory(null);
        } else {
          console.error('Failed to delete subcategory:', data.message);
        }
      })
      .catch(error => console.error('Error:', error));
    }
  };
  
  const removeSubcategoryFromList = (id) => {
    setSubcategories(subcategories.filter(subcategory => subcategory.id !== id));
  };

  const handleToggleChange = (field) => {
    setEditingSubcategory(prevSubcategory => ({
      ...prevSubcategory,
      [field]: prevSubcategory[field] === '1' ? '0' : '1'
    }));
  };

  const handleViewClick = (subcategory) => {
    setSelectedSubcategory(subcategory);
  };

  const handleCloseModal = () => {
    setSelectedSubcategory(null);
  };

  const toggleSubCategoryForm = () => {
    setShowSubCategoryForm(!showSubCategoryForm);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedSubcategories = [...subcategories].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredSubcategories = sortedSubcategories.filter(subcategory =>
    subcategory.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastSubcategory = currentPage * subcategoriesPerPage;
  const indexOfFirstSubcategory = indexOfLastSubcategory - subcategoriesPerPage;
  const currentSubcategories = filteredSubcategories.slice(indexOfFirstSubcategory, indexOfLastSubcategory);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSubcategoriesPerPageChange = (event) => {
    setSubcategoriesPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredSubcategories.length / subcategoriesPerPage); i++) {
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
          <h2 className="text-3xl font-bold text-center text-green-900">Subcategory Management</h2>
          <p className="text-md font-bold text-center text-gray-800">Manage all subcategories efficiently</p>
        </div>
        <button
          onClick={toggleSubCategoryForm}
          className="bg-primary-green hover:bg-green-900 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <MdOutlineAddCircleOutline className="mr-2" /> Add New Subcategory
        </button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search Subcategory by Name"
          className="p-2 border border-gray-300 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div>
          <label htmlFor="entries" className="mr-2 text-gray-700">Show</label>
          <select
            id="entries"
            value={subcategoriesPerPage}
            onChange={handleSubcategoriesPerPageChange}
            className="border border-gray-300 rounded py-1 px-2 text-gray-700"
          >
            
            <option value="10">10</option>
            <option value="15">15</option>
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
                Subcategory ID {getSortIcon('id')}
              </th>
              <th
                className="py-3 px-6 text-left cursor-pointer"
                onClick={() => handleSort('name')}
              >
                Name {getSortIcon('name')}
              </th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm h-48 max-h-48 overflow-y-auto">
            {currentSubcategories.map((subcategory) => (
              <tr key={subcategory.id} className="border-b border-gray-200 hover:bg-gray-100 transition duration-300">
                <td className="py-3 px-6">{subcategory.id}</td>
                <td className="py-3 px-6">{subcategory.name}</td>
                <td className="py-3 px-6 text-center flex justify-center space-x-4">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => handleViewClick(subcategory)}
                  >
                    <FaEye />
                  </button>
                  <button
                    className="text-green-500 hover:text-green-700"
                    onClick={() => handleEditClick(subcategory)}
                  >
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div>
          Showing {indexOfFirstSubcategory + 1} to {indexOfLastSubcategory > filteredSubcategories.length ? filteredSubcategories.length : indexOfLastSubcategory} of {filteredSubcategories.length} entries
        </div>
        <div>
          <ul className="flex space-x-2">
            {pageNumbers.map(number => (
              <li key={number}>
                <button
                  onClick={() => paginate(number)}
                  className={`px-4 py-2 rounded ${currentPage === number ? 'bg-primary-green text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  {number}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {showSubCategoryForm && <SubCategoryForm onClose={toggleSubCategoryForm} />}
      
      {selectedSubcategory && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
        <div className="bg-white p-8 w-full max-w-lg rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Sub Category Details</h2>
          <div className="mb-4">
            <p className="text-lg text-gray-700">
              <strong>ID:</strong> {selectedSubcategory.id}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-lg text-gray-700">
              <strong>Name:</strong> {selectedSubcategory.name}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-lg text-gray-700">
              <strong>Status:</strong> {selectedSubcategory.is_active === '1' ? 'Active' : 'Inactive'}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-lg text-gray-700">
              <strong>Popularity:</strong> {selectedSubcategory.is_popular === '1' ? 'Popular' : 'Not Popular'}
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

      {editingSubcategory && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-2/3 max-h-[90vh] p-8 rounded-lg shadow-lg overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">Edit Subcategory</h3>
            <div className="space-y-4">
              
              
      
              
            <div className="flex items-center justify-between mb-6">
            <label className="text-gray-700 font-medium">Active Status:</label>
            <button
              onClick={() => handleToggleChange('is_active')}
              className={`py-2 px-6 rounded-full transition-all duration-300 ${
                editingSubcategory.is_active === '1' 
                  ? 'bg-green-600 text-white shadow-md' 
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {editingSubcategory.is_active === '1' ? 'On' : 'Off'}
            </button>
          </div>
      
          <div className="flex items-center justify-between mb-6">
            <label className="text-gray-700 font-medium">Popular Status:</label>
            <button
              onClick={() => handleToggleChange('is_popular')}
              className={`py-2 px-6 rounded-full transition-all duration-300 ${
                editingSubcategory.is_popular === '1' 
                  ? 'bg-green-600 text-white shadow-md' 
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {editingSubcategory.is_popular === '1' ? 'On' : 'Off'}
            </button>
          </div>
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={handleSaveEdit}
                className="bg-primary-green text-white py-2 px-4 rounded"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="bg-gray-500 text-white py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSubcategory}
                className="bg-red-500 text-white py-2 px-4 rounded"
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

export default SubcategoriesList;
