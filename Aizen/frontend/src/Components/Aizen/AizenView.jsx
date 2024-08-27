
import React, { useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import Header from '../Header'
import Footer from '../Footer';
import AizenSideBar from './AizenSideBar'
import ProductsList from './ProductList'

import FruitsList from './FruitsList';
import VegetablesList from './VegetablesList';
import SpicesList from './SpicesList'
import Banner from './Banner';
import Cart from '../cart/cart';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import MeatList from './MeatList';
import AttaAndRiceList from './AttaAndRiceList';
import DairyProducts from './DairyProducts';
import SapplingsList from './SapplingsList';
import DryfruitsList from './DryfruitsList';
import DalsList from './DalsList';
import FlowersList from './FlowersList';
import OilsList from './OilsList';

const AizenView = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const [storeId, setStoreId] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term);
  };
  const handleStoreChange = (storeId) => {
    setStoreId(storeId);
    console.log(storeId);
  };

  return (
    <>
     <div className="relative min-h-screen">
      <Header onSearch={handleSearch} onStoreChange={handleStoreChange} /> {/* Pass onStoreChange */}
      <div className="flex">
      <div className='h-11/12   overflow-y-auto bg-green-900 w-60'>
      <AizenSideBar />
      </div>
       
     
       
        <div className="maincontent bg-white flex-1 p-4 ml-54">
          <Routes>
            <Route path="/" element={<ProductsList searchTerm={searchTerm} storeId={storeId} />} />
            <Route path="/aizen/*" element={<ProductsList searchTerm={searchTerm} storeId={storeId} />} />
            <Route path="/all-categories/*" element={<ProductsList searchTerm={searchTerm} storeId={storeId} />} />
            <Route path="/fresh-fruits/*" element={<FruitsList searchTerm={searchTerm} storeId={storeId} />} />
            <Route path="/fresh-vegetables/*" element={<VegetablesList searchTerm={searchTerm} storeId={storeId} />} />
            <Route path="/spices/*" element={<SpicesList searchTerm={searchTerm} storeId={storeId} />} />
            <Route path="/meats/*" element={<MeatList searchTerm={searchTerm} storeId={storeId} />} />
            <Route path="/dryfruits/*" element={<DryfruitsList searchTerm={searchTerm} storeId={storeId} />} />
            <Route path="/dairyproducts/*" element={<DairyProducts searchTerm={searchTerm} storeId={storeId} />} />
            <Route path="/rice/*" element={<AttaAndRiceList searchTerm={searchTerm} storeId={storeId} />} />
            <Route path="/sapplings/*" element={<SapplingsList searchTerm={searchTerm} storeId={storeId} />} />
            <Route path="/dals/*" element={<DalsList searchTerm={searchTerm} storeId={storeId} />} />
          <Route path="/flowers/*" element={<FlowersList searchTerm={searchTerm} storeId={storeId} />} />
          <Route path="/oils/*" element={<OilsList searchTerm={searchTerm} storeId={storeId} />} />
          
          </Routes>
        </div>
      </div>
      <Footer />
    </div>
    
    </>
  );
};

export default AizenView;
