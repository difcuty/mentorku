import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  UserCheck, 
  LogOut,
  ChevronRight
} from 'lucide-react';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'dosen', label: 'Kelola Dosen', icon: <UserPlus size={20} /> },
    { id: 'mahasiswa', label: 'Data Mahasiswa', icon: <Users size={20} /> },
    { id: 'plotting', label: 'Plotting Pembimbing', icon: <UserCheck size={20} /> },
  ];

  return (
    <aside className="w-72 bg-slate-900 text-slate-300 min-h-screen p-6 flex flex-col border-r border-slate-800">
      <div className="mb-10 px-2">
        <div className="flex items-center gap-3 mb-1">
          <div className="bg-cyan-500 p-2 rounded-lg">
            <UserCheck className="text-slate-900" size={24} />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Mentorku Admin</h1>
        </div>
        <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">Thesis Management System</p>
      </div>

      <nav className="flex-grow space-y-1.5">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${
              activeTab === item.id 
                ? 'bg-cyan-600/10 text-cyan-400 border border-cyan-600/20' 
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`${activeTab === item.id ? 'text-cyan-400' : 'text-slate-500 group-hover:text-white'}`}>
                {item.icon}
              </span>
              <span className="font-medium text-sm">{item.label}</span>
            </div>
            {activeTab === item.id && <ChevronRight size={14} />}
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-800">
        <button 
          onClick={() => { localStorage.clear(); navigate('/login'); }}
          className="w-full p-3 flex items-center gap-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium text-sm">Keluar Sistem</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;