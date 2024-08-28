import React from 'react';
import Header from './Header';
import Footer from './Footer';

const TermsAndConditions = () => {
  return (
    <div className="bg-white">
      <Header />
      <header className="text-center shadow-none mb-12">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4">Terms and Conditions</h1>
        <p className="text-lg text-gray-600">Review our rules and regulations for using our platform</p>
      </header>

      {/* Introduction Section */}
      <section className="mb-12 px-4 shadow-none md:px-12">
        <div className="text-left space-y-6">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Introduction</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Welcome to Aizen! By accessing our platform, you agree to be bound by these Terms and Conditions. Please read them carefully to ensure you understand your rights and obligations when using our services.
          </p>
        </div>
      </section>

      {/* User Responsibilities Section */}
      <section className="mb-12 px-4 shadow-none md:px-12">
        <div className="text-left space-y-6">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">User Responsibilities</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Users are responsible for maintaining the confidentiality of their account details and ensuring all information provided is accurate and up to date. Any misuse of the platform may result in the termination of services.
          </p>
        </div>
      </section>

      {/* Prohibited Activities Section */}
      <section className="mb-12 px-4 shadow-none md:px-12">
        <div className="text-left space-y-6">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Prohibited Activities</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Users must not engage in activities that violate any laws or infringe on the rights of others. This includes but is not limited to spamming, hacking, and distributing malicious software.
          </p>
        </div>
      </section>

      {/* Changes to Terms Section */}
      <section className="mb-12 px-4 shadow-none md:px-12">
        <div className="text-left space-y-6">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Changes to Terms</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            We reserve the right to update these Terms and Conditions at any time. Changes will be posted on this page, and it is your responsibility to review them periodically to stay informed of any modifications.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TermsAndConditions;
