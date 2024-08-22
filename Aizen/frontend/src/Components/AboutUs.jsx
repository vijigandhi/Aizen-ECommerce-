import React from 'react';
import Header from './Header';
import Footer from './Footer'

const AboutUs = () => {
  return (
    
    <div className="">
        <Header/>
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4">About Us</h1>
        <p className="text-lg text-gray-600">Discover who we are and what we stand for</p>
      </header>
      <section className="mb-12">
        <div className="mb-8 space-y-6">
          <p className="text-lg text-gray-700 leading-relaxed">Welcome to Aizen, your premier destination for the latest in e-commerce technology. Our platform is designed to offer a seamless shopping experience with a user-friendly interface and robust features to help you find exactly what you need.</p>
          <p className="text-lg text-gray-700 leading-relaxed">At Aizen, we pride ourselves on delivering high-quality products and exceptional customer service. Our advanced search capabilities, intuitive navigation, and comprehensive product details ensure you have all the information you need to make informed purchasing decisions.</p>
          <p className="text-lg text-gray-700 leading-relaxed">Explore our diverse range of categories and discover new arrivals and popular items. We are continuously updating our product catalog to bring you the latest trends and innovations in the industry.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-6 justify-center mb-12">
          <div className="md:w-1/2">
            <img src="https://example.com/seller-stocks-products.jpg" alt="Sellers stocking products" className="w-full object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-105" />
          </div>
          <div className="md:w-1/2">
            <img src="https://example.com/store-selection.jpg" alt="Store selection" className="w-full object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-105" />
          </div>
        </div>
        <div className="text-center">
          <img src="../../../src/assets/22949.jpg" alt="Fast delivery" className="w-full md:w-5/12 object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 mx-auto" />
          <p className="text-lg text-gray-700 mt-6">Enjoy delivery within 20 minutes if products are ordered from a single store, ensuring quick and efficient service right to your doorstep.</p>
        </div>
      </section>
      <section>
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">Meet Our Team</h2>
        <div className="flex flex-wrap gap-8 justify-center">
          <div className="w-64 text-center bg-white rounded-lg shadow-lg p-4 transition-transform duration-300 hover:scale-105">
            <img src="/path/to/team-member1.jpg" alt="Team Member 1" className="w-full h-48 object-cover rounded-full mb-4 mx-auto border-4 border-gray-200" />
            <h3 className="text-xl font-semibold text-gray-800">John Doe</h3>
            <p className="text-gray-600">CEO & Founder</p>
          </div>
          <div className="w-64 text-center bg-white rounded-lg shadow-lg p-4 transition-transform duration-300 hover:scale-105">
            <img src="/path/to/team-member2.jpg" alt="Team Member 2" className="w-full h-48 object-cover rounded-full mb-4 mx-auto border-4 border-gray-200" />
            <h3 className="text-xl font-semibold text-gray-800">Jane Smith</h3>
            <p className="text-gray-600">Lead Developer</p>
          </div>
          <div className="w-64 text-center bg-white rounded-lg shadow-lg p-4 transition-transform duration-300 hover:scale-105">
            <img src="/path/to/team-member3.jpg" alt="Team Member 3" className="w-full h-48 object-cover rounded-full mb-4 mx-auto border-4 border-gray-200" />
            <h3 className="text-xl font-semibold text-gray-800">Emily Johnson</h3>
            <p className="text-gray-600">Marketing Manager</p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AboutUs;
