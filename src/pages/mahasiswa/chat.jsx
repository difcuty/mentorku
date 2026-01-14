import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { chatService } from '../../services/chatService';

const socket = io('http://localhost:5000');

const ChatMentorku = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [activeRoom, setActiveRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const textareaRef = useRef(null);
  const chatEndRef = useRef(null);
  const myId = parseInt(localStorage.getItem('userId'));

  // 1. Cari atau buat percakapan dengan Dosen saat pertama kali buka
  useEffect(() => {
    const initializeChat = async () => {
      try {
        setLoading(true);
        // Mahasiswa otomatis chat ke Dosen pembimbingnya. 
        // Backend kita sudah menghandle pembuatan room jika belum ada.
        const room = await chatService.createConversation([], null); 
        setActiveRoom(room);
        
        // Load riwayat pesan
        const history = await chatService.getMessages(room.id_conversation);
        setMessages(history || []);
        
        // Join socket room
        socket.emit('join_room', room.id_conversation);
      } catch (err) {
        console.error("Gagal inisialisasi chat mahasiswa:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeChat();

    // Listen pesan masuk
    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, []);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInput = (e) => {
    setInputText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !activeRoom) return;
    
    try {
      const savedMsg = await chatService.saveMessage(activeRoom.id_conversation, inputText);
      
      // Emit ke socket agar dosen menerima
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#e0e7e1]">
        <p className="font-bold text-gray-500 animate-pulse">Menghubungkan ke Bimbingan...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#e0e7e1] font-sans">
      {/* --- HEADER --- */}
      <header className="bg-yellow-400 p-3 flex items-center shadow-md fixed top-0 w-full z-10 lg:px-8">
        <button onClick={() => navigate(-1)} className="hover:opacity-70 transition">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="mx-auto text-center">
            <h1 className="text-xl font-bold tracking-wider uppercase text-gray-800">Chat Mentorku</h1>
            <p className="text-[10px] font-black text-green-700 uppercase tracking-widest">Terhubung dengan Dosen</p>
        </div>
      </header>

      {/* --- KONTEN CHAT --- */}
      <main className="flex-grow pt-[80px] pb-[100px] overflow-y-auto">
        <div className="max-w-[900px] mx-auto p-4">
          
          {/* Avatar Bar */}
          <div className="flex justify-around items-center mb-6 bg-white/50 backdrop-blur rounded-2xl p-4 shadow-sm border border-white/20">
            <div className="flex flex-col items-center">
              <div className="bg-blue-600 rounded-full w-14 h-14 flex items-center justify-center border-2 border-white shadow-md text-white font-bold">
                M
              </div>
              <p className="text-xs mt-2 font-bold uppercase">Anda</p>
            </div>
            
            <div className="h-10 w-[1px] bg-gray-300"></div>

            <div className="flex flex-col items-center">
              <div className="bg-yellow-500 rounded-full w-14 h-14 flex items-center justify-center border-2 border-white shadow-md text-white font-bold">
                D
              </div>
              <p className="text-xs mt-2 font-bold uppercase text-center">Dosen PA</p>
            </div>
          </div>

          {/* Area Pesan */}
          <div className="space-y-4">
            {messages.length === 0 && (
                <p className="text-center text-gray-500 text-sm italic py-10">Belum ada percakapan. Mulai bimbingan sekarang.</p>
            )}
            {messages.map((msg, index) => {
              const isMine = msg.sender_id === myId;
              return (
                <div key={msg.id_message || index} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl shadow-md ${
                    isMine 
                    ? 'bg-blue-500 text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
                  }`}>
                    {!isMine && (
                         <p className="text-[10px] font-bold text-yellow-600 mb-1">Dosen Pembimbing</p>
                    )}
                    <p className="text-sm md:text-base">{msg.text}</p>
                    <span className={`text-[9px] opacity-70 block mt-1 ${isMine ? 'text-right' : 'text-left'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
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
                handleSendMessage();
              }
            }}
            placeholder="Ketik Pesan bimbingan..."
            className="flex-grow bg-gray-100 rounded-2xl py-3 px-5 mr-3 text-gray-700 focus:outline-none placeholder-gray-400 resize-none max-h-[150px]"
          />
          <button 
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="p-3 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition shadow-md disabled:bg-gray-300"
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