import { useState, useEffect } from 'react';
import TransportContext from './TransportContext';

const initialDrivers = [
  { id: 'DRV-001', name: 'Rajesh Kumar', initial: 'R', phone: '98765 43210', bus: 'RJ-14-AB-1234', route: 'Route 03', trip: 'TRIP-1024', status: 'Online', license: 'RJ14-2018-0912' },
  { id: 'DRV-002', name: 'Suresh Meena', initial: 'S', phone: '97654 32109', bus: 'RJ-14-AB-1088', route: 'Route 01', trip: 'TRIP-1022', status: 'Online', license: 'RJ14-2019-4410' },
  { id: 'DRV-003', name: 'Mohan Sharma', initial: 'M', phone: '96543 21098', bus: 'RJ-14-AB-2231', route: 'Route 02', trip: '—', status: 'Available', license: 'RJ14-2021-1289' },
  { id: 'DRV-004', name: 'Dinesh Yadav', initial: 'D', phone: '95432 10987', bus: 'RJ-14-AB-4512', route: 'Route 04', trip: 'TRIP-1026', status: 'Online', license: 'RJ14-2017-7731' },
  { id: 'DRV-005', name: 'Ramesh Verma', initial: 'R', phone: '94321 09876', bus: '—', route: '—', trip: '—', status: 'On Leave', license: 'RJ14-2020-5623' },
];

const initialBuses = [
  { id: 'RJ-14-AB-1234', regNo: 'RJ14-2021-9981', type: 'AC', capacity: '40 seats', driver: 'Rajesh Kumar', route: 'Route 03', status: 'Active', fitnessDate: '15 Nov 2027' },
  { id: 'RJ-14-AB-1088', regNo: 'RJ14-2019-3312', type: 'Non-AC', capacity: '52 seats', driver: 'Suresh Meena', route: 'Route 01', status: 'Active', fitnessDate: '04 Aug 2026' },
  { id: 'RJ-14-AB-2231', regNo: 'RJ14-2022-7744', type: 'AC', capacity: '40 seats', driver: 'Mohan Sharma', route: 'Route 02', status: 'Maintenance', fitnessDate: '21 Jan 2027' },
  { id: 'RJ-14-AB-4512', regNo: 'RJ14-2018-1120', type: 'Non-AC', capacity: '52 seats', driver: 'Unassigned', route: '—', status: 'Inactive', fitnessDate: '10 Dec 2025' },
  { id: 'RJ-14-AB-5501', regNo: 'RJ14-2023-5561', type: 'AC', capacity: '36 seats', driver: 'Dinesh Yadav', route: 'Route 04', status: 'Active', fitnessDate: '30 Mar 2028' },
];

const initialStudents = [
  { id: '23CSE101', name: 'Aarav Sharma', initial: 'A', course: 'B.Tech CSE', year: '3rd Year', stop: 'Stop 03', route: 'Route 03', bus: 'RJ-14-AB-1234', status: 'Active' },
  { id: '23CSE204', name: 'Priya Verma', initial: 'P', course: 'B.Tech CSE', year: '3rd Year', stop: 'Stop 02', route: 'Route 03', bus: 'RJ-14-AB-1234', status: 'Active' },
  { id: '23ME105', name: 'Rahul Singh', initial: 'R', course: 'B.Tech ME', year: '2nd Year', stop: 'Stop 05', route: 'Route 01', bus: 'RJ-14-AB-1088', status: 'Active' },
  { id: '23EE302', name: 'Neha Gupta', initial: 'N', course: 'B.Tech EE', year: '3rd Year', stop: 'Stop 01', route: 'Route 02', bus: '—', status: 'Unassigned' },
  { id: '23CE201', name: 'Arjun Mehta', initial: 'A', course: 'B.Tech CE', year: '1st Year', stop: 'Stop 04', route: 'Route 04', bus: 'RJ-14-AB-4512', status: 'Active' },
];

