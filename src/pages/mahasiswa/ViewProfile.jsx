import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar'; // Sesuaikan path sidebar Anda
import { getProfile, API_URL } from '../../services/profilService';
import profilIconDefault from '../../assets/PROFIL.svg';
import logoutIcon from '../../assets/Vector.svg';
import listCheckIcon from '../../assets/list-check.svg';

const ViewProfile = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    nama: '',
    npm: '',
    programStudi: '',
    angkatan: '-',
    foto: null
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();
        
        // Logika Hitung Angkatan dari 2 digit pertama NPM
        let tahunAngkatan = '-';
        if (data.npm && data.npm.length >= 2) {
          const duaDigitAwal = data.npm.substring(0, 2);
          tahunAngkatan = `20${duaDigitAwal}`;
        }

        setProfileData({
          nama: data.nama_lengkap || 'Belum diisi',
          npm: data.npm || 'Belum diisi',
          programStudi: data.program_studi || 'Belum diisi',
          angkatan: tahunAngkatan,
          foto: data.foto_url ? `${API_URL}${data.foto_url}` : null
        });
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };
    loadProfile();
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <style>{`
        .profile-icon-box { background-color: #00ffff; }
        #header-title { transition: margin-left 0.3s ease, opacity 0.3s ease; }
      `}</style>

      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Header */}
      <header className="bg-[#ffc107] h-[60px] flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-10 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="flex items-center cursor-pointer" onClick={toggleSidebar}>
            <img src={listCheckIcon} alt="Menu" className="w-[35px] h-[35px] object-contain" />
          </div>
          <h1 
            id="header-title" 
            className={`text-xl font-bold text-black transition-opacity duration-300 
              ${isSidebarOpen ? 'lg:opacity-100' : 'lg:opacity-0'} opacity-100`}
          >
            Profil Mahasiswa
          </h1>
        </div>

        <button 
          onClick={handleLogout}
          className="bg-white text-black text-sm font-bold py-1.5 px-3 rounded-full flex items-center shadow-sm hover:bg-gray-100 transition"
        >
          <img src={logoutIcon} alt="Logout" className="w-4 h-4 mr-1" /> Logout
        </button>
      </header>

      {/* Main Content */}
      <main 
        className={`flex-grow pt-20 p-4 lg:p-8 transition-all duration-300 
          ${isSidebarOpen ? 'lg:ml-[280px]' : 'ml-0'}`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link to="/dashboard" className="inline-flex items-center text-gray-600 hover:text-black transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              Kembali ke Dashboard
            </Link>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-10 border border-gray-100">
            {/* Profile Header Card */}
            <div className="flex flex-col md:flex-row items-center mb-10 pb-8 border-b border-gray-200">
              <div className="profile-icon-box w-32 h-32 rounded-2xl flex items-center justify-center mb-4 md:mb-0 md:mr-8 shadow-lg overflow-hidden">
                {profileData.foto ? (
                  <img src={profileData.foto} alt="Foto Profil" className="w-full h-full object-cover" />
                ) : (
                  <img src={profilIconDefault} alt="Default Profil" className="w-20 h-20" />
                )}
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-800 uppercase">{profileData.nama}</h1>
                <p className="text-xl text-gray-500 font-semibold tracking-wide">NPM : {profileData.npm}</p>
              </div>
            </div>

            {/* Profile Details List */}
            <div className="grid gap-4">
              <div className="bg-yellow-400 p-4 rounded-xl shadow-sm flex items-center">
                <span className="font-bold text-gray-800 w-40">Program Studi</span>
                <span className="text-gray-900">: {profileData.programStudi}</span>
              </div>
              <div className="bg-yellow-400 p-4 rounded-xl shadow-sm flex items-center">
                <span className="font-bold text-gray-800 w-40">Tahun Angkatan</span>
                <span className="text-gray-900">: {profileData.angkatan}</span>
              </div>
              {/* Dosen PA bisa statis atau ambil dari backend jika tersedia */}
              <div className="bg-yellow-400 p-4 rounded-xl shadow-sm flex items-center">
                <span className="font-bold text-gray-800 w-40">Dosen PA</span>
                <span className="text-gray-900">: Masdiana Sagala S.Kom, M.Kom</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-col md:flex-row gap-4">
              <Link to="/ubah-password" class="flex-1 bg-blue-600 text-white text-center font-bold py-3 rounded-xl hover:bg-blue-700 transition">
                Ubah Password
              </Link>
              <Link to="/ubah-profil" class="flex-1 bg-green-600 text-white text-center font-bold py-3 rounded-xl hover:bg-green-700 transition">
                Edit Profil
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewProfile;