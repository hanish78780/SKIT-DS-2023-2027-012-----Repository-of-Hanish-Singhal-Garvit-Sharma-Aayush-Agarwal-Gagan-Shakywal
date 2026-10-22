import React from 'react';
import { AppState, AppStateStatus } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { useLocation, UseLocationReturn } from '../src/hooks/useLocation';
import { LocationCoordinates } from '../src/types/driver';
import {
  checkLocationPermission,
  getCurrentLocation,
  LocationWatchCallbacks,
  PermissionResult,
  requestLocationPermission,
  startLocationUpdates,
  stopLocationUpdates,
} from '../src/services/locationService';

jest.mock('@react-native-community/geolocation', () => ({
  __esModule: true,
  default: {},
}));

jest.mock('../src/services/locationService', () => ({
  ...jest.requireActual('../src/services/locationService'),
  checkLocationPermission: jest.fn(),
  getCurrentLocation: jest.fn(),
  requestLocationPermission: jest.fn(),
  startLocationUpdates: jest.fn(),
  stopLocationUpdates: jest.fn(),
}));

const checkPermission = jest.mocked(checkLocationPermission);
const requestPermission = jest.mocked(requestLocationPermission);
const getLocation = jest.mocked(getCurrentLocation);
const startUpdates = jest.mocked(startLocationUpdates);
const stopUpdates = jest.mocked(stopLocationUpdates);
const coordinates: LocationCoordinates = {
  latitude: 26.8678,
  longitude: 75.7965,
  accuracy: 5,
  altitude: null,
  heading: null,
  speed: null,
  timestamp: 1700000000000,
};

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

let api: UseLocationReturn;
let component: ReactTestRenderer.ReactTestRenderer | null;
let changeState: (state: AppStateStatus) => void;
let callbacks: LocationWatchCallbacks[];
let removeListener: jest.Mock;

function Harness() {
  api = useLocation();
  return null;
}

async function mount() {
  await act(async () => {
    component = ReactTestRenderer.create(<Harness />);
  });
}

async function start() {
  await act(async () => {
    await api.startTracking();
  });
}

