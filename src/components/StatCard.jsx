import React from 'react';

const StatCard = ({ icon, label, value, color }) => {
  const colorMap = {
    orange: 'bg-orange-600 shadow-orange-200',
    amber: 'bg-amber-500 shadow-amber-200',
    warm: 'bg-orange-400 shadow-orange-100'
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group border-b-4 border-b-transparent hover:border-b-amber-400">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg text-white group-hover:rotate-6 transition-transform ${colorMap[color]}`}>
        {icon}
      </div>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{label}</p>
      <h3 className="text-3xl font-black text-slate-800 mt-1">{value}</h3>
    </div>
  );
};

export default StatCard;