// Mengambil Base URL dari .env (Vite)
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${BASE_URL}/api/auth`;

/**
 * REGISTRASI MAHASISWA
 * Sesuai dengan route: router.post('/register/mahasiswa', ...)
 */
export const registerMahasiswa = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/register/mahasiswa`, { // Ubah endpoint
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nama_lengkap: userData.nama_lengkap,
        email: userData.email,
        password: userData.password,
        npm: userData.npm,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Gagal registrasi mahasiswa');
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * REGISTRASI DOSEN (Tambahan baru jika diperlukan)
 */
export const registerDosen = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/register/dosen`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nama_lengkap: userData.nama_lengkap,
        email: userData.email,
        password: userData.password,
        nidn: userData.nidn,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Gagal registrasi dosen');
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * LOGIN (Multi-Role)
 */
export const loginUser = async (loginData) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: loginData.email, 
        password: loginData.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Email atau password salah');
    }

    // PENTING: Pastikan data ini disimpan di localStorage pada komponen Login.js
    // data berisi: { token, user: { id_user, nama, email, role } }
    return data; 
  } catch (error) {
    throw error;
  }
};

/**
 * GANTI PASSWORD
 * Di controller kita menggunakan app.post (atau app.put, pastikan sinkron)
 */
export const changePassword = async (passwordData) => {
  const token = localStorage.getItem('token'); 
  try {
    const response = await fetch(`${API_URL}/change-password`, {
      method: 'POST', // Sesuaikan dengan router.post di authRoutes
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Gagal mengubah password');
    return data;
  } catch (error) {
    throw error;
  }
};