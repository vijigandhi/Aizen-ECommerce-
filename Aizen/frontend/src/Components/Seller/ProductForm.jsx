import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toastify

// Initialize toast notifications
toast.configure();

const ProductForm = ({ onClose }) => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    short_description: '',
    description: '',
    actual_price: '',
    selling_price: '',
    quantity: '',
    unit: '',
    category_id: '',
    subcategory_id: '',
    store_id: '',
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [sellerId, setSellerId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchCategories(),
          fetchStores(),
          fetchUserDetails(),
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/controller/Admin/getCategories.php');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    if (categoryId) {
      try {
        const response = await axios.get(`http://localhost:8000/controller/Admin/getSubCategories.php?category_id=${categoryId}`);
        setSubcategories(response.data);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    } else {
      setSubcategories([]);
    }
  };

  const fetchStores = async () => {
    try {
      const response = await axios.get('http://localhost:8000/controller/Admin/getStores.php');
      setStores(response.data);
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  const fetchUserDetails = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:8000/controller/Admin/getUserDetails.php', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setSellerId(response.data.user.id);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => {
      const newFormData = { ...prevFormData, [name]: value };
      if (name === 'category_id') {
        fetchSubcategories(value);
      }
      return newFormData;
    });
    // Clear error for the changed field
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
    setErrors(prevErrors => ({ ...prevErrors, image: '' }));
  };

  const validateForm = () => {
    const errors = {};

    // Validation rules
    if (!formData.name.trim()) errors.name = 'Product name is required';
    if (!formData.short_description.trim()) errors.short_description = 'Short description is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.actual_price || formData.actual_price <= 0) errors.actual_price = 'Actual price must be greater than zero';
    if (!formData.selling_price || formData.selling_price <= 0) errors.selling_price = 'Selling price must be greater than zero';
    if (!formData.quantity || formData.quantity <= 0) errors.quantity = 'Quantity must be greater than zero';
    if (!formData.unit.trim()) errors.unit = 'Unit is required';
    if (!formData.category_id) errors.category_id = 'Category is required';
    if (!formData.subcategory_id) errors.subcategory_id = 'Subcategory is required';
    if (!formData.store_id) errors.store_id = 'Store is required';
    if (!formData.image) errors.image = 'Product image is required';

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);

    const formDataToSubmit = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSubmit.append(key, formData[key]);
    });
    formDataToSubmit.append('seller_id', sellerId);

    try {
      const response = await axios.post('http://localhost:8000/controller/Admin/addProduct.php', formDataToSubmit, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.success) {
        setFormData({
          name: '',
          short_description: '',
          description: '',
          actual_price: '',
          selling_price: '',
          quantity: '',
          unit: '',
          category_id: '',
          subcategory_id: '',
          store_id: '',
          image: null,
        });
        setSubcategories([]);
        toast.success('Product added successfully!'); // Use toastify for success
        onClose(); // Close the form after successful submission
      } else {
        toast.error('Failed to add product: ' + response.data.message); // Use toastify for error
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred. Please try again.'); // Use toastify for error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center custom-scrollbar justify-center z-50">
      <div className="relative bg-white shadow-lg rounded-lg w-full max-w-3xl p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <form onSubmit={handleSubmit} className="space-y-4 custom-scrollbar">
          {loading && <p className="text-blue-500 mb-4">Loading...</p>}
          <h2 className="text-xl font-bold mb-4">Add New Product</h2>
          <div className="max-h-96 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <span className="block h-6">
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </span>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Short Description:</label>
                <input
                  type="text"
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <span className="block h-6">
                  {errors.short_description && <p className="text-red-500 text-xs mt-1">{errors.short_description}</p>}
                </span>
              </div>
              <div className="col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <span className="block h-6">
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </span>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Actual Price:</label>
                <input
                  type="number"
                  step="0.01"
                  name="actual_price"
                  value={formData.actual_price}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <span className="block h-6">
                  {errors.actual_price && <p className="text-red-500 text-xs mt-1">{errors.actual_price}</p>}
                </span>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Selling Price:</label>
                <input
                  type="number"
                  step="0.01"
                  name="selling_price"
                  value={formData.selling_price}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <span className="block h-6">
                  {errors.selling_price && <p className="text-red-500 text-xs mt-1">{errors.selling_price}</p>}
                </span>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Quantity:</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <span className="block h-6">
                  {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
                </span>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Unit:</label>
                <input
                  type="text"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <span className="block h-6">
                  {errors.unit && <p className="text-red-500 text-xs mt-1">{errors.unit}</p>}
                </span>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Category:</label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
                <span className="block h-6">
                  {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>}
                </span>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Subcategory:</label>
                <select
                  name="subcategory_id"
                  value={formData.subcategory_id}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">Select a subcategory</option>
                  {subcategories.map(subcategory => (
                    <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
                  ))}
                </select>
                <span className="block h-6">
                  {errors.subcategory_id && <p className="text-red-500 text-xs mt-1">{errors.subcategory_id}</p>}
                </span>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Store:</label>
                <select
                  name="store_id"
                  value={formData.store_id}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">Select a store</option>
                  {stores.map(store => (
                    <option key={store.id} value={store.id}>{store.name}</option>
                  ))}
                </select>
                <span className="block h-6">
                  {errors.store_id && <p className="text-red-500 text-xs mt-1">{errors.store_id}</p>}
                </span>
              </div>
              <div className="col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">Product Image:</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <span className="block h-6">
                  {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-primary-green text-white font-bold py-2 px-4 rounded hover:bg-green-900 focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;





