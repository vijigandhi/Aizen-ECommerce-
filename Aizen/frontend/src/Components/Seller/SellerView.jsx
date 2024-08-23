import React, { useEffect, useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Header from '../Header';
import Stat from './Stat';
import SellerSideBar from './SellerSideBar';
import ProductForm from './ProductForm';
import Navbar from './Navbar';
import ProductManagement from './ProductManagement'
import SellerDashboard from './SellerDashboard';

const SellerView = () => {
  const navigate = useNavigate();
  const [hasAccess, setHasAccess] = useState(false);
  const [selectedMenuTitle, setSelectedMenuTitle] = useState('Dashboard');

  useEffect(() => {
    const checkAccess = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:8000/controller/Admin/getUserDetails.php', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const roleId = response.data.user.role_id;
          if (roleId === 1 || roleId === 2) {
            setHasAccess(true);
          } else {
            navigate('/access-denied');
          }
        } catch (error) {
          console.error('Error verifying role:', error);
          navigate('/access-denied');
        }
      } else {
        navigate('/access-denied');
      }
    };

    checkAccess();
  }, [navigate]);

  if (!hasAccess) {
    return null; // or a loading spinner while checking
  }

  return (
    <div className='h-full flex-1'>
    <div>
    <SellerSideBar setSelectedMenuTitle={setSelectedMenuTitle} />
    </div>
    
    <div className="flex-1  ml-56">
    <Navbar selectedMenuTitle={selectedMenuTitle} />
      <div className="maincontent flex-1 p-4">
        <Routes>
         <Route path="/" element={<SellerDashboard/>} /> 
         <Route path="/dashboard" element={<SellerDashboard />} /> 
         <Route path="/productmanagement" element={<ProductManagement/>}/>
         <Route path="/statistics" element={<Stat/>}/>
        </Routes>
      </div>
    </div>
  </div>
  );
};

export default SellerView;
