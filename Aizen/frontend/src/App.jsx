
import React from 'react';
import RouterComponent from './Components/Router';
import './index.css'; // Ensure your global styles are imported correctly
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'
import Banner from './Components/Aizen/Banner';

const App = () => {

  return (
    <div className="App ">

      <RouterComponent/>
      <ToastContainer />
    </div>  
  );
};

export default App;

