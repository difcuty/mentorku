import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProfile, API_URL } from '../services/profilService'; // Import service & base URL
import profilIconDefault from '../assets/PROFIL.svg';
import userPlus from '.././assets/interface-user-add--actions-add-close-geometric-human-person-plus-single-up-user--Streamline-Core.svg';
import arrowIcon from '../assets/Vector (3).svg';
import listIcon from '../assets/list.svg';
import calendarIcon from '../assets/Vector (1).svg';
import historyIcon from '../assets/Vector (2).svg';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userData, setUserData] = useState({
    nama: 'User',
    npm: 'Loading...',
    foto: null
  });

  // Ambil data profil saat komponen dimuat
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getProfile();
        setUserData({
          nama: data.nama_lengkap,
          npm: data.npm || 'NPM Belum Diisi',
          foto: data.foto_url ? `${API_URL}${data.foto_url}` : null
        });
      } catch (error) {
        console.error("Gagal memuat data sidebar:", error);
      }
    };

    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen]);

  return (
    <>
      {/* Overlay untuk Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={toggleSidebar}
        />
      )}

      <aside className={`fixed top-0 left-0 h-full w-[280px] bg-[#f4f4f4] shadow-2xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-end p-4">
          <button onClick={toggleSidebar} className="text-gray-800 hover:text-red-500 text-2xl">✕</button>
        </div>

        {/* BAGIAN HEADER PROFIL SIDEBAR */}
        <div className="p-4 flex flex-col items-center border-b border-gray-300">
          <div className="bg-[#00ffff] w-28 h-28 rounded-xl flex flex-col items-center justify-center mb-2 shadow-md hover:-translate-y-1 transition-transform cursor-pointer overflow-hidden">
            {userData.foto ? (
              <img 
                src={userData.foto} 
                alt="Profil" 
                className="w-full h-full object-cover" 
              />
            ) : (
              <img 
                src={profilIconDefault} 
                alt="Default Profil" 
                className="w-16 h-16" 
              />
            )}
          </div>
          <p className="text-sm font-bold text-black mt-1 uppercase text-center">
            {userData.nama}
          </p>
          <p className="text-xs font-medium text-gray-600">
            {userData.npm}
          </p>
        </div>

        <nav className="flex flex-col text-black font-semibold text-lg mt-2">
          {/* Dropdown Profil */}
          <div className="border-b border-gray-300">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-200 transition-all"
            >
              <div className="flex items-center space-x-4">
                <img src={userPlus} alt="" className="w-6 h-6" />
                <span>Profil</span>
              </div>
              <img 
                src={arrowIcon} 
                alt="" 
                className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} 
              />
            </button>
            
            {isProfileOpen && (
              <div className="bg-gray-50 text-base font-normal animate-fadeIn">
                <Link to="/profil" className="block py-3 text-center border-b border-gray-200 hover:bg-gray-200">Lihat Profil</Link>
                <Link to="/ubah-sandi" className="block py-3 text-center border-b border-gray-200 hover:bg-gray-200">Ubah Password</Link>
                <Link to="/ubah-profil" className="block py-3 text-center hover:bg-gray-200">Ubah Profil</Link>
              </div>
            )}
          </div>

          <Link to="/chat" className="flex items-center p-4 border-b border-gray-300 hover:bg-gray-200 hover:pl-6 transition-all">
            <img src={listIcon} alt="" className="w-6 h-6" />
            <span className="ml-4">Chat Mentorku</span>
          </Link>

          <Link to="/jadwal" className="flex items-center p-4 border-b border-gray-300 hover:bg-gray-200 hover:pl-6 transition-all">
            <img src={calendarIcon} alt="" className="w-6 h-6" />
            <span className="ml-4">Penjadwalan</span>
          </Link>

          <Link to="/riwayat" className="flex items-center p-4 border-b border-gray-300 hover:bg-gray-200 hover:pl-6 transition-all">
            <img src={historyIcon} alt="" className="w-6 h-6" />
            <span className="ml-4">Riwayat</span>
          </Link>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;