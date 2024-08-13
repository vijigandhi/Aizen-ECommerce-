// index.jsx or main.jsx (Root component)
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AdminView from './Components/Admin/Adminview.jsx';


ReactDOM.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="455299441373-uj8s3cffg1aptgb5f81ov0t7tkhk346g.apps.googleusercontent.com">
      <App />
      {/* <Banner/> */}
      {/* <AdminView/> */}
    </GoogleOAuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
