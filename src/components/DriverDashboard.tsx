'use client';

import React, { useState } from 'react';
import { useBus } from '@/context/BusContext';
import {
  Bus as BusIcon,
  MapPin,
  CheckCircle2,
  Send,
  AlertTriangle,
  Clock,
  Users,
  PhoneCall,
  Radio,
  Navigation,
  ChevronRight,
  Info
} from 'lucide-react';

export const DriverDashboard: React.FC = () => {
  const {
    buses,
    activeDriverBusId,
    setActiveDriverBusId,
    updateStopStatus,
    reportDelay,
    broadcastAlert
  } = useBus();

  const [delayReason, setDelayReason] = useState('');
  const [showDelayModal, setShowDelayModal] = useState(false);
  const [announcementText, setAnnouncementText] = useState('');
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  const activeBus = buses.find((b) => b.id === activeDriverBusId) || buses[0];

  if (!activeBus) return null;

  const currentStopIndex = activeBus.stops.findIndex((s) => s.id === activeBus.currentStopId);

  const handleArrived = (stopId: string) => {
    updateStopStatus(activeBus.id, stopId, 'ARRIVED');
  };

  const handleDeparted = (stopId: string) => {
    updateStopStatus(activeBus.id, stopId, 'DEPARTED');
  };

  const handleSendDelay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!delayReason.trim()) return;
    reportDelay(activeBus.id, delayReason.trim());
    setDelayReason('');
    setShowDelayModal(false);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    broadcastAlert(activeBus.id, announcementText.trim());
    setAnnouncementText('');
    setShowBroadcastModal(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">

      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full filter blur-3xl -z-0"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Radio className="w-4 h-4 animate-pulse text-emerald-400" />
              <span>Driver Console & Dispatcher</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center space-x-3">
              <span>{activeBus.number} Console</span>
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                activeBus.status === 'Arrived at Stop'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : activeBus.status === 'Delayed'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}>
                {activeBus.status}
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-1 flex items-center space-x-2">
              <span>Route: {activeBus.route}</span>
              <span>•</span>
              <span>Driver: {activeBus.driverName}</span>
            </p>
          </div>

          {/* Switch Active Bus */}
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 flex items-center space-x-3">
            <BusIcon className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-xs">
              <label className="block text-slate-400 font-medium mb-1">Select Bus Vehicle:</label>
              <select
                value={activeBus.id}
                onChange={(e) => setActiveDriverBusId(e.target.value)}
                className="bg-slate-900 text-white font-semibold text-xs rounded-lg border border-slate-700 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {buses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.number} - {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Quick Driver Action Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowDelayModal(true)}
            className="flex items-center space-x-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all"
          >
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Report Traffic / Delay</span>
          </button>

          <button
            onClick={() => setShowBroadcastModal(true)}
            className="flex items-center space-x-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all"
          >
            <Send className="w-4 h-4 text-blue-400" />
            <span>Broadcast Message to Students</span>
          </button>

          <div className="ml-auto text-xs text-slate-400 flex items-center space-x-1">
            <Users className="w-4 h-4 text-slate-500" />
            <span>Assigned Passengers: <strong className="text-white">{activeBus.assignedCount} / {activeBus.capacity}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Bus Stops Control Workflow */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Navigation className="w-5 h-5 text-emerald-400" />
              <span>Route Stop Controls</span>
            </h2>
            <p className="text-xs text-slate-400">
              Click <strong className="text-amber-400">ARRIVED</strong> when reaching a stop, and <strong className="text-emerald-400">DEPARTED</strong> when leaving.
            </p>
          </div>
          <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
            {activeBus.stops.length} Total Stops
          </span>
        </div>

        {/* Vertical Timeline / Cards */}
        <div className="space-y-4">
          {activeBus.stops.map((stop, index) => {
            const isCurrent = activeBus.currentStopId === stop.id;
            const isPast = index < currentStopIndex || (index === currentStopIndex && activeBus.status === 'On Route');
            const isUpcoming = index > currentStopIndex;
            const isArrivedHere = isCurrent && activeBus.status === 'Arrived at Stop';

            return (
              <div
                key={stop.id}
                className={`relative rounded-xl p-4 sm:p-5 transition-all border ${
                  isArrivedHere
                    ? 'bg-amber-500/10 border-amber-500/40 shadow-lg shadow-amber-500/5'
                    : isCurrent
                    ? 'bg-slate-800/90 border-blue-500/50 shadow-md ring-1 ring-blue-500/30'
                    : isPast
                    ? 'bg-slate-900/50 border-slate-800 opacity-75'
                    : 'bg-slate-900/80 border-slate-800/80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                  {/* Stop Name & Status Indicator */}
                  <div className="flex items-start space-x-3.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 ${
                      isArrivedHere
                        ? 'bg-amber-500 text-slate-950 font-extrabold animate-bounce'
                        : isCurrent
                        ? 'bg-blue-600 text-white'
                        : isPast
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {isPast ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : stop.sequence}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-base text-white">{stop.name}</h3>
                        {isArrivedHere && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
                            BUS ARRIVED HERE
                          </span>
                        )}
                        {isCurrent && !isArrivedHere && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-full">
                            CURRENT STOP
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center space-x-2">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>Scheduled ETA: <strong>{stop.eta}</strong></span>
                      </p>
                    </div>
                  </div>

                  {/* Primary Action Buttons: ARRIVED / DEPARTED */}
                  <div className="flex items-center space-x-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                    <button
                      onClick={() => handleArrived(stop.id)}
                      disabled={isArrivedHere}
                      className={`flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
                        isArrivedHere
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 cursor-not-allowed opacity-60'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 active:scale-95'
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                      <span>ARRIVED</span>
                    </button>

                    <button
                      onClick={() => handleDeparted(stop.id)}
                      className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md shadow-emerald-600/20 active:scale-95"
                    >
                      <ChevronRight className="w-4 h-4" />
                      <span>DEPARTED</span>
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Report Delay Modal */}
      {showDelayModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-rose-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">Report Traffic / Delay</h3>
            </div>
            <p className="text-xs text-slate-400">
              Notify students assigned to <strong>{activeBus.number}</strong> about potential delay details.
            </p>

            <form onSubmit={handleSendDelay} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Reason for Delay:</label>
                <select
                  value={delayReason}
                  onChange={(e) => setDelayReason(e.target.value)}
                  className="w-full bg-slate-950 text-white border border-slate-800 rounded-xl p-2.5 text-xs mb-2 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                >
                  <option value="">-- Select or type custom reason --</option>
                  <option value="Heavy Traffic Junction Jam">Heavy Traffic Junction Jam (15-20 min)</option>
                  <option value="Engine Inspection & Tire Check">Engine Inspection & Tire Check (10 min)</option>
                  <option value="Road Diversion near Flyover">Road Diversion near Flyover (15 min)</option>
                  <option value="Weather / Heavy Rain Slowdown">Weather / Heavy Rain Slowdown (20 min)</option>
                </select>

                <input
                  type="text"
                  placeholder="Or enter custom delay description..."
                  value={delayReason}
                  onChange={(e) => setDelayReason(e.target.value)}
                  className="w-full bg-slate-950 text-white border border-slate-800 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDelayModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30"
                >
                  Dispatch Delay Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Broadcast Announcement Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-blue-400">
              <Send className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">Broadcast Announcement</h3>
            </div>
            <p className="text-xs text-slate-400">
              Send a direct operational announcement to passengers on <strong>{activeBus.number}</strong>.
            </p>

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <textarea
                rows={3}
                placeholder="e.g. Please be ready at stop. Bus is operating on normal schedule."
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className="w-full bg-slate-950 text-white border border-slate-800 rounded-xl p-3 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30"
                >
                  Broadcast Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
