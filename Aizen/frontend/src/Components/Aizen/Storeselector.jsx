import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StoreSelector = ({ onSelectStore }) => {
  const [stores, setStores] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get('http://localhost:8000/controller/Admin/getStores.php');
        if (response.data) {
          setStores(response.data);
        } else {
          setError('No stores found');
        }
      } catch (err) {
        setError('Error fetching stores');
        console.error('Error fetching stores:', err);
      }
    };

    fetchStores();
  }, []);

  if (error) {
    return <div className="text-center text-red-500 m-10 ml-1">{error}</div>;
  }

  return (
    <div className="m-6 ml-1">
      <label htmlFor="store" className="block text-sm font-medium text-gray-700">Select Store:</label>
      <select
        id="store"
        name="store"
        onChange={(e) => onSelectStore(e.target.value)}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        <option value="">All Stores</option>
        {stores.map((store) => (
          <option key={store.id} value={store.id}>{store.name}</option>
        ))}
      </select>
    </div>
  );
};

export default StoreSelector;
