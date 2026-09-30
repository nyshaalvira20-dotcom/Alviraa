'use client';

import React from 'react';
import { UserRole } from '@/types';
import {
  GraduationCap,
  Bus,
  ShieldCheck,
  Columns,
  CheckCircle2,
  ArrowRight,
  Bell,
  Zap,
  ShieldAlert,
  Smartphone
} from 'lucide-react';

interface LandingPageProps {
  onSelectRole: (role: UserRole) => void;
  onOpenSplitDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectRole, onOpenSplitDemo }) => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16 text-center space-y-6">

        {/* Subtitle Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium animate-pulse">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>College Transportation Prototype Demo</span>
        </div>

        {/* Title & Tagline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Welcome to <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">BusNotify</span>
        </h1>

        <p className="text-xl sm:text-2xl text-slate-300 font-light max-w-3xl mx-auto leading-relaxed">
          Know when your bus arrives. <span className="text-blue-400 font-normal">Never miss your stop.</span>
        </p>

        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          Smart real-time stop notifications engineered for campus transportation. Drivers dispatch accurate stop arrivals, ensuring <span className="text-amber-300 font-semibold">only assigned students</span> receive relevant alerts.
        </p>

        {/* Interactive Split View Demo Callout */}
        <div className="pt-2">
          <button
            onClick={onOpenSplitDemo}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:from-amber-400 hover:to-orange-400 font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Columns className="w-5 h-5" />
            <span>Try Interactive Split-Screen Demo</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        {/* Role Cards Grid */}
        <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">

          {/* 1. Student Role */}
          <div className="group relative bg-slate-900/90 rounded-2xl p-6 border border-slate-800 hover:border-blue-500/50 shadow-xl transition-all duration-300 flex flex-col justify-between hover:shadow-blue-500/10">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-between">
                <span>Student</span>
                <span className="text-xs bg-blue-500/20 text-blue-400 font-medium px-2.5 py-1 rounded-full border border-blue-500/30">
                  Passenger View
                </span>
              </h2>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Track your assigned bus, view live route timelines, and receive instant arrival/departure stop alerts.
              </p>
            </div>

            <button
              onClick={() => onSelectRole('student')}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md shadow-blue-600/30 group-hover:bg-blue-500"
            >
              <span>Continue as Student</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 2. Driver Role */}
          <div className="group relative bg-slate-900/90 rounded-2xl p-6 border border-slate-800 hover:border-emerald-500/50 shadow-xl transition-all duration-300 flex flex-col justify-between hover:shadow-emerald-500/10">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Bus className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-between">
                <span>Driver</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 font-medium px-2.5 py-1 rounded-full border border-emerald-500/30">
                  Operator Panel
                </span>
              </h2>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Update bus stop arrival and departure statuses with 1-click controls, report traffic delays, and send announcements.
              </p>
            </div>

            <button
              onClick={() => onSelectRole('driver')}
              className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md shadow-emerald-600/30 group-hover:bg-emerald-500"
            >
              <span>Continue as Driver</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 3. Admin Role */}
          <div className="group relative bg-slate-900/90 rounded-2xl p-6 border border-slate-800 hover:border-purple-500/50 shadow-xl transition-all duration-300 flex flex-col justify-between hover:shadow-purple-500/10">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-between">
                <span>Admin</span>
                <span className="text-xs bg-purple-500/20 text-purple-400 font-medium px-2.5 py-1 rounded-full border border-purple-500/30">
                  Fleet Manager
                </span>
              </h2>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Monitor live fleet movement, reassign students to routes, execute route simulations, and inspect system audit logs.
              </p>
            </div>

            <button
              onClick={() => onSelectRole('admin')}
              className="w-full flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md shadow-purple-600/30 group-hover:bg-purple-500"
            >
              <span>Continue as Admin</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Highlights / Features Banner */}
      <div className="border-t border-slate-800/80 bg-slate-900/50 py-8">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-slate-300 text-xs">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-1">Targeted Bus Alerts</h4>
              <p className="text-slate-400">Only students assigned to a specific bus receive arrival & departure notifications.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-1">Zero External APIs</h4>
              <p className="text-slate-400">Runs reliably offline without requiring GPS, Google Maps, or external backend setup.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Columns className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-1">Split View Testing</h4>
              <p className="text-slate-400">Demonstrate instant driver-to-student notification dispatch on one screen.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-1">Realistic Sample Data</h4>
              <p className="text-slate-400">Pre-loaded with multiple college routes, stops, and student passenger profiles.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
