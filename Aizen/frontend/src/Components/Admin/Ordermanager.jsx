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
  const [ordersPerPage, setOrdersPerPage] = useState(5);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:8000/controller/Admin/Order/getOrders.php');
        const data = await response.json();
        console.log(data);
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
    try {
      const response = await axios.post('http://localhost:8000/controller/Admin/manageOrders.php', {
        order_id: editingOrder.id,
        status: editingOrder.Status
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === editingOrder.id ? editingOrder : order
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
            <option value="5">5</option>
            <option value="10">10</option>
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
                onClick={() => handleSort('status')}
              >
                Status
              </th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm border-0 h-45 max-h-45 overflow-y-auto">
            {currentOrders.map((order) => (
              <tr key={order.order_id} className="border-b border-r-0 border-gray-200 h-8 hover:bg-gray-100 transition duration-300">
                <td className="py-3 px-6">{order.id}</td>
                <td className="py-3 border-l-0 border-r-0 px-6">{order.shipping_name}</td>
                <td className="py-3 border-l-0 border-r-0 px-6">{order.Status}</td>
                <td className="py-3 px-6 text-center">
                  <FaEye className="inline-block cursor-pointer text-green-600" onClick={() => handleViewClick(order)} />
                  <FaEdit className="inline-block cursor-pointer text-blue-600 ml-2" onClick={() => handleEditClick(order)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div>
          Showing {indexOfFirstOrder + 1} to {indexOfLastOrder > filteredOrders.length ? filteredOrders.length : indexOfLastOrder} of {filteredOrders.length} entries
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

      {selectedOrder &&
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-1/2">
            <h3 className="text-2xl font-semibold mb-4">Order Details</h3>
            <p><strong>Order ID:</strong> {selectedOrder.id}</p>
            <p><strong>Shipping Name:</strong> {selectedOrder.shipping_name}</p>
            <p><strong>Status:</strong> {selectedOrder.Status}</p>
            <button
              onClick={handleCloseModal}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            >
              Close
            </button>
          </div>
        </div>
      }

      {editingOrder &&
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-1/2">
            <h3 className="text-2xl font-semibold mb-4">Edit Order</h3>
            <div className="mb-4">
              <label className="block text-gray-700">Order ID:</label>
              <input
                type="text"
                value={editingOrder.id}
                readOnly
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Shipping Name:</label>
              <input
                type="text"
                value={editingOrder.shipping_name}
                readOnly
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Status:</label>
              <select
                value={editingOrder.Status}
                onChange={(e) => setEditingOrder({ ...editingOrder, Status: e.target.value })}
                className="p-2 border border-gray-300 rounded w-full"
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleSaveEdit}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteOrder}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default OrderManager;