const initialTrips = [
  { id: 'TRIP-1024', bus: 'RJ-14-AB-1234', driver: 'Rajesh Kumar', phone: '98765 43210', route: 'Route 03 (SKIT → Jaipur)', students: 42, startTime: '08:00 AM', status: 'Active', speed: '38 km/h', eta: '12 mins', nextStop: 'Tonk Phatak' },
  { id: 'TRIP-1023', bus: 'RJ-14-AB-1088', driver: 'Suresh Meena', phone: '97654 32109', route: 'Route 01 (SKIT → Tonk Rd)', students: 38, startTime: '08:05 AM', status: 'Active', speed: '42 km/h', eta: '18 mins', nextStop: 'Gopalpura' },
  { id: 'TRIP-1022', bus: 'RJ-14-AB-4512', driver: 'Dinesh Yadav', phone: '95432 10987', route: 'Route 04 (SKIT → Mansarovar)', students: 31, startTime: '07:55 AM', status: 'Completed', speed: '0 km/h', eta: 'Arrived', nextStop: 'Trip Completed' },
  { id: 'TRIP-1021', bus: 'RJ-14-AB-1088', driver: 'Suresh Meena', phone: '97654 32109', route: 'Route 01 (SKIT → Vaishali)', students: 44, startTime: '07:45 AM', status: 'Delayed', speed: '24 km/h', eta: '25 mins', nextStop: 'Ajmer Flyover' },
  { id: 'TRIP-1020', bus: 'RJ-14-AB-2231', driver: 'Mohan Sharma', phone: '96543 21098', route: 'Route 02 (SKIT → C-Scheme)', students: 0, startTime: '08:15 AM', status: 'Cancelled', speed: '0 km/h', eta: 'Cancelled', nextStop: '—' },
];

const initialNotifications = [
  {
    id: 'notif-1',
    title: 'Route 03 Stop Updated',
    category: 'Route Update',
    message: 'Stop 5 location on Route 03 has been shifted to Civil Lines Metro.',
    audience: 'Route 03 Students',
    priority: 'Medium',
    type: 'warning',
    time: '10 min ago',
    read: false,
    timestamp: Date.now() - 10 * 60 * 1000,
  },
  {
    id: 'notif-2',
    title: 'Trip TRIP-1021 Delayed',
    category: 'Trip Delay',
    message: 'Bus RJ-14-AB-1088 is delayed by 15 minutes due to traffic.',
    audience: 'Route 01 Students',
    priority: 'High',
    type: 'alert',
    time: '25 min ago',
    read: false,
    timestamp: Date.now() - 25 * 60 * 1000,
  },
  {
    id: 'notif-3',
    title: 'Bus RJ-14-AB-2231 in Maintenance',
    category: 'Bus Issue',
    message: 'Bus sent for scheduled maintenance. Route 02 operating with substitute vehicle.',
    audience: 'Route 02 Students',
    priority: 'Medium',
    type: 'warning',
    time: '2 hrs ago',
    read: true,
    timestamp: Date.now() - 120 * 60 * 1000,
  },
  {
    id: 'notif-4',
    title: 'Holiday Notice — 15 Sep',
    category: 'College Announcement',
    message: 'No transport service on 15 September 2026 due to college holiday.',
    audience: 'All Students',
    priority: 'Low',
    type: 'info',
    time: 'Yesterday',
    read: true,
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
  },
];

const initialRoutes = [
  {
    id: 'Route 01',
    name: 'Route 01',
    origin: 'SKIT Campus',
    destination: 'Tonk Road',
    stopsCount: 8,
    studentsCount: 44,
    bus: 'RJ-14-AB-1088',
    driver: 'Suresh Meena',
    status: 'Active',
    stopsList: ['SKIT Main Gate', 'Jagatpura Circle', 'Malviya Nagar', 'Gopalpura Flyover', 'Tonk Phatak', 'Gandhi Nagar', 'Tonk Road'],
  },
  {
    id: 'Route 02',
    name: 'Route 02',
    origin: 'SKIT Campus',
    destination: 'C-Scheme',
    stopsCount: 6,
    studentsCount: 36,
    bus: 'RJ-14-AB-2231',
    driver: 'Mohan Sharma',
    status: 'Active',
    stopsList: ['SKIT Main Gate', 'JLN Marg', 'Rambagh Circle', 'Statue Circle', 'Ahinsa Circle', 'C-Scheme'],
  },
  {
    id: 'Route 03',
    name: 'Route 03',
    origin: 'SKIT Campus',
    destination: 'Jaipur City',
    stopsCount: 12,
    studentsCount: 42,
    bus: 'RJ-14-AB-1234',
    driver: 'Rajesh Kumar',
    status: 'Active',
    stopsList: ['SKIT Main Gate', 'Pratap Nagar', 'Sanganer Stadium', 'Durgapura', 'Maharani Farm', 'Tonk Phatak', 'Civil Lines', 'Railway Station', 'Jaipur City'],
  },
  {
    id: 'Route 04',
    name: 'Route 04',
    origin: 'SKIT Campus',
    destination: 'Mansarovar',
    stopsCount: 9,
    studentsCount: 31,
    bus: 'RJ-14-AB-4512',
    driver: 'Dinesh Yadav',
    status: 'Active',
    stopsList: ['SKIT Main Gate', 'NRI Colony', 'Haldi Ghati Marg', 'Kalyan Nagar', 'VT Road', 'Mansarovar Metro', 'Mansarovar'],
  },
];

