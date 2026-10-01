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

// ─── GPS / Location Types ────────────────────────────────────────────────────

/**
 * Represents all possible states of the foreground GPS service.
 *
 * idle               – GPS not yet requested
 * requesting_permission – permission dialog is open
 * permission_denied  – user denied once (can still ask again)
 * permission_blocked – user selected "Don't ask again"
 * location_unavailable – permission granted but device GPS is off
 * acquiring_location – waiting for the first fix
 * tracking           – actively receiving location updates
 * error              – unexpected error from the location provider
 */
export type LocationStatus =
  | 'idle'
  | 'requesting_permission'
  | 'permission_denied'
  | 'permission_blocked'
  | 'location_unavailable'
  | 'acquiring_location'
  | 'tracking'
  | 'error';

/** Raw WGS-84 coordinates returned by the GPS hardware. */
export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;       // metres
  altitude: number | null;
  heading: number | null; // degrees from north
  speed: number | null;   // m/s
  timestamp: number;      // Unix ms
}

/** The complete GPS state kept in the Navigator / AppNavigator. */
export interface LocationState {
  status: LocationStatus;
  coordinates: LocationCoordinates | null;
  errorMessage: string | null;
}
