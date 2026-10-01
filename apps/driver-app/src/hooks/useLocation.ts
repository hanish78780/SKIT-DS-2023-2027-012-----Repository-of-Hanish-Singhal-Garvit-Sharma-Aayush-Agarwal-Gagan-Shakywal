/**
 * useLocation.ts
 *
 * Custom React hook that wraps the locationService and exposes a clean,
 * state-driven GPS interface to screen components.
 *
 * Usage:
 *   const { locationState, startTracking, stopTracking } = useLocation();
 *
 * The hook:
 *  - Manages LocationState transitions
 *  - Prevents duplicate watch subscriptions
 *  - Cleans up the watcher on unmount automatically
 *  - Does NOT trigger GPS on mount; caller must explicitly call startTracking()
 */

import {useCallback, useEffect, useRef, useState} from 'react';
import {LocationCoordinates, LocationState, LocationStatus} from '../types/driver';
import {
  checkLocationPermission,
  describeGeoError,
  getCurrentLocation,
  requestLocationPermission,
  startLocationUpdates,
  stopLocationUpdates,
} from '../services/locationService';

// ─── Initial State ────────────────────────────────────────────────────────────

const INITIAL_STATE: LocationState = {
  status: 'idle',
  coordinates: null,
  errorMessage: null,
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseLocationReturn {
  locationState: LocationState;
  startTracking: () => Promise<void>;
  stopTracking: () => void;
}

export function useLocation(): UseLocationReturn {
  const [locationState, setLocationState] =
    useState<LocationState>(INITIAL_STATE);

  /** Ref to the active watchPosition watcher ID. null = not watching. */
  const watcherIdRef = useRef<number | null>(null);

  /** Guard: prevent double-start if the user taps rapidly. */
  const isStartingRef = useRef<boolean>(false);

  // ── Helpers ────────────────────────────────────────────────────────────────

  function setStatus(status: LocationStatus, errorMessage: string | null = null) {
    setLocationState(prev => ({...prev, status, errorMessage}));
  }

  function setCoordinates(coordinates: LocationCoordinates) {
    setLocationState({
      status: 'tracking',
      coordinates,
      errorMessage: null,
    });
  }

  // ── startTracking ──────────────────────────────────────────────────────────

  const startTracking = useCallback(async () => {
    // Prevent duplicate calls
    if (isStartingRef.current) {
      return;
    }

    // If already tracking, do nothing
    if (watcherIdRef.current !== null) {
      return;
    }

    isStartingRef.current = true;

    try {
      // 1. Request permission
      setStatus('requesting_permission');

      let permission = await checkLocationPermission();

      if (permission !== 'granted') {
        permission = await requestLocationPermission();
      }

      if (permission === 'blocked') {
        setStatus(
          'permission_blocked',
          'Location permission is permanently denied. Please enable it in Android Settings → App Info → Permissions.',
        );
        isStartingRef.current = false;
        return;
      }

      if (permission === 'denied') {
        setStatus(
          'permission_denied',
          'Location permission is required to track your bus position.',
        );
        isStartingRef.current = false;
        return;
      }

      // 2. Get initial fix
      setStatus('acquiring_location');

      try {
        const initialCoords = await getCurrentLocation();
        setCoordinates(initialCoords);
      } catch (err: any) {
        // Code 2 = POSITION_UNAVAILABLE → device GPS is off
        if (err?.code === 2) {
          setStatus(
            'location_unavailable',
            'GPS / Location services are disabled on this device. Please enable them in Settings.',
          );
          isStartingRef.current = false;
          return;
        }
        // Code 3 = timeout – not fatal, continue to watch
        if (err?.code !== 3) {
          setStatus('error', describeGeoError(err));
          isStartingRef.current = false;
          return;
        }
        // On timeout fall-through: start the watcher anyway; it may find a fix
        setStatus('acquiring_location');
      }

      // 3. Start continuous watcher
      // If a previous watcher somehow exists, clear it first
      if (watcherIdRef.current !== null) {
        stopLocationUpdates(watcherIdRef.current);
        watcherIdRef.current = null;
      }

      const id = startLocationUpdates({
        onLocation: coords => {
          setCoordinates(coords);
        },
        onError: (message, code) => {
          if (code === 2) {
            setStatus('location_unavailable', message);
          } else {
            setStatus('error', message);
          }
        },
      });

      watcherIdRef.current = id;
    } finally {
      isStartingRef.current = false;
    }
  }, []);

  // ── stopTracking ───────────────────────────────────────────────────────────

  const stopTracking = useCallback(() => {
    if (watcherIdRef.current !== null) {
      stopLocationUpdates(watcherIdRef.current);
      watcherIdRef.current = null;
    }
    setLocationState(INITIAL_STATE);
  }, []);

  // ── Cleanup on unmount ─────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (watcherIdRef.current !== null) {
        stopLocationUpdates(watcherIdRef.current);
        watcherIdRef.current = null;
      }
    };
  }, []);

  return {locationState, startTracking, stopTracking};
}
