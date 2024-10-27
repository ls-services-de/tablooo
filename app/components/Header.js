// components/Header.js
'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, LogOut } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.isLoggedIn && parsedUser.expiration > Date.now()) {
        setUser(parsedUser); // User is logged in and not expired
      } else {
        localStorage.removeItem('user'); // Remove expired user
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user'); // Clear user from local storage
    setUser(null); // Update state to reflect logout
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
  <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
    <Link href="/" className="text-2xl font-bold text-orange-500">Tablooo</Link>
    <div className="md:hidden">
      <button onClick={toggleMenu} className="text-orange-500">
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>
    <ul className={`md:flex md:space-x-4 ${isMenuOpen ? 'block absolute top-full left-0 right-0 bg-white p-4 shadow-md' : 'hidden'} md:static md:shadow-none`}>
      <li><Link href="#features" className="hover:text-orange-500 transition-colors block py-2 md:py-0">Features</Link></li>
      <li><Link href="#pricing" className="hover:text-orange-500 transition-colors block py-2 md:py-0">Preise</Link></li>
      <li><Link href="#about" className="hover:text-orange-500 transition-colors block py-2 md:py-0">Über uns</Link></li>
      <li><Link href="#contact" className="hover:text-orange-500 transition-colors block py-2 md:py-0 mr-8">Kontakt</Link></li>
      {user ? (
        <>
          <li className="text-orange-500 mr-8 font-bold">Hallo, {user.username}</li> {/* Increased margin-right */}
          <li><Link href="/admin-dashboard" className="hover:text-orange-500 transition-colors block py-2 ml-0 md:py-0">Admin Dashboard</Link></li>
          <LogOut onClick={handleLogout} className="hover:text-orange-500 text-gray-500 cursor-pointer"/>
        </>
      ) : (
        <>
          <li><Link href="/registrierung" className="text-orange-500 hover:text-orange-500 transition-colors block py-2 ml-3 md:py-0">Registrierung</Link></li>
          <li><Link href="/login" className="text-gray-500 hover:text-orange-500 transition-colors block py-2 md:py-0">Login</Link></li>
        </>
      )}
    </ul>
  </nav>
</header>

  );
}
