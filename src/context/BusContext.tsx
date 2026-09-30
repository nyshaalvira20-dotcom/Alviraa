'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Bus, Student, Notification, SystemLog, UserRole, BusStatusType } from '@/types';
import { INITIAL_BUSES, INITIAL_STUDENTS, INITIAL_NOTIFICATIONS, INITIAL_LOGS } from '@/data/mockData';

interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'ARRIVED' | 'DEPARTED' | 'DELAYED' | 'ANNOUNCEMENT';
  busNumber: string;
}

interface BusContextType {
  role: UserRole | null;
  setRole: (role: UserRole | null) => void;
  activeStudentId: string;
  setActiveStudentId: (id: string) => void;
  activeDriverBusId: string;
  setActiveDriverBusId: (id: string) => void;
  buses: Bus[];
  students: Student[];
  notifications: Notification[];
  logs: SystemLog[];
  activeToast: ToastMessage | null;
  dismissToast: () => void;
  // Driver Actions
  updateStopStatus: (busId: string, stopId: string, action: 'ARRIVED' | 'DEPARTED') => void;
  reportDelay: (busId: string, reason: string) => void;
  broadcastAlert: (busId: string, message: string) => void;
  // Student Actions
  markNotificationRead: (notificationId: string) => void;
  clearStudentNotifications: (studentBusId: string) => void;
  // Admin Actions
  assignStudentToBus: (studentId: string, newBusId: string, newStopId: string) => void;
  resetAllData: () => void;
  // Helper getters
  getStudentBus: (studentBusId: string) => Bus | undefined;
  getStudentNotifications: (studentBusId: string) => Notification[];
}

const STORAGE_KEYS = {
  BUSES: 'busnotify_buses_v1',
  STUDENTS: 'busnotify_students_v1',
  NOTIFICATIONS: 'busnotify_notifications_v1',
  LOGS: 'busnotify_logs_v1',
  ROLE: 'busnotify_role_v1',
  STUDENT_ID: 'busnotify_active_student_v1',
  DRIVER_BUS_ID: 'busnotify_active_driver_bus_v1',
};

const BusContext = createContext<BusContextType | undefined>(undefined);

export const BusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole | null>(null);
  const [activeStudentId, setActiveStudentIdState] = useState<string>('std-101');
  const [activeDriverBusId, setActiveDriverBusIdState] = useState<string>('bus-12');

  const [buses, setBuses] = useState<Bus[]>(INITIAL_BUSES);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [logs, setLogs] = useState<SystemLog[]>(INITIAL_LOGS);
  const [activeToast, setActiveToast] = useState<ToastMessage | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load initial data from localStorage
  useEffect(() => {
    try {
      const savedRole = localStorage.getItem(STORAGE_KEYS.ROLE);
      if (savedRole) setRoleState(savedRole as UserRole);

      const savedStudentId = localStorage.getItem(STORAGE_KEYS.STUDENT_ID);
      if (savedStudentId) setActiveStudentIdState(savedStudentId);

      const savedDriverBusId = localStorage.getItem(STORAGE_KEYS.DRIVER_BUS_ID);
      if (savedDriverBusId) setActiveDriverBusIdState(savedDriverBusId);

      const savedBuses = localStorage.getItem(STORAGE_KEYS.BUSES);
      if (savedBuses) setBuses(JSON.parse(savedBuses));

      const savedStudents = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (savedStudents) setStudents(JSON.parse(savedStudents));

      const savedNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (savedNotifs) setNotifications(JSON.parse(savedNotifs));

      const savedLogs = localStorage.getItem(STORAGE_KEYS.LOGS);
      if (savedLogs) setLogs(JSON.parse(savedLogs));
    } catch (e) {
      console.error('Failed to load local storage', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEYS.BUSES, JSON.stringify(buses));
    } catch (e) { console.error(e); }
  }, [buses, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) { console.error(e); }
  }, [notifications, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
    } catch (e) { console.error(e); }
  }, [logs, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    } catch (e) { console.error(e); }
  }, [students, isInitialized]);

  const setRole = (newRole: UserRole | null) => {
    setRoleState(newRole);
    if (newRole) localStorage.setItem(STORAGE_KEYS.ROLE, newRole);
    else localStorage.removeItem(STORAGE_KEYS.ROLE);
  };

  const setActiveStudentId = (id: string) => {
    setActiveStudentIdState(id);
    localStorage.setItem(STORAGE_KEYS.STUDENT_ID, id);
  };

  const setActiveDriverBusId = (id: string) => {
    setActiveDriverBusIdState(id);
    localStorage.setItem(STORAGE_KEYS.DRIVER_BUS_ID, id);
  };

  const dismissToast = () => setActiveToast(null);

  const addLog = useCallback((actor: string, action: string, details: string) => {
    const newLog: SystemLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      actor,
      action,
      details,
    };
    setLogs((prev) => [newLog, ...prev]);
  }, []);

  // DRIVER ACTION: ARRIVED / DEPARTED
  const updateStopStatus = useCallback((busId: string, stopId: string, action: 'ARRIVED' | 'DEPARTED') => {
    setBuses((prevBuses) => {
      return prevBuses.map((bus) => {
        if (bus.id !== busId) return bus;

        const currentStop = bus.stops.find((s) => s.id === stopId);
        if (!currentStop) return bus;

        let updatedStatus: BusStatusType = bus.status;
        let newCurrentStopId = bus.currentStopId;
        let newNextStopId = bus.nextStopId;

        const stopIndex = bus.stops.findIndex((s) => s.id === stopId);

        if (action === 'ARRIVED') {
          updatedStatus = 'Arrived at Stop';
          newCurrentStopId = stopId;
          newNextStopId = bus.stops[stopIndex + 1]?.id || null;
        } else if (action === 'DEPARTED') {
          updatedStatus = 'On Route';
          newCurrentStopId = stopId;
          newNextStopId = bus.stops[stopIndex + 1]?.id || null;
        }

        const title = action === 'ARRIVED' ? '🔔 Bus Arrived' : '🔵 Bus Departed';
        const message = action === 'ARRIVED'
          ? `${bus.number} has arrived at ${currentStop.name}.`
          : `${bus.number} has departed from ${currentStop.name}.`;

        // Create new notification
        const newNotif: Notification = {
          id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
          busId: bus.id,
          busNumber: bus.number,
          stopId: currentStop.id,
          stopName: currentStop.name,
          type: action,
          title,
          message,
          timestamp: new Date().toISOString(),
          read: false,
        };

        setNotifications((prevNotifs) => [newNotif, ...prevNotifs]);

        // Trigger toast notification
        setActiveToast({
          id: 'toast-' + Date.now(),
          title,
          message,
          type: action,
          busNumber: bus.number,
        });

        addLog(
          `Driver (${bus.driverName})`,
          `Stop ${action === 'ARRIVED' ? 'Arrival' : 'Departure'}`,
          `Updated ${bus.number} at ${currentStop.name}. Notification dispatched to assigned students.`
        );

        return {
          ...bus,
          status: updatedStatus,
          currentStopId: newCurrentStopId,
          nextStopId: newNextStopId,
          lastUpdated: new Date().toISOString(),
          delayReason: undefined,
        };
      });
    });
  }, [addLog]);

  // DRIVER ACTION: Report Delay
  const reportDelay = useCallback((busId: string, reason: string) => {
    setBuses((prevBuses) => {
      return prevBuses.map((bus) => {
        if (bus.id !== busId) return bus;

        const newNotif: Notification = {
          id: 'notif-' + Date.now(),
          busId: bus.id,
          busNumber: bus.number,
          stopId: bus.currentStopId,
          stopName: bus.stops.find((s) => s.id === bus.currentStopId)?.name || 'En Route',
          type: 'DELAYED',
          title: '⚠️ Delay Alert',
          message: `${bus.number} is delayed. Reason: ${reason}`,
          timestamp: new Date().toISOString(),
          read: false,
        };

        setNotifications((prevNotifs) => [newNotif, ...prevNotifs]);

        setActiveToast({
          id: 'toast-' + Date.now(),
          title: '⚠️ Delay Alert',
          message: `${bus.number} delayed: ${reason}`,
          type: 'DELAYED',
          busNumber: bus.number,
        });

        addLog(`Driver (${bus.driverName})`, 'Delay Reported', `${bus.number} reported delay: ${reason}`);

        return {
          ...bus,
          status: 'Delayed',
          delayReason: reason,
          lastUpdated: new Date().toISOString(),
        };
      });
    });
  }, [addLog]);

  // DRIVER ACTION: Broadcast Alert
  const broadcastAlert = useCallback((busId: string, message: string) => {
    const bus = buses.find((b) => b.id === busId);
    if (!bus) return;

    const newNotif: Notification = {
      id: 'notif-' + Date.now(),
      busId: bus.id,
      busNumber: bus.number,
      stopId: bus.currentStopId,
      stopName: 'Driver Announcement',
      type: 'ANNOUNCEMENT',
      title: '📢 Driver Announcement',
      message: `${bus.number} Driver: ${message}`,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setNotifications((prev) => [newNotif, ...prev]);

    setActiveToast({
      id: 'toast-' + Date.now(),
      title: '📢 Driver Announcement',
      message,
      type: 'ANNOUNCEMENT',
      busNumber: bus.number,
    });

    addLog(`Driver (${bus.driverName})`, 'Broadcast Alert', `Announcement to ${bus.number} passengers: "${message}"`);
  }, [buses, addLog]);

  // STUDENT ACTIONS
  const markNotificationRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  const clearStudentNotifications = (studentBusId: string) => {
    setNotifications((prev) => prev.filter((n) => n.busId !== studentBusId));
  };

  // ADMIN ACTIONS
  const assignStudentToBus = (studentId: string, newBusId: string, newStopId: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        return { ...s, busId: newBusId, stopId: newStopId };
      })
    );

    const student = students.find((s) => s.id === studentId);
    const bus = buses.find((b) => b.id === newBusId);
    addLog('Admin', 'Student Bus Reassigned', `Assigned ${student?.name || studentId} to ${bus?.number || newBusId}`);
  };

  const resetAllData = () => {
    setBuses(INITIAL_BUSES);
    setStudents(INITIAL_STUDENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setLogs(INITIAL_LOGS);
    localStorage.removeItem(STORAGE_KEYS.BUSES);
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.LOGS);
    addLog('Admin', 'Reset Data', 'Reset all system data to initial realistic default state.');
  };

  // HELPERS
  const getStudentBus = (studentBusId: string) => {
    return buses.find((b) => b.id === studentBusId);
  };

  const getStudentNotifications = (studentBusId: string) => {
    return notifications.filter((n) => n.busId === studentBusId);
  };

  return (
    <BusContext.Provider
      value={{
        role,
        setRole,
        activeStudentId,
        setActiveStudentId,
        activeDriverBusId,
        setActiveDriverBusId,
        buses,
        students,
        notifications,
        logs,
        activeToast,
        dismissToast,
        updateStopStatus,
        reportDelay,
        broadcastAlert,
        markNotificationRead,
        clearStudentNotifications,
        assignStudentToBus,
        resetAllData,
        getStudentBus,
        getStudentNotifications,
      }}
    >
      {children}
    </BusContext.Provider>
  );
};

export const useBus = () => {
  const context = useContext(BusContext);
  if (!context) {
    throw new Error('useBus must be used within a BusProvider');
  }
  return context;
};
