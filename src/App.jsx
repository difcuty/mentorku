import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';

// --- AUTH PAGES ---
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// --- MAHASISWA PAGES ---
import DashboardMahasiswa from './pages/mahasiswa/Dashboard';
import ViewProfile from './pages/mahasiswa/ViewProfile';
import EditProfile from './pages/mahasiswa/EditProfile';
import ChatMentorku from './pages/mahasiswa/chat';
import ChangePassword from './pages/mahasiswa/ChangePassword';

// --- ADMIN PAGES ---
import AdminDashboard from './pages/admin/AdminDashboard';

// --- DOSEN PAGES ---
import DosenDashboard from './pages/dosen/DosenDashboard';

/**
 * Komponen Proteksi Rute (Role-Based)
 * Memeriksa token dan hak akses berdasarkan role pengguna.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role'); 

  // 1. Jika tidak ada token, paksa ke halaman login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Jika halaman butuh role tertentu dan user tidak memilikinya
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect ke dashboard masing-masing sesuai role yang sah
    if (userRole === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (userRole === 'dosen') return <Navigate to="/dosen/dashboard" replace />;
    if (userRole === 'mahasiswa') return <Navigate to="/dashboard" replace />;
    
    // Fallback jika role tidak dikenal
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- ADMIN ROUTES (Hanya Admin) --- */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* --- DOSEN ROUTES (Hanya Dosen) --- */}
        <Route 
          path="/dosen/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['dosen']}>
              <DosenDashboard />
            </ProtectedRoute>
          } 
        />

        {/* --- MAHASISWA ROUTES (Hanya Mahasiswa) --- */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['mahasiswa']}>
              <DashboardMahasiswa />
            </ProtectedRoute>
          } 
        />

        {/* --- SHARED PROTECTED ROUTES (Bisa diakses beberapa role) --- */}
        <Route 
          path="/profil" 
          element={
            <ProtectedRoute allowedRoles={['mahasiswa', 'dosen']}>
              <ViewProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/ubah-profil" 
          element={
            <ProtectedRoute allowedRoles={['mahasiswa', 'dosen']}>
              <EditProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/ubah-password" 
          element={
            <ProtectedRoute allowedRoles={['mahasiswa', 'dosen', 'admin']}>
              <ChangePassword />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/chat" 
          element={
            <ProtectedRoute allowedRoles={['mahasiswa', 'dosen']}>
              <ChatMentorku />
            </ProtectedRoute>
          } 
        />

        {/* --- 404 PAGE --- */}
        <Route path="*" element={
          <div className="flex flex-col items-center justify-center h-screen bg-[#f8fafc] p-6 text-center">
            <div className="w-64 h-64 bg-amber-100 rounded-full flex items-center justify-center mb-8">
              <span className="text-9xl font-black text-amber-500">404</span>
            </div>
            <h1 className="text-3xl font-black text-slate-800">Ups! Halaman Hilang</h1>
            <p className="text-slate-500 mt-2 max-w-xs">Halaman yang Anda cari tidak tersedia atau Anda tidak memiliki akses.</p>
            <button 
              onClick={() => window.history.back()} 
              className="mt-8 bg-slate-800 text-white px-8 py-3 rounded-2xl font-bold hover:bg-slate-700 transition-all shadow-lg active:scale-95"
            >
              Kembali Sekarang
            </button>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;