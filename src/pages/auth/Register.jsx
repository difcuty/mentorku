import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Update import: sesuaikan dengan nama fungsi baru di authService
import { registerMahasiswa } from '../../services/authService'; 
import logo from '../../assets/logo.png';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    email: '',
    password: '',
    confirm_password: '',
    npm: '' // Tambahkan field NPM jika ingin mendukung data mahasiswa lengkap
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // --- LOGIKA BACKEND ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi dasar Client-side
    if (formData.password !== formData.confirm_password) {
      alert("Password dan Konfirmasi Password tidak cocok!");
      return;
    }

    try {
      // Panggil Service dengan nama fungsi yang baru: registerMahasiswa
      const result = await registerMahasiswa(formData);
      
      alert(result.message || "Registrasi Berhasil!");
      
      // Arahkan ke halaman login setelah sukses
      navigate('/login'); 
      
    } catch (error) {
      // Tampilkan error dari backend (misal: Email sudah terdaftar)
      alert(error.message);
    }
  };

  // --- RENDER (DESAIN TETAP SAMA) ---
  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-[#dbe7db] font-sans">
      <div className="w-full max-w-6xl bg-white/30 md:bg-transparent rounded-3xl p-6 md:p-0 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Sisi Kiri: Logo */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <img src={logo} alt="Logo Mentorku" className="w-48 h-48 md:w-80 md:h-80 object-contain" />
          <p className="hidden md:block text-teal-800 font-medium text-center">
            Temukan Mentormu, Raih Masa Depanmu.
          </p>
        </div>

        {/* Sisi Kanan: Form */}
        <div className="flex flex-col items-center md:items-start w-full max-w-md mx-auto">
          <h1 
            className="text-[2.5rem] font-bold text-black uppercase mb-8 pb-2 border-b-[3px] border-black inline-block"
            style={{ textShadow: '0 0.05em 0 white, 0 -0.05em 0 white, 0.05em 0 0 white, -0.05em 0 0 white' }}
          >
            Registrasi
          </h1>
          
          <form onSubmit={handleSubmit} className="w-full space-y-5">
            <div>
              <label className="text-black font-semibold text-sm block mb-1 ml-4">Nama Lengkap</label>
              <input 
                type="text" 
                name="nama_lengkap"
                value={formData.nama_lengkap}
                onChange={handleChange}
                className="bg-[#4db6ac] text-white placeholder:text-white/80 p-3 rounded-full w-full outline-none border-2 border-transparent focus:border-[#26a69a] transition-all" 
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>

            <div>
              <label className="text-black font-semibold text-sm block mb-1 ml-4">Alamat Email</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-[#4db6ac] text-white placeholder:text-white/80 p-3 rounded-full w-full outline-none border-2 border-transparent focus:border-[#26a69a] transition-all" 
                placeholder="email@contoh.com"
                required
              />
            </div>

            {/* Opsional: Tambahkan input NPM jika perlu */}
            <div>
              <label className="text-black font-semibold text-sm block mb-1 ml-4">NPM (Opsional)</label>
              <input 
                type="text" 
                name="npm"
                value={formData.npm}
                onChange={handleChange}
                className="bg-[#4db6ac] text-white placeholder:text-white/80 p-3 rounded-full w-full outline-none border-2 border-transparent focus:border-[#26a69a] transition-all" 
                placeholder="Masukkan NPM Anda"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-black font-semibold text-sm block mb-1 ml-4">Password</label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-[#4db6ac] text-white placeholder:text-white/80 p-3 rounded-full w-full outline-none border-2 border-transparent focus:border-[#26a69a] transition-all" 
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label className="text-black font-semibold text-sm block mb-1 ml-4">Confirm Password</label>
                <input 
                  type="password" 
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  className="bg-[#4db6ac] text-white placeholder:text-white/80 p-3 rounded-full w-full outline-none border-2 border-transparent focus:border-[#26a69a] transition-all" 
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="pt-4 flex justify-center md:justify-start">
              <button 
                type="submit" 
                className="bg-[#4db6ac] hover:bg-[#26a69a] text-white text-xl font-bold py-4 px-12 rounded-full w-full max-w-[400px] shadow-md transition-all hover:-translate-y-1"
              >
                Buat Akun
              </button>
            </div>

            <p className="text-sm text-center md:text-left w-full mt-4 text-gray-700">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-teal-700 font-bold hover:underline transition-all">
                Masuk di sini
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;