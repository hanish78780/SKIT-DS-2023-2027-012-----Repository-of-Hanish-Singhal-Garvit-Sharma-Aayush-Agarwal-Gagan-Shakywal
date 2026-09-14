import {
  StudentProfile,
  BusDetails,
  RouteDetails,
  NotificationItem,
  HelpContact,
  FAQItem,
  TrackingLocation,
} from '../types';

export const mockStudent: StudentProfile = {
  id: 'std_012',
  name: 'Aarav Sharma',
  studentId: 'SKIT/2023/CS/012',
  email: 'aarav.sharma@skit.ac.in',
  course: 'B.Tech Computer Science & Engineering',
  year: '3rd Year (6th Sem)',
  college: 'Swami Keshwanand Institute of Technology & Management (SKIT Jaipur)',
  assignedBusNumber: 'RJ-14-AB-1234',
  assignedRouteNumber: 'Route 03',
  pickupStopName: 'Stop 03 - Mansarovar Metro Station',
  pickupTime: '08:00 AM',
};

export const mockDriver = {
  id: 'drv_089',
  name: 'Rajesh Kumar',
  driverId: 'SKIT-DRV-089',
  phone: '+91 98290 12345',
  experienceYears: 8,
  rating: 4.9,
};

export const mockBus: BusDetails = {
  busNumber: 'RJ-14-AB-1234',
  registrationNumber: 'RJ-14-AB-1234',
  capacity: 52,
  busType: 'AC Express Deluxe Coach',
  model: 'Tata Marcopolo Starbus 2024',
  status: 'ON THE WAY',
  assignedRoute: 'Route 03 — Vaishali Nagar to SKIT Campus',
  currentSpeedKmH: 28,
  driver: mockDriver,
  lastUpdated: '10 sec ago',
};

export const mockRoute: RouteDetails = {
  id: 'route_03',
  routeNumber: 'Route 03',
  routeName: 'Vaishali Nagar to SKIT Campus',
  startPoint: 'Vaishali Nagar Depot',
  destination: 'SKIT Main Gate, Ramnagaria',
  totalDistanceKm: 18.5,
  estimatedDurationMins: 45,
  stops: [
    {
      id: 'stop_01',
      stopNumber: 1,
      stopName: 'Vaishali Nagar Depot',
      scheduledTime: '07:30 AM',
      isStudentPickup: false,
      status: 'passed',
      latitude: 26.9124,
      longitude: 75.7433,
    },
    {
      id: 'stop_02',
      stopNumber: 2,
      stopName: 'Queens Road Circle',
      scheduledTime: '07:45 AM',
      isStudentPickup: false,
      status: 'passed',
      latitude: 26.8912,
      longitude: 75.7589,
    },
    {
      id: 'stop_03',
      stopNumber: 3,
      stopName: 'Stop 03 - Mansarovar Metro Station',
      scheduledTime: '08:00 AM',
      isStudentPickup: true,
      status: 'current',
      latitude: 26.8721,
      longitude: 75.7724,
    },
    {
      id: 'stop_04',
      stopNumber: 4,
      stopName: 'Gopalpura Flyover',
      scheduledTime: '08:15 AM',
      isStudentPickup: false,
      status: 'upcoming',
      latitude: 26.8533,
      longitude: 75.7981,
    },
    {
      id: 'stop_05',
      stopNumber: 5,
      stopName: 'Tonk Phatak Circle',
      scheduledTime: '08:25 AM',
      isStudentPickup: false,
      status: 'upcoming',
      latitude: 26.8399,
      longitude: 75.8112,
    },
    {
      id: 'stop_06',
      stopNumber: 6,
      stopName: 'SKIT Main Campus Gate 1',
      scheduledTime: '08:45 AM',
      isStudentPickup: false,
      status: 'upcoming',
      latitude: 26.8219,
      longitude: 75.8456,
    },
  ],
};

export const mockTrackingLocation: TrackingLocation = {
  latitude: 26.8812,
  longitude: 75.7654,
  heading: 135,
  speedKmH: 28,
  lastUpdatedTime: '10 sec ago',
  distanceRemainingKm: 2.4,
  etaMinutes: 8,
};

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif_01',
    title: 'TRIP STARTED',
    message: 'Your assigned bus RJ-14-AB-1234 has started its trip from Vaishali Nagar Depot.',
    timestamp: '07:30 AM Today',
    category: 'Trip',
    isRead: true,
    type: 'success',
  },
  {
    id: 'notif_02',
    title: 'BUS DELAY NOTICE',
    message: 'Route 03 bus is delayed by approximately 5-8 minutes due to traffic near Queens Road.',
    timestamp: '07:48 AM Today',
    category: 'Important',
    isRead: false,
    type: 'warning',
  },
  {
    id: 'notif_03',
    title: 'ROUTE UPDATE',
    message: 'Stop 03 pickup location point updated slightly closer to Metro Gate #2 for student safety.',
    timestamp: 'Yesterday, 05:30 PM',
    category: 'Route',
    isRead: true,
    type: 'info',
  },
  {
    id: 'notif_04',
    title: 'TRANSPORTATION FEE RECEIPT',
    message: 'Semester 6 bus transportation pass confirmed for SKIT Campus access.',
    timestamp: '3 days ago',
    category: 'All',
    isRead: true,
    type: 'info',
  },
];

export const mockHelpContacts: HelpContact[] = [
  {
    id: 'contact_01',
    title: 'Transport Helpline Desk',
    department: 'SKIT Transport Department',
    phone: '+91 141 5160400',
    email: 'transport@skit.ac.in',
    availableHours: '07:00 AM - 07:00 PM (Mon-Sat)',
  },
  {
    id: 'contact_02',
    title: 'Transport Incharge Officer',
    department: 'Mr. R.S. Sharma',
    phone: '+91 94140 76543',
    email: 'rs.sharma@skit.ac.in',
    availableHours: '08:00 AM - 05:00 PM',
  },
  {
    id: 'contact_03',
    title: 'College Emergency Control Room',
    department: 'SKIT Campus Security & First Aid',
    phone: '+91 141 2752165',
    email: 'emergency@skit.ac.in',
    availableHours: '24/7 Helpline',
  },
];

export const mockFAQs: FAQItem[] = [
  {
    id: 'faq_01',
    question: 'How do I track my assigned bus in real-time?',
    answer: 'Navigate to the "Track Bus" tab from the home dashboard. The map displays your live bus position, speed, remaining distance, and updated ETA.',
  },
  {
    id: 'faq_02',
    question: 'What should I do if the bus passes my stop early?',
    answer: 'Students are advised to arrive 5 minutes prior to scheduled pickup time. If you miss your bus, contact the Transport Helpline immediately via the Help & Safety screen.',
  },
  {
    id: 'faq_03',
    question: 'How do I report a transport issue or driver behavior?',
    answer: 'Go to "Report Issue" in your dashboard or menu. Select the category (e.g., Bus Delay, Driver Issue, Bus Condition), describe the problem, and submit. The transport office will review your ticket.',
  },
  {
    id: 'faq_04',
    question: 'Can I temporarily change my pickup stop?',
    answer: 'Route or stop changes require prior approval from the SKIT Transport Office. Please submit a written request or visit the transport desk in Campus Block A.',
  },
];
