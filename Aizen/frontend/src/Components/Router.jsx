// Router.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import LoginForm from "./signup/Loginform";
import GoogleSignup from "./signup/google_signup";
import RegistartionForm from "./signup/sign";
import Profile from "./signup/profile";
import Header from "./Header";
import AdminView from "./Admin/Adminview";
import SellerView from "./Seller/SellerView";

import AizenView from "./Aizen/AizenView"
import AccessDenied from "./Admin/AccessDenied";
import ProduceDetailPage from "./Aizen/ProductDetails"
import AizenView2 from "./Aizen/AizenView2";
import Cart from "./cart/cart";
import Checkout from "./checkout/checkout"
import CartItem from "./cart/cartitem";
import Homepage from "./Aizen/Home";
import OrderDetails from "./checkout/orderDetails";
import ViewCart from "./cart/viewcart";
import AboutUs from "./AboutUs";
import DalsList from "./Aizen/DalsList";
import FlowersList from "./Aizen/FlowersList";
import OilsList from "./Aizen/OilsList";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsAndConditions from "./TermsAndConditions";

const RouterComponent = () => {
  return (
    <Router>
      <div>
        
        <Routes>
        <Route path="/home/*" element={<Homepage />} />
        <Route path="/*" element={<Homepage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsAndConditions />} />
          <Route path="/aizen/*" element={<AizenView />} />
          <Route path ="/product/:id" element={<ProduceDetailPage/>}/>
          <Route path="/aizen-admin/*" element={<AdminView />} />
          <Route path="/aizen-seller/*" element={<SellerView />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/google-signup" element={<GoogleSignup />} />
          {/* Corrected path */}
          <Route path="/sign" element={<RegistartionForm />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/access-denied" element={<AccessDenied />} /> 
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/viewcart" element={<ViewCart />} />

          <Route path="/OrderDetails" element={<OrderDetails />} />

        </Routes>
      </div>
    </Router>
  );
};

export default RouterComponent;
