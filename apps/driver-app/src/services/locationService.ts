/**
 * locationService.ts
 *
 * Foreground GPS service for the UniTransit Driver App.
 *
 * Responsibilities:
 *  - Request / check Android location permission via PermissionsAndroid
 *  - Get a one-shot current location
 *  - Start / stop a foreground location watcher
 *  - Expose clean error messages for every failure case
 *
 * What this module does NOT do:
 *  - No MongoDB / backend calls (future milestone)
 *  - No background location tracking (future milestone)
 *  - No student-app consumption of data
 */

import Geolocation, {
  GeolocationError,
  GeolocationResponse,
  GeolocationOptions,
} from '@react-native-community/geolocation';
import {PermissionsAndroid, Platform} from 'react-native';
import {LocationCoordinates} from '../types/driver';

// ─── Constants ────────────────────────────────────────────────────────────────

/** Shared options for getCurrentPosition and watchPosition. */
const GEO_OPTIONS: GeolocationOptions = {
  enableHighAccuracy: true,
  timeout: 15000,       // 15 s before timing out
  maximumAge: 5000,     // accept a cached fix up to 5 s old
};

/** Watch options – slightly looser timeout for continuous updates. */
const WATCH_OPTIONS: GeolocationOptions = {
  enableHighAccuracy: true,
  timeout: 20000,
  maximumAge: 0,        // always fetch fresh position while watching
  distanceFilter: 5,    // only fire callback if driver moves ≥ 5 m
};

// ─── Types ────────────────────────────────────────────────────────────────────

export type PermissionResult =
  | 'granted'
  | 'denied'
  | 'blocked'    // "Don't ask again" selected
  | 'unavailable'; // non-Android where PermissionsAndroid is N/A

// ─── Android Permission ───────────────────────────────────────────────────────

/**
 * Request ACCESS_FINE_LOCATION permission on Android.
 * On iOS the permission is handled by Geolocation itself (not needed here).
 *
 * Returns:
 *  'granted'     – user allowed
 *  'denied'      – user denied (can ask again next time)
 *  'blocked'     – user selected "Don't ask again"
 *  'unavailable' – not Android (no PermissionsAndroid)
 */
export async function requestLocationPermission(): Promise<PermissionResult> {
  if (Platform.OS !== 'android') {
    // iOS permission is requested automatically by Geolocation on first use
    return 'granted';
  }

  try {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'UniTransit – Location Permission',
        message:
          'UniTransit needs access to your GPS location to broadcast your ' +
          'bus position to students during an active trip.',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
        buttonNeutral: 'Ask Me Later',
      },
    );

    if (result === PermissionsAndroid.RESULTS.GRANTED) {
      return 'granted';
    }

    if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      return 'blocked';
    }

    return 'denied';
  } catch (err) {
    console.warn('[LocationService] requestLocationPermission error:', err);
    return 'denied';
  }
}

/**
 * Check the current Android location permission status without prompting.
 *
 * Returns the same set of values as requestLocationPermission().
 */
export async function checkLocationPermission(): Promise<PermissionResult> {
  if (Platform.OS !== 'android') {
    return 'granted';
  }

  try {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    return granted ? 'granted' : 'denied';
  } catch (err) {
    console.warn('[LocationService] checkLocationPermission error:', err);
    return 'denied';
  }
}

// ─── Coordinate Mapping ───────────────────────────────────────────────────────

/** Map a raw GeolocationResponse into our typed LocationCoordinates. */
function mapPosition(pos: GeolocationResponse): LocationCoordinates {
  return {
    latitude: pos.coords.latitude,
    longitude: pos.coords.longitude,
    accuracy: pos.coords.accuracy,
    altitude: pos.coords.altitude,
    heading: pos.coords.heading,
    speed: pos.coords.speed,
    timestamp: pos.timestamp,
  };
}

// ─── Error Handling ───────────────────────────────────────────────────────────

/**
 * Map a native GeoError code to a user-readable message.
 *
 * GeoError codes (W3C / Android):
 *  1 – PERMISSION_DENIED
 *  2 – POSITION_UNAVAILABLE (GPS hardware / provider unavailable)
 *  3 – TIMEOUT
 */
export function describeGeoError(err: GeolocationError): string {
  switch (err.code) {
    case 1:
      return 'Location permission was denied. Please allow location access in Settings.';
    case 2:
      return 'GPS / location services are unavailable. Please enable Location in device Settings.';
    case 3:
      return 'Location request timed out. Please ensure GPS signal is available and try again.';
    default:
      return `Location error (code ${err.code}): ${err.message}`;
  }
}

// ─── One-Shot Current Location ────────────────────────────────────────────────

/**
 * Obtain the device's current GPS position once.
 *
 * Resolves with LocationCoordinates on success.
 * Rejects with { code, message } (GeoError shape) on failure.
 */
export function getCurrentLocation(): Promise<LocationCoordinates> {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (pos: GeolocationResponse) => {
        resolve(mapPosition(pos));
      },
      (err: GeolocationError) => {
        console.warn('[LocationService] getCurrentPosition error:', err);
        reject(err);
      },
      GEO_OPTIONS,
    );
  });
}

// ─── Continuous Foreground Watch ──────────────────────────────────────────────

/** Opaque watcher ID returned by watchPosition – used to clear it later. */
type WatcherId = number;

/** Callbacks provided by the caller to receive updates / errors. */
export interface LocationWatchCallbacks {
  onLocation: (coords: LocationCoordinates) => void;
  onError: (message: string, code: number) => void;
}

/**
 * Start a foreground location watcher.
 *
 * Returns a numeric watcherId that MUST be passed to stopLocationUpdates()
 * when the caller unmounts or stops tracking.
 *
 * Guards:
 *  - Caller is responsible for ensuring permission is granted before calling.
 *  - Duplicate subscriptions are the caller's responsibility (pass the
 *    previous watcherId to stopLocationUpdates first).
 */
export function startLocationUpdates(
  callbacks: LocationWatchCallbacks,
): WatcherId {
  const watcherId = Geolocation.watchPosition(
    (pos: GeolocationResponse) => {
      callbacks.onLocation(mapPosition(pos));
    },
    (err: GeolocationError) => {
      console.warn('[LocationService] watchPosition error:', err);
      callbacks.onError(describeGeoError(err), err.code);
    },
    WATCH_OPTIONS,
  );

  return watcherId;
}

/**
 * Stop a previously started foreground location watcher.
 *
 * Safe to call with a null/undefined watcherId (no-op).
 */
export function stopLocationUpdates(watcherId: WatcherId | null): void {
  if (watcherId !== null && watcherId !== undefined) {
    Geolocation.clearWatch(watcherId);
  }
}
