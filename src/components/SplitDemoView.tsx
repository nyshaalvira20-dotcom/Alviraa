'use client';

import React from 'react';
import { DriverDashboard } from '@/components/DriverDashboard';
import { StudentDashboard } from '@/components/StudentDashboard';
import { Columns, ArrowRightLeft, Sparkles, CheckCircle2 } from 'lucide-react';

export const SplitDemoView: React.FC = () => {
  return (
    <div className="space-y-4 max-w-[1600px] mx-auto pb-12">

      {/* Banner Explainer */}
      <div className="bg-gradient-to-r from-amber-500/20 via-blue-500/10 to-indigo-500/20 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-500 text-slate-950 font-bold rounded-xl shrink-0">
            <Columns className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <span>Interactive Real-time Demonstration Mode</span>
              <span className="text-[10px] uppercase font-extrabold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                LIVE SPLIT
              </span>
            </h2>
            <p className="text-xs text-slate-300">
              Click <strong className="text-amber-400">ARRIVED</strong> or <strong className="text-emerald-400">DEPARTED</strong> on the Driver panel (Left) and observe instant notification delivery on the Student panel (Right).
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold text-amber-300 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-amber-500/30">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Real-time Isolation Active</span>
        </div>
      </div>

      {/* Side by Side Split Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* Left Column: Driver View */}
        <div className="space-y-2">
          <div className="bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-between">
            <span>🚌 LEFT PANEL: DRIVER CONTROLLER</span>
            <span>OPERATOR ACTION</span>
          </div>
          <div className="bg-slate-950/60 p-2 sm:p-4 rounded-2xl border border-slate-800 shadow-2xl">
            <DriverDashboard />
          </div>
        </div>

        {/* Right Column: Student View */}
        <div className="space-y-2">
          <div className="bg-blue-600/20 border border-blue-500/30 text-blue-300 px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-between">
            <span>👨‍🎓 RIGHT PANEL: STUDENT NOTIFICATIONS</span>
            <span>REAL-TIME FEED</span>
          </div>
          <div className="bg-slate-950/60 p-2 sm:p-4 rounded-2xl border border-slate-800 shadow-2xl">
            <StudentDashboard />
          </div>
        </div>

      </div>

    </div>
  );
};
