import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { UserProfileModal } from '../profile/UserProfileModal';

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [profileOpen, setProfileOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-black text-cyber-text flex flex-col antialiased relative selection:bg-cyan-500/30 selection:text-white">
      {/* Ambient Liquid Glass Atmosphere (Fixed Background Glows for Acrylic Refraction) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 left-1/4 w-[34rem] h-[34rem] bg-cyan-500/[0.12] rounded-full blur-[140px] transform-gpu will-change-transform" />
        <div className="absolute top-1/3 -right-20 w-[30rem] h-[30rem] bg-indigo-600/[0.10] rounded-full blur-[150px] transform-gpu will-change-transform" />
        <div className="absolute -bottom-24 left-1/3 w-[36rem] h-[36rem] bg-emerald-500/[0.08] rounded-full blur-[160px] transform-gpu will-change-transform" />
        <div className="absolute top-2/3 -left-20 w-[26rem] h-[26rem] bg-purple-600/[0.07] rounded-full blur-[130px] transform-gpu will-change-transform" />
      </div>

      {/* Fixed / Translucent Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onProfileClick={() => setProfileOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 relative z-10">
        {/* Apple macOS Centered Floating Glass Capsule Navbar Wrapper */}
        <div className="sticky top-2 sm:top-3.5 z-30 px-3 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto transition-all duration-300">
          <Header 
            onMenuToggle={() => setSidebarOpen((prev: boolean) => !prev)} 
            onProfileClick={() => setProfileOpen(true)}
          />
        </div>

        {/* Dashboard Pages Content */}
        <main className="flex-1 px-3 sm:px-6 lg:px-8 py-3 sm:py-5 max-w-7xl w-full mx-auto space-y-6 animate-fade-in-up">
          <Outlet />
        </main>
      </div>

      {/* User Profile Modal */}
      <UserProfileModal 
        isOpen={profileOpen} 
        onClose={() => setProfileOpen(false)} 
      />
    </div>
  );
};

