import React, { createContext, useContext, useState, useEffect } from 'react';

const TransportContext = createContext();

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
    return saved ? JSON.parse(saved) : initialTrips;
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

  // --- CROSS-SYNCHRONIZATION ACTIONS ---

  /**
   * Assign driver to a bus and route.
   * Synchronizes across Drivers, Buses, Trips, and Students.
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
            route: `${route} (${t.route.split('(')[1] || 'SKIT Campus'})`,
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
            route: `${route} (${t.route.split('(')[1] || 'SKIT Campus'})`,
          };
        }
        return t;
      })
    );

    // 4. Update Students assigned to this bus
    setStudents((prev) =>
      prev.map((s) => (s.bus === busId ? { ...s, route: route } : s))
    );
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
          return { ...b, status: isMaint ? 'Active' : 'Maintenance' };
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

  return (
    <TransportContext.Provider
      value={{
        drivers,
        buses,
        students,
        trips,
        assignDriver,
        unassignDriver,
        toggleDriverDisabled,
        addDriver,
        assignBus,
        unassignBus,
        toggleBusMaintenance,
        editBus,
        addBus,
        updateStudent,
        unassignStudent,
      }}
    >
      {children}
    </TransportContext.Provider>
  );
};

export const useTransport = () => useContext(TransportContext);
