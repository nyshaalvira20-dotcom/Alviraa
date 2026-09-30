'use client';

import React, { useState } from 'react';
import { useBus } from '@/context/BusContext';
import {
  ShieldCheck,
  Bus as BusIcon,
  Users,
  Play,
  RotateCcw,
  History,
  ArrowRightLeft,
  CheckCircle2,
  Clock,
  Sliders
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    buses,
    students,
    logs,
    assignStudentToBus,
    updateStopStatus,
    resetAllData
  } = useBus();

  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [targetBusId, setTargetBusId] = useState(buses[0]?.id || '');
  const [targetStopId, setTargetStopId] = useState(buses[0]?.stops[0]?.id || '');

  const [isSimulating, setIsSimulating] = useState(false);

  // Reassignment submit
  const handleReassign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !targetBusId || !targetStopId) return;
    assignStudentToBus(selectedStudentId, targetBusId, targetStopId);
    alert('Student bus assignment updated successfully!');
  };

  // Target bus changed for reassignment
  const selectedBus = buses.find((b) => b.id === targetBusId) || buses[0];

  // Automated Route Simulation Runner
  const runRouteSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);

    const busToSimulate = buses[0]; // Bus 12
    let step = 0;

    const interval = setInterval(() => {
      if (step >= busToSimulate.stops.length * 2) {
        clearInterval(interval);
        setIsSimulating(false);
        return;
      }

      const stopIdx = Math.floor(step / 2);
      const isArrival = step % 2 === 0;
      const stop = busToSimulate.stops[stopIdx];

      if (stop) {
        updateStopStatus(busToSimulate.id, stop.id, isArrival ? 'ARRIVED' : 'DEPARTED');
      }

      step++;
    }, 2500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">

      {/* Admin Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Admin & Fleet Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Campus Bus Fleet Management</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time monitoring, student assignment controls, and automated demonstration simulation.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={runRouteSimulation}
            disabled={isSimulating}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all ${
              isSimulating
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 cursor-wait'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/25'
            }`}
          >
            <Play className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Simulating Route...' : 'Run Automated Bus Simulation'}</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Reset prototype data to default initial state?')) {
                resetAllData();
              }
            }}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700"
            title="Reset System Store"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>

      {/* Live Fleet Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {buses.map((bus) => {
          const currentStop = bus.stops.find((s) => s.id === bus.currentStopId);
          return (
            <div key={bus.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold">
                    <BusIcon className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{bus.number}</h3>
                    <p className="text-xs text-slate-400">{bus.name}</p>
                  </div>
                </div>

                <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border ${
                  bus.status === 'Arrived at Stop'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : bus.status === 'Delayed'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}>
                  {bus.status}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Driver:</span>
                  <strong className="text-slate-200">{bus.driverName}</strong>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Current Location:</span>
                  <strong className="text-blue-400">{currentStop?.name || 'On Route'}</strong>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Passengers:</span>
                  <strong className="text-slate-200">{bus.assignedCount} / {bus.capacity} seats</strong>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4 pt-3 border-t border-slate-800">
                <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                  <span>Route Progress</span>
                  <span>{Math.round(((bus.stops.findIndex(s => s.id === bus.currentStopId) + 1) / bus.stops.length) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-500 h-full transition-all duration-500 rounded-full"
                    style={{
                      width: `${((bus.stops.findIndex(s => s.id === bus.currentStopId) + 1) / bus.stops.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Student Assignment & System Logs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Reassign Student Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center space-x-2 text-purple-400 mb-4">
            <Sliders className="w-5 h-5" />
            <h3 className="text-base font-bold text-white">Student Bus Assignment</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Reassign students to different buses or boarding stops to test notification routing logic.
          </p>

          <form onSubmit={handleReassign} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select Student:</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full bg-slate-950 text-white border border-slate-800 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.rollNo})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Assign to Bus:</label>
              <select
                value={targetBusId}
                onChange={(e) => {
                  setTargetBusId(e.target.value);
                  const b = buses.find((item) => item.id === e.target.value);
                  if (b && b.stops.length > 0) {
                    setTargetStopId(b.stops[0].id);
                  }
                }}
                className="w-full bg-slate-950 text-white border border-slate-800 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                {buses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.number} - {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Boarding Stop:</label>
              <select
                value={targetStopId}
                onChange={(e) => setTargetStopId(e.target.value)}
                className="w-full bg-slate-950 text-white border border-slate-800 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                {selectedBus.stops.map((s) => (
                  <option key={s.id} value={s.id}>
                    Stop {s.sequence}: {s.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md shadow-purple-600/30"
            >
              Update Student Assignment
            </button>
          </form>
        </div>

        {/* System Activity & Notification Dispatch Logs */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center space-x-2 text-purple-400 mb-4">
            <History className="w-5 h-5" />
            <h3 className="text-base font-bold text-white">System Notification Dispatch Log</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Audit log of driver stop actions, status updates, and notification broadcasts.
          </p>

          <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
            {logs.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No system logs recorded yet.</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-400">{log.action}</span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{log.details}</p>
                  <p className="text-[10px] text-slate-500">By: {log.actor}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
