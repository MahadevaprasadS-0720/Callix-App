import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { UserProfileModal } from '../profile/UserProfileModal';

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [profileOpen, setProfileOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-cyber-bg text-cyber-text flex flex-col antialiased">
      {/* Fixed Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onProfileClick={() => setProfileOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header 
          onMenuToggle={() => setSidebarOpen((prev: boolean) => !prev)} 
          onProfileClick={() => setProfileOpen(true)}
        />
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto space-y-6 animate-fade-in-up">
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
