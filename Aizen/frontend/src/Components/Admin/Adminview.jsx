import React, { useEffect, useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Header from '../Header';
import AdminSideBar from './AdminSideBar';
import CountryForm from './CountryForm';
import StateForm from './StateForm';
import CityForm from './CityForm';
import StoreForm from './StoreForm';
import CategoryForm from './CategoryForm';
import SubCategoryForm from './SubCategoryForm';
import StoreInventory from './StoreInventory';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import Store from './Store';
import User from './User';
import Requests from './Requests';
import Address from './Address';
import Category from './Category'
import OrderManager from './Ordermanager';


const AdminView = () => {
  
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedMenuTitle, setSelectedMenuTitle] = useState('Dashboard');

  useEffect(() => {
    const checkAdminAccess = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:8000/controller/Admin/getUserDetails.php', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.user.role_id === 1) {
            setIsAdmin(true);
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

  if (!isAdmin) {
    return null; // or a loading spinner while checking
  }

  return (
    <>
    <div className='h-full flex-1'>
      <div>
      <AdminSideBar setSelectedMenuTitle={setSelectedMenuTitle} />
      </div>
      
      <div className="flex-1  ml-56">
      <Navbar selectedMenuTitle={selectedMenuTitle} />
        <div className="maincontent h-full  bg-adminbg flex-1 p-2">
          <Routes>
           <Route path="/" element={<Dashboard />} /> 
           <Route path="/dashboard" element={<Dashboard />} /> 
            <Route path="/stores" element={<Store />} />
            <Route path="/users/*" element={<User />} /> 
            <Route path="/orders/*" element={<OrderManager />} />
            <Route path="/requests/*" element={<Requests />} /> 
            <Route path="/address/*" element={<Address />} />
            <Route path="/categories/*" element={<Category />} />
            <Route path="/add-category" element={<CategoryForm />} />
            <Route path="/add-sub-category" element={<SubCategoryForm />} />
            <Route path="/add-store" element={<StoreForm />} />
            <Route path="/store-inventory" element={<StoreInventory />} />
            <Route path="/add-country" element={<CountryForm />} />
            <Route path="/add-state" element={<StateForm />} />
            <Route path="/add-city" element={<CityForm />} />
          </Routes>
        </div>
      </div>
    </div>
    </>
  );
};

export default AdminView;
