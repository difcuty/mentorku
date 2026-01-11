import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import logo from '../../assets/logo.png';
import emailIcon from '../../assets/Group 13.svg';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Header toggleSidebar={toggleSidebar} />

      <main 
        className={`flex-grow pt-20 p-4 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-[280px]' : 'ml-0'}`}
      >
        <div className="w-full flex justify-end mb-10">
          <img src={emailIcon} alt="Email" className="w-[35px] h-[35px] cursor-pointer" />
        </div>
        
        <h1 className="text-4xl lg:text-5xl font-extrabold text-[#46678c] text-center mb-10 tracking-widest">
            SELAMAT DATANG
        </h1>
        
        <div className="flex flex-col items-center mx-auto max-w-lg lg:max-w-xl">
            <img src={logo} alt="Logo Mentorku" className="w-full h-auto object-contain" />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;