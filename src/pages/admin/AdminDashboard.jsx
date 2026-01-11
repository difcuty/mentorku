import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import StatCard from '../../components/StatCard';
import FormTambahDosen from '../../components/FormTambahDosen';
import PlottingPembimbing from '../../components/PlottingPembimbing';
import ListDataMahasiswa from '../../components/ListDataMahasiswa';
import adminService from '../../services/adminService'; // Import service
import { 
  Users, 
  GraduationCap, 
  Clock, 
  Search,
  CheckCircle2,
  RefreshCcw
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalMahasiswa: 0,
    totalDosen: 0,
    antreanPlotting: 0
  });
  const [loadingStats, setLoadingStats] = useState(false);

  // Fungsi untuk mengambil statistik dari backend
  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const data = await adminService.getDashboardStats();
      setStats({
        totalMahasiswa: data.totalMahasiswa || 0,
        totalDosen: data.totalDosen || 0,
        antreanPlotting: data.antreanPlotting || 0
      });
    } catch (err) {
      console.error("Gagal mengambil statistik:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  // Ambil data statistik saat pertama kali load dan saat tab overview aktif
  useEffect(() => {
    if (activeTab === 'overview') {
      fetchStats();
    }
  }, [activeTab]);

  return (
    <div className="flex min-h-screen bg-[#fcfcfc]">
      {/* Sidebar - Mengontrol navigasi tab */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto">
        {/* Header Dashboard */}
        <header className="bg-white border-b border-amber-100 px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">
              {activeTab === 'overview' ? 'Dashboard Overview' : 
               activeTab === 'dosen' ? 'Manajemen Dosen' : 
               activeTab === 'plotting' ? 'Plotting Pembimbing' : 'Data Mahasiswa'}
            </h2>
            <p className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md inline-block">
              Mentorku Admin v1.0
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" size={16} />
              <input 
                type="text" 
                placeholder="Cari data..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none w-64 transition-all"
              />
            </div>
            <div className="flex items-center gap-3 bg-slate-50 p-1.5 pr-4 rounded-full border border-slate-200">
              <div className="w-8 h-8 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-sm">
                AD
              </div>
              <span className="text-xs font-bold text-slate-700">Administrator</span>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* TAMPILAN 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Ringkasan Sistem</h3>
                <button 
                  onClick={fetchStats}
                  className="p-2 hover:bg-amber-50 rounded-full text-amber-600 transition-colors"
                  title="Refresh Data"
                >
                  <RefreshCcw size={18} className={loadingStats ? 'animate-spin' : ''} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                  icon={<Users size={24} />} 
                  label="Total Mahasiswa" 
                  value={loadingStats ? "..." : stats.totalMahasiswa} 
                  color="orange" 
                />
                <StatCard 
                  icon={<GraduationCap size={24} />} 
                  label="Dosen Aktif" 
                  value={loadingStats ? "..." : stats.totalDosen} 
                  color="amber" 
                />
                <StatCard 
                  icon={<Clock size={24} />} 
                  label="Antrean Plotting" 
                  value={loadingStats ? "..." : stats.antreanPlotting} 
                  color="warm" 
                />
              </div>
              
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                   <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-orange-500" /> 
                    Aktivitas Terbaru
                  </h3>
                  <button className="text-xs font-bold text-amber-600 hover:underline">Lihat Semua</button>
                </div>
                <div className="text-slate-400 text-sm italic py-12 border-2 border-dashed border-slate-50 rounded-2xl text-center bg-slate-50/30">
                  Belum ada riwayat plotting untuk periode ini.
                </div>
              </div>
            </div>
          )}

          {/* TAMPILAN 2: MANAJEMEN DOSEN */}
          {activeTab === 'dosen' && (
             <div className="animate-in slide-in-from-bottom-4 duration-500">
                <FormTambahDosen />
             </div>
          )}

          {/* TAMPILAN 3: PLOTTING */}
          {activeTab === 'plotting' && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <PlottingPembimbing onPlotSuccess={fetchStats} />
            </div>
          )}

          {/* TAMPILAN 4: DATA MAHASISWA */}
          {activeTab === 'mahasiswa' && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
               <ListDataMahasiswa />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;