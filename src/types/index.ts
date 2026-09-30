export type UserRole = 'student' | 'driver' | 'admin';

export interface Stop {
  id: string;
  name: string;
  eta: string; // e.g. "07:45 AM" or "10 mins"
  sequence: number;
}

export type BusStatusType = 'On Route' | 'Arrived at Stop' | 'Departed Stop' | 'Delayed' | 'Not Started';

export interface Bus {
  id: string; // e.g., "bus-12"
  number: string; // "Bus 12"
  name: string; // "Electronic City Express"
  route: string; // "Electronic City → College Campus"
  driverName: string;
  driverPhone: string;
  capacity: number;
  assignedCount: number;
  status: BusStatusType;
  currentStopId: string;
  nextStopId: string | null;
  lastUpdated: string; // timestamp ISO or string
  delayReason?: string;
  stops: Stop[];
}

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  busId: string;
  stopId: string; // Student's boarding stop
  department: string;
  phone: string;
  avatar: string;
}

export interface Notification {
  id: string;
  busId: string;
  busNumber: string;
  stopId: string;
  stopName: string;
  type: 'ARRIVED' | 'DEPARTED' | 'DELAYED' | 'ANNOUNCEMENT';
  title: string;
  message: string;
  timestamp: string; // ISO string or human readable
  read: boolean;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  actor: string; // e.g. "Driver (Rajesh)", "Admin"
  action: string;
  details: string;
}