async function setAppState(state: AppStateStatus) {
  await act(async () => {
    changeState(state);
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  checkPermission.mockReset().mockResolvedValue('granted');
  requestPermission.mockReset().mockResolvedValue('granted');
  getLocation.mockReset().mockResolvedValue(coordinates);
  callbacks = [];
  startUpdates.mockReset().mockImplementation(watchCallbacks => {
    callbacks.push(watchCallbacks);
    return callbacks.length - 1; // ID zero is a valid subscription.
  });
  component = null;
  removeListener = jest.fn();
  Object.defineProperty(AppState, 'currentState', {
    value: 'active',
    configurable: true,
  });
  jest
    .spyOn(AppState, 'addEventListener')
    .mockImplementation((_event, listener) => {
      changeState = listener;
      return { remove: removeListener };
    });
});

afterEach(async () => {
  if (component) {
    await act(async () => component?.unmount());
  }
  jest.restoreAllMocks();
});

it('starts only on request, avoids duplicate starts, and cleans watcher ID zero on stop', async () => {
  await mount();
  expect(checkPermission).not.toHaveBeenCalled();
  await act(async () => {
    await Promise.all([api.startTracking(), api.startTracking()]);
  });
  await start();
  expect(startUpdates).toHaveBeenCalledTimes(1);
  expect(api.locationState.coordinates).toEqual(coordinates);
  act(() => api.stopTracking());
  expect(stopUpdates).toHaveBeenCalledWith(0);
  expect(api.locationState).toEqual({
    status: 'idle',
    coordinates: null,
    errorMessage: null,
  });
  act(() => callbacks[0].onLocation({ ...coordinates, latitude: 99 }));
  expect(api.locationState.status).toBe('idle');
});

it.each<PermissionResult>(['denied', 'blocked', 'approximate'])(
  'does not acquire or watch GPS with %s permission',
  async permission => {
    checkPermission.mockResolvedValue('denied');
    requestPermission.mockResolvedValue(permission);
    await mount();
    await start();
    expect(api.locationState.status).toBe(
      permission === 'blocked' ? 'permission_blocked' : 'permission_denied',
    );
    if (permission === 'approximate') {
      expect(api.locationState.errorMessage).toMatch(/precise/i);
    }
    expect(getLocation).not.toHaveBeenCalled();
    expect(startUpdates).not.toHaveBeenCalled();
  },
);

it('stopping while permission is pending prevents a late grant from starting GPS', async () => {
  const permission = deferred<PermissionResult>();
  checkPermission.mockResolvedValue('denied');
  requestPermission.mockReturnValue(permission.promise);
  await mount();
  let pending!: Promise<void>;
  await act(async () => {
    pending = api.startTracking();
  });
  act(() => api.stopTracking());
  await act(async () => {
    permission.resolve('granted');
    await pending;
  });
  expect(getLocation).not.toHaveBeenCalled();
  expect(startUpdates).not.toHaveBeenCalled();
  expect(api.locationState.status).toBe('idle');
});

it('does not open a new permission dialog if the initial check finishes after stop', async () => {
  const permissionCheck = deferred<PermissionResult>();
  checkPermission.mockReturnValue(permissionCheck.promise);
  await mount();
  let pending!: Promise<void>;
  await act(async () => {
    pending = api.startTracking();
  });
  act(() => api.stopTracking());
  await act(async () => {
    permissionCheck.resolve('denied');
    await pending;
  });
  expect(requestPermission).not.toHaveBeenCalled();
  expect(getLocation).not.toHaveBeenCalled();
  expect(api.locationState.status).toBe('idle');
});

it('stopping while the first fix is pending prevents a late fix from restarting GPS', async () => {
  const fix = deferred<LocationCoordinates>();
  getLocation.mockReturnValue(fix.promise);
  await mount();
  let pending!: Promise<void>;
  await act(async () => {
    pending = api.startTracking();
  });
  act(() => api.stopTracking());
  await act(async () => {
    fix.resolve(coordinates);
    await pending;
  });
  expect(startUpdates).not.toHaveBeenCalled();
  expect(api.locationState.coordinates).toBeNull();
});

it('restarting during a pending permission request shares its dialog and ignores the canceled session', async () => {
  const permission = deferred<PermissionResult>();
  checkPermission.mockResolvedValue('denied');
  requestPermission.mockReturnValue(permission.promise);
  await mount();
  let oldStart!: Promise<void>;
  let newStart!: Promise<void>;
  await act(async () => {
    oldStart = api.startTracking();
  });
  act(() => api.stopTracking());
  await act(async () => {
    newStart = api.startTracking();
  });
  await act(async () => {
    permission.resolve('granted');
    await Promise.all([oldStart, newStart]);
  });
  expect(requestPermission).toHaveBeenCalledTimes(1);
  expect(getLocation).toHaveBeenCalledTimes(1);
  expect(startUpdates).toHaveBeenCalledTimes(1);
  expect(api.locationState.status).toBe('tracking');
});

it('a previous session finishing cannot overwrite or unlock a newer pending session', async () => {
  const oldFix = deferred<LocationCoordinates>();
  const newFix = deferred<LocationCoordinates>();
  getLocation
    .mockReturnValueOnce(oldFix.promise)
    .mockReturnValueOnce(newFix.promise);
  await mount();
  let oldStart!: Promise<void>;
  let newStart!: Promise<void>;
  await act(async () => {
    oldStart = api.startTracking();
  });
  act(() => api.stopTracking());
  await act(async () => {
    newStart = api.startTracking();
  });
  await act(async () => {
    oldFix.resolve({ ...coordinates, latitude: 1 });
    await oldStart;
  });
  await start();
  expect(getLocation).toHaveBeenCalledTimes(2);
  expect(startUpdates).not.toHaveBeenCalled();
  expect(api.locationState.status).toBe('acquiring_location');
  await act(async () => {
    newFix.resolve(coordinates);
    await newStart;
  });
  expect(api.locationState.coordinates).toEqual(coordinates);
  expect(startUpdates).toHaveBeenCalledTimes(1);
});

it('unmounting during startup ignores a late fix and removes the AppState listener', async () => {
  const fix = deferred<LocationCoordinates>();
  getLocation.mockReturnValue(fix.promise);
  await mount();
  let pending!: Promise<void>;
  await act(async () => {
    pending = api.startTracking();
  });
  await act(async () => {
    component?.unmount();
    component = null;
  });
  await act(async () => {
    fix.resolve(coordinates);
    await pending;
  });
  expect(startUpdates).not.toHaveBeenCalled();
  expect(removeListener).toHaveBeenCalledTimes(1);
});

it('unmounting an active session clears its watcher and ignores queued callbacks', async () => {
  await mount();
  await start();
  await act(async () => {
    component?.unmount();
    component = null;
  });
  expect(stopUpdates).toHaveBeenCalledWith(0);
  act(() => callbacks[0].onLocation({ ...coordinates, latitude: 1 }));
  expect(startUpdates).toHaveBeenCalledTimes(1);
});

it('pauses in background, ignores old updates, and resumes the requested trip once', async () => {
  await mount();
  await start();
  await setAppState('background');
  expect(stopUpdates).toHaveBeenCalledWith(0);
  expect(api.locationState.status).toBe('idle');
  act(() => callbacks[0].onLocation({ ...coordinates, latitude: 1 }));
  expect(api.locationState.coordinates).toBeNull();
  await setAppState('active');
  await setAppState('active');
  expect(startUpdates).toHaveBeenCalledTimes(2);
  expect(api.locationState.status).toBe('tracking');
  await setAppState('background');
  act(() => api.stopTracking());
  await setAppState('active');
  expect(startUpdates).toHaveBeenCalledTimes(2);
});

it('allows a permission-dialog background/resume cycle without duplicate requests', async () => {
  const permission = deferred<PermissionResult>();
  checkPermission.mockResolvedValue('denied');
  requestPermission.mockReturnValue(permission.promise);
  await mount();
  let pending!: Promise<void>;
  await act(async () => {
    pending = api.startTracking();
  });
  await setAppState('background');
  await setAppState('active');
  await act(async () => {
    permission.resolve('granted');
    await pending;
  });
  expect(requestPermission).toHaveBeenCalledTimes(1);
  expect(startUpdates).toHaveBeenCalledTimes(1);
  expect(api.locationState.status).toBe('tracking');
});

it('does not start a watch if permission succeeds while still backgrounded', async () => {
  const permission = deferred<PermissionResult>();
  checkPermission.mockResolvedValue('denied');
  requestPermission.mockReturnValue(permission.promise);
  await mount();
  let pending!: Promise<void>;
  await act(async () => {
    pending = api.startTracking();
  });
  await setAppState('background');
  await act(async () => {
    permission.resolve('granted');
    await pending;
  });
  expect(startUpdates).not.toHaveBeenCalled();
  checkPermission.mockResolvedValue('granted');
  await setAppState('active');
  expect(startUpdates).toHaveBeenCalledTimes(1);
});

it('continues watching after an initial timeout and recovers from transient watch errors', async () => {
  getLocation.mockRejectedValue({ code: 3, message: 'Timeout' });
  await mount();
  await start();
  expect(api.locationState.status).toBe('acquiring_location');
  act(() => callbacks[0].onLocation(coordinates));
  expect(api.locationState.status).toBe('tracking');
  act(() => callbacks[0].onError('Provider unavailable', 2));
  expect(api.locationState.status).toBe('location_unavailable');
  expect(api.locationState.coordinates).toBeNull();
  act(() => callbacks[0].onLocation(coordinates));
  expect(api.locationState.status).toBe('tracking');
  expect(api.locationState.errorMessage).toBeNull();
});

it.each([1, 2])(
  'reports initial native error %s without starting a watcher',
  async code => {
    getLocation.mockRejectedValue({ code, message: 'Native error' });
    await mount();
    await start();
    expect(api.locationState.status).toBe(
      code === 1 ? 'permission_denied' : 'location_unavailable',
    );
    expect(startUpdates).not.toHaveBeenCalled();
  },
);

it('clears a watcher on permission loss, ignores its late fixes, and permits retry', async () => {
  await mount();
  await start();
  act(() => callbacks[0].onError('Permission revoked', 1));
  expect(stopUpdates).toHaveBeenCalledWith(0);
  expect(api.locationState.status).toBe('permission_denied');
  expect(api.locationState.coordinates).toBeNull();
  act(() => callbacks[0].onLocation({ ...coordinates, latitude: 1 }));
  expect(api.locationState.status).toBe('permission_denied');
  await start();
  expect(startUpdates).toHaveBeenCalledTimes(2);
  expect(api.locationState.status).toBe('tracking');
});

it('handles synchronous watcher startup failure without rejecting the trip action', async () => {
  startUpdates.mockImplementation(() => {
    throw new Error('Native failure');
  });
  await mount();
  await start();
  expect(api.locationState.status).toBe('error');
  expect(api.locationState.coordinates).toBeNull();
});
