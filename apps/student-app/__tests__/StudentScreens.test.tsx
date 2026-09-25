import React from 'react';
import renderer, { act } from 'react-test-renderer';
import HomeScreen from '../src/screens/home/HomeScreen';
import LiveTrackingScreen from '../src/screens/tracking/LiveTrackingScreen';
import MyRouteScreen from '../src/screens/route/MyRouteScreen';
import BusDetailsScreen from '../src/screens/bus/BusDetailsScreen';
import NotificationsScreen from '../src/screens/notifications/NotificationsScreen';
import ProfileScreen from '../src/screens/profile/ProfileScreen';
import SettingsScreen from '../src/screens/settings/SettingsScreen';
import ReportIssueScreen from '../src/screens/issue/ReportIssueScreen';
import HelpSafetyScreen from '../src/screens/help/HelpSafetyScreen';
import LoginScreen from '../src/screens/auth/LoginScreen';

describe('Student App Screen Component Tests', () => {
  const dummyNav = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  const renderAndFlush = async (element: React.ReactElement) => {
    let component: any;
    await act(async () => {
      component = renderer.create(element);
    });
    await act(async () => {
      jest.advanceTimersByTime(500);
      await Promise.resolve();
    });
    const json = component.toJSON();
    await act(async () => {
      component.unmount();
    });
    return json;
  };

  test('renders HomeScreen correctly', async () => {
    const tree = await renderAndFlush(
      <HomeScreen
        onNavigateTrack={dummyNav}
        onNavigateRoute={dummyNav}
        onNavigateBusDetails={dummyNav}
        onNavigateNotifications={dummyNav}
        onNavigateReportIssue={dummyNav}
        onNavigateHelp={dummyNav}
        onNavigateProfile={dummyNav}
      />
    );
    expect(tree).toBeDefined();
  });

  test('renders LiveTrackingScreen correctly', async () => {
    const tree = await renderAndFlush(<LiveTrackingScreen onNavigateRoute={dummyNav} />);
    expect(tree).toBeDefined();
  });

  test('renders MyRouteScreen correctly', async () => {
    const tree = await renderAndFlush(<MyRouteScreen />);
    expect(tree).toBeDefined();
  });

  test('renders BusDetailsScreen correctly', async () => {
    const tree = await renderAndFlush(<BusDetailsScreen />);
    expect(tree).toBeDefined();
  });

  test('renders NotificationsScreen correctly', async () => {
    const tree = await renderAndFlush(<NotificationsScreen />);
    expect(tree).toBeDefined();
  });

  test('renders ProfileScreen correctly', async () => {
    const tree = await renderAndFlush(
      <ProfileScreen
        onNavigateSettings={dummyNav}
        onNavigateHelp={dummyNav}
        onNavigateReportIssue={dummyNav}
        onLogout={dummyNav}
      />
    );
    expect(tree).toBeDefined();
  });

  test('renders SettingsScreen correctly', async () => {
    const tree = await renderAndFlush(<SettingsScreen onLogout={dummyNav} />);
    expect(tree).toBeDefined();
  });

  test('renders ReportIssueScreen correctly', async () => {
    const tree = await renderAndFlush(<ReportIssueScreen />);
    expect(tree).toBeDefined();
  });

  test('renders HelpSafetyScreen correctly', async () => {
    const tree = await renderAndFlush(<HelpSafetyScreen />);
    expect(tree).toBeDefined();
  });

  test('renders LoginScreen correctly', async () => {
    const tree = await renderAndFlush(<LoginScreen onLoginSuccess={dummyNav} />);
    expect(tree).toBeDefined();
  });
});
