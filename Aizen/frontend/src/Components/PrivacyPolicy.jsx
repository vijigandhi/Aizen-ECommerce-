import React from 'react';
import Header from './Header';
import Footer from './Footer';

const PrivacyPolicy = () => {
  return (
    <div className="bg-white shadow-none">
      <Header />
      <header className="text-center mb-12 shadow-none">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4">Privacy Policy</h1>
        <p className="text-lg text-gray-600">Understand how we handle your personal information</p>
      </header>

      {/* Introduction Section */}
      <section className="mb-12 px-4 md:px-12 shadow-none">
        <div className="text-left space-y-6">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Introduction</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            At Aizen, we value your privacy and are committed to protecting your personal data. This Privacy Policy outlines how we collect, use, and safeguard your information when you interact with our platform.
          </p>
        </div>
      </section>

      {/* Information Collection Section */}
      <section className="mb-12 px-4 md:px-12 shadow-none">
        <div className="text-left space-y-6">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Information We Collect</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            We collect personal information that you voluntarily provide to us when you register on our platform, express an interest in our services, or contact us for support. This may include your name, email address, contact details, and other relevant data.
          </p>
        </div>
      </section>

      {/* Use of Information Section */}
      <section className="mb-12 px-4 md:px-12 shadow-none">
        <div className="text-left space-y-6">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">How We Use Your Information</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            The personal data we collect is used to provide and improve our services, process transactions, communicate with you, and comply with legal obligations. We do not sell your information to third parties.
          </p>
        </div>
      </section>

      {/* Data Protection Section */}
      <section className="mb-12 px-4 md:px-12 shadow-none">
        <div className="text-left space-y-6">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Data Protection</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            We implement a variety of security measures to maintain the safety of your personal information. Your data is stored on secure servers, and we use encryption technologies to protect sensitive information transmitted online.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
