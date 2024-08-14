import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaEye, FaSortUp, FaSortDown } from 'react-icons/fa';
import { MdOutlineAddCircleOutline } from 'react-icons/md';
import StoreForm from './StoreForm';

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [selectedStore, setSelectedStore] = useState(null);
  const [showStoreForm, setShowStoreForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [storesPerPage, setStoresPerPage] = useState(5); // Default entries per page

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch('http://localhost:8000/controller/Admin/getStores.php');
        const data = await response.json();
        setStores(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchStores();
  }, []);

  const handleToggleActive = async (storeId) => {
    try {
      const store = stores.find(store => store.id === storeId);
      const updatedActiveStatus = store.is_active === 1 ? 0 : 1;

      const response = await axios.post('http://localhost:8000/controller/Admin/Store/updateStoreStatus.php', {
        store_id: storeId,
        is_active: updatedActiveStatus
      });

      if (response.data.status === 'success') {
        setStores(prevStores =>
          prevStores.map(store =>
            store.id === storeId
              ? { ...store, is_active: updatedActiveStatus }
              : store
          )
        );
      } else {
        console.error('Failed to update store status:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating store status:', error);
    }
  };

  const handleViewClick = (store) => {
    setSelectedStore(store);
  };

  const handleCloseModal = () => {
    setSelectedStore(null);
  };

  const toggleStoreForm = () => {
    setShowStoreForm(!showStoreForm);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedStores = [...stores].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredStores = sortedStores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastStore = currentPage * storesPerPage;
  const indexOfFirstStore = indexOfLastStore - storesPerPage;
  const currentStores = filteredStores.slice(indexOfFirstStore, indexOfLastStore);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleStoresPerPageChange = (event) => {
    setStoresPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to first page when entries per page change
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredStores.length / storesPerPage); i++) {
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
          <h2 className="text-3xl font-bold text-center text-green-900">Store Management</h2>
          <p className="text-md font-bold text-center text-gray-800">Manage all stores efficiently</p>
        </div>
        <button
          onClick={toggleStoreForm}
          className="bg-primary-green hover:bg-green-900 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <MdOutlineAddCircleOutline className="mr-2" /> Add New Store
        </button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search Store by Name"
          className="p-2 border border-gray-300 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div>
          <label htmlFor="entries" className="mr-2 text-gray-700">Show</label>
          <select
            id="entries"
            value={storesPerPage}
            onChange={handleStoresPerPageChange}
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
                className="py-3 px-6  text-left cursor-pointer"
                onClick={() => handleSort('id')}
              >
                Store ID 
              </th>
              <th
                className="py-3 px-6  text-left cursor-pointer"
                onClick={() => handleSort('name')}
              >
                Name 
              </th>
              <th
                className="py-3 px-6 text-center cursor-pointer"
                onClick={() => handleSort('is_active')}
              >
                Active
              </th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm h-48 max-h-48 overflow-y-auto">
            {currentStores.map((store) => (
              <tr key={store.id} className="border-b border-gray-200 hover:bg-gray-100 transition duration-300">
                <td className="py-3 px-6">{store.id}</td>
                <td className="py-3 px-6">{store.name}</td>
                <td className="py-3 px-6 text-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={store.is_active === 1}
                      onChange={() => handleToggleActive(store.id)}
                      className="sr-only"
                    />
                    <div className="block bg-gray-300 w-11 h-6 rounded-full"></div>
                    <div
                      className={`absolute ${store.is_active === 1 ? 'bg-green-500' : 'bg-gray-400'} w-5 h-5 rounded-full transform transition-transform duration-300 ease-in-out`}
                      style={{ transform: store.is_active === 1 ? 'translateX(5px)' : 'translateX(0)' }}
                    ></div>
                  </label>
                </td>
                <td className="py-3 px-6 text-center flex justify-center space-x-4">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => handleViewClick(store)}
                  >
                    <FaEye />
                  </button>
                  <button
                    className="text-green-500 hover:text-green-700"
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
          Showing {indexOfFirstStore + 1} to {indexOfLastStore > filteredStores.length ? filteredStores.length : indexOfLastStore} of {filteredStores.length} entries
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

      {selectedStore && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
            <h3 className="text-lg font-bold mb-4">Store Detail</h3>
            <p>
              <strong>Store ID:</strong> {selectedStore.id}
            </p>
            <p>
              <strong>Name:</strong> {selectedStore.name}
            </p>
            <p>
              <strong>Status:</strong> {selectedStore.is_active === 1 ? 'Active' : 'Inactive'}
            </p>
            <button
              className="mt-4 bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
              onClick={handleCloseModal}
            >
              Close
            </button>
          </div>
        </div>
      )}

{showStoreForm && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
      {/* Your StoreForm content here */}
      <StoreForm onClose={toggleStoreForm} />
    </div>
  </div>
)}

    </div>
  );
};

export default Stores;

