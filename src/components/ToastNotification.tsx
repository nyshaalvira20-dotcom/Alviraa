'use client';

import React from 'react';
import { useBus } from '@/context/BusContext';
import { Bell, CheckCircle2, AlertTriangle, X, Radio } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { activeToast, dismissToast, role, activeStudentId, students } = useBus();

  if (!activeToast) return null;

  const currentStudent = students.find((s) => s.id === activeStudentId);

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-bounce-short">
      <div className={`p-4 rounded-2xl shadow-2xl border backdrop-blur-md flex items-start space-x-3 ${
        activeToast.type === 'ARRIVED'
          ? 'bg-amber-950/90 border-amber-500/50 text-amber-200'
          : activeToast.type === 'DEPARTED'
          ? 'bg-blue-950/90 border-blue-500/50 text-blue-200'
          : activeToast.type === 'DELAYED'
          ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
          : 'bg-purple-950/90 border-purple-500/50 text-purple-200'
      }`}>
        <div className="p-2 rounded-xl bg-slate-900/80 shrink-0">
          {activeToast.type === 'ARRIVED' ? (
            <Bell className="w-5 h-5 text-amber-400" />
          ) : activeToast.type === 'DELAYED' ? (
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          ) : (
            <Radio className="w-5 h-5 text-blue-400" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white">
              {activeToast.title} ({activeToast.busNumber})
            </h4>
            <button
              onClick={dismissToast}
              className="text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-200 mt-1 font-medium leading-tight">
            {activeToast.message}
          </p>
        </div>
      </div>
    </div>
  );
};
