// app/components/Sidebar.js
import { House, Calendar, Brush, Settings, BookOpen } from 'lucide-react';

const Sidebar = ({ onIconClick }) => {
  return (
    <div
      className="
        bg-gray-200
        flex sm:flex-col
        items-center justify-center
        sm:w-16 sm:h-screen w-full h-16
        sm:fixed sm:top-0 sm:left-0
        fixed bottom-0 left-0 right-0
      "
    >
      <div onClick={() => onIconClick('home')} className="p-4 cursor-pointer text-orange-500 hover:text-orange-700">
        <House size={24} />
      </div>
      <div onClick={() => onIconClick('calendar')} className="p-4 cursor-pointer text-orange-500 hover:text-orange-700">
        <Calendar size={24} />
      </div>
      <div onClick={() => onIconClick('brush')} className="p-4 cursor-pointer text-orange-500 hover:text-orange-700">
        <Brush size={24} />
      </div>
      <div onClick={() => onIconClick('settings')} className="p-4 cursor-pointer text-orange-500 hover:text-orange-700">
        <BookOpen size={24} />
      </div>
    </div>
  );
};

export default Sidebar;
