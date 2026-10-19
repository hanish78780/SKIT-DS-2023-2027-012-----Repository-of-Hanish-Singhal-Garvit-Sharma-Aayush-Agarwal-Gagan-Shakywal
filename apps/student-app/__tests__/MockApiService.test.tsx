import MockApiService from '../src/services/mockApi';

describe('MockApiService Tests', () => {
  test('loginStudent returns student profile for valid input', async () => {
    const profile = await MockApiService.loginStudent('SKIT/2023/CS/012', 'password123');
    expect(profile.name).toBe('Aarav Sharma');
  });

  test('loginStudent throws error for empty ID', async () => {
    await expect(MockApiService.loginStudent('', 'password')).rejects.toThrow(
      'Please enter valid Student ID or College Email.'
    );
  });

  test('getAssignedBus returns bus RJ-14-AB-1234', async () => {
    const bus = await MockApiService.getAssignedBus();
    expect(bus.busNumber).toBe('RJ-14-AB-1234');
    expect(bus.status).toBe('ON THE WAY');
  });

  test('getAssignedRoute returns Route 03', async () => {
    const route = await MockApiService.getAssignedRoute();
    expect(route.routeNumber).toBe('Route 03');
  });

  test('submitIssueReport generates valid ticket ID', async () => {
    const result = await MockApiService.submitIssueReport({
      category: 'Bus Delay',
      description: 'Bus was delayed near Metro stop',
      busNumber: 'RJ-14-AB-1234',
      routeNumber: 'Route 03',
      studentId: 'SKIT/2023/CS/012',
      timestamp: new Date().toISOString(),
    });
    expect(result.success).toBe(true);
    expect(result.ticketId).toMatch(/^TICK-\d+$/);
  });
});
