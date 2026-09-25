import {
  mockStudent,
  mockBus,
  mockRoute,
  mockNotifications,
  mockHelpContacts,
  mockFAQs,
  mockTrackingLocation,
} from '../data/mockData';
import {
  StudentProfile,
  BusDetails,
  RouteDetails,
  NotificationItem,
  IssueReportPayload,
  TrackingLocation,
} from '../types';

export class MockApiService {
  static async loginStudent(emailOrId: string, _password: string): Promise<StudentProfile> {
    await new Promise(resolve => setTimeout(() => resolve(true), 600));
    if (!emailOrId.trim()) {
      throw new Error('Please enter valid Student ID or College Email.');
    }
    return mockStudent;
  }

  static async getStudentProfile(): Promise<StudentProfile> {
    await new Promise(resolve => setTimeout(() => resolve(true), 300));
    return mockStudent;
  }

  static async getAssignedBus(): Promise<BusDetails> {
    await new Promise(resolve => setTimeout(() => resolve(true), 300));
    return mockBus;
  }

  static async getAssignedRoute(): Promise<RouteDetails> {
    await new Promise(resolve => setTimeout(() => resolve(true), 300));
    return mockRoute;
  }

  static async getLiveTracking(): Promise<TrackingLocation> {
    await new Promise(resolve => setTimeout(() => resolve(true), 300));
    return mockTrackingLocation;
  }

  static async getNotifications(): Promise<NotificationItem[]> {
    await new Promise(resolve => setTimeout(() => resolve(true), 300));
    return mockNotifications;
  }

  static async submitIssueReport(payload: IssueReportPayload): Promise<{ success: boolean; ticketId: string }> {
    await new Promise(resolve => setTimeout(() => resolve(payload), 800));
    return {
      success: true,
      ticketId: `TICK-${Math.floor(100000 + Math.random() * 900000)}`,
    };
  }

  static async getHelpContacts() {
    await new Promise(resolve => setTimeout(() => resolve(true), 200));
    return mockHelpContacts;
  }

  static async getFAQs() {
    await new Promise(resolve => setTimeout(() => resolve(true), 200));
    return mockFAQs;
  }
}

export default MockApiService;
