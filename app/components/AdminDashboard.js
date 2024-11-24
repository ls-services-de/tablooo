// app/components/AdminDashboard.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 
import Sidebar from './Sidebar'; 
import OpeningHours from './OpeningHours';
import Footer from './FooterSection';
import PageSettingsForm from './SettingForm';
import LastBookings from './Home';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [activeComponent, setActiveComponent] = useState('home');
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.isLoggedIn && parsedUser.expiration > Date.now()) {
        setUser(parsedUser);
      } else {
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-gray-500">Lade...</h1>
      </div>
    );
  }

  const renderComponent = () => {
    switch (activeComponent) {
      case 'home':
        return <div><LastBookings /></div>;
      case 'calendar':
        return  <div><OpeningHours /></div>;
      case 'brush':
        return <div>Brush Component</div>;
      case 'settings':
        return <div><PageSettingsForm /></div>;
      default:
        return <div>Home Component</div>;
    }
  };

  return (
    <div className="flex">
      <Sidebar onIconClick={setActiveComponent} />
      <div className="flex-1 container mx-auto py-10">
        <div className="fixed top-0 left-0 right-0 bg-white p-4 shadow">
          <h1 className="text-4xl font-bold text-center">Hallo, {user.username}!</h1>
        </div>
        <div className="mt-16 lg:ml-10">{renderComponent()}</div>

        
        
      </div>
    </div>
  );
};

export default AdminDashboard;
