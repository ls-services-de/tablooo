import React from 'react';
import LoginForm from '../components/LoginForm';
import Header from '../components/Header';
import Footer from '../components/FooterSection';

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hintergrundbild-Div */}
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

      {/* Header */}
      <Header />

      {/* Flex-grow für LoginForm, um den verfügbaren Platz einzunehmen */}
      <main className="flex-grow flex items-center justify-center">
        <LoginForm />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
