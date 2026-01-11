// Mengambil Base URL dari .env (Vite)
const API_URL = import.meta.env.VITE_API_URL;

/**
 * AMBIL DATA PROFIL (Mendukung Multi-Role)
 */
export const getProfile = async () => {
    const token = localStorage.getItem('token');
    try {
        // Gabungkan API_URL dengan path spesifik
        const response = await fetch(`${API_URL}/api/users/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Gagal mengambil data profil');
        }

        return data; // Mengembalikan objek profil gabungan (User + Mahasiswa/Dosen)
    } catch (error) {
        throw error;
    }
};

/**
 * UPDATE PROFIL (Multi-Role & Upload Foto)
 */
export const updateProfile = async (formDataObj, imageFile) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role'); // Ambil role untuk logika mapping
    const data = new FormData();

    // 1. Data Dasar (Umum)
    data.append('nama_lengkap', formDataObj.nama || formDataObj.nama_lengkap);
    
    // 2. Data Spesifik Berdasarkan Role
    if (role === 'mahasiswa') {
        data.append('npm', formDataObj.npm);
        data.append('program_studi', formDataObj.programStudi || formDataObj.program_studi);
    } else if (role === 'dosen') {
        data.append('nidn', formDataObj.nidn);
    }

    // 3. Foto Profil
    if (imageFile) {
        data.append('foto', imageFile); // 'foto' harus sesuai dengan upload.single('foto') di backend
    }

    try {
        // Gabungkan API_URL dengan path spesifik
        const response = await fetch(`${API_URL}/api/users/update`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
                // Penting: Jangan set Content-Type secara manual saat menggunakan FormData
            },
            body: data
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Gagal memperbarui profil');
        
        return result;
    } catch (error) {
        throw error;
    }
};

export { API_URL };