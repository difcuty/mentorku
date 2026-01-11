import React, { useState, useEffect } from 'react';
import { Search, Filter, Trash2, Mail, GraduationCap, Download, UserCircle, Loader2 } from 'lucide-react';
import adminService from '../services/adminService';

const ListDataMahasiswa = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // Untuk loading per baris

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getAllStudents();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal memuat mahasiswa:", err);
      setError("Gagal mengambil data dari server");
    } finally {
      setLoading(false);
    }
  };

  // LOGIKA MELEPAS PLOTTING
  const handleUnplot = async (studentId, studentName) => {
    if (window.confirm(`Apakah Anda yakin ingin melepas plotting pembimbing untuk ${studentName}?`)) {
      setActionLoading(studentId);
      try {
        await adminService.deletePlotting(studentId);
        // Refresh data setelah berhasil
        const updatedData = await adminService.getAllStudents();
        setStudents(updatedData);
      } catch (err) {
        alert(err.response?.data?.message || "Gagal melepas plotting");
      } finally {
        setActionLoading(null);
      }
    }
  };

  const filteredStudents = students.filter(s => 
    (s.nama_lengkap?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (s.npm || "").includes(searchTerm)
  );

  if (error) {
    return (
      <div className="p-10 text-center bg-red-50 rounded-[2.5rem] border border-red-100 text-red-600 font-bold animate-in fade-in">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Statistik Ringkas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-6 rounded-[2.5rem] text-white shadow-lg shadow-orange-200/50 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 bg-white/10 w-24 h-24 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
          <p className="text-orange-100 text-xs font-bold uppercase tracking-wider mb-1 relative z-10">Total Mahasiswa</p>
          <h3 className="text-3xl font-black relative z-10">{loading ? '...' : students.length}</h3>
          <div className="mt-4 flex items-center gap-2 bg-white/20 w-fit px-3 py-1 rounded-full text-[10px] font-bold relative z-10">
            <GraduationCap size={12} /> Database Terintegrasi
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-[2.5rem] border border-amber-100 shadow-sm flex flex-col justify-between group hover:border-amber-300 transition-all">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-all">
              <UserCircle size={24} />
            </div>
            <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-lg italic">LIVE DATA</span>
          </div>
          <div className="mt-4">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Status Plotting</p>
            <h3 className="text-2xl font-black text-slate-800">
                {students.filter(s => s.id_dosen).length} <span className="text-slate-300 text-lg font-medium">/ {students.length}</span>
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] border border-amber-100 shadow-sm flex flex-col justify-between border-dashed border-2 hover:bg-amber-50/30 transition-all cursor-pointer group">
           <button className="flex flex-col items-center justify-center h-full gap-2 text-amber-600 group-hover:text-orange-600">
              <Download size={32} className="animate-bounce" />
              <span className="text-xs font-black uppercase tracking-widest">Export (CSV)</span>
           </button>
        </div>
      </div>

      {/* Toolbar & Tabel */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Cari nama atau NPM..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm transition-all shadow-inner bg-white"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
              <Filter size={18} /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4 text-amber-500">
              <Loader2 className="animate-spin" size={48} strokeWidth={3} />
              <p className="text-sm font-black uppercase tracking-widest animate-pulse text-slate-400">Mensinkronkan Data...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-[11px] uppercase tracking-[0.2em] font-black border-b border-slate-50">
                  <th className="px-8 py-6">Profil Mahasiswa</th>
                  <th className="px-6 py-6">ID Kampus</th>
                  <th className="px-6 py-6">Pembimbing</th>
                  <th className="px-6 py-6">Status Plotting</th>
                  <th className="px-8 py-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredStudents.map((s, idx) => (
                  <tr key={idx} className="group hover:bg-amber-50/40 transition-all">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-orange-600 font-black text-lg border-2 border-white shadow-sm group-hover:scale-110 transition-transform">
                          {s.nama_lengkap?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800 group-hover:text-orange-600 transition-colors">
                            {s.nama_lengkap || 'Unknown Student'}
                          </p>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                            <Mail size={10} /> {s.email || 'No email registered'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-xs font-black text-slate-700">{s.npm || 'N/A'}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">{s.prodi || 'Informatika'}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-600 italic">
                          {s.nama_dosen ? s.nama_dosen : 'Belum Ditentukan'}
                        </span>
                        {s.nama_dosen && <span className="text-[9px] text-amber-500 font-black uppercase">Pembimbing Utama</span>}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest shadow-sm ${
                        s.id_dosen 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-amber-50 text-amber-600 border border-amber-200 animate-pulse'
                      }`}>
                        {s.id_dosen ? 'SUDAH DIPLOT' : 'ANTREAN'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      {s.id_dosen ? (
                        <button 
                          onClick={() => handleUnplot(s.id_user, s.nama_lengkap)}
                          disabled={actionLoading === s.id_user}
                          className="p-2.5 bg-red-50 hover:bg-red-500 rounded-xl transition-all text-red-500 hover:text-white shadow-sm border border-red-100 disabled:opacity-50 active:scale-90"
                        >
                          {actionLoading === s.id_user ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      ) : (
                        <div className="p-2.5 text-slate-200 cursor-not-allowed">
                          <Trash2 size={18} />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {/* ... UI Mahasiswa Tidak Ditemukan ... */}
        </div>
      </div>
    </div>
  );
};

export default ListDataMahasiswa;