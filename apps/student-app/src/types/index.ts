export type TripStatusType =
  | 'SCHEDULED'
  | 'BUS STARTED'
  | 'ON THE WAY'
  | 'ARRIVING'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DELAYED'
  | 'OFFLINE'
  | 'GPS UNAVAILABLE';

export interface StudentProfile {
  id: string;
  name: string;
  studentId: string;
  email: string;
  course: string;
  year: string;
  college: string;
  assignedBusNumber: string;
  assignedRouteNumber: string;
  pickupStopName: string;
  pickupTime: string;
  avatarUrl?: string;
}

export interface DriverInfo {
  id: string;
  name: string;
  driverId: string;
  phone: string;
  experienceYears: number;
  rating: number;
}

export interface BusDetails {
  busNumber: string;
  registrationNumber: string;
  capacity: number;
  busType: string;
  model: string;
  status: TripStatusType;
  assignedRoute: string;
  currentSpeedKmH: number;
  driver: DriverInfo;
  lastUpdated: string;
}

export interface RouteStop {
  id: string;
  stopNumber: number;
  stopName: string;
  scheduledTime: string;
  isStudentPickup: boolean;
  status: 'passed' | 'current' | 'upcoming';
  latitude: number;
  longitude: number;
}

export interface RouteDetails {
  id: string;
  routeNumber: string;
  routeName: string;
  startPoint: string;
  destination: string;
  totalDistanceKm: number;
  estimatedDurationMins: number;
  stops: RouteStop[];
}

export interface TrackingLocation {
  latitude: number;
  longitude: number;
  heading: number;
  speedKmH: number;
  lastUpdatedTime: string;
  distanceRemainingKm: number;
  etaMinutes: number;
}

export type NotificationCategory = 'All' | 'Important' | 'Route' | 'Trip';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  category: NotificationCategory;
  isRead: boolean;
  type?: 'warning' | 'info' | 'success' | 'alert';
}

export type IssueCategory =
  | 'Bus Delay'
  | 'Bus Not Arrived'
  | 'Wrong Route'
  | 'Driver Issue'
  | 'Bus Condition'
  | 'Other';

export interface IssueReportPayload {
  category: IssueCategory;
  description: string;
  busNumber: string;
  routeNumber: string;
  studentId: string;
  timestamp: string;
}

export interface HelpContact {
  id: string;
  title: string;
  department: string;
  phone: string;
  email: string;
  availableHours: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}
