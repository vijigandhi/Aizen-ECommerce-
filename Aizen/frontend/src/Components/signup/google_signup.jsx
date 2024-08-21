import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const GoogleSignup = ({ onSuccess }) => {
  const responseMessage = (response) => {
    onSuccess(response); 
  };

  const errorMessage = (error) => {
    console.log(error);
  };

  return (
    <div className="flex items-center justify-center mt-2 flex-wrap">
      <GoogleLogin
        clientId="995387049773-1l8a7e3q87cp7d38i18lfr09au8027rr.apps.googleusercontent.com" 
        onSuccess={responseMessage}
        onError={errorMessage}
        render={(renderProps) => (
          <button
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
            className="hover:scale-105 ease-in-out duration-300 shadow-lg p-1 rounded-lg m-1"
          >
            <img
              className="max-w-[20px]"
              src="https://ucarecdn.com/8f25a2ba-bdcf-4ff1-b596-088f330416ef/"
              alt="Google"
            />
          </button>
        )}
      />
    </div>
  );
};

export default GoogleSignup;
