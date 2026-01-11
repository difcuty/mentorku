import React from 'react';
import { Link } from 'react-router-dom';

// Import Assets
import profilIcon from '../assets/PROFIL.svg';
import userAddIcon from '../assets/interface-user-add--actions-add-close-geometric-human-person-plus-single-up-user--Streamline-Core.svg';
import arrowIcon from '../assets/Vector (3).svg';
import chatIcon from '../assets/list.svg';
import calendarIcon from '../assets/Vector (1).svg';
import historyIcon from '../assets/Vector (2).svg';

const SidebarDosen = ({ isSidebarOpen, toggleSidebar, isProfilOpen, toggleProfil, nidn }) => {
  return (
    <>
      {/* SIDEBAR MENU */}
      <div 
        id="sidebar-menu" 
        className={`fixed top-0 left-0 h-full w-3/4 max-w-xs md:w-[280px] bg-[#f4f4f4] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4 pb-0">
          <svg 
            onClick={toggleSidebar}
            className="w-8 h-8 text-gray-800 cursor-pointer hover:text-red-500 transition-colors" 
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>

        {/* Profile Section */}
        <div className="p-4 flex flex-col items-center border-b border-gray-300 pt-0 lg:pt-4">
          <div className="bg-[#00ffff] w-28 h-28 rounded-xl flex flex-col items-center justify-center mb-2 shadow-md cursor-pointer hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300">
            <img src={profilIcon} alt="Ikon Profil" className="w-16 h-16 object-contain" />
            <p className="text-xs font-bold text-black mt-1">{nidn}</p>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex flex-col text-black font-semibold text-lg mt-2">
          {/* Dropdown Profil */}
          <div className="border-b border-gray-300">
            <button 
              onClick={toggleProfil}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-200 hover:pl-8 transition-all duration-300 relative group"
            >
              {/* Garis Indikator Biru (CSS ::before) */}
              <div className="absolute left-0 top-0 h-full w-1 bg-[#46678c] opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-center space-x-4">
                <img src={userAddIcon} alt="Profil" className="w-6 h-6 object-contain" />
                <span>profil</span>
              </div>
              <img 
                src={arrowIcon} 
                alt="Dropdown" 
                className={`w-4 h-4 transition-transform duration-300 ${isProfilOpen ? 'rotate-180' : ''}`} 
              />
            </button>

            <div className={`bg-gray-50 text-base font-normal transition-all duration-300 overflow-hidden ${isProfilOpen ? 'max-h-60' : 'max-h-0'}`}>
              <Link to="/dosen/profil" className="py-3 hover:bg-gray-200 border-b border-gray-200 flex justify-center">lihat profil</Link>
              <Link to="/ubah-password" className="py-3 hover:bg-gray-200 border-b border-gray-200 flex justify-center">ubah password</Link>
              <Link to="/ubah-profil" className="py-3 hover:bg-gray-200 flex justify-center">ubah profil</Link>
            </div>
          </div>
          
          <Link to="/chat" className="flex items-center p-4 border-b border-gray-300 hover:bg-gray-200 hover:pl-8 transition-all duration-300 relative group">
            <div className="absolute left-0 top-0 h-full w-1 bg-[#46678c] opacity-0 group-hover:opacity-100 transition-opacity" />
            <img src={chatIcon} alt="Chat" className="w-6 h-6 object-contain" />
            <span className="ml-4">chat mentorku</span>
          </Link>

          <Link to="/jadwal" className="flex items-center p-4 border-b border-gray-300 hover:bg-gray-200 hover:pl-8 transition-all duration-300 relative group">
            <div className="absolute left-0 top-0 h-full w-1 bg-[#46678c] opacity-0 group-hover:opacity-100 transition-opacity" />
            <img src={calendarIcon} alt="Jadwal" className="w-6 h-6 object-contain" />
            <span className="ml-4">penjadwalan bimbingan</span>
          </Link>

          <Link to="/riwayat" className="flex items-center p-4 border-b border-gray-300 hover:bg-gray-200 hover:pl-8 transition-all duration-300 relative group">
            <div className="absolute left-0 top-0 h-full w-1 bg-[#46678c] opacity-0 group-hover:opacity-100 transition-opacity" />
            <img src={historyIcon} alt="Riwayat" className="w-6 h-6 object-contain" />
            <span className="ml-4">riwayat</span>
          </Link>
        </nav>
      </div>

      {/* OVERLAY */}
      {isSidebarOpen && (
        <div 
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
        ></div>
      )}
    </>
  );
};

export default SidebarDosen;