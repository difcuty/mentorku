import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { chatService } from '../../services/chatService';

const socket = io('http://localhost:5000');

const ChatMentorku = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [availableDosen, setAvailableDosen] = useState([]); // Daftar dosen yang bisa dipilih
  const [selectedDosen, setSelectedDosen] = useState([]);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [activeRoom, setActiveRoom] = useState(() => {
    const savedRoom = localStorage.getItem('lastActiveRoomMhs');
    return savedRoom ? JSON.parse(savedRoom) : null;
  });

  const textareaRef = useRef(null);
  const chatEndRef = useRef(null);
  const myId = parseInt(localStorage.getItem('userId'));

  // 1. Load Data Dosen & Chat Awal
  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        // Load daftar dosen (Pastikan ada service getDosen)
        // Jika belum ada, sementara bisa pakai service yang mengembalikan dosen pembimbing
        const dosenList = await chatService.getAllDosen(); 
        setAvailableDosen(dosenList);

        // Jika belum ada activeRoom, buat otomatis dengan Dosen Pembimbing
        if (!activeRoom) {
          const room = await chatService.createConversation([], null);
          setActiveRoom(room);
        }
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, []);

  // 2. Sinkronisasi Room & Socket
  useEffect(() => {
    if (activeRoom) {
      localStorage.setItem('lastActiveRoomMhs', JSON.stringify(activeRoom));
      socket.emit('join_room', activeRoom.id_conversation);

      const loadMessages = async () => {
        try {
          const history = await chatService.getMessages(activeRoom.id_conversation);
          setMessages(history || []);
        } catch (err) {
          console.error("Gagal load history");
        }
      };
      loadMessages();

      socket.on('receive_message', (data) => {
        if (String(data.id_conversation) === String(activeRoom.id_conversation)) {
          setMessages((prev) => {
            if (prev.find(m => m.id_message === data.id_message)) return prev;
            return [...prev, data];
          });
        }
      });
    }
    return () => socket.off('receive_message');
  }, [activeRoom]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fungsi pindah ke chat dosen tertentu
  const switchToDosen = async (dosen) => {
    try {
      const room = await chatService.createConversation([dosen.id_user], null);
      setActiveRoom(room);
      setIsAddUserModalOpen(false);
    } catch (err) {
      alert("Gagal memindahkan chat");
    }
  };

  const handleStartGroupChat = async () => {
    if (selectedDosen.length === 0) return;
    try {
      const groupName = selectedDosen.length > 1 ? "Grup Diskusi" : null;
      const room = await chatService.createConversation(selectedDosen, groupName);
      setActiveRoom(room);
      setIsAddUserModalOpen(false);
      setSelectedDosen([]);
    } catch (err) {
      alert("Gagal membuat grup");
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !activeRoom) return;
    try {
      const savedMsg = await chatService.saveMessage(activeRoom.id_conversation, inputText);
      socket.emit('send_message', { ...savedMsg, id_conversation: activeRoom.id_conversation });
      setMessages((prev) => [...prev, savedMsg]);
      setInputText('');
    } catch (err) {
      alert("Gagal mengirim");
    }
  };

  // Mencari nama dosen untuk ditampilkan di bar status
  const getDosenName = () => {
    if (!activeRoom) return "Dosen";
    if (activeRoom.is_group) return activeRoom.name || "Grup Diskusi";
    const partner = activeRoom.anggota_percakapan?.find(u => u.id_user !== myId);
    return partner?.profil_dosen?.nama_lengkap || "Dosen Pembimbing";
  };

  const handleInput = (e) => {
    setInputText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
  };

  if (loading && !activeRoom) return <div className="text-center p-10">Memuat Chat...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f2f5] font-sans">
      
      {/* MODAL PILIH DOSEN */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Tambah Diskusi Dosen</h2>
            <div className="max-h-60 overflow-y-auto space-y-2 mb-6 px-1">
              {availableDosen.map(dosen => (
                <div 
                  key={dosen.id_user} 
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer border-2 transition ${
                    selectedDosen.includes(dosen.id_user) ? 'bg-blue-50 border-blue-500' : 'bg-gray-50 border-transparent'
                  }`}
                  onClick={() => setSelectedDosen(prev => 
                    prev.includes(dosen.id_user) ? prev.filter(id => id !== dosen.id_user) : [...prev, dosen.id_user]
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center font-bold text-white">
                      {dosen.profil_dosen?.nama_lengkap?.charAt(0) || "D"}
                    </div>
                    <div>
                      <p className="font-bold text-gray-700 text-sm">{dosen.profil_dosen?.nama_lengkap}</p>
                      <p className="text-xs text-gray-500">{dosen.profil_dosen?.nidn || 'Dosen'}</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 ${selectedDosen.includes(dosen.id_user) ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`} />
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setIsAddUserModalOpen(false)} className="flex-1 py-3 rounded-xl bg-gray-200 font-bold text-gray-500">Batal</button>
              <button onClick={handleStartGroupChat} disabled={selectedDosen.length === 0} className="flex-1 py-3 rounded-xl bg-blue-600 font-bold text-white disabled:bg-gray-300 shadow-lg shadow-blue-500/30">Mulai Chat</button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="bg-yellow-400 p-4 flex items-center shadow-md fixed top-0 w-full z-10 lg:px-10">
        <button onClick={() => navigate(-1)} className="hover:bg-yellow-500 p-2 rounded-full transition">
          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="mx-auto text-center">
            <h1 className="text-lg font-bold uppercase text-gray-800 tracking-tight">
                {activeRoom?.is_group ? (activeRoom.name || "Grup Diskusi") : "Bimbingan Privat"}
            </h1>
            <div className="flex items-center justify-center gap-1">
                <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest">System Online</p>
            </div>
        </div>
      </header>

      {/* KONTEN UTAMA */}
      <main className="flex-grow pt-[85px] pb-[100px] overflow-y-auto">
        <div className="max-w-[800px] mx-auto p-4">
          
          {/* BAR STATUS & DAFTAR DOSEN AKTIF */}
          <div className="flex items-center gap-4 mb-6 bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-gray-200 shadow-sm overflow-x-auto no-scrollbar">
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="bg-blue-700 rounded-xl w-12 h-12 flex items-center justify-center text-white font-bold shadow-inner">M</div>
              <p className="text-[10px] mt-1 font-bold text-gray-400 uppercase">Anda</p>
            </div>

            <div className="h-8 w-[1px] bg-gray-300 flex-shrink-0"></div>

            <div className="flex gap-4">
                {/* Menampilkan Dosen yang sedang di-chat */}
                <div className="flex flex-col items-center flex-shrink-0">
                    <div className="bg-yellow-500 rounded-xl w-12 h-12 flex items-center justify-center text-white font-bold shadow-md border-2 border-white">
                        {getDosenName().charAt(0)}
                    </div>
                    <p className="text-[10px] mt-1 font-bold text-blue-600 truncate max-w-[80px]">{getDosenName().split(' ')[0]}</p>
                </div>
            </div>

            <button onClick={() => setIsAddUserModalOpen(true)} className="flex flex-col items-center flex-shrink-0 group ml-auto">
              <div className="bg-gray-100 rounded-xl w-12 h-12 flex items-center justify-center border-2 border-dashed border-gray-300 text-gray-400 group-hover:bg-blue-50 group-hover:border-blue-400 transition-all">
                <span className="text-xl">+</span>
              </div>
              <p className="text-[10px] mt-1 font-bold text-gray-400 group-hover:text-blue-600 tracking-tighter">Tambah</p>
            </button>
          </div>

          {/* AREA BUBBLE CHAT */}
          <div className="space-y-4">
            {messages.map((msg, index) => {
                const isMine = msg.sender_id === myId;
                return (
                  <div key={msg.id_message || index} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm relative ${
                      isMine ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                    }`}>
                      {!isMine && (
                        <p className="text-[10px] font-bold text-yellow-600 mb-1">
                          {msg.pengirim?.role === 'dosen' ? (msg.pengirim?.profil_dosen?.nama_lengkap) : (msg.pengirim?.profil_mahasiswa?.nama_lengkap)}
                        </p>
                      )}
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <p className={`text-[9px] mt-1 opacity-70 ${isMine ? 'text-right' : 'text-left'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
            })}
            <div ref={chatEndRef} />
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 p-4 fixed bottom-0 w-full z-10">
        <div className="max-w-[800px] mx-auto flex items-end gap-2">
          <textarea
            ref={textareaRef}
            rows="1"
            value={inputText}
            onChange={handleInput}
            onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
            placeholder="Ketik pesan bimbingan..."
            className="flex-grow bg-gray-100 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none max-h-32"
          />
          <button onClick={handleSendMessage} disabled={!inputText.trim()} className="p-3 bg-blue-600 rounded-xl text-white hover:bg-blue-700 disabled:bg-gray-300 transition-colors shadow-lg shadow-blue-500/30">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3v6l15 3-15 3v6z"></path></svg>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatMentorku;