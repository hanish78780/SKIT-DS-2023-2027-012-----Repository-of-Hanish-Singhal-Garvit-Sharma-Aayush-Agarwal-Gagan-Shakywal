import {
  BusInfo,
  DriverInfo,
  DriverNotification,
  RouteInfo,
  Student,
  TripMetrics,
} from '../types/driver';

export const mockDriver: DriverInfo = {
  id: 'DRV-001',
  name: 'Rajesh Kumar',
  phone: '+91 98290 12345',
  licenseNumber: 'RJ-14-2018-0098231',
  status: 'ON_DUTY',
};

export const mockBus: BusInfo = {
  id: 'BUS-12',
  busNumber: 'RJ-14-AB-1234',
  model: 'Tata Starbus 52-Seater',
  capacity: 52,
  type: 'AC Deluxe Campus Express',
  busTag: 'Bus #12',
};

export const mockRoute: RouteInfo = {
  id: 'RT-01',
  routeName: 'SKIT Campus → Jaipur',
  startLocation: 'SKIT Campus (Ramnagaria)',
  endLocation: 'Jaipur Main Bus Stand (Sindhi Camp)',
  pickupTime: '07:30 AM',
  shift: 'Morning Campus Express',
  totalStops: 8,
  stops: [
    {id: 'ST-01', stopName: 'SKIT Main Gate', time: '07:30 AM', stopOrder: 1, studentsCount: 4, isCompleted: true},
    {id: 'ST-02', stopName: 'Jagatpura Railway Overbridge', time: '07:42 AM', stopOrder: 2, studentsCount: 6, isCompleted: true},
    {id: 'ST-03', stopName: 'Malviya Nagar SNG Plaza', time: '07:55 AM', stopOrder: 3, studentsCount: 8, isCompleted: false},
    {id: 'ST-04', stopName: 'GT Central Mall Circle', time: '08:08 AM', stopOrder: 4, studentsCount: 5, isCompleted: false},
    {id: 'ST-05', stopName: 'Apex Circle Malviya Nagar', time: '08:18 AM', stopOrder: 5, studentsCount: 4, isCompleted: false},
    {id: 'ST-06', stopName: 'Tonk Phatak Overbridge', time: '08:28 AM', stopOrder: 6, studentsCount: 3, isCompleted: false},
    {id: 'ST-07', stopName: 'SMS Hospital Crossing', time: '08:38 AM', stopOrder: 7, studentsCount: 2, isCompleted: false},
    {id: 'ST-08', stopName: 'Jaipur Main Bus Stand', time: '08:50 AM', stopOrder: 8, studentsCount: 0, isCompleted: false},
  ],
};

export const mockStudents: Student[] = [
  {
    id: 'STD-101',
    name: 'Aarav Sharma',
    rollNumber: '23ESKCS012',
    stopName: 'Malviya Nagar SNG Plaza',
    stopId: 'ST-03',
    pickupTime: '07:55 AM',
    status: 'WAITING',
    phone: '+91 98765 43210',
  },
  {
    id: 'STD-102',
    name: 'Ananya Gupta',
    rollNumber: '23ESKEC045',
    stopName: 'Malviya Nagar SNG Plaza',
    stopId: 'ST-03',
    pickupTime: '07:55 AM',
    status: 'BOARDED',
    phone: '+91 98765 43211',
  },
  {
    id: 'STD-103',
    name: 'Vikramaditya Singh',
    rollNumber: '23ESKME088',
    stopName: 'GT Central Mall Circle',
    stopId: 'ST-04',
    pickupTime: '08:08 AM',
    status: 'WAITING',
    phone: '+91 98765 43212',
  },
  {
    id: 'STD-104',
    name: 'Priya Sharma',
    rollNumber: '23ESKIT104',
    stopName: 'Apex Circle Malviya Nagar',
    stopId: 'ST-05',
    pickupTime: '08:18 AM',
    status: 'BOARDED',
    phone: '+91 98765 43213',
  },
  {
    id: 'STD-105',
    name: 'Rohan Meena',
    rollNumber: '23ESKCE031',
    stopName: 'SKIT Main Gate',
    stopId: 'ST-01',
    pickupTime: '07:30 AM',
    status: 'BOARDED',
    phone: '+91 98765 43214',
  },
  {
    id: 'STD-106',
    name: 'Sneha Agarwal',
    rollNumber: '23ESKAI019',
    stopName: 'Jagatpura Railway Overbridge',
    stopId: 'ST-02',
    pickupTime: '07:42 AM',
    status: 'BOARDED',
    phone: '+91 98765 43215',
  },
];

export const mockNotifications: DriverNotification[] = [
  {
    id: 'NT-01',
    title: 'Temporary Route Modification',
    message: 'Stop 4 (GT Central) temporarily shifted to GT Circle due to road maintenance.',
    timestamp: '10 mins ago',
    read: false,
    type: 'ROUTE',
  },
  {
    id: 'NT-02',
    title: 'Evening Return Schedule',
    message: 'Evening return trip departure moved to 05:15 PM today for college seminar.',
    timestamp: '1 hour ago',
    read: false,
    type: 'SCHEDULE',
  },
  {
    id: 'NT-03',
    title: 'Monthly Inspection Due',
    message: 'Bus RJ-14-AB-1234 scheduled for monthly safety inspection on Saturday.',
    timestamp: 'Yesterday',
    read: true,
    type: 'MAINTENANCE',
  },
  {
    id: 'NT-04',
    title: 'UniTransit Driver Portal Update',
    message: 'UniTransit Driver Portal updated to v1.2.0 with enhanced trip summary analytics.',
    timestamp: '2 days ago',
    read: true,
    type: 'SYSTEM',
  },
];

export const mockTripMetrics: TripMetrics = {
  durationMinutes: 24,
  distanceKm: 12.4,
  currentSpeedKmh: 38,
  studentsPickedUp: 28,
  totalStudents: 32,
  completedStops: 2,
  currentLocationName: 'Near Jagatpura Flyover (Heading to Malviya Nagar)',
};
