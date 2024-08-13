import React, { useState, useEffect } from 'react';
import axios from 'axios';

let StoreInventory = () => {
  let [stores, setStores] = useState([]);
  let [selectedStore, setSelectedStore] = useState('');
  let [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch stores data
    let fetchStores = async () => {
      try {
        let response = await axios.get('http://localhost:8000/controller/Admin/getStores.php');
        setStores(response.data || []);
         // Assuming the response has a stores array
         console.log(stores)
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };

    fetchStores();
  }, []);

  useEffect(() => {
    // Fetch products data based on selected store
    let fetchProducts = async () => {
      if (selectedStore) {
        try {
          let response = await axios.get(`http://localhost:8000/controller/Admin/getProducts.php?store_id=${selectedStore}`);
          setProducts(response.data.products || []); // Assuming the response has a products array
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      } else {
        setProducts([]);
      }
    };

    fetchProducts();
  }, [selectedStore]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Store Inventory</h1>
      
      <div className="mb-4">
     
        <select
          id="store-select"
          className="w-full p-2 border border-gray-300 rounded"
          value={selectedStore}
          onChange={(e) => setSelectedStore(e.target.value)}
        >
          <option value="">--Select a Store--</option>
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>
      </div>
      
      {products.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Quantity</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody >
            {products.map((product) => (
              <tr key={product.id}>
                <td className="py-2 px-4 border-b">{product.id}</td>
                <td className="py-2 px-4 border-b">{product.name}</td>
                <td className="py-2 px-4 border-b">{product.quantity}</td>
                <td className="py-2 px-4 border-b">
                  <button className="bg-black text-white px-4 py-1 rounded hover:bg-primary-green">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No products available for the selected store.</p>
      )}
    </div>
  );
};

export default StoreInventory;
