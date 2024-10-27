// src/App.js
import React from 'react';

import RegistrationForm from '../components/RegistrationForm';

import AdminDashboard from '../components/AdminDashboard';
import Header from '../components/Header';
import Footer from '../components/FooterSection';


const App = () => {
  return (
    <>

<div
        className="fixed top-0 left-0 h-full -z-40 w-full"
        style={{
          backgroundImage: 'url("/interior.jpg")', // Ersetze durch deinen Bildpfad
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Overlay-Div mit 35% Opazität */}
      <div className="fixed top-0 left-0 h-full w-full -z-40 bg-black opacity-35" />

    <Header />
    <RegistrationForm />
    <Footer />
    </>
  );
};

export default App;
