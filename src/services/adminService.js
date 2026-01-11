import axios from 'axios';

// Mengambil Base URL dari .env dan menambahkan path /api/admin
const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/admin`;

/**
 * Helper untuk menyertakan Token JWT di setiap request.
 * Diambil langsung dari localStorage agar selalu up-to-date.
 */
const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

const adminService = {
  
  /**
   * 1. Mendapatkan Statistik Dashboard
   */
  getDashboardStats: async () => {
    try {
      const response = await axios.get(`${API_URL}/stats`, getAuthConfig());
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Gagal memuat statistik" };
    }
  },

  /**
   * 2. Registrasi Dosen
   */
  registerDosen: async (dosenData) => {
    try {
      const response = await axios.post(
        `${API_URL}/register-dosen`, 
        dosenData, 
        getAuthConfig()
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Gagal mendaftarkan dosen" };
    }
  },

  /**
   * 3. Ambil Semua Mahasiswa
   */
  getAllStudents: async () => {
    try {
      const response = await axios.get(`${API_URL}/all-students`, getAuthConfig());
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Gagal memuat data mahasiswa" };
    }
  },

  /**
   * 4. Eksekusi Plotting
   */
  executePlotting: async (id_mahasiswa, id_dosen) => {
    try {
      const response = await axios.post(
        `${API_URL}/plotting`, 
        { id_mahasiswa, id_dosen }, 
        getAuthConfig()
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Gagal melakukan plotting" };
    }
  },

  /**
   * 5. Melepas Plotting (Unplot)
   */
  deletePlotting: async (id_mahasiswa) => {
    try {
      const response = await axios.delete(
        `${API_URL}/plotting/${id_mahasiswa}`, 
        getAuthConfig()
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Gagal menghapus plotting" };
    }
  },

  /**
   * 6. Ambil Antrean Mahasiswa (Belum diplot)
   */
  getUnmappedStudents: async () => {
    try {
      const response = await axios.get(`${API_URL}/unmapped-students`, getAuthConfig());
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Gagal memuat antrean mahasiswa" };
    }
  },

  /**
   * 7. Ambil Daftar Dosen
   */
  getAllLecturers: async () => {
    try {
      const response = await axios.get(`${API_URL}/lecturers`, getAuthConfig());
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Gagal memuat data dosen" };
    }
  }
};

export default adminService;