import React, { useState, useRef, useEffect } from 'react'; // Tambah useEffect
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile, API_URL } from '../../services/profilService'; // Import service

const EditProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    nama: '',
    npm: '',
    programStudi: '',
    email: ''
  });

  const [profilePic, setProfilePic] = useState(null); // Preview gambar
  const [selectedFile, setSelectedFile] = useState(null); // File asli untuk dikirim
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- LOGIKA LOAD DATA AWAL ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getProfile();
        setFormData({
          nama: data.nama_lengkap || '',
          npm: data.npm || '',
          programStudi: data.program_studi || '',
          email: data.email_kontak || ''
        });
        if (data.foto_url) {
          // Menampilkan foto dari server (pastikan URL benar)
          setProfilePic(`http://localhost:5000${data.foto_url}`);
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    loadData();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleUbahFotoClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); // Simpan file asli
      const reader = new FileReader();
      reader.onload = (event) => setProfilePic(event.target.result); // Simpan preview
      reader.readAsDataURL(file);
    }
  };

  const showModal = (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.npm || !formData.programStudi) {
      alert('Mohon lengkapi semua field yang wajib diisi (*)');
      return;
    }
    setIsModalOpen(true);
  };

  // --- LOGIKA SIMPAN KE BACKEND ---
  const confirmSave = async () => {
    try {
      await updateProfile(formData, selectedFile);
      alert('Perubahan profil berhasil disimpan!');
      setIsModalOpen(false);
      navigate('/dashboard');
    } catch (error) {
      alert(error.message);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen relative font-sans">
      <style>{`
        body {
            background: linear-gradient(to bottom, #F59E0B 0%, #F59E0B 200px, #D1D5DB 200px, #D1D5DB 100%);
        }
        @media (min-width: 1024px) {
            body {
                background: linear-gradient(to bottom, #F59E0B 0%, #F59E0B 250px, #D1D5DB 250px, #D1D5DB 100%);
            }
        }
      `}</style>

      {/* MODAL KONFIRMASI (TIDAK BERUBAH) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 md:p-10 text-center" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-8">Apakah Anda Yakin<br />ingin Simpan Perubahan Profil?</h2>
            <div className="flex justify-center gap-8 md:gap-12">
              <button onClick={() => setIsModalOpen(false)} className="w-16 h-16 md:w-20 md:h-20 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-800 transition duration-150 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="white" className="w-8 h-8 md:w-10 md:h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <button onClick={confirmSave} className="w-16 h-16 md:w-20 md:h-20 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-800 transition duration-150 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="white" className="w-8 h-8 md:w-10 md:h-10"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KONTEN UTAMA (TIDAK BERUBAH) */}
      <div className="max-w-md lg:max-w-5xl mx-auto">
        <div className="bg-amber-500 p-4 lg:p-6 flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 lg:h-8 lg:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl lg:text-3xl font-bold flex-1 text-center mr-10 text-white uppercase">UBAH PROFIL</h1>
        </div>

        <div className="lg:flex lg:gap-8 lg:px-8 lg:py-8">
          <div className="lg:w-1/3">
            <div className="flex flex-col items-center mt-8 lg:mt-0 mb-6 lg:sticky lg:top-8">
              <div className="w-32 h-32 lg:w-48 lg:h-48 bg-cyan-400 rounded-full flex items-center justify-center mb-4 overflow-hidden shadow-inner">
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 lg:h-32 lg:w-32 text-cyan-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              <button onClick={handleUbahFotoClick} className="bg-amber-500 text-white px-6 py-2 lg:px-8 lg:py-3 rounded-full font-semibold hover:bg-amber-600 transition">
                Ubah Foto Profil
              </button>
            </div>
          </div>

          <div className="lg:w-2/3">
            <div className="px-6 mb-4 lg:hidden">
              <p className="text-sm text-gray-700"><span className="text-red-600 font-semibold">*</span> Wajib diisi</p>
            </div>

            <form onSubmit={showModal} className="px-6 lg:px-0 space-y-4 lg:space-y-5">
              <div className="lg:grid lg:grid-cols-2 lg:gap-4 space-y-4 lg:space-y-0">
                <div>
                  <label htmlFor="nama" className="block text-sm lg:text-base font-semibold mb-1 lg:mb-2">Nama<span className="text-red-600">*</span></label>
                  <input type="text" id="nama" value={formData.nama} onChange={handleInputChange} placeholder="Masukkan nama lengkap" className="w-full bg-amber-400 text-gray-800 px-4 py-3 lg:py-4 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600" required />
                </div>
                <div>
                  <label htmlFor="npm" className="block text-sm lg:text-base font-semibold mb-1 lg:mb-2">NPM<span className="text-red-600">*</span></label>
                  <input type="text" id="npm" value={formData.npm} onChange={handleInputChange} placeholder="Masukkan NPM" className="w-full bg-amber-400 text-gray-800 px-4 py-3 lg:py-4 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600" required />
                </div>
              </div>

              <div className="lg:grid lg:grid-cols-2 lg:gap-4 space-y-4 lg:space-y-0">
                <div>
                  <label htmlFor="programStudi" className="block text-sm lg:text-base font-semibold mb-1 lg:mb-2">Program Studi<span className="text-red-600">*</span></label>
                  <input type="text" id="programStudi" value={formData.programStudi} onChange={handleInputChange} placeholder="Masukkan program studi" className="w-full bg-amber-400 text-gray-800 px-4 py-3 lg:py-4 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600" required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm lg:text-base font-semibold mb-1 lg:mb-2">Email</label>
                  <input type="email" id="email" value={formData.email} onChange={handleInputChange} placeholder="contoh@email.com" className="w-full bg-white border-2 border-amber-400 text-gray-800 px-4 py-3 lg:py-4 rounded-md focus:outline-none focus:border-cyan-400 transition" />
                </div>
              </div>

              <div className="flex justify-center pt-4 pb-8 lg:pt-8 lg:pb-0">
                <button type="submit" className="w-full lg:w-auto bg-cyan-400 text-gray-800 px-8 py-3 lg:px-12 lg:py-4 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-cyan-500 transition text-base lg:text-lg shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 lg:h-6 lg:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;