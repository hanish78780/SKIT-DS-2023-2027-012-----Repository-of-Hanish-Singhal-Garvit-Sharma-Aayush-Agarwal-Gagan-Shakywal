/**
 * locationService.test.ts
 *
 * Unit tests for the foreground GPS location service.
 *
 * Strategy:
 *  - Mock @react-native-community/geolocation so tests run without a device.
 *  - Mock react-native's PermissionsAndroid for Android-path coverage.
 *  - Platform.OS is tested by mocking the entire 'react-native' module sections.
 *  - Test every PermissionResult branch and every GeoError code branch.
 *
 * Note on Platform.OS mocking:
 *   Platform.OS is a plain string property (not a getter) in React Native's
 *   Jest mock, so jest.spyOn(..., 'OS', 'get') does not work.
 *   We use Object.defineProperty to temporarily override it instead.
 */

import { PermissionsAndroid, Platform } from 'react-native';

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockGetCurrentPosition = jest.fn();
const mockWatchPosition = jest.fn();
const mockClearWatch = jest.fn();

jest.mock('@react-native-community/geolocation', () => ({
  __esModule: true,
  default: {
    getCurrentPosition: (...args: any[]) => mockGetCurrentPosition(...args),
    watchPosition: (...args: any[]) => mockWatchPosition(...args),
    clearWatch: (...args: any[]) => mockClearWatch(...args),
  },
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

function setPlatformOS(os: string) {
  Object.defineProperty(Platform, 'OS', {
    get: () => os,
    configurable: true,
  });
}

function makeGeoPosition(lat = 26.86, lng = 75.8) {
  return {
    coords: {
      latitude: lat,
      longitude: lng,
      accuracy: 10,
      altitude: 300,
      altitudeAccuracy: null,
      heading: 90,
      speed: 5,
    },
    timestamp: 1696166400000,
  };
}

function makeGeoError(code: number, message = 'Error') {
  return {
    code,
    message,
    PERMISSION_DENIED: 1,
    POSITION_UNAVAILABLE: 2,
    TIMEOUT: 3,
  };
}

type PermissionStatus =
  (typeof PermissionsAndroid.RESULTS)[keyof typeof PermissionsAndroid.RESULTS];

function permissionResults(fine: PermissionStatus, coarse: PermissionStatus) {
  // React Native types this as a record of every permission, although native
  // requestMultiple returns entries only for the requested permissions.
  return {
    [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION]: fine,
    [PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION]: coarse,
  } as Awaited<ReturnType<typeof PermissionsAndroid.requestMultiple>>;
}

// ─── Import after mocks ───────────────────────────────────────────────────────

import {
  checkLocationPermission,
  describeGeoError,
  getCurrentLocation,
  requestLocationPermission,
  startLocationUpdates,
  stopLocationUpdates,
} from '../src/services/locationService';

beforeEach(() => {
  jest.useFakeTimers();
  mockGetCurrentPosition.mockReset();
  mockWatchPosition.mockReset();
  mockClearWatch.mockReset();
});

afterEach(() => {
  for (const result of mockWatchPosition.mock.results) {
    if (result.type === 'return' && typeof result.value === 'number') {
      stopLocationUpdates(result.value);
    }
  }
  jest.useRealTimers();
  jest.restoreAllMocks();
});

// ─── Tests: requestLocationPermission ─────────────────────────────────────────

describe('requestLocationPermission', () => {
  beforeEach(() => {
    setPlatformOS('android');
    mockGetCurrentPosition.mockClear();
    mockWatchPosition.mockClear();
    mockClearWatch.mockClear();
  });

  afterEach(() => {
    // Restore default
    setPlatformOS('android');
  });

  it('requests fine and coarse location together and returns a precise grant', async () => {
    const requestSpy = jest
      .spyOn(PermissionsAndroid, 'requestMultiple')
      .mockResolvedValue(permissionResults('granted', 'granted'));

    const result = await requestLocationPermission();
    expect(result).toBe('granted');
    expect(requestSpy).toHaveBeenCalledWith([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ]);
  });

  it('returns "denied" when both location permissions are denied', async () => {
    jest
      .spyOn(PermissionsAndroid, 'requestMultiple')
      .mockResolvedValue(permissionResults('denied', 'denied'));

    const result = await requestLocationPermission();
    expect(result).toBe('denied');
  });

  it('returns "blocked" when precise location is permanently denied', async () => {
    jest
      .spyOn(PermissionsAndroid, 'requestMultiple')
      .mockResolvedValue(
        permissionResults('never_ask_again', 'never_ask_again'),
      );

    const result = await requestLocationPermission();
    expect(result).toBe('blocked');
  });

  it('distinguishes an approximate-only grant from denied permission', async () => {
    jest
      .spyOn(PermissionsAndroid, 'requestMultiple')
      .mockResolvedValue(permissionResults('never_ask_again', 'granted'));

    expect(await requestLocationPermission()).toBe('approximate');
  });

  it('returns "denied" when PermissionsAndroid.requestMultiple throws', async () => {
    jest
      .spyOn(PermissionsAndroid, 'requestMultiple')
      .mockRejectedValue(new Error('Native crash'));
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const result = await requestLocationPermission();
    expect(result).toBe('denied');
    warnSpy.mockRestore();
  });

  it('returns "granted" on iOS (no PermissionsAndroid dialog needed)', async () => {
    setPlatformOS('ios');

    const result = await requestLocationPermission();
    expect(result).toBe('granted');
  });
});

// ─── Tests: checkLocationPermission ───────────────────────────────────────────

describe('checkLocationPermission', () => {
  beforeEach(() => {
    setPlatformOS('android');
  });

  afterEach(() => {
    setPlatformOS('android');
  });

  it('returns "granted" when permission is already granted', async () => {
    jest.spyOn(PermissionsAndroid, 'check').mockResolvedValue(true);

    const result = await checkLocationPermission();
    expect(result).toBe('granted');
  });

  it('returns "denied" when permission is not granted', async () => {
    jest.spyOn(PermissionsAndroid, 'check').mockResolvedValue(false);

    const result = await checkLocationPermission();
    expect(result).toBe('denied');
  });

  it('returns "approximate" when only coarse location is granted', async () => {
    jest
      .spyOn(PermissionsAndroid, 'check')
      .mockImplementation(
        async permission =>
          permission === PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      );

    expect(await checkLocationPermission()).toBe('approximate');
  });

  it('returns "denied" if a permission check fails', async () => {
    jest
      .spyOn(PermissionsAndroid, 'check')
      .mockRejectedValue(new Error('Native failure'));
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    expect(await checkLocationPermission()).toBe('denied');
    warnSpy.mockRestore();
  });

  it('returns "granted" on iOS without checking PermissionsAndroid', async () => {
    setPlatformOS('ios');
    const checkSpy = jest
      .spyOn(PermissionsAndroid, 'check')
      .mockResolvedValue(false);
    checkSpy.mockClear(); // clear any prior calls

    const result = await checkLocationPermission();
    expect(result).toBe('granted');
    // When OS is 'ios', we should short-circuit before calling PermissionsAndroid.check
    expect(checkSpy).not.toHaveBeenCalled();
    checkSpy.mockRestore();
  });
});

// ─── Tests: describeGeoError ──────────────────────────────────────────────────

describe('describeGeoError', () => {
  it('describes PERMISSION_DENIED (code 1)', () => {
    const msg = describeGeoError(makeGeoError(1) as any);
    expect(msg).toMatch(/permission/i);
  });

  it('describes POSITION_UNAVAILABLE (code 2)', () => {
    const msg = describeGeoError(makeGeoError(2) as any);
    expect(msg).toMatch(/unavailable/i);
  });

  it('describes TIMEOUT (code 3)', () => {
    const msg = describeGeoError(makeGeoError(3) as any);
    expect(msg).toMatch(/timed out/i);
  });

  it('returns a fallback for unknown codes', () => {
    const msg = describeGeoError(makeGeoError(99, 'Unknown') as any);
    expect(msg).toMatch(/99/);
  });
});

// ─── Tests: getCurrentLocation ────────────────────────────────────────────────

describe('getCurrentLocation', () => {
  beforeEach(() => {
    mockGetCurrentPosition.mockClear();
  });

  it('resolves with mapped coordinates on success', async () => {
    const geoPos = makeGeoPosition(26.8678, 75.7965);

    mockGetCurrentPosition.mockImplementation(
      (successCb: (p: any) => void, _errCb: any, _opts: any) => {
        successCb(geoPos);
      },
    );

    const coords = await getCurrentLocation();

    expect(coords.latitude).toBeCloseTo(26.8678);
    expect(coords.longitude).toBeCloseTo(75.7965);
    expect(coords.accuracy).toBe(10);
    expect(coords.timestamp).toBe(1696166400000);
  });

  it('rejects with GeolocationError on failure', async () => {
    const geoErr = makeGeoError(2, 'Provider unavailable');

    mockGetCurrentPosition.mockImplementation(
      (_successCb: any, errCb: (e: any) => void, _opts: any) => {
        errCb(geoErr);
      },
    );

    // Suppress expected console.warn in this test
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    await expect(getCurrentLocation()).rejects.toMatchObject({ code: 2 });
    warnSpy.mockRestore();
  });
});

// ─── Tests: startLocationUpdates / stopLocationUpdates ────────────────────────

describe('startLocationUpdates', () => {
  beforeEach(() => {
    mockWatchPosition.mockClear();
    mockClearWatch.mockClear();
  });

  it('calls watchPosition and returns a watcherId', () => {
    mockWatchPosition.mockReturnValue(42);

    const id = startLocationUpdates({
      onLocation: jest.fn(),
      onError: jest.fn(),
    });

    expect(mockWatchPosition).toHaveBeenCalledTimes(1);
    expect(id).toBe(42);
  });

  it('calls onLocation callback when a position update arrives', () => {
    const geoPos = makeGeoPosition();
    const onLocation = jest.fn();

    mockWatchPosition.mockImplementation(
      (successCb: (p: any) => void, _errCb: any, _opts: any) => {
        successCb(geoPos);
        return 10;
      },
    );

    startLocationUpdates({ onLocation, onError: jest.fn() });

    expect(onLocation).toHaveBeenCalledTimes(1);
    expect(onLocation.mock.calls[0][0]).toMatchObject({
      latitude: geoPos.coords.latitude,
      longitude: geoPos.coords.longitude,
    });
  });

  it('calls onError callback when a watch error occurs', () => {
    const geoErr = makeGeoError(2, 'GPS off');
    const onError = jest.fn();

    // Suppress expected console.warn
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    mockWatchPosition.mockImplementation(
      (_successCb: any, errCb: (e: any) => void, _opts: any) => {
        errCb(geoErr);
        return 11;
      },
    );

    startLocationUpdates({ onLocation: jest.fn(), onError });

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][1]).toBe(2); // code

    warnSpy.mockRestore();
  });
});

describe('stopLocationUpdates', () => {
  beforeEach(() => {
    mockClearWatch.mockClear();
  });

  it('calls clearWatch with the given watcherId', () => {
    stopLocationUpdates(42);
    expect(mockClearWatch).toHaveBeenCalledWith(42);
  });

  it('is a no-op when called with null', () => {
    stopLocationUpdates(null);
    expect(mockClearWatch).not.toHaveBeenCalled();
  });
});

describe('foreground watcher health checks', () => {
  let onLocation: jest.Mock;
  let onError: jest.Mock;
  let watchSuccess: (position: ReturnType<typeof makeGeoPosition>) => void;
  let watchError: (error: ReturnType<typeof makeGeoError>) => void;
  let probeSuccess: (position: ReturnType<typeof makeGeoPosition>) => void;
  let probeError: (error: ReturnType<typeof makeGeoError>) => void;

  beforeEach(() => {
    onLocation = jest.fn();
    onError = jest.fn();
    mockWatchPosition.mockImplementation((success, error) => {
      watchSuccess = success;
      watchError = error;
      return 101;
    });
    mockGetCurrentPosition.mockImplementation((success, error) => {
      probeSuccess = success;
      probeError = error;
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('detects a disabled provider after watch silence using a fresh bounded request', () => {
    startLocationUpdates({ onLocation, onError });
    jest.advanceTimersByTime(20000);
    expect(mockGetCurrentPosition).toHaveBeenCalledTimes(1);
    expect(mockGetCurrentPosition.mock.calls[0][2]).toMatchObject({
      maximumAge: 0,
      timeout: 15000,
    });
    probeError(makeGeoError(2, 'No location provider available'));
    expect(onError).toHaveBeenCalledWith(
      expect.stringMatching(/unavailable/i),
      2,
    );
  });

  it('keeps a stationary bus valid when its fresh health fix succeeds', () => {
    startLocationUpdates({ onLocation, onError });
    watchSuccess(makeGeoPosition());
    jest.advanceTimersByTime(20000);
    probeSuccess(makeGeoPosition());
    expect(onLocation).toHaveBeenCalledTimes(2);
    expect(onError).not.toHaveBeenCalled();
    jest.advanceTimersByTime(20000);
    expect(mockGetCurrentPosition).toHaveBeenCalledTimes(2);
  });

  it('defers health probes while watch updates arrive', () => {
    startLocationUpdates({ onLocation, onError });
    jest.advanceTimersByTime(15000);
    watchSuccess(makeGeoPosition());
    jest.advanceTimersByTime(15000);
    expect(mockGetCurrentPosition).not.toHaveBeenCalled();
    jest.advanceTimersByTime(5000);
    expect(mockGetCurrentPosition).toHaveBeenCalledTimes(1);
  });

  it('never overlaps probes and resumes checks after a failed probe', () => {
    startLocationUpdates({ onLocation, onError });
    jest.advanceTimersByTime(20000);
    jest.advanceTimersByTime(60000);
    watchSuccess(makeGeoPosition());
    jest.advanceTimersByTime(60000);
    expect(mockGetCurrentPosition).toHaveBeenCalledTimes(1);
    probeError(makeGeoError(3, 'Timeout'));
    jest.advanceTimersByTime(20000);
    expect(mockGetCurrentPosition).toHaveBeenCalledTimes(2);
  });

  it.each(['success', 'error'])(
    'ignores a stale probe %s after a newer watch fix arrives',
    result => {
      startLocationUpdates({onLocation, onError});
      jest.advanceTimersByTime(20000);
      const freshPosition = makeGeoPosition(26.87, 75.81);
      watchSuccess(freshPosition);
      if (result === 'success') {
        probeSuccess(makeGeoPosition());
      } else {
        probeError(makeGeoError(3, 'Old request timed out'));
      }
      expect(onLocation).toHaveBeenCalledTimes(1);
      expect(onLocation).toHaveBeenLastCalledWith(
        expect.objectContaining({latitude: 26.87, longitude: 75.81}),
      );
      expect(onError).not.toHaveBeenCalled();
      jest.advanceTimersByTime(20000);
      expect(mockGetCurrentPosition).toHaveBeenCalledTimes(2);
    },
  );

  it('clears scheduled health work when stopped and ignores late watch events', () => {
    const id = startLocationUpdates({ onLocation, onError });
    stopLocationUpdates(id);
    jest.advanceTimersByTime(60000);
    watchSuccess(makeGeoPosition());
    watchError(makeGeoError(2));
    expect(mockGetCurrentPosition).not.toHaveBeenCalled();
    expect(onLocation).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it('ignores an in-flight probe finishing after stop and schedules no further checks', () => {
    const id = startLocationUpdates({ onLocation, onError });
    jest.advanceTimersByTime(20000);
    stopLocationUpdates(id);
    probeSuccess(makeGeoPosition());
    probeError(makeGeoError(2));
    jest.advanceTimersByTime(60000);
    expect(mockGetCurrentPosition).toHaveBeenCalledTimes(1);
    expect(onLocation).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });
});
