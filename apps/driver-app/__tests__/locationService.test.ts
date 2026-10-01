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

import {PermissionsAndroid, Platform} from 'react-native';

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
  return {code, message, PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3};
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

  it('returns "granted" when PermissionsAndroid.request returns GRANTED', async () => {
    jest
      .spyOn(PermissionsAndroid, 'request')
      .mockResolvedValue(PermissionsAndroid.RESULTS.GRANTED);

    const result = await requestLocationPermission();
    expect(result).toBe('granted');
  });

  it('returns "denied" when PermissionsAndroid.request returns DENIED', async () => {
    jest
      .spyOn(PermissionsAndroid, 'request')
      .mockResolvedValue(PermissionsAndroid.RESULTS.DENIED);

    const result = await requestLocationPermission();
    expect(result).toBe('denied');
  });

  it('returns "blocked" when PermissionsAndroid.request returns NEVER_ASK_AGAIN', async () => {
    jest
      .spyOn(PermissionsAndroid, 'request')
      .mockResolvedValue(PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN);

    const result = await requestLocationPermission();
    expect(result).toBe('blocked');
  });

  it('returns "denied" when PermissionsAndroid.request throws', async () => {
    jest
      .spyOn(PermissionsAndroid, 'request')
      .mockRejectedValue(new Error('Native crash'));

    const result = await requestLocationPermission();
    expect(result).toBe('denied');
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
    jest
      .spyOn(PermissionsAndroid, 'check')
      .mockResolvedValue(true);

    const result = await checkLocationPermission();
    expect(result).toBe('granted');
  });

  it('returns "denied" when permission is not granted', async () => {
    jest
      .spyOn(PermissionsAndroid, 'check')
      .mockResolvedValue(false);

    const result = await checkLocationPermission();
    expect(result).toBe('denied');
  });

  it('returns "granted" on iOS without checking PermissionsAndroid', async () => {
    setPlatformOS('ios');
    const checkSpy = jest.spyOn(PermissionsAndroid, 'check').mockResolvedValue(false);
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
    await expect(getCurrentLocation()).rejects.toMatchObject({code: 2});
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

    startLocationUpdates({onLocation, onError: jest.fn()});

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

    startLocationUpdates({onLocation: jest.fn(), onError});

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
