export type TripState = 'NOT_STARTED' | 'TRIP_STARTED';

export interface DriverInfo {
  id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  avatarUrl?: string;
  status: 'ON_DUTY' | 'OFF_DUTY';
}

export interface BusInfo {
  id: string;
  busNumber: string;
  model: string;
  capacity: number;
  type: string;
  busTag: string;
}

export interface RouteStop {
  id: string;
  stopName: string;
  time: string;
  stopOrder: number;
  studentsCount: number;
  isCompleted?: boolean;
}

export interface RouteInfo {
  id: string;
  routeName: string;
  startLocation: string;
  endLocation: string;
  pickupTime: string;
  shift: string;
  totalStops: number;
  stops: RouteStop[];
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  stopName: string;
  stopId: string;
  pickupTime: string;
  status: 'BOARDED' | 'WAITING';
  phone?: string;
}

export interface DriverNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'ROUTE' | 'SCHEDULE' | 'SYSTEM' | 'MAINTENANCE';
}

export interface TripMetrics {
  durationMinutes: number;
  distanceKm: number;
  currentSpeedKmh: number;
  studentsPickedUp: number;
  totalStudents: number;
  completedStops: number;
  currentLocationName: string;
}
