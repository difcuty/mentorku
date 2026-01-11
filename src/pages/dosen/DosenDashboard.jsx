import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarDosen from '../../components/SidebarDosen';
import HeaderDosen from '../../components/HeaderDosen';

// Assets
import emailIcon from '../../assets/Group 13.svg';
import logoMentorku from '../../assets/logo.png';

const DosenDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfilOpen, setIsProfilOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans overflow-x-hidden">
      
      <SidebarDosen 
        isSidebarOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isProfilOpen={isProfilOpen}
        toggleProfil={() => setIsProfilOpen(!isProfilOpen)}
        nidn="240840134"
      />

      <HeaderDosen 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        onLogout={() => setShowLogoutModal(true)} 
      />

      <main 
        className={`flex flex-col items-center flex-grow pt-24 p-4 min-h-screen transition-all duration-300
        ${isSidebarOpen ? 'lg:ml-[280px]' : 'ml-0'}`}
      >
        <div className="w-full flex justify-end mb-10 pr-4">
          <img 
            src={emailIcon} 
            alt="Email" 
            className="w-[35px] h-[35px] object-contain cursor-pointer hover:scale-110 transition-transform" 
          />
        </div>
        
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#46678c] text-center mb-10 tracking-[0.2em] uppercase">
            Selamat Datang
        </h1>
        
        <div className="flex flex-col items-center max-w-lg lg:max-w-xl">
            <img src={logoMentorku} alt="Logo Mentorku" className="w-full h-auto object-contain drop-shadow-xl" />
        </div>
      </main>

      {/* --- LOGOUT MODAL --- */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full p-8 text-center animate-in zoom-in duration-300">
            <h2 className="text-2xl font-bold text-gray-800 mb-10">Apakah Anda Yakin<br />Ingin Keluar</h2>
            <div className="flex justify-center gap-8">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center hover:scale-110 transition shadow-lg"
              >
                <svg className="w-8 h-8" fill="none" stroke="white" viewBox="0 0 24 24" strokeWidth="3">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center hover:scale-110 transition shadow-lg"
              >
                <svg className="w-8 h-8" fill="none" stroke="white" viewBox="0 0 24 24" strokeWidth="3">
                  <path d="m4.5 12.75 6 6 9-13.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DosenDashboard;