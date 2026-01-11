// Mengambil Base URL dari .env (Vite)
const BASE_URL = import.meta.env.VITE_API_URL;
// Menyesuaikan path ke /api/auth
const API_URL = `${BASE_URL}/api/auth`;

/**
 * REGISTRASI MAHASISWA
 * Mengirim data ke tabel Users & Mahasiswa sekaligus
 */
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nama_lengkap: userData.nama_lengkap,
        email: userData.email,
        password: userData.password,
        npm: userData.npm, // Tambahkan NPM agar tersimpan di tabel Mahasiswa
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Gagal melakukan registrasi');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * LOGIN (Multi-Role)
 * Mengembalikan token, role, dan data profil dasar
 */
export const loginUser = async (loginData) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // loginData.nama berasal dari field UI 'nama' yang berisi email
      body: JSON.stringify({
        email: loginData.email || loginData.nama, 
        password: loginData.password || loginData.kata_sandi,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Gagal masuk ke akun');
    }

    // data berisi: { token, role, user: { id_user, nama, email } }
    return data; 
  } catch (error) {
    throw error;
  }
};

/**
 * GANTI PASSWORD
 * Membutuhkan token di Header Authorization
 */
export const changePassword = async (passwordData) => {
  const token = localStorage.getItem('token'); 
  try {
    const response = await fetch(`${API_URL}/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({
        oldPassword: passwordData.oldPassword || passwordData.kata_sandi_lama,
        newPassword: passwordData.newPassword || passwordData.kata_sandi_baru
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Gagal mengubah password');
    return data;
  } catch (error) {
    throw error;
  }
};