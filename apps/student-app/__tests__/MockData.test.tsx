import {
  mockStudent,
  mockBus,
  mockRoute,
  mockNotifications,
  mockHelpContacts,
  mockFAQs,
} from '../src/data/mockData';

describe('Student App Mock Data Verification', () => {
  test('mockStudent contains required SKIT Jaipur student info', () => {
    expect(mockStudent.name).toBe('Aarav Sharma');
    expect(mockStudent.studentId).toBe('SKIT/2023/CS/012');
    expect(mockStudent.assignedBusNumber).toBe('RJ-14-AB-1234');
    expect(mockStudent.assignedRouteNumber).toBe('Route 03');
    expect(mockStudent.pickupStopName).toBe('Stop 03 - Mansarovar Metro Station');
    expect(mockStudent.college).toContain('SKIT Jaipur');
  });

  test('mockBus contains assigned driver and vehicle specifications', () => {
    expect(mockBus.busNumber).toBe('RJ-14-AB-1234');
    expect(mockBus.status).toBe('ON THE WAY');
    expect(mockBus.capacity).toBe(52);
    expect(mockBus.driver.name).toBe('Rajesh Kumar');
    expect(mockBus.driver.driverId).toBe('SKIT-DRV-089');
  });

  test('mockRoute includes stops and student pickup point', () => {
    expect(mockRoute.routeNumber).toBe('Route 03');
    expect(mockRoute.stops.length).toBeGreaterThan(0);
    const pickupStop = mockRoute.stops.find(s => s.isStudentPickup);
    expect(pickupStop).toBeDefined();
    expect(pickupStop?.stopName).toContain('Mansarovar Metro Station');
  });

  test('mockNotifications contains category items', () => {
    expect(mockNotifications.length).toBeGreaterThan(0);
    const tripNotif = mockNotifications.find(n => n.category === 'Trip');
    expect(tripNotif).toBeDefined();
  });

  test('mockHelpContacts and FAQs are populated', () => {
    expect(mockHelpContacts.length).toBeGreaterThan(0);
    expect(mockFAQs.length).toBeGreaterThan(0);
  });
});
