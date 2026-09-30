'use client';

import React from 'react';
import { useBus } from '@/context/BusContext';
import { Bus, UserRole } from '@/types';
import {
  Bus as BusIcon,
  UserCheck,
  ShieldCheck,
  RefreshCw,
  Columns,
  BellRing,
  ArrowRightLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  currentView: 'landing' | 'dashboard' | 'split-demo';
  setCurrentView: (view: 'landing' | 'dashboard' | 'split-demo') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView }) => {
  const {
    role,
    setRole,
    activeStudentId,
    setActiveStudentId,
    students,
    buses,
    activeDriverBusId,
    setActiveDriverBusId,
    resetAllData,
    notifications
  } = useBus();

  const currentStudent = students.find((s) => s.id === activeStudentId) || students[0];
  const currentStudentBus = buses.find((b) => b.id === currentStudent?.busId);
  const unreadCount = notifications.filter((n) => n.busId === currentStudent?.busId && !n.read).length;

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentView('landing')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <BusIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white">BusNotify</span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Smart Bus Stop System
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Know when your bus arrives. Never miss your stop.</p>
            </div>
          </div>

          {/* Role Navigation & Switches */}
          <div className="flex items-center space-x-2 sm:space-x-4">

            {/* View Mode Toggle Button */}
            <button
              onClick={() => setCurrentView(currentView === 'split-demo' ? 'dashboard' : 'split-demo')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentView === 'split-demo'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
              }`}
              title="Interactive Live Driver-Student Split View"
            >
              <Columns className="w-4 h-4" />
              <span className="hidden md:inline">Split Demo Mode</span>
            </button>

            {/* Current Active Role Switcher */}
            {role && (
              <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700 text-xs">
                <button
                  onClick={() => { setRole('student'); setCurrentView('dashboard'); }}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition-all ${
                    role === 'student'
                      ? 'bg-blue-600 text-white font-medium shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Student</span>
                </button>

                <button
                  onClick={() => { setRole('driver'); setCurrentView('dashboard'); }}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition-all ${
                    role === 'driver'
                      ? 'bg-emerald-600 text-white font-medium shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BusIcon className="w-3.5 h-3.5" />
                  <span>Driver</span>
                </button>

                <button
                  onClick={() => { setRole('admin'); setCurrentView('dashboard'); }}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition-all ${
                    role === 'admin'
                      ? 'bg-purple-600 text-white font-medium shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>
              </div>
            )}

            {/* Quick Selectors depending on Role */}
            {role === 'student' && (
              <div className="hidden lg:flex items-center space-x-2 text-xs bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                <span className="text-slate-400">Profile:</span>
                <select
                  value={activeStudentId}
                  onChange={(e) => setActiveStudentId(e.target.value)}
                  className="bg-slate-900 text-white text-xs rounded border border-slate-700 px-1.5 py-0.5 focus:outline-none focus:border-blue-500"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({buses.find(b => b.id === s.busId)?.number})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {role === 'driver' && (
              <div className="hidden lg:flex items-center space-x-2 text-xs bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                <span className="text-slate-400">Bus:</span>
                <select
                  value={activeDriverBusId}
                  onChange={(e) => setActiveDriverBusId(e.target.value)}
                  className="bg-slate-900 text-white text-xs rounded border border-slate-700 px-1.5 py-0.5 focus:outline-none focus:border-emerald-500"
                >
                  {buses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.number} ({b.driverName})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Reset Button */}
            <button
              onClick={() => {
                if (confirm('Reset prototype data to default sample state?')) {
                  resetAllData();
                }
              }}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Reset Sample Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
