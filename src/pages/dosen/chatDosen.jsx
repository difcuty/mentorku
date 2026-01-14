import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { chatService } from '../../services/chatService';

const socket = io('http://localhost:5000');

const ChatMentorkuDosen = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  
  // 1. Inisialisasi activeRoom dari localStorage jika ada
  const [activeRoom, setActiveRoom] = useState(() => {
    const savedRoom = localStorage.getItem('lastActiveRoom');
    return savedRoom ? JSON.parse(savedRoom) : null;
  });
  
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const textareaRef = useRef(null);
  const chatEndRef = useRef(null);
  const myId = parseInt(localStorage.getItem('userId')); 

  // Load daftar mahasiswa (tetap dilakukan setiap refresh)
  useEffect(() => {
    const loadData = async () => {
      try {
        const students = await chatService.getMyStudents();
        setAvailableStudents(students);
      } catch (err) {
        console.error("Gagal memuat data mahasiswa");
      }
    };
    loadData();
  }, []);

  // 2. Gunakan useEffect untuk handle sinkronisasi room & socket
  useEffect(() => {
    if (activeRoom) {
      // Simpan ke localStorage setiap kali activeRoom berubah
      localStorage.setItem('lastActiveRoom', JSON.stringify(activeRoom));
      
      socket.emit('join_room', activeRoom.id_conversation);

      const loadMessages = async () => {
        try {
          const history = await chatService.getMessages(activeRoom.id_conversation);
          setMessages(history || []);
        } catch (err) {
          console.error("Gagal load history:", err);
        }
      };
      loadMessages();

      socket.on('receive_message', (data) => {
        if (data.id_conversation === activeRoom.id_conversation) {
          setMessages((prev) => [...prev, data]);
        }
      });
    }

    return () => {
      socket.off('receive_message');
    };
  }, [activeRoom]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const switchToStudent = async (student) => {
    try {
      const room = await chatService.createConversation([student.id_user], null);
      // Room baru otomatis tersimpan ke localStorage via useEffect di atas
      setActiveRoom({
        ...room,
        participantDetails: [student]
      });
      setIsAddUserModalOpen(false);
    } catch (err) {
      console.error("Gagal berpindah chat:", err);
    }
  };

  const handleStartChat = async () => {
    if (selectedStudents.length === 0) return;
    try {
      const groupName = selectedStudents.length > 1 ? "Grup Bimbingan" : null;
      const room = await chatService.createConversation(selectedStudents, groupName);
      const details = availableStudents.filter(s => selectedStudents.includes(s.id_user));
      
      setActiveRoom({
        ...room,
        participantDetails: details
      });
      
      setIsAddUserModalOpen(false);
      setSelectedStudents([]);
    } catch (err) {
      alert("Gagal memulai percakapan");
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !activeRoom) return;
    try {
      const savedMsg = await chatService.saveMessage(activeRoom.id_conversation, inputText);
      socket.emit('send_message', { 
        ...savedMsg, 
        id_conversation: activeRoom.id_conversation 
      });
      setMessages((prev) => [...prev, savedMsg]);
      setInputText('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    } catch (err) {
      alert("Pesan gagal terkirim");
    }
  };

  const handleInput = (e) => {
    setInputText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f2f5] font-sans">
      
      {/* MODAL PILIH MAHASISWA */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Mulai Bimbingan Baru</h2>
            <div className="max-h-60 overflow-y-auto space-y-2 mb-6 px-1">
              {availableStudents.map(student => (
                <div 
                  key={student.id_user} 
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer border-2 transition ${
                    selectedStudents.includes(student.id_user) ? 'bg-blue-50 border-blue-500' : 'bg-gray-50 border-transparent'
                  }`}
                  onClick={() => setSelectedStudents(prev => 
                    prev.includes(student.id_user) ? prev.filter(id => id !== student.id_user) : [...prev, student.id_user]
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">
                      {student.profil_mahasiswa?.nama_lengkap?.charAt(0) || "M"}
                    </div>
                    <div>
                      <p className="font-bold text-gray-700 text-sm">{student.profil_mahasiswa?.nama_lengkap}</p>
                      <p className="text-xs text-gray-500">{student.profil_mahasiswa?.npm}</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 ${selectedStudents.includes(student.id_user) ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`} />
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setIsAddUserModalOpen(false)} className="flex-1 py-3 rounded-xl bg-gray-200 font-bold text-gray-500 hover:bg-gray-300 transition">Batal</button>
              <button onClick={handleStartChat} disabled={selectedStudents.length === 0} className="flex-1 py-3 rounded-xl bg-blue-600 font-bold text-white disabled:bg-gray-300 transition shadow-lg shadow-blue-500/30">Mulai Chat</button>
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
                {activeRoom ? (activeRoom.name || (activeRoom.is_group ? "Grup Bimbingan" : "Bimbingan Privat")) : "Bimbingan Mentorku"}
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
          
          {/* BAR DAFTAR MAHASISWA */}
          <div className="flex items-center gap-4 mb-6 bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-gray-200 shadow-sm overflow-x-auto no-scrollbar">
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="bg-blue-700 rounded-xl w-12 h-12 flex items-center justify-center text-white font-bold shadow-inner">D</div>
              <p className="text-[10px] mt-1 font-bold text-gray-400 uppercase">Anda</p>
            </div>

            <div className="h-8 w-[1px] bg-gray-300 flex-shrink-0"></div>

            <div className="flex gap-4">
              {availableStudents.map((student) => {
                const isActive = activeRoom?.participantDetails?.some(p => p.id_user === student.id_user) && !activeRoom.is_group;
                return (
                  <div key={student.id_user} className="flex flex-col items-center flex-shrink-0 cursor-pointer group" onClick={() => switchToStudent(student)}>
                    <div className={`rounded-xl w-12 h-12 flex items-center justify-center font-bold border-2 transition-all 
                      ${isActive ? 'bg-blue-600 border-blue-600 text-white scale-105 shadow-md' : 'bg-white border-gray-200 text-gray-500 hover:border-blue-400'}`}>
                      {student.profil_mahasiswa?.nama_lengkap?.charAt(0)}
                    </div>
                    <p className={`text-[10px] mt-1 font-medium truncate max-w-[50px] ${isActive ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>
                      {student.profil_mahasiswa?.nama_lengkap?.split(' ')[0]}
                    </p>
                  </div>
                );
              })}
            </div>

            <button onClick={() => setIsAddUserModalOpen(true)} className="flex flex-col items-center flex-shrink-0 group">
              <div className="bg-gray-100 rounded-xl w-12 h-12 flex items-center justify-center border-2 border-dashed border-gray-300 text-gray-400 group-hover:bg-blue-50 group-hover:border-blue-400 group-hover:text-blue-600 transition-all">
                <span className="text-xl">+</span>
              </div>
              <p className="text-[10px] mt-1 font-bold text-gray-400 group-hover:text-blue-600">Grup</p>
            </button>
          </div>

          {/* AREA BUBBLE CHAT */}
          <div className="space-y-4">
            {!activeRoom ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400 italic">
                <p>Pilih mahasiswa atau grup bimbingan untuk memulai chat</p>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isMine = msg.sender_id === myId;
                return (
                  <div key={msg.id_message || index} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm relative ${
                      isMine 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                    }`}>
                      {!isMine && activeRoom.is_group && (
                        <p className="text-[10px] font-bold text-blue-500 mb-1">
                          {msg.pengirim?.profil_mahasiswa?.nama_lengkap || 'Mahasiswa'}
                        </p>
                      )}
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <p className={`text-[9px] mt-1 opacity-70 ${isMine ? 'text-right' : 'text-left'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
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
            disabled={!activeRoom}
            onChange={handleInput}
            onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
            placeholder={activeRoom ? "Ketik pesan bimbingan..." : "Pilih bimbingan..."}
            className="flex-grow bg-gray-100 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none max-h-32 disabled:bg-gray-50"
          />
          <button 
            onClick={handleSendMessage} 
            disabled={!activeRoom || !inputText.trim()}
            className="p-3 bg-blue-600 rounded-xl text-white hover:bg-blue-700 disabled:bg-gray-300 transition-colors shadow-lg shadow-blue-500/30"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3v6l15 3-15 3v6z"></path></svg>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatMentorkuDosen;