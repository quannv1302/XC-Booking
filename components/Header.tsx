import React from 'react';
import { Bell, Search } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-10">
      {/* Left side spacer or Breadcrumbs if needed later */}
      <div className="hidden md:block">
        {/* Placeholder for potential breadcrumbs: Home > Booking */}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6 ml-auto">
        <button className="relative p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-px bg-gray-200 mx-2"></div>

        <div className="flex items-center gap-3 cursor-pointer p-1.5 pr-3 rounded-full hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
          <img 
            src="https://picsum.photos/100/100" 
            alt="User Avatar" 
            className="w-9 h-9 rounded-full object-cover border border-gray-200"
          />
          <div className="text-sm hidden md:block">
            <p className="font-semibold text-gray-800 leading-tight">Nguyễn Văn A</p>
            <p className="text-xs text-gray-500 font-medium">Admin vận hành</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;