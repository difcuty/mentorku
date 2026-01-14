import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${BASE_URL}/api/chat`;

/**
 * Helper untuk mengambil konfigurasi header dengan token terbaru.
 */
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        headers: { 
            Authorization: `Bearer ${token}` 
        }
    };
};

export const chatService = {
    /**
     * 1. Ambil daftar mahasiswa bimbingan (Untuk Role: Dosen)
     */
    getMyStudents: async () => {
        try {
            const response = await axios.get(`${API_URL}/students`, getAuthHeader());
            return response.data;
        } catch (error) {
            console.error("Error getMyStudents:", error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * 2. Ambil daftar semua dosen (Untuk Role: Mahasiswa)
     * Perbaikan URL: disesuaikan dengan route /api/chat/dosens di backend
     */
    getAllDosen: async () => {
        try {
            const response = await axios.get(`${API_URL}/dosens`, getAuthHeader());
            return response.data;
        } catch (error) {
            console.error("Error getAllDosen:", error.response?.data || error.message);
            return []; // Kembalikan array kosong agar UI tidak crash saat .map()
        }
    },

    /**
     * 3. Buat atau Cari Percakapan (Get or Create)
     * Mahasiswa: Kirim participantIds [] untuk otomatis chat dengan pembimbing
     * Dosen/Mahasiswa (Grup): Kirim participantIds [id1, id2, ...]
     */
    createConversation: async (participantIds, groupName = null) => {
        try {
            const response = await axios.post(
                `${API_URL}/conversation`, 
                { participantIds, groupName }, 
                getAuthHeader()
            );
            return response.data;
        } catch (error) {
            console.error("Error createConversation:", error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * 4. Ambil riwayat pesan berdasarkan ID Percakapan
     */
    getMessages: async (id_conversation) => {
        try {
            if (!id_conversation) return [];
            const response = await axios.get(
                `${API_URL}/messages/${id_conversation}`, 
                getAuthHeader()
            );
            return response.data;
        } catch (error) {
            console.error("Error getMessages:", error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * 5. Simpan pesan baru ke database
     */
    saveMessage: async (id_conversation, text) => {
        try {
            const response = await axios.post(
                `${API_URL}/message`, 
                { id_conversation, text }, 
                getAuthHeader()
            );
            return response.data;
        } catch (error) {
            console.error("Error saveMessage:", error.response?.data || error.message);
            throw error;
        }
    }
};