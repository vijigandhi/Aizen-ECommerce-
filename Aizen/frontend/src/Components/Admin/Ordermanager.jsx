import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaEye } from 'react-icons/fa';

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(10);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:8000/controller/Admin/Order/getOrders.php');
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleEditClick = (order) => {
    setEditingOrder(order);
  };

  const handleCancelEdit = () => {
    setEditingOrder(null);
  };

  const handleSaveEdit = async () => {
    console.log('Saving order with ID:', editingOrder.id);
    console.log('New status:', editingOrder.Status);

    try {
      const response = await axios.post('http://localhost:8000/controller/Admin/manageOrders.php', {
        order_id: editingOrder.id,
        status: editingOrder.Status
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      console.log('Response data:', response.data);

      if (response.data.success) {
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === editingOrder.id ? { ...order, Status: editingOrder.Status } : order
          )
        );
        setEditingOrder(null);
      } else {
        console.error('Failed to update order:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const handleDeleteOrder = async () => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        const response = await fetch(`http://localhost:8000/controller/Admin/deleteOrders.php?id=${editingOrder.id}`, {
          method: 'DELETE',
        });
        const data = await response.json();

        if (data.success) {
          removeOrderFromList(editingOrder.id);
          setEditingOrder(null);
        } else {
          console.error('Failed to delete order:', data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const removeOrderFromList = (id) => {
    setOrders(orders.filter(order => order.id !== id));
  };

  const handleViewClick = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedOrders = [...orders].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredOrders = sortedOrders.filter(order =>
    order.shipping_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleOrdersPerPageChange = (event) => {
    setOrdersPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredOrders.length / ordersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="p-6 min-h-screen bg-white">
      <div className="flex justify-between items-center mb-8">
        <div className='flex flex-col items-start'>
          <h2 className="text-3xl font-bold text-center text-green-900">Order Management</h2>
          <p className="text-md font-bold text-center text-gray-800">Manage all orders efficiently</p>
        </div>
      </div>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search Order by Shipping Name"
          className="p-2 border border-gray-300 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div>
          <label htmlFor="entries" className="mr-2 text-gray-700">Show</label>
          <select
            id="entries"
            value={ordersPerPage}
            onChange={handleOrdersPerPageChange}
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
        <table className="min-w-full bg-white border rounded-lg shadow-md">
          <thead className="bg-gray-200 text-gray-800 uppercase text-sm">
            <tr>
              <th
                className="py-3 px-6 text-left cursor-pointer"
                onClick={() => handleSort('order_id')}
              >
                Order ID
              </th>
              <th
                className="py-3 px-6 text-left cursor-pointer"
                onClick={() => handleSort('shipping_name')}
              >
                Shipping Name
              </th>
              <th
                className="py-3 px-6 text-left cursor-pointer"
                onClick={() => handleSort('order_status')}
              >
                Order Status
              </th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="py-3 px-6">{order.id}</td>
                <td className="py-3 px-6">{order.shipping_name}</td>
                <td className="py-3 px-6">{order.Status}</td>
                <td className="py-3 px-6 text-center">
                <button
                    className="text-green-500 hover:text-green-700 mr-2"
                    onClick={() => handleViewClick(order)}
                  >
                    <FaEye />
                  </button>
                  <button
                    className="text-blue-500 hover:text-blue-700 "
                    onClick={() => handleEditClick(order)}
                  >
                    <FaEdit />
                  </button>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div>
          <span className="text-gray-700">
            Page{' '}
            <strong>
              {currentPage} of {pageNumbers.length}
            </strong>
          </span>
        </div>
        <div>
          <button
            className="p-2 border border-gray-300 rounded mr-2"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {pageNumbers.map(number => (
            <button
              key={number}
              className={`px-5 border border-gray-300 rounded mr-2 ${currentPage === number ? 'bg-primary-green text-white' : 'text-gray-700'}`}
              onClick={() => paginate(number)}
            >
              {number}
            </button>
          ))}
          <button
            className="p-2 border border-gray-300 rounded"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageNumbers.length))}
            disabled={currentPage === pageNumbers.length}
          >
            Next
          </button>
        </div>
      </div>

      {selectedOrder && (
       <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-60 flex items-center justify-center">
       <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-300 max-w-sm w-full">
         <h3 className="text-2xl font-semibold mb-6 text-gray-800">Order Details</h3>
         <p className="text-gray-700 mb-2"><strong>Order ID:</strong> {selectedOrder.id}</p>
         <p className="text-gray-700 mb-2"><strong>Shipping Name:</strong> {selectedOrder.shipping_name}</p>
         <p className="text-gray-700 mb-4"><strong>Status:</strong> {selectedOrder.Status}</p>
         <button 
           className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300"
           onClick={handleCloseModal}
         >
           Close
         </button>
       </div>
     </div>
     
      )}

      {editingOrder && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-60 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200 max-w-md w-full">
          <h3 className="text-2xl font-semibold mb-6 text-gray-800">Edit Order</h3>
          <label className="block mb-4">
            <span className="text-gray-700 font-medium">Order Status</span>
            <select
              value={editingOrder.Status}
              onChange={(e) => setEditingOrder({ ...editingOrder, Status: e.target.value })}
              className="form-select mt-1 block w-full border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-300"
            >
              <option value="Order Placed">Order Placed</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </label>
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300"
              onClick={handleSaveEdit}
            >
              Save
            </button>
            <button
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-300"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-300"
              onClick={handleDeleteOrder}
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

export default OrderManager;


