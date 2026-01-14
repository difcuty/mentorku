import axios from 'axios';

const API_URL = 'http://localhost:5000/api/chat';

// Helper untuk mengambil token terbaru dari localStorage
const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const chatService = {
    // 1. Ambil daftar mahasiswa bimbingan dosen
    getMyStudents: async () => {
        try {
            const response = await axios.get(`${API_URL}/students`, getAuthHeader());
            return response.data;
        } catch (error) {
            console.error("Error getMyStudents:", error.response?.data || error.message);
            throw error;
        }
    },

    // 2. Buat percakapan baru (Personal atau Grup)
    // participantIds: array of user id [1, 2, 3]
    // groupName: string (opsional)
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

    // 3. Ambil riwayat pesan berdasarkan ID Ruangan
    getMessages: async (id_conversation) => {
        try {
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

    // 4. Simpan pesan baru ke database
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