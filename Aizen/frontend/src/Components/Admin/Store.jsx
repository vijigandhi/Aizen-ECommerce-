import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaEye } from 'react-icons/fa';
import { MdOutlineAddCircleOutline } from 'react-icons/md';
import StoreForm from './StoreForm';

const Stores = (onClose) => {
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [selectedStore, setSelectedStore] = useState(null);
  const [showStoreForm, setShowStoreForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [storesPerPage, setStoresPerPage] = useState(5);
  const [editingStore, setEditingStore] = useState(null);

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

  const handleEditClick = (store) => {
    setEditingStore({ ...store });
  };

  const handleCancelEdit = () => {
    setEditingStore(null);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.post('http://localhost:8000/controller/Admin/manageStores.php', {
        store_id: editingStore.id,
        is_active: editingStore.is_active,
        is_popular: editingStore.is_popular
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setStores(prevStores =>
          prevStores.map(st => 
            st.id === editingStore.id ? editingStore : st
          )
        );
        setEditingStore(null);
      } else {
        console.error('Failed to update store:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating store:', error);
    }
  };

  const handleDeleteStore = () => {
    if (window.confirm('Are you sure you want to delete this store?')) {
      fetch(`http://localhost:8000/controller/Admin/deleteStore.php?id=${editingStore.id}`, {
        method: 'DELETE',
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          removeStoreFromList(editingStore.id);
          setEditingStore(null);
        } else {
          console.error('Failed to delete store:', data.message);
        }
      })
      .catch(error => console.error('Error:', error));
    }
  };

  const removeStoreFromList = (id) => {
    setStores(stores.filter(store => store.id !== id));
  };

  const handleToggleChange = (field) => {
    setEditingStore(prevStore => ({
      ...prevStore,
      [field]: prevStore[field] === '1' ? '0' : '1'
    }));
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
    setCurrentPage(1);
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredStores.length / storesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="p-6 min-h-screen bg-white">
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
        <table className="min-w-full bg-white border  rounded-lg shadow-md">
          <thead className="bg-gray-200 text-gray-800 uppercase text-sm">
            <tr>
              <th
                className="py-3 px-6 text-left cursor-pointer"
                onClick={() => handleSort('id')}
              >
                Store ID
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
            {currentStores.map((store) => (
              <tr key={store.id} className="border-b border-r-0 border-gray-200 h-8 hover:bg-gray-100 transition duration-300">
                <td className="py-3 px-6">{store.id}</td>
                <td className="py-3 border-l-0 border-r-0 px-6">{store.name}</td>
                <td className="py-3 px-6 text-center">
                  <FaEye className="inline-block cursor-pointer text-green-600" onClick={() => handleViewClick(store)} />
                  <FaEdit className="inline-block cursor-pointer text-blue-600 ml-2" onClick={() => handleEditClick(store)} />
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
      {showStoreForm && 
       <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
         <div className="bg-white p-8 rounded-lg shadow-lg">
         <StoreForm onClose={toggleStoreForm} />
         </div>
       </div>
      }
      {selectedStore &&
       <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
         <div className="bg-white p-8 rounded-lg shadow-lg">
           <h2 className="text-xl font-bold mb-4">Store Details</h2>
           <p><strong>ID:</strong> {selectedStore.id}</p>
           <p><strong>Name:</strong> {selectedStore.name}</p>
           <p><strong>Status:</strong> {selectedStore.is_active ? 'Active' : 'Inactive'}</p>
           <p><strong>Popularity:</strong> {selectedStore.is_popular ? 'Popular' : 'Not Popular'}</p>
           <button onClick={handleCloseModal} className="mt-4 bg-red-500 text-white py-2 px-4 rounded">Close</button>
         </div>
       </div>
      }
      {editingStore &&
       <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
         <div className="bg-white p-8 rounded-lg shadow-lg">
           <h2 className="text-xl font-bold mb-4">Edit Store</h2>
           <div className="mb-4">
             <label className="block text-gray-700">Status</label>
             <button
               onClick={() => handleToggleChange('is_active')}
               className={`px-4 py-2 rounded ${editingStore.is_active === '1' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-700'}`}
             >
               {editingStore.is_active === '1' ? 'Active' : 'Inactive'}
             </button>
           </div>
           <div className="mb-4">
             <label className="block text-gray-700">Popularity</label>
             <button
               onClick={() => handleToggleChange('is_popular')}
               className={`px-4 py-2 rounded ${editingStore.is_popular === '1' ? 'bg-yellow-600 text-white' : 'bg-gray-300 text-gray-700'}`}
             >
               {editingStore.is_popular === '1' ? 'Popular' : 'Not Popular'}
             </button>
           </div>
           <button
             onClick={handleSaveEdit}
             className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
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
             onClick={handleDeleteStore}
             className="bg-red-500 text-white py-2 px-4 rounded mt-4"
           >
             Delete
           </button>
         </div>
       </div>
      }
    </div>
  );
};

export default Stores;


