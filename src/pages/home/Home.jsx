import React from 'react';
import Header from '../../components/header/Header';
import Navbar from '../../components/navbar/Navbar';
import Featured from '../../components/featured/Featured';

import FeaturedProperties from '../../components/featuredProperties/FeaturedProperties';
import MailList from '../../components/mailList/MailList';
import Footer from '../../components/footer/Footer';

const Home = () => {
  return (
    <div className=" ">
      {/* Navbar and Header Section */}
      <div className=" container mx-auto">
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white font-sans">
          <Navbar />
          <Header />
          <Featured />
        </div>
        <FeaturedProperties />
        <MailList />
        <Footer />
      </div>
    </div>

  );
};

export default Home;
