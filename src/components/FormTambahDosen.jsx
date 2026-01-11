import React, { useState } from 'react';
import { PlusCircle, Loader2, Lock } from 'lucide-react';
import adminService from '../services/adminService';

const FormTambahDosen = () => {
  // 1. State untuk Form Data (Default Password: dosen123)
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    nidn: '',
    email: '',
    password: 'dosen123', 
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // 2. Handle Perubahan Input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Menggunakan adminService yang sudah kita buat sebelumnya
      const response = await adminService.registerDosen(formData);
      
      setMessage({ type: 'success', text: response.message || 'Dosen berhasil didaftarkan!' });
      
      // Reset Form ke kondisi awal (termasuk default password)
      setFormData({ 
        nama_lengkap: '', 
        nidn: '', 
        email: '', 
        password: 'dosen123' 
      });
    } catch (error) {
      // Menangkap pesan error dari backend
      const errorMsg = error.message || 'Terjadi kesalahan sistem';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-[2.5rem] border border-amber-100 shadow-xl shadow-amber-50/50 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg shadow-orange-200">
          <PlusCircle className="text-white" size={28} />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Registrasi Akun Dosen</h3>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Sistem Plotting Skripsi</p>
        </div>
      </div>

      {/* Notifikasi */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-2xl text-sm font-bold animate-in zoom-in duration-300 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-600 border border-green-100' 
            : 'bg-red-50 text-red-600 border border-red-100'
        }`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        {/* Nama Lengkap */}
        <div className="col-span-2">
          <label className="text-xs font-black text-slate-400 uppercase mb-2 block ml-1">Nama Lengkap & Gelar</label>
          <input 
            type="text" 
            name="nama_lengkap"
            value={formData.nama_lengkap}
            onChange={handleChange}
            required
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-amber-500 transition-all outline-none" 
            placeholder="Contoh: Dr. Budi Santoso, M.T." 
          />
        </div>

        {/* Email */}
        <div className="col-span-2 md:col-span-1">
          <label className="text-xs font-black text-slate-400 uppercase mb-2 block ml-1">Email Resmi</label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-amber-500 transition-all outline-none" 
            placeholder="email@univ.ac.id" 
          />
        </div>

        {/* NIDN */}
        <div className="col-span-2 md:col-span-1">
          <label className="text-xs font-black text-slate-400 uppercase mb-2 block ml-1">NIDN</label>
          <input 
            type="text" 
            name="nidn"
            value={formData.nidn}
            onChange={handleChange}
            required
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-amber-500 transition-all outline-none" 
            placeholder="Nomor Induk Dosen..." 
          />
        </div>

        {/* Password Baru */}
        <div className="col-span-2">
          <label className="text-xs font-black text-slate-400 uppercase mb-2 block ml-1">Kata Sandi Akun</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-amber-500 transition-all outline-none font-mono" 
              placeholder="Masukkan password..." 
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-2 ml-1 italic">*Default: dosen123 (Admin dapat mengubahnya secara manual)</p>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={loading}
          className="col-span-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-lg py-5 rounded-2xl hover:scale-[1.01] active:scale-95 transition-all shadow-lg shadow-orange-100 mt-4 disabled:opacity-70 flex items-center justify-center gap-2 group"
        >
          {loading ? (
            <><Loader2 className="animate-spin" /> Memproses Data...</>
          ) : (
            'Konfirmasi Registrasi Dosen'
          )}
        </button>
      </form>
    </div>
  );
};

export default FormTambahDosen;