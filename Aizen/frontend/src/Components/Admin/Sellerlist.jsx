import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Sellerlist = () => {
  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/controller/Admin/User/getSellers.php'); // Update the path accordingly
        setSellers(response.data);
      } catch (error) {
        console.error("There was an error fetching the sellers!", error);
      }
    };

    fetchSellers();
  }, []);

  const handleViewClick = (sellerId) => {
    // Handle view button click
    console.log(`View seller with ID: ${sellerId}`);
    // For example, you might want to redirect to a seller detail page
  };

  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      <h1>Seller List</h1>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sellers.map(seller => (
            <tr key={seller.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{seller.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{seller.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{seller.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => handleViewClick(seller.id)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Sellerlist;

