import React from 'react';
import Header from './Header';
import Footer from './Footer';

const AboutUs = () => {
  return (
    <div className="bg-white"> {/* Ensure the background is set to white overall */}
      <Header />
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4">About Us</h1>
        <p className="text-lg text-gray-600">Discover who we are and what we stand for</p>
      </header>

      {/* Our Mission Section */}
      <section className="mb-12 shadow-none flex flex-col gap-32 md:flex-row items-center px-4 md:px-12"> {/* Added padding */}
        <div className="md:w-1/2 text-left space-y-6 mb-8 md:mb-0">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-lg text-gray-700 leading-relaxed">Welcome to Aizen, your premier destination for the latest in e-commerce technology. Our platform is designed to offer a seamless shopping experience with a user-friendly interface and robust features to help you find exactly what you need.</p>
          <p className="text-lg text-gray-700 leading-relaxed">At Aizen, we pride ourselves on delivering high-quality products and exceptional customer service. Our advanced search capabilities, intuitive navigation, and comprehensive product details ensure you have all the information you need to make informed purchasing decisions.</p>
        </div>
        <div className="md:w-1/3">
          <img src="../../../src/assets/customer.png" alt="Sellers stocking products" className="w-full h-auto object-cover rounded-lg  hover:scale-105" /> {/* Reduced size */}
        </div>
      </section>

      {/* For Sellers Section */}
      <section className="mb-12 shadow-none flex flex-col gap-48 md:flex-row items-center px-4 md:px-12"> {/* Added padding */}
        <div className="md:w-1/3 order-2 md:order-1">
          <img src="../../../src/assets/10158.jpg" alt="Store selection" className="w-full h-auto object-cover rounded-lg  hover:scale-105" /> {/* Reduced size */}
        </div>
        <div className="md:w-1/2 order-1 md:order-2 text-left space-y-6">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">For Sellers</h2>
          <p className="text-lg text-gray-700 leading-relaxed">Sellers can stock up their products to the store nearest to them and have their own portal where they can manage their products, access sales reports, and view product orders charts.</p>
        </div>
      </section>

      {/* For Users Section */}
      <section className="mb-12 shadow-none flex flex-col gap-48 md:flex-row items-center px-4 md:px-12"> {/* Added padding */}
        <div className="md:w-1/2 text-left space-y-6">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">For Users</h2>
          <p className="text-lg text-gray-700 leading-relaxed">Users can select which hub/store they want to purchase from, and easily upgrade their account from a regular user to a seller via their profile page. Our platform is designed to be simple and intuitive for all users.</p>
        </div>
        <div className="md:w-1/3">
          <img src="../../../src/assets/22949.jpg" alt="User selecting store" className="w-full h-auto object-cover rounded-lg  hover:scale-105" /> {/* Reduced size */}
        </div>
      </section>

      {/* Fast Delivery Section */}
      <section className="mb-12 bg-primary-green shadow-none text-center px-4 md:px-12"> {/* Added padding */}
        <p className="text-lg text-white ">Enjoy delivery within 20 minutes if products are ordered from a single store, ensuring quick and efficient service right to your doorstep.</p>
      </section>

      {/* Our Team Section */}
     

      <Footer />
    </div>
  );
};

export default AboutUs;
