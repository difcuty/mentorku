import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import menuIcon from '../assets/list-check.svg';
import logoutIcon from '../assets/Vector.svg';

const Header = ({ toggleSidebar }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <>
      <header className="bg-[#ffc107] h-[60px] flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-10 shadow-md transition-all duration-300">
        <button onClick={toggleSidebar} className="cursor-pointer">
          <img src={menuIcon} alt="Menu" className="w-[35px] h-[35px]" />
        </button>

        <button 
          onClick={() => setShowLogoutModal(true)}
          className="bg-white text-black text-sm font-bold py-1.5 px-3 rounded-full flex items-center shadow-sm hover:bg-gray-100 transition duration-200"
        >
          <img src={logoutIcon} alt="" className="w-4 h-4 mr-1" />
          Logout
        </button>
      </header>

      {/* Modal Logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-10">Apakah Anda Yakin<br/>Ingin Keluar?</h2>
            <div className="flex justify-center gap-8">
              <button onClick={() => setShowLogoutModal(false)} className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-800 text-white text-2xl">✕</button>
              <Link to="/login" className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-800 text-white text-2xl">✓</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;