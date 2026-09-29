import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { UserProfileModal } from '../profile/UserProfileModal';
import { TelecomOnboardingModal } from '../profile/TelecomOnboardingModal';
import { useAuth } from '../../context/AuthContext';

export const DashboardLayout: React.FC = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [profileOpen, setProfileOpen] = useState<boolean>(false);
  const [telecomModalOpen, setTelecomModalOpen] = useState<boolean>(false);

  // Automatically prompt for Truecaller-style phone number onboarding if user is logged in,
  // has no phone number, and hasn't explicitly dismissed it in this browser session.
  useEffect(() => {
    if (user && !user.phoneNumber && !user.isSimulationUser) {
      const dismissed = sessionStorage.getItem('dismissed_phone_onboarding');
      if (!dismissed) {
        const timer = setTimeout(() => {
          setTelecomModalOpen(true);
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [user]);

  // Listen for custom trigger to open phone modal from anywhere
  useEffect(() => {
    const handleOpen = () => setTelecomModalOpen(true);
    window.addEventListener('open-telecom-onboarding', handleOpen);
    return () => window.removeEventListener('open-telecom-onboarding', handleOpen);
  }, []);

  return (
    <div className="min-h-screen bg-black text-cyber-text flex flex-col antialiased relative selection:bg-cyan-500/30 selection:text-white">
      {/* Ambient Liquid Glass Atmosphere (Ultra-Smooth Zero-Blur Hardware-Accelerated Gradients) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-70">
        <div className="absolute -top-32 left-1/4 w-[36rem] h-[36rem] rounded-full [background:radial-gradient(circle,rgba(6,182,212,0.14)_0%,transparent_70%)]" />
        <div className="absolute top-1/3 -right-20 w-[32rem] h-[32rem] rounded-full [background:radial-gradient(circle,rgba(99,102,241,0.11)_0%,transparent_70%)]" />
        <div className="absolute -bottom-24 left-1/3 w-[38rem] h-[38rem] rounded-full [background:radial-gradient(circle,rgba(16,185,129,0.08)_0%,transparent_70%)]" />
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
        <div className="sticky top-2 sm:top-3.5 z-30 px-3 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto transition-all duration-300 mb-5 sm:mb-7">
          <Header 
            onMenuToggle={() => setSidebarOpen((prev: boolean) => !prev)} 
            onProfileClick={() => setProfileOpen(true)}
          />
        </div>

        {/* Dashboard Pages Content */}
        <main className="flex-1 px-3 sm:px-6 lg:px-8 pt-2 sm:pt-3 pb-8 sm:pb-12 max-w-7xl w-full mx-auto space-y-6 animate-fade-in-up">
          <Outlet />
        </main>
      </div>

      {/* User Profile Modal */}
      <UserProfileModal 
        isOpen={profileOpen} 
        onClose={() => setProfileOpen(false)} 
      />

      {/* Telecom Onboarding / Phone Number Setup Modal */}
      <TelecomOnboardingModal
        isOpen={telecomModalOpen}
        onClose={() => setTelecomModalOpen(false)}
      />
    </div>
  );
};

