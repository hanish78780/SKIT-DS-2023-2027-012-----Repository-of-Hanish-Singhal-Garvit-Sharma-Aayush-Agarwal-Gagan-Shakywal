import React from 'react';
import { BackHandler } from 'react-native';
import renderer, { act, ReactTestRenderer } from 'react-test-renderer';
import AppNavigator from '../src/navigation/AppNavigator';
import LoginScreen from '../src/screens/auth/LoginScreen';
import HomeScreen from '../src/screens/home/HomeScreen';
import LiveTrackingScreen from '../src/screens/tracking/LiveTrackingScreen';
import BusDetailsScreen from '../src/screens/bus/BusDetailsScreen';
import ProfileScreen from '../src/screens/profile/ProfileScreen';
import SettingsScreen from '../src/screens/settings/SettingsScreen';

jest.mock('../src/screens/auth/LoginScreen', () => jest.fn(() => null));
jest.mock('../src/screens/home/HomeScreen', () => jest.fn(() => null));
jest.mock('../src/screens/tracking/LiveTrackingScreen', () => jest.fn(() => null));
jest.mock('../src/screens/route/MyRouteScreen', () => jest.fn(() => null));
jest.mock('../src/screens/bus/BusDetailsScreen', () => jest.fn(() => null));
jest.mock('../src/screens/notifications/NotificationsScreen', () => jest.fn(() => null));
jest.mock('../src/screens/issue/ReportIssueScreen', () => jest.fn(() => null));
jest.mock('../src/screens/help/HelpSafetyScreen', () => jest.fn(() => null));
jest.mock('../src/screens/profile/ProfileScreen', () => jest.fn(() => null));
jest.mock('../src/screens/settings/SettingsScreen', () => jest.fn(() => null));

describe('Student navigation', () => {
  let component: ReactTestRenderer;
  let hardwareBackHandler: Parameters<typeof BackHandler.addEventListener>[1];
  let removeListener: jest.Mock;
  const pressBack = () =>
    hardwareBackHandler({ type: 'hardwareBackPress', timeStamp: Date.now() });

  beforeEach(async () => {
    removeListener = jest.fn();
    jest.spyOn(BackHandler, 'addEventListener').mockImplementation((_, handler) => {
      hardwareBackHandler = handler;
      return { remove: removeListener };
    });
    await act(async () => {
      component = renderer.create(<AppNavigator />);
    });
  });

  afterEach(async () => {
    await act(async () => {
      component.unmount();
    });
    jest.restoreAllMocks();
  });

  const signIn = async () => {
    await act(async () => {
      component.root.findByType(LoginScreen).props.onLoginSuccess();
    });
  };

  test('requires sign in on launch and allows normal system Back on login and Home', async () => {
    expect(component.root.findAllByType(LoginScreen)).toHaveLength(1);
    expect(component.root.findAllByType(HomeScreen)).toHaveLength(0);
    expect(pressBack()).toBe(false);

    await signIn();

    expect(component.root.findAllByType(LoginScreen)).toHaveLength(0);
    expect(component.root.findAllByType(HomeScreen)).toHaveLength(1);
    expect(pressBack()).toBe(false);
  });

  test('Android Back returns from a Home detail screen to Home', async () => {
    await signIn();
    await act(async () => {
      component.root.findByType(HomeScreen).props.onNavigateBusDetails();
    });
    expect(component.root.findAllByType(BusDetailsScreen)).toHaveLength(1);

    await act(async () => {
      expect(pressBack()).toBe(true);
    });

    expect(component.root.findAllByType(BusDetailsScreen)).toHaveLength(0);
    expect(component.root.findAllByType(HomeScreen)).toHaveLength(1);
    expect(pressBack()).toBe(false);
  });

  test('Android Back returns from Settings to Profile, then Home', async () => {
    await signIn();
    await act(async () => {
      component.root.findByType(HomeScreen).props.onNavigateProfile();
    });
    await act(async () => {
      component.root.findByType(ProfileScreen).props.onNavigateSettings();
    });
    expect(component.root.findAllByType(SettingsScreen)).toHaveLength(1);

    await act(async () => {
      expect(pressBack()).toBe(true);
    });
    expect(component.root.findAllByType(ProfileScreen)).toHaveLength(1);

    await act(async () => {
      expect(pressBack()).toBe(true);
    });
    expect(component.root.findAllByType(HomeScreen)).toHaveLength(1);
    expect(pressBack()).toBe(false);
  });

  test('Android Back returns from Track to Home', async () => {
    await signIn();
    await act(async () => {
      component.root.findByType(HomeScreen).props.onNavigateTrack();
    });
    expect(component.root.findAllByType(LiveTrackingScreen)).toHaveLength(1);

    await act(async () => {
      expect(pressBack()).toBe(true);
    });

    expect(component.root.findAllByType(HomeScreen)).toHaveLength(1);
  });

  test('logout returns to login and clears the previous tab and detail screen', async () => {
    await signIn();
    await act(async () => {
      component.root.findByType(HomeScreen).props.onNavigateProfile();
    });
    await act(async () => {
      component.root.findByType(ProfileScreen).props.onNavigateSettings();
    });
    await act(async () => {
      component.root.findByType(SettingsScreen).props.onLogout();
    });

    expect(component.root.findAllByType(LoginScreen)).toHaveLength(1);
    expect(component.root.findAllByType(SettingsScreen)).toHaveLength(0);
    expect(pressBack()).toBe(false);

    await signIn();
    expect(component.root.findAllByType(HomeScreen)).toHaveLength(1);
    expect(pressBack()).toBe(false);
  });

  test('replaces stale Back listeners and removes the last listener on unmount', async () => {
    expect(removeListener).not.toHaveBeenCalled();
    await signIn();
    expect(removeListener).toHaveBeenCalledTimes(1);
    const registrations = jest.mocked(BackHandler.addEventListener).mock.calls.length;

    await act(async () => {
      component.unmount();
    });

    expect(removeListener).toHaveBeenCalledTimes(registrations);
  });
});
