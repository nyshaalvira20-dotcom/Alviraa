'use client';

import React from 'react';
import { useBus } from '@/context/BusContext';
import {
  Bus as BusIcon,
  MapPin,
  Bell,
  Clock,
  UserCheck,
  Phone,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Trash2,
  ShieldAlert,
  Info,
  Radio
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    activeStudentId,
    setActiveStudentId,
    students,
    buses,
    notifications,
    markNotificationRead,
    clearStudentNotifications
  } = useBus();

  const currentStudent = students.find((s) => s.id === activeStudentId) || students[0];
  const myBus = buses.find((b) => b.id === currentStudent?.busId);

  if (!currentStudent || !myBus) return null;

  // Filter notifications ONLY for student's assigned bus
  const myNotifications = notifications.filter((n) => n.busId === myBus.id);

  const currentStopIndex = myBus.stops.findIndex((s) => s.id === myBus.currentStopId);
  const myBoardingStop = myBus.stops.find((s) => s.id === currentStudent.stopId);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">

      {/* Header Greeting & Profile Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full filter blur-3xl -z-0"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <UserCheck className="w-4 h-4 text-blue-400" />
              <span>Student Passenger Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center space-x-2">
              <span>Good Morning, {currentStudent.name} 👋</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {currentStudent.department} • Roll No: <strong className="text-slate-200">{currentStudent.rollNo}</strong>
            </p>
          </div>

          {/* Student Profile Switcher */}
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 flex items-center space-x-3">
            <span className="text-2xl">{currentStudent.avatar}</span>
            <div className="text-xs">
              <label className="block text-slate-400 font-medium mb-1">Switch Demo Student:</label>
              <select
                value={currentStudent.id}
                onChange={(e) => setActiveStudentId(e.target.value)}
                className="bg-slate-900 text-white font-semibold text-xs rounded-lg border border-slate-700 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {students.map((s) => {
                  const b = buses.find((item) => item.id === s.busId);
                  return (
                    <option key={s.id} value={s.id}>
                      {s.name} ({b?.number || 'Bus'})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: My Bus Card & Notifications Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left 2 Columns: Bus Status Overview & Route Timeline */}
        <div className="lg:col-span-2 space-y-6">

          {/* My Bus Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-lg shadow-inner">
                  <BusIcon className="w-7 h-7 text-blue-400" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs uppercase font-bold text-blue-400 tracking-wider">Assigned Bus</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-slate-400">{myBus.name}</span>
                  </div>
                  <h2 className="text-2xl font-black text-white">{myBus.number}</h2>
                </div>
              </div>

              {/* Status Badge */}
              <div className="text-right">
                <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                  myBus.status === 'Arrived at Stop'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse'
                    : myBus.status === 'Delayed'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    myBus.status === 'Arrived at Stop' ? 'bg-amber-400' : myBus.status === 'Delayed' ? 'bg-rose-400' : 'bg-emerald-400'
                  }`} />
                  <span>{myBus.status}</span>
                </span>
                <p className="text-[10px] text-slate-500 mt-1">Updated {new Date(myBus.lastUpdated).toLocaleTimeString()}</p>
              </div>
            </div>

            {/* Delay Warning Box if delayed */}
            {myBus.delayReason && (
              <div className="mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start space-x-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block text-rose-200">Delay Reported by Driver:</strong>
                  <span>{myBus.delayReason}</span>
                </div>
              </div>
            )}

            {/* Bus Info Details Grid */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 pt-5 border-t border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Route Direction:</span>
                <strong className="text-slate-200 font-medium block truncate">{myBus.route}</strong>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Assigned Driver:</span>
                <strong className="text-slate-200 font-medium flex items-center space-x-1">
                  <span>{myBus.driverName}</span>
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">My Boarding Stop:</span>
                <strong className="text-amber-300 font-semibold block truncate">
                  📍 {myBoardingStop?.name || 'Assigned Stop'}
                </strong>
              </div>
            </div>
          </div>

          {/* Student Route Timeline */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span>Route Timeline & Stop Status</span>
                </h3>
                <p className="text-xs text-slate-400">Live progress of {myBus.number} along its stop trajectory.</p>
              </div>
            </div>

            {/* Timeline List */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
              {myBus.stops.map((stop, index) => {
                const isCurrent = myBus.currentStopId === stop.id;
                const isPast = index < currentStopIndex || (index === currentStopIndex && myBus.status === 'On Route');
                const isMyStop = stop.id === currentStudent.stopId;
                const isArrivedHere = isCurrent && myBus.status === 'Arrived at Stop';

                return (
                  <div key={stop.id} className="relative flex items-start justify-between group">

                    {/* Circle Bullet Marker */}
                    <div className={`absolute -left-6 top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      isArrivedHere
                        ? 'bg-amber-500 border-amber-300 text-slate-950 font-bold text-xs ring-4 ring-amber-500/20 animate-pulse'
                        : isCurrent
                        ? 'bg-blue-600 border-blue-400 ring-4 ring-blue-600/20 text-white'
                        : isPast
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                        : 'bg-slate-900 border-slate-700 text-slate-600'
                    }`}>
                      {isPast ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
                      ) : (
                        <span className="text-[10px] font-bold">{stop.sequence}</span>
                      )}
                    </div>

                    {/* Stop Details */}
                    <div className="pl-3">
                      <div className="flex items-center space-x-2">
                        <span className={`font-bold text-sm ${isArrivedHere ? 'text-amber-300' : isCurrent ? 'text-blue-400' : 'text-slate-200'}`}>
                          {stop.name}
                        </span>

                        {isMyStop && (
                          <span className="text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-full">
                            ★ YOUR BOARDING STOP
                          </span>
                        )}

                        {isArrivedHere && (
                          <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
                            ✓ BUS AT STOP
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 mt-0.5 flex items-center space-x-3">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>ETA: {stop.eta}</span>
                        </span>
                        <span>•</span>
                        <span className={`font-semibold ${
                          isArrivedHere ? 'text-amber-400' : isPast ? 'text-emerald-400' : 'text-slate-500'
                        }`}>
                          {isArrivedHere ? 'Arrived at Stop' : isPast ? 'Completed' : isCurrent ? 'Next Arriving' : 'Upcoming'}
                        </span>
                      </p>
                    </div>

                    <div className="text-right text-xs">
                      <span className="text-slate-500">Stop #{stop.sequence}</span>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right 1 Column: Bus Notifications Panel (STRICTLY ISOLATED TO MY BUS) */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col h-full min-h-[500px]">

            {/* Panel Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Notifications</h3>
                  <p className="text-[11px] text-slate-400">Exclusive alerts for <strong className="text-blue-400">{myBus.number}</strong></p>
                </div>
              </div>

              {myNotifications.length > 0 && (
                <button
                  onClick={() => clearStudentNotifications(myBus.id)}
                  className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Clear All Bus Notifications"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Notification Filtering Notice */}
            <div className="my-3 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-300 flex items-center space-x-2">
              <Info className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Only passengers assigned to <strong>{myBus.number}</strong> view these notifications.</span>
            </div>

            {/* List of Notifications */}
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[550px] pr-1">
              {myNotifications.length === 0 ? (
                <div className="text-center py-12 px-4 space-y-2">
                  <Radio className="w-8 h-8 text-slate-600 mx-auto animate-pulse" />
                  <p className="text-sm font-semibold text-slate-300">No active notifications</p>
                  <p className="text-xs text-slate-500">
                    When the driver of {myBus.number} clicks Arrived or Departed, updates will appear here instantly.
                  </p>
                </div>
              ) : (
                myNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationRead(notif.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      notif.type === 'ARRIVED'
                        ? 'bg-amber-500/10 border-amber-500/30 hover:border-amber-500/50'
                        : notif.type === 'DEPARTED'
                        ? 'bg-blue-500/10 border-blue-500/30 hover:border-blue-500/50'
                        : notif.type === 'DELAYED'
                        ? 'bg-rose-500/10 border-rose-500/30 hover:border-rose-500/50'
                        : 'bg-purple-500/10 border-purple-500/30 hover:border-purple-500/50'
                    } ${!notif.read ? 'ring-1 ring-blue-400/40' : 'opacity-85'}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-base">
                          {notif.type === 'ARRIVED' ? '🔔' : notif.type === 'DEPARTED' ? '🔵' : notif.type === 'DELAYED' ? '⚠️' : '📢'}
                        </span>
                        <h4 className="font-bold text-xs text-white">{notif.title}</h4>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-medium">
                      {notif.message}
                    </p>

                    <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800/60">
                      <span>Stop: <strong>{notif.stopName}</strong></span>
                      {!notif.read && <span className="text-blue-400 font-bold">New</span>}
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