/**
 * Sanitizes route strings to guarantee balanced, single parentheses:
 * e.g. "Route 03 (SKIT → Mansarovar))))" -> "Route 03 (SKIT → Mansarovar)"
 */
export const sanitizeRouteString = (str) => {
  if (!str) return str;
  const firstOpen = str.indexOf('(');
  if (firstOpen === -1) {
    return str.replace(/[()]/g, '').trim();
  }
  const baseRoute = str.slice(0, firstOpen).trim();
  const inside = str.slice(firstOpen).replace(/[()]/g, '').trim();
  if (!inside) {
    return baseRoute;
  }
  return `${baseRoute} (${inside})`;
};

/**
 * Safely combines new route with destination description without bracket duplication
 */
export const formatTripRoute = (newRoute, previousRoute) => {
  const cleanNew = sanitizeRouteString(newRoute || '');
  const cleanPrev = sanitizeRouteString(previousRoute || '');

  // If cleanNew already has a destination inside brackets
  const newMatch = cleanNew.match(/\(([^)]+)\)/);
  if (newMatch) {
    return cleanNew;
  }

  // Otherwise, extract destination from cleanPrev if available
  const prevMatch = cleanPrev.match(/\(([^)]+)\)/);
  const destination = prevMatch ? prevMatch[1].trim() : 'SKIT Campus';
  const base = cleanNew.split('(')[0].trim() || 'Route 01';
  return `${base} (${destination})`;
};

