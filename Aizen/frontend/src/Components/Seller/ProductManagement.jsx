import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaEye, FaSortUp, FaSortDown } from 'react-icons/fa';
import { MdOutlineAddCircleOutline } from 'react-icons/md';
import ProductForm from './ProductForm'; // Ensure this component exists and is correctly implemented
import { useNavigate } from 'react-router-dom';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(5); // Default entries per page
  const [loading, setLoading] = useState(true); // Loading state
  const [userId, setUserId] = useState(null); // State to store user ID
  const [isAdmin, setIsAdmin] = useState(false); // State to check if user is an admin
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAccess = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:8000/controller/Admin/getUserDetails.php', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.user.role_id === 1 || response.data.user.role_id === 2 ) {
            setIsAdmin(true);
            setUserId(response.data.user.id); // Store user ID
          } else {
            navigate('/access-denied');
          }
        } catch (error) {
          console.error('Error verifying admin role:', error);
          navigate('/access-denied');
        }
      } else {
        navigate('/access-denied');
      }
    };

    checkAdminAccess();
  }, [navigate]);

  useEffect(() => {
    if (userId) {
      const fetchProducts = async () => {
        try {
          const response = await axios.get('http://localhost:8000/controller/Admin/Seller/getSellerProducts.php', {
            params: { user_id: userId }
          });
          setProducts(response.data.products || []);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();
    }
  }, [userId]);

  const handleViewClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const toggleProductForm = () => {
    setShowProductForm(!showProductForm);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredProducts = sortedProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleProductsPerPageChange = (event) => {
    setProductsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to first page when entries per page change
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredProducts.length / productsPerPage); i++) {
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
          <h2 className="text-3xl font-bold text-center text-green-900">Product Management</h2>
          <p className="text-md font-bold text-center text-gray-800">Manage all products efficiently</p>
        </div>
        <button
          onClick={toggleProductForm}
          className="bg-primary-green hover:bg-green-900 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <MdOutlineAddCircleOutline className="mr-2" /> Add New Product
        </button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search Product by Name"
          className="p-2 border border-gray-300 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div>
          <label htmlFor="entries" className="mr-2 text-gray-700">Show</label>
          <select
            id="entries"
            value={productsPerPage}
            onChange={handleProductsPerPageChange}
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
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <p>Loading...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-200 text-gray-800 uppercase text-sm">
              <tr>
                <th
                  className="py-3 px-6 text-left cursor-pointer"
                  onClick={() => handleSort('id')}
                >
                  Product ID {getSortIcon('id')}
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
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-100 transition duration-300">
                    <td className="py-3 px-6">{product.id}</td>
                    <td className="py-3 px-6">{product.name}</td>
                    <td className="py-3 px-6 text-center flex justify-center space-x-4">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleViewClick(product)}
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
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-3">No products found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <div>
          Showing {indexOfFirstProduct + 1} to {indexOfLastProduct > filteredProducts.length ? filteredProducts.length : indexOfLastProduct} of {filteredProducts.length} entries
        </div>
        <div className="flex space-x-1">
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`py-1 px-3 rounded ${currentPage === number ? 'bg-green-900 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-green-700 hover:text-white`}
            >
              {number}
            </button>
          ))}
        </div>
      </div>

      {showProductForm && <ProductForm onClose={toggleProductForm} />}
      {selectedProduct && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Product Details</h2>
            <p><strong>ID:</strong> {selectedProduct.id}</p>
            <p><strong>Name:</strong> {selectedProduct.name}</p>
            <p><strong>Description:</strong> {selectedProduct.short_description}</p>
            <button
              onClick={handleCloseModal}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;

