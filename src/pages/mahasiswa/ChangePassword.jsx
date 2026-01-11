import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { changePassword } from '../../services/authService';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenModal = (e) => {
    e.preventDefault();
    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      alert('Semua field harus diisi!');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      alert('Kata sandi baru dan konfirmasi tidak cocok!');
      return;
    }
    setShowModal(true);
  };

  const handleConfirmSave = async () => {
    try {
      await changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      });
      alert('Kata sandi berhasil diubah!');
      setShowModal(false);
      navigate('/dashboard');
    } catch (error) {
      alert(error.message);
      setShowModal(false);
    }
  };

  return (
    <div className="bg-[#e8f5e9] min-h-screen antialiased font-sans">
      {/* Modal Konfirmasi */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 md:p-10 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-8">
              Apakah Anda Yakin<br />ingin Simpan Perubahan
            </h2>
            <div className="flex justify-center gap-8 md:gap-12">
              <button onClick={() => setShowModal(false)} className="w-16 h-16 md:w-20 md:h-20 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-800 transition duration-150 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="white" className="w-8 h-8 md:w-10 md:h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <button onClick={handleConfirmSave} className="w-16 h-16 md:w-20 md:h-20 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-800 transition duration-150 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="white" className="w-8 h-8 md:w-10 md:h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout (Desktop & Mobile handled by Tailwind Responsive) */}
      <div className="flex min-h-screen">
        {/* Left Side Desktop */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-green-100 to-green-200 items-center justify-center p-12">
          <div className="text-center">
            <div className="w-64 h-64 mx-auto mb-8 bg-white rounded-full flex items-center justify-center shadow-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-32 h-32 text-gray-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Keamanan Akun</h2>
            <p className="text-lg text-gray-600">Lindungi akun Anda dengan kata sandi yang kuat dan aman</p>
          </div>
        </div>

        {/* Right Side / Mobile Layout */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-12">
          <div className="w-full max-w-lg">
            <div className="mb-6 lg:mb-8">
              <Link to="/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-800 transition duration-150 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                Kembali
              </Link>
              <h1 className="text-2xl lg:text-4xl font-bold text-gray-800">Ubah Kata Sandi</h1>
            </div>

            <div className="bg-white p-6 md:p-10 rounded-[30px] shadow-2xl">
              <form onSubmit={handleOpenModal} className="space-y-6">
                {[
                  { label: 'Masukkan Kata Sandi Lama', id: 'oldPassword', placeholder: 'Kata Sandi Lama' },
                  { label: 'Masukkan Kata Sandi Baru', id: 'newPassword', placeholder: 'Kata Sandi Baru' },
                  { label: 'Konfirmasi Kata Sandi Baru', id: 'confirmPassword', placeholder: 'Konfirmasi Kata Sandi Baru' }
                ].map((field) => (
                  <div key={field.id}>
                    <label htmlFor={field.id} className="block text-base font-semibold text-gray-800 mb-2">
                      {field.label}
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        name={field.id}
                        id={field.id}
                        value={formData[field.id]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className="w-full py-3 lg:py-4 px-5 pl-12 lg:pl-14 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-500 font-medium"
                        required
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 lg:pl-5 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-4 lg:pt-6">
                  <button type="submit" className="w-full bg-yellow-400 text-gray-800 font-bold py-3 lg:py-4 px-6 rounded-lg shadow-lg hover:bg-yellow-500 transition duration-150 flex items-center justify-center space-x-2 text-lg">
                    <span>Simpan</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;