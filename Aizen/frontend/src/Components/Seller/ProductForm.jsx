import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductForm = () => {
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
    console.log('Fetching subcategories for categoryId:', categoryId);
    if (categoryId) {
      try {
        const response = await axios.get(`http://localhost:8000/controller/Admin/getSubCategories.php?category_id=${categoryId}`);
        console.log('Subcategories fetched:', response.data);
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
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      console.log(response.data);
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
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-4 bg-white shadow-md rounded-lg">
      {loading && <p className="text-blue-500 mb-4">Loading...</p>}
      <h2 className="text-xl font-bold mb-4">Add New Product</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
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
        </div>
        <div className="col-span-2">
          <label className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Actual Price:</label>
          <input
            type="number"
            step="0.01"
            name="actual_price"
            value={formData.actual_price}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Selling Price:</label>
          <input
            type="number"
            step="0.01"
            name="selling_price"
            value={formData.selling_price}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Quantity:</label>
          <input
            type="number"
            step="0.01"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Unit:</label>
          <input
            type="text"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Category:</label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
            className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Subcategory:</label>
          <select
            name="subcategory_id"
            value={formData.subcategory_id}
            onChange={handleChange}
            required
            className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select Subcategory</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Store:</label>
          <select
            name="store_id"
            value={formData.store_id}
            onChange={handleChange}
            required
            className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select Store</option>
            {stores.map((store) => (
              <option key={store.id} value={store.id}>{store.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Image:</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-gray-700 border border-gray-400 rounded py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-primary-green hover:bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

export default ProductForm;