export const TransportProvider = ({ children }) => {
  // Load from localStorage or use initial defaults
  const [drivers, setDrivers] = useState(() => {
    const saved = localStorage.getItem('unitransit_drivers');
    return saved ? JSON.parse(saved) : initialDrivers;
  });

  const [buses, setBuses] = useState(() => {
    const saved = localStorage.getItem('unitransit_buses');
    return saved ? JSON.parse(saved) : initialBuses;
  });

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('unitransit_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [trips, setTrips] = useState(() => {
    const saved = localStorage.getItem('unitransit_trips');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((t) => ({
          ...t,
          route: sanitizeRouteString(t.route),
        }));
      } catch (e) {
        console.error(e);
      }
    }
    return initialTrips;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('unitransit_notifications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].category) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return initialNotifications;
  });

  const [routes, setRoutes] = useState(() => {
    const saved = localStorage.getItem('unitransit_routes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return initialRoutes;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('unitransit_drivers', JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem('unitransit_buses', JSON.stringify(buses));
  }, [buses]);

  useEffect(() => {
    localStorage.setItem('unitransit_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('unitransit_trips', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('unitransit_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('unitransit_routes', JSON.stringify(routes));
  }, [routes]);

  // --- CROSS-SYNCHRONIZATION ACTIONS ---

  /**
   * Assign driver to a bus and route.
   * Synchronizes across Drivers, Buses, Trips, Students, and Routes.
   */
  const assignDriver = (driverId, { bus, route, trip }) => {
    const targetDriver = drivers.find((d) => d.id === driverId);
    if (!targetDriver) return;

    // 1. Update Driver
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === driverId
          ? {
              ...d,
              bus: bus,
              route: route,
              trip: trip || d.trip,
              status: 'Online',
            }
          : d
      )
    );

    // 2. Update Bus (if bus is selected)
    if (bus && bus !== '—') {
      setBuses((prev) =>
        prev.map((b) =>
          b.id === bus
            ? {
                ...b,
                driver: targetDriver.name,
                route: route,
                status: 'Active',
              }
            : b.driver === targetDriver.name
            ? { ...b, driver: 'Unassigned', status: 'Inactive' }
            : b
        )
      );
    }

    // 3. Update Trips for this driver or bus
    setTrips((prev) =>
      prev.map((t) => {
        if (t.driver === targetDriver.name || (bus && t.bus === bus)) {
          return {
            ...t,
            driver: targetDriver.name,
            phone: targetDriver.phone,
            bus: bus && bus !== '—' ? bus : t.bus,
            route: formatTripRoute(route, t.route),
          };
        }
        return t;
      })
    );

    // 4. Update Students assigned to this bus or driver
    if (bus && bus !== '—') {
      setStudents((prev) =>
        prev.map((s) => (s.bus === bus ? { ...s, route: route } : s))
      );
    }

    // 5. Update Routes
    if (route && route !== '—') {
      setRoutes((prev) =>
        prev.map((r) =>
          r.id === route || r.name === route
            ? { ...r, driver: targetDriver.name, bus: bus && bus !== '—' ? bus : r.bus }
            : r
        )
      );
    }

    addNotification({
      type: 'success',
      title: 'Driver Assigned',
      message: `${targetDriver.name} assigned to bus ${bus} on ${route}.`,
    });
  };

  /**
   * Unassign driver from active bus/route.
   */
  const unassignDriver = (driverId) => {
    const targetDriver = drivers.find((d) => d.id === driverId);
    if (!targetDriver) return;

    const previousBus = targetDriver.bus;

    setDrivers((prev) =>
      prev.map((d) =>
        d.id === driverId
          ? { ...d, bus: '—', route: '—', trip: '—', status: 'Available' }
          : d
      )
    );

    if (previousBus && previousBus !== '—') {
      setBuses((prev) =>
        prev.map((b) =>
          b.id === previousBus
            ? { ...b, driver: 'Unassigned', status: 'Inactive' }
            : b
        )
      );
    }
  };

  /**
   * Toggle Driver Disabled / Enabled.
   */
  const toggleDriverDisabled = (driverId) => {
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id === driverId) {
          const isCurrentlyDisabled = d.status === 'Disabled';
          return {
            ...d,
            status: isCurrentlyDisabled ? 'Available' : 'Disabled',
            bus: isCurrentlyDisabled ? d.bus : '—',
            trip: isCurrentlyDisabled ? d.trip : '—',
          };
        }
        return d;
      })
    );
  };

  /**
   * Add a new driver.
   */
  const addDriver = (newDriver) => {
    setDrivers((prev) => [...prev, newDriver]);
    if (newDriver.bus && newDriver.bus !== '—') {
      setBuses((prev) =>
        prev.map((b) =>
          b.id === newDriver.bus
            ? { ...b, driver: newDriver.name, route: newDriver.route, status: 'Active' }
            : b
        )
      );
    }
    addNotification({
      type: 'info',
      title: 'New Driver Added',
      message: `${newDriver.name} added to driver roster with license ${newDriver.license}.`,
    });
  };

  /**
   * Assign bus to a driver and route.
   */
  const assignBus = (busId, { driver, route }) => {
    // 1. Update Bus
    setBuses((prev) =>
      prev.map((b) =>
        b.id === busId
          ? {
              ...b,
              driver: driver,
              route: route,
              status: 'Active',
            }
          : b
      )
    );

    // 2. Update Driver
    if (driver && driver !== 'Unassigned') {
      setDrivers((prev) =>
        prev.map((d) =>
          d.name === driver
            ? {
                ...d,
                bus: busId,
                route: route,
                status: 'Online',
              }
            : d
        )
      );
    }

    // 3. Update Trips
    setTrips((prev) =>
      prev.map((t) => {
        if (t.bus === busId) {
          return {
            ...t,
            driver: driver !== 'Unassigned' ? driver : t.driver,
            route: formatTripRoute(route, t.route),
          };
        }
        return t;
      })
    );

    // 4. Update Students assigned to this bus
    setStudents((prev) =>
      prev.map((s) => (s.bus === busId ? { ...s, route: route } : s))
    );

    // 5. Update Routes
    if (route && route !== '—') {
      setRoutes((prev) =>
        prev.map((r) =>
          r.id === route || r.name === route
            ? { ...r, bus: busId, driver: driver !== 'Unassigned' ? driver : r.driver }
            : r
        )
      );
    }

    addNotification({
      type: 'success',
      title: 'Bus Route Assigned',
      message: `Bus ${busId} assigned to ${route} with driver ${driver}.`,
    });
  };

  /**
   * Unassign Bus
   */
  const unassignBus = (busId) => {
    const targetBus = buses.find((b) => b.id === busId);
    const prevDriver = targetBus ? targetBus.driver : null;

    setBuses((prev) =>
      prev.map((b) =>
        b.id === busId
          ? { ...b, driver: 'Unassigned', route: '—', status: 'Inactive' }
          : b
      )
    );

    if (prevDriver && prevDriver !== 'Unassigned') {
      setDrivers((prev) =>
        prev.map((d) =>
          d.name === prevDriver ? { ...d, bus: '—', status: 'Available' } : d
        )
      );
    }
  };

  /**
   * Toggle Bus Maintenance
   */
  const toggleBusMaintenance = (busId) => {
    setBuses((prev) =>
      prev.map((b) => {
        if (b.id === busId) {
          const isMaint = b.status === 'Maintenance';
          const nextStatus = isMaint ? 'Active' : 'Maintenance';
          addNotification({
            type: isMaint ? 'success' : 'alert',
            title: isMaint ? 'Bus Resumed Service' : 'Bus Scheduled for Maintenance',
            message: isMaint
              ? `Bus ${busId} is back in active fleet rotation.`
              : `Bus ${busId} has been sent for servicing/inspection.`,
          });
          return { ...b, status: nextStatus };
        }
        return b;
      })
    );
  };

  /**
   * Edit Bus Details
   */
  const editBus = (busId, updatedData) => {
    setBuses((prev) =>
      prev.map((b) => (b.id === busId ? { ...b, ...updatedData } : b))
    );
  };

  /**
   * Add a new bus
   */
  const addBus = (newBus) => {
    setBuses((prev) => [...prev, newBus]);
    addNotification({
      type: 'info',
      title: 'New Bus Registered',
      message: `Bus ${newBus.id} (${newBus.type}, ${newBus.capacity}) added to fleet.`,
    });
  };

  /**
   * Add a new student
   */
  const addStudent = (newStudent) => {
    setStudents((prev) => [newStudent, ...prev]);
    addNotification({
      type: 'info',
      title: 'New Student Enrolled',
      message: `${newStudent.name} (${newStudent.id}) enrolled on ${newStudent.route}.`,
    });
  };

  /**
   * Update or Assign Student
   */
  const updateStudent = (studentId, updatedData) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, ...updatedData } : s))
    );
  };

  const unassignStudent = (studentId) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? { ...s, route: '—', stop: '—', bus: '—', status: 'Unassigned' }
          : s
      )
    );
  };

  /**
   * Route Management Actions
   */
  const addRoute = (newRoute) => {
    setRoutes((prev) => [...prev, newRoute]);
    addNotification({
      type: 'info',
      title: 'New Route Added',
      message: `${newRoute.name} (${newRoute.origin} → ${newRoute.destination}) added to campus network.`,
    });
  };

  const updateRoute = (routeId, updatedData) => {
    setRoutes((prev) =>
      prev.map((r) => (r.id === routeId ? { ...r, ...updatedData } : r))
    );
    addNotification({
      type: 'success',
      title: 'Route Updated',
      message: `${routeId} updated successfully.`,
    });
  };

  const addStopToRoute = (routeId, stopName) => {
    setRoutes((prev) =>
      prev.map((r) => {
        if (r.id === routeId) {
          const currentList = r.stopsList || [];
          return {
            ...r,
            stopsCount: (r.stopsCount || currentList.length) + 1,
            stopsList: [...currentList, stopName],
          };
        }
        return r;
      })
    );
    addNotification({
      type: 'success',
      title: 'Stop Added',
      message: `Stop "${stopName}" added to ${routeId}.`,
    });
  };

  const assignBusToRoute = (routeId, { bus, driver }) => {
    setRoutes((prev) =>
      prev.map((r) =>
        r.id === routeId
          ? {
              ...r,
              bus: bus,
              driver: driver || r.driver,
            }
          : r
      )
    );
    if (bus && bus !== '—') {
      assignBus(bus, { driver, route: routeId });
    }
  };

  /**
   * Notification Handlers
   */
  const addNotification = ({
    type = 'info',
    title,
    category = 'General Alert',
    message,
    audience = 'All Students',
    priority = 'Medium',
  }) => {
    const newNotif = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type,
      title,
      category,
      message,
      audience,
      priority,
      time: 'Just now',
      read: false,
      timestamp: Date.now(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <TransportContext.Provider
      value={{
        drivers,
        buses,
        students,
        trips,
        routes,
        notifications,
        unreadNotificationsCount: notifications.filter((n) => !n.read).length,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearAllNotifications,
        assignDriver,
        unassignDriver,
        toggleDriverDisabled,
        addDriver,
        assignBus,
        unassignBus,
        toggleBusMaintenance,
        editBus,
        addBus,
        addStudent,
        updateStudent,
        unassignStudent,
        addRoute,
        updateRoute,
        addStopToRoute,
        assignBusToRoute,
      }}
    >
      {children}
    </TransportContext.Provider>
  );
};
