import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authService'; 
import logo from '../../assets/logo.png'; 

const Login = () => {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    nama: '', // Ini digunakan sebagai field Email di input
    kata_sandi: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- LOGIKA LOGIN MULTI-ROLE ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Pastikan authService mengirimkan data ke backend: { email: formData.nama, password: formData.kata_sandi }
      const result = await loginUser({
        email: formData.nama,
        password: formData.kata_sandi
      });
      
      // 1. Simpan Data ke localStorage
      localStorage.setItem('token', result.token);
      localStorage.setItem('role', result.role); // Simpan role (admin/dosen/mahasiswa)
      localStorage.setItem('user', JSON.stringify(result.user));

      alert(`Login Berhasil! Selamat Datang, ${result.user.nama}.`);
      
      // 2. Redirect Berdasarkan Role
      if (result.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (result.role === 'dosen') {
        navigate('/dosen/dashboard');
      } else {
        navigate('/dashboard'); // Dashboard untuk mahasiswa
      }
      
    } catch (error) {
      alert(error.message || "Gagal masuk. Periksa kembali email dan kata sandi Anda.");
    }
  };

  return (
    <div className="min-h-screen bg-[#dbe7db] flex items-center justify-center p-6 md:p-12 font-sans">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* SISI KIRI: LOGO */}
        <div className="flex flex-col items-center justify-center">
          <img src={logo} alt="Logo Mentorku" className="w-56 h-56 md:w-96 md:h-96 object-contain" />
          <p className="hidden md:block mt-4 text-gray-700 font-medium text-lg text-center">
            Selamat Datang Kembali di <span className="text-teal-700 font-bold">Mentorku</span>
          </p>
        </div>

        {/* SISI KANAN: FORM */}
        <div className="bg-white/20 md:bg-transparent p-8 md:p-0 rounded-3xl flex flex-col items-center md:items-start">
          <h1 className="text-[2.5rem] font-bold text-black capitalize mb-10 pb-2 border-b-4 border-black inline-block leading-tight"
              style={{ textShadow: '0 0.05em 0 white, 0 -0.05em 0 white, 0.05em 0 0 white, -0.05em 0 0 white' }}>
            Masuk
          </h1>
          
          <form onSubmit={handleSubmit} className="w-full space-y-6 max-w-md"> 
            {/* Input Email */}
            <div className="bg-[#4db6ac] rounded-full px-5 py-3 flex items-center transition-transform focus-within:scale-[1.02] shadow-sm">
              <svg className="w-6 h-6 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <input 
                type="email" // Ubah ke type email untuk validasi browser
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                className="bg-transparent border-none outline-none text-white w-full pl-3 placeholder:text-white/90 focus:ring-0" 
                placeholder="Email (Alamat Email)"
                required
              />
            </div>

            {/* Input Password */}
            <div className="bg-[#4db6ac] rounded-full px-5 py-3 flex items-center transition-transform focus-within:scale-[1.02] shadow-sm">
              <svg className="w-6 h-6 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v3h8z"></path>
              </svg>
              <input 
                type="password" 
                name="kata_sandi"
                value={formData.kata_sandi}
                onChange={handleChange}
                className="bg-transparent border-none outline-none text-white w-full pl-3 placeholder:text-white/90 focus:ring-0" 
                placeholder="Kata Sandi"
                required
              />
            </div>
            
            <div className="flex justify-end pr-4 text-sm">
              <Link to="/lupa-sandi" className="text-black hover:text-teal-800 font-semibold transition-colors">
                Lupa Kata Sandi?
              </Link>
            </div>

            <div className="pt-4 flex justify-center md:justify-start">
              <button 
                type="submit" 
                className="bg-[#46678c] hover:bg-[#375471] text-white text-xl font-bold py-4 px-12 rounded-full w-full transition-all hover:-translate-y-1 shadow-md hover:shadow-lg focus:outline-none"
              >
                Masuk
              </button>
            </div>

            <div className="flex flex-col items-center md:items-start pt-6 space-y-2">
              <span className="text-gray-600 text-sm">Belum memiliki akun?</span>
              <Link 
                to="/register" 
                className="text-black font-bold text-base border-b-2 border-black hover:text-[#46678c] hover:border-[#46678c] transition-all pb-1 leading-none"
                style={{ textShadow: '0 0.05em 0 white, 0 -0.05em 0 white, 0.05em 0 0 white, -0.05em 0 0 white' }}>
                Daftar Akun
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;