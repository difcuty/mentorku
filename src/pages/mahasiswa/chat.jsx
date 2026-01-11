import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatMentorku = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  
  const textareaRef = useRef(null);
  const chatEndRef = useRef(null);

  // Auto scroll ke bawah setiap ada pesan baru
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle auto-expand textarea
  const handleInput = (e) => {
    const target = e.target;
    setInputText(target.value);
    target.style.height = 'auto';
    target.style.height = `${Math.min(target.scrollHeight, 150)}px`;
  };

  const sendMessage = () => {
    if (inputText.trim() === "") return;

    const newMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInputText('');
    
    // Reset height textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const openDeleteModal = (id) => {
    setMessageToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    setMessages(messages.filter(msg => msg.id !== messageToDelete));
    setIsModalOpen(false);
    setMessageToDelete(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#e0e7e1] font-sans">
      {/* --- MODAL HAPUS --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-[#d1d5d1] rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-200">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-8">
              Apakah Anda Yakin Ingin<br />Menghapus Pesan
            </h2>
            <div className="flex justify-center gap-4">
              <button 
                onClick={confirmDelete}
                className="bg-[#94a392] hover:bg-[#7d8c7b] text-black font-bold px-8 py-2 rounded-full text-lg uppercase tracking-wide transition"
              >
                Hapus
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="bg-[#94a392] hover:bg-[#7d8c7b] text-black font-bold px-8 py-2 rounded-full text-lg uppercase tracking-wide transition"
              >
                Tidak
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <header className="bg-yellow-400 p-3 flex items-center shadow-md fixed top-0 w-full z-10 lg:px-8">
        <button onClick={() => navigate(-1)} className="hover:opacity-70 transition">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold tracking-wider mx-auto lg:ml-4 lg:mr-auto uppercase text-gray-800">Chat Mentorku</h1>
      </header>

      {/* --- KONTEN CHAT --- */}
      <main className="flex-grow pt-[80px] pb-[100px]">
        <div className="max-w-[900px] mx-auto p-4">
          
          {/* Avatar Bar */}
          <div className="flex justify-around items-center mb-6 bg-white/50 backdrop-blur rounded-2xl p-4 shadow-sm border border-white/20">
            <div className="flex flex-col items-center">
              <div className="bg-gray-200 rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center border-2 border-white shadow-sm">
                <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path></svg>
              </div>
              <p className="text-xs mt-2 font-bold uppercase">Anda</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-gray-200 rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center border-2 border-white shadow-sm">
                <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path></svg>
              </div>
              <p className="text-xs mt-2 font-bold uppercase text-center text-nowrap">Dosen PA</p>
            </div>
            <div className="flex flex-col items-center opacity-60">
              <div className="bg-gray-100/50 rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center border-2 border-dashed border-gray-400">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              </div>
              <p className="text-[10px] mt-2 font-semibold uppercase text-center text-nowrap">Tambah Dosen</p>
            </div>
          </div>

          <div className="text-center my-4">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-white/30 px-3 py-1 rounded-full">Hari Ini</span>
          </div>

          {/* Area Pesan */}
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div 
                  onClick={() => openDeleteModal(msg.id)}
                  className="bg-blue-500 text-white rounded-2xl rounded-tr-none p-3 max-w-[80%] shadow-md cursor-pointer transition active:scale-95 select-none"
                >
                  <p className="text-sm md:text-base">{msg.text}</p>
                  <span className="text-[9px] opacity-70 block text-right mt-1">{msg.time}</span>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </div>
      </main>

      {/* --- FOOTER INPUT --- */}
      <footer className="bg-white p-3 flex items-end shadow-[0_-5px_15px_rgba(0,0,0,0.05)] fixed bottom-0 w-full z-10">
        <div className="max-w-[900px] mx-auto flex w-full items-center">
          <textarea
            ref={textareaRef}
            rows="1"
            value={inputText}
            onChange={handleInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Ketik Pesan............"
            className="flex-grow bg-gray-100 rounded-2xl py-3 px-5 mr-3 text-gray-700 focus:outline-none placeholder-gray-400 resize-none max-h-[150px] overflow-y-auto"
          />
          <button 
            onClick={sendMessage}
            className="p-3 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition shadow-md active:scale-90"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3v6l15 3-15 3v6z"></path>
            </svg>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatMentorku;