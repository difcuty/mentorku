import React from 'react';

// Import Assets
import menuIcon from '../assets/list-check.svg';
import logoutIcon from '../assets/Vector.svg';

const HeaderDosen = ({ isSidebarOpen, toggleSidebar, onLogout }) => {
  return (
    <header 
      className={`bg-[#ffc107] h-[60px] flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-10 shadow-md transition-all duration-300
      ${isSidebarOpen ? 'lg:translate-x-0' : ''}`}
    >
      {/* Bagian Kiri: Tombol Menu */}
      <div className="flex items-center space-x-3">
        <div 
          className="flex items-center cursor-pointer p-1 hover:bg-amber-400 rounded-lg transition-colors" 
          onClick={toggleSidebar}
        >
          <img 
            src={menuIcon} 
            alt="Menu" 
            className="w-[35px] h-[35px] object-contain" 
          />
        </div>
      </div>

      {/* Bagian Kanan: Tombol Logout */}
      <div className="flex items-center space-x-3">
        <button 
          onClick={(e) => {
            e.preventDefault();
            onLogout();
          }}
          className="bg-white text-black text-sm font-bold py-1.5 px-3 rounded-full flex items-center shadow-sm hover:bg-gray-100 transition duration-200"
        >
          <img 
            src={logoutIcon} 
            alt="Logout" 
            className="w-4 h-4 mr-1 object-contain" 
          />
          Logout
        </button>
      </div>
    </header>
  );
};

export default HeaderDosen;