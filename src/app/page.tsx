'use client';

import React, { useState } from 'react';
import { BusProvider, useBus } from '@/context/BusContext';
import { Navbar } from '@/components/Navbar';
import { LandingPage } from '@/components/LandingPage';
import { StudentDashboard } from '@/components/StudentDashboard';
import { DriverDashboard } from '@/components/DriverDashboard';
import { AdminDashboard } from '@/components/AdminDashboard';
import { SplitDemoView } from '@/components/SplitDemoView';
import { ToastNotification } from '@/components/ToastNotification';
import { UserRole } from '@/types';

function AppContent() {
  const { role, setRole } = useBus();
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'split-demo'>('landing');

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setCurrentView('dashboard');
  };

  const handleOpenSplitDemo = () => {
    setCurrentView('split-demo');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentView === 'split-demo' ? (
          <SplitDemoView />
        ) : !role || currentView === 'landing' ? (
          <LandingPage
            onSelectRole={handleRoleSelect}
            onOpenSplitDemo={handleOpenSplitDemo}
          />
        ) : role === 'student' ? (
          <StudentDashboard />
        ) : role === 'driver' ? (
          <DriverDashboard />
        ) : role === 'admin' ? (
          <AdminDashboard />
        ) : (
          <LandingPage
            onSelectRole={handleRoleSelect}
            onOpenSplitDemo={handleOpenSplitDemo}
          />
        )}
      </main>

      <ToastNotification />

      <footer className="bg-slate-900 border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Smart Bus Stop Notification System (BusNotify). College Prototype Demonstration.</p>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>Built with Next.js & Tailwind CSS</span>
            <span>•</span>
            <button
              onClick={() => setCurrentView('split-demo')}
              className="text-amber-400 hover:underline font-semibold"
            >
              Split View Demo
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <BusProvider>
      <AppContent />
    </BusProvider>
  );
}
