import React, { useState, useEffect } from 'react';
import { UserCheck, Users, GraduationCap, ArrowRight, Info, Loader2 } from 'lucide-react';
import adminService from '../services/adminService';

const PlottingPembimbing = () => {
  const [mahasiswa, setMahasiswa] = useState([]);
  const [dosen, setDosen] = useState([]);
  const [selectedMhs, setSelectedMhs] = useState(null);
  const [selectedDosen, setSelectedDosen] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Load Data Otomatis saat komponen dibuka
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [mhsData, dsnData] = await Promise.all([
        adminService.getUnmappedStudents(),
        adminService.getAllLecturers()
      ]);
      setMahasiswa(mhsData);
      setDosen(dsnData);
    } catch (err) {
      console.error("Gagal memuat data plotting:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Fungsi Eksekusi Plotting ke Backend
  const handlePlotting = async () => {
    if (!selectedMhs || !selectedDosen) return;

    try {
      // id_user adalah primary key dari tabel Users/Mahasiswa
      await adminService.executePlotting(selectedMhs.id_user, selectedDosen.id);
      
      alert(`Sukses! ${selectedMhs.nama_lengkap} berhasil diplot ke ${selectedDosen.nama}`);
      
      // Reset pilihan dan Refresh data agar daftar terupdate
      setSelectedMhs(null);
      setSelectedDosen(null);
      fetchInitialData(); 
    } catch (err) {
      alert(err.response?.data?.message || "Terjadi kesalahan saat plotting");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 text-orange-500">
      <Loader2 className="animate-spin mb-2" size={32} />
      <p className="text-sm font-medium">Memuat data plotting...</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex gap-3 items-start">
        <Info className="text-amber-600 shrink-0" size={20} />
        <p className="text-sm text-amber-900">
          <strong>Panduan Plotting:</strong> Pilih mahasiswa di kolom kiri dan dosen di kolom kanan untuk memasangkan pembimbing skripsi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Kolom Mahasiswa */}
        <div className="bg-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-orange-50 bg-orange-50/30 flex justify-between items-center">
            <h4 className="font-bold text-orange-900 flex items-center gap-2">
              <Users size={18} className="text-orange-500" /> Mahasiswa Belum Diplot
            </h4>
            <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-1 rounded-lg font-bold">
              {mahasiswa.length} Orang
            </span>
          </div>
          <div className="p-4 max-h-[400px] overflow-y-auto space-y-2">
            {mahasiswa.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-sm italic">Semua mahasiswa sudah diplot.</div>
            ) : mahasiswa.map((mhs) => (
              <div 
                key={mhs.id_user}
                onClick={() => setSelectedMhs(mhs)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedMhs?.id_user === mhs.id_user 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'border-transparent bg-slate-50 hover:border-orange-200'
                }`}
              >
                <p className={`font-bold ${selectedMhs?.id_user === mhs.id_user ? 'text-orange-700' : 'text-slate-700'}`}>
                  {mhs.nama_lengkap}
                </p>
                <p className="text-xs text-slate-500">{mhs.email}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Kolom Dosen */}
        <div className="bg-white rounded-3xl border border-amber-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-amber-50 bg-amber-50/30">
            <h4 className="font-bold text-amber-900 flex items-center gap-2">
              <GraduationCap size={18} className="text-amber-500" /> Pilih Dosen Pembimbing
            </h4>
          </div>
          <div className="p-4 max-h-[400px] overflow-y-auto space-y-2">
            {dosen.map((dsn) => {
              const sisa = dsn.kuota - dsn.terisi;
              return (
                <div 
                  key={dsn.id}
                  onClick={() => sisa > 0 && setSelectedDosen(dsn)}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    sisa === 0 ? 'opacity-50 cursor-not-allowed bg-slate-100' : 'cursor-pointer'
                  } ${
                    selectedDosen?.id === dsn.id 
                    ? 'border-amber-500 bg-amber-50' 
                    : 'border-transparent bg-slate-50 hover:border-amber-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={`font-bold ${selectedDosen?.id === dsn.id ? 'text-amber-700' : 'text-slate-700'}`}>
                        {dsn.nama}
                      </p>
                      <p className="text-xs text-slate-500">NIDN: {dsn.nidn}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                        sisa > 2 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        Sisa: {sisa}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl transition-all duration-500 z-50 ${
        selectedMhs && selectedDosen ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}>
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-6 rounded-3xl shadow-2xl shadow-orange-200 border border-amber-400 mx-4">
          <div className="flex items-center justify-between gap-6">
            <div className="flex-1 overflow-hidden">
              <p className="text-[10px] uppercase tracking-widest text-amber-100 font-bold mb-1">Konfirmasi Plotting</p>
              <div className="flex items-center gap-3 text-sm truncate">
                <span className="font-black text-white underline decoration-amber-300 underline-offset-4">{selectedMhs?.nama_lengkap}</span>
                <ArrowRight size={16} className="text-amber-200 shrink-0" />
                <span className="font-black text-white underline decoration-amber-300 underline-offset-4">{selectedDosen?.nama}</span>
              </div>
            </div>
            <button 
              onClick={handlePlotting}
              className="bg-white text-orange-600 font-black px-8 py-3 rounded-2xl hover:bg-amber-50 active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap shadow-md"
            >
              <UserCheck size={20} /> Eksekusi Plotting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlottingPembimbing;