/** Foreground GPS state shared by the trip screens. */

import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { LocationState, LocationStatus, LocationUploadState } from '../types/driver';
import {
  checkLocationPermission,
  describeGeoError,
  getCurrentLocation,
  PermissionResult,
  requestLocationPermission,
  startLocationUpdates,
  stopLocationUpdates,
} from '../services/locationService';
import {
  INITIAL_UPLOAD_STATE,
  TripLocationUploader,
} from '../services/tripLocationApi';

const INITIAL_STATE: LocationState = {
  status: 'idle',
  coordinates: null,
  errorMessage: null,
};

export interface UseLocationOptions {
  tripId?: string | null;
  authToken?: string | null;
  baseUrl?: string;
  uploadIntervalMs?: number;
}

export interface UseLocationReturn {
  locationState: LocationState;
  uploadState: LocationUploadState;
  startTracking: (tripContext?: { tripId?: string; authToken?: string }) => Promise<void>;
  stopTracking: () => void;
}

export function useLocation(options?: UseLocationOptions): UseLocationReturn {
  const [locationState, setLocationState] =
    useState<LocationState>(INITIAL_STATE);
  const [uploadState, setUploadState] =
    useState<LocationUploadState>(INITIAL_UPLOAD_STATE);

  const watcherIdRef = useRef<number | null>(null);
  const sessionRef = useRef(0);
  const startingSessionRef = useRef<number | null>(null);
  const trackingRequestedRef = useRef(false);
  const mountedRef = useRef(true);
  const appStateRef = useRef<string | null>(AppState.currentState ?? null);
  const permissionPromiseRef = useRef<Promise<PermissionResult> | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const activeTripContextRef = useRef<{ tripId?: string; authToken?: string } | null>(null);

  const uploaderRef = useRef<TripLocationUploader | null>(null);
  if (!uploaderRef.current) {
    uploaderRef.current = new TripLocationUploader(state => {
      if (mountedRef.current) {
        setUploadState(state);
      }
    });
  }

  const isForeground = useCallback(
    () => appStateRef.current === 'active' || appStateRef.current === null,
    [],
  );

  const cancelSession = useCallback(() => {
    // Invalidate pending permission/fix results and already queued callbacks.
    sessionRef.current += 1;
    startingSessionRef.current = null;
    if (watcherIdRef.current !== null) {
      stopLocationUpdates(watcherIdRef.current);
      watcherIdRef.current = null;
    }
  }, []);

  const getPermission = useCallback(() => {
    // A permission dialog can change AppState. Reuse its result when a resumed
    // session starts, rather than opening a second dialog or losing the grant.
    if (!permissionPromiseRef.current) {
      const pending = (async () => {
        const permission = await checkLocationPermission();
        return permission === 'granted' ||
          !mountedRef.current ||
          !trackingRequestedRef.current ||
          !isForeground()
          ? permission
          : requestLocationPermission();
      })();
      permissionPromiseRef.current = pending;
      const clearPending = () => {
        if (permissionPromiseRef.current === pending) {
          permissionPromiseRef.current = null;
        }
      };
      pending.then(clearPending, clearPending);
    }
    return permissionPromiseRef.current;
  }, [isForeground]);

  const beginSession = useCallback(async () => {
    if (
      !mountedRef.current ||
      !trackingRequestedRef.current ||
      !isForeground() ||
      startingSessionRef.current !== null ||
      watcherIdRef.current !== null
    ) {
      return;
    }

    const session = ++sessionRef.current;
    startingSessionRef.current = session;
    const isCurrent = () =>
      mountedRef.current &&
      trackingRequestedRef.current &&
      sessionRef.current === session &&
      isForeground();
    const setStatus = (
      status: LocationStatus,
      errorMessage: string | null = null,
    ) => {
      if (isCurrent()) {
        setLocationState({ status, coordinates: null, errorMessage });
      }
    };

    try {
      setStatus('requesting_permission');
      const permission = await getPermission();
      if (!isCurrent()) {
        return;
      }
      if (permission !== 'granted') {
        if (permission === 'blocked') {
          setStatus(
            'permission_blocked',
            'Location permission is permanently denied. Please enable precise location in Android Settings → App Info → Permissions.',
          );
        } else {
          setStatus(
            'permission_denied',
            permission === 'approximate'
              ? 'Precise location is required for bus GPS tracking. Please enable Precise location in Android Settings → App Info → Permissions.'
              : 'Location permission is required to track your bus position.',
          );
        }
        return;
      }

      setStatus('acquiring_location');
      try {
        const coordinates = await getCurrentLocation();
        if (!isCurrent()) {
          return;
        }
        setLocationState({
          status: 'tracking',
          coordinates,
          errorMessage: null,
        });
        if (uploaderRef.current) {
          uploaderRef.current.enqueueLocation(coordinates);
        }
      } catch (error) {
        if (!isCurrent()) {
          return;
        }
        const code = (error as { code?: number } | null)?.code;
        // A timed-out first fix can still be followed by a successful watch.
        if (code !== 3) {
          throw error;
        }
      }

      if (!isCurrent()) {
        return;
      }
      let permissionFailed = false;
      const id = startLocationUpdates({
        onLocation: coordinates => {
          if (isCurrent() && !permissionFailed) {
            setLocationState({
              status: 'tracking',
              coordinates,
              errorMessage: null,
            });
            if (uploaderRef.current) {
              uploaderRef.current.enqueueLocation(coordinates);
            }
          }
        },
        onError: (message, code) => {
          if (!isCurrent()) {
            return;
          }
          if (code === 1) {
            permissionFailed = true;
            if (watcherIdRef.current !== null) {
              stopLocationUpdates(watcherIdRef.current);
              watcherIdRef.current = null;
            }
            setStatus('permission_denied', message);
          } else {
            setStatus(code === 2 ? 'location_unavailable' : 'error', message);
          }
        },
      });
      if (!isCurrent() || permissionFailed) {
        stopLocationUpdates(id);
      } else {
        watcherIdRef.current = id;
      }
    } catch (error) {
      if (!isCurrent()) {
        return;
      }
      const nativeError = error as { code?: number; message?: string } | null;
      const code = nativeError?.code;
      const message =
        typeof code === 'number'
          ? describeGeoError({ code, message: nativeError?.message ?? '' })
          : 'Unable to start GPS tracking. Please try again.';
      setStatus(
        code === 1
          ? 'permission_denied'
          : code === 2
          ? 'location_unavailable'
          : 'error',
        message,
      );
    } finally {
      // A canceled request must not unlock a newer session's startup guard.
      if (startingSessionRef.current === session) {
        startingSessionRef.current = null;
      }
    }
  }, [getPermission, isForeground]);

  const startTracking = useCallback(
    async (tripContext?: { tripId?: string; authToken?: string }) => {
      if (tripContext) {
        activeTripContextRef.current = tripContext;
      }
      const effectiveTripId =
        tripContext?.tripId ?? optionsRef.current?.tripId ?? null;
      const effectiveToken =
        tripContext?.authToken ?? optionsRef.current?.authToken ?? null;

      if (effectiveTripId && effectiveToken && uploaderRef.current) {
        uploaderRef.current.start({
          tripId: effectiveTripId,
          authToken: effectiveToken,
          baseUrl: optionsRef.current?.baseUrl,
          uploadIntervalMs: optionsRef.current?.uploadIntervalMs,
        });
      }

      trackingRequestedRef.current = true;
      await beginSession();
    },
    [beginSession],
  );

  const stopTracking = useCallback(() => {
    trackingRequestedRef.current = false;
    activeTripContextRef.current = null;
    if (uploaderRef.current) {
      uploaderRef.current.stop();
    }
    cancelSession();
    if (mountedRef.current) {
      setLocationState(INITIAL_STATE);
      setUploadState(INITIAL_UPLOAD_STATE);
    }
  }, [cancelSession]);

  useEffect(() => {
    mountedRef.current = true;
    const subscription = AppState.addEventListener('change', nextState => {
      const wasForeground = isForeground();
      appStateRef.current = nextState;
      if (!isForeground()) {
        if (uploaderRef.current) {
          uploaderRef.current.stop();
        }
        cancelSession();
        setLocationState(INITIAL_STATE);
        setUploadState(INITIAL_UPLOAD_STATE);
      } else if (!wasForeground && trackingRequestedRef.current) {
        const effectiveTripId =
          activeTripContextRef.current?.tripId ??
          optionsRef.current?.tripId ??
          null;
        const effectiveToken =
          activeTripContextRef.current?.authToken ??
          optionsRef.current?.authToken ??
          null;
        if (effectiveTripId && effectiveToken && uploaderRef.current) {
          uploaderRef.current.start({
            tripId: effectiveTripId,
            authToken: effectiveToken,
            baseUrl: optionsRef.current?.baseUrl,
            uploadIntervalMs: optionsRef.current?.uploadIntervalMs,
          });
        }
        beginSession().catch(error => {
          console.warn('[useLocation] resume failed:', error);
        });
      }
    });

    return () => {
      mountedRef.current = false;
      trackingRequestedRef.current = false;
      activeTripContextRef.current = null;
      if (uploaderRef.current) {
        uploaderRef.current.stop();
      }
      cancelSession();
      subscription.remove();
    };
  }, [beginSession, cancelSession, isForeground]);

  return { locationState, uploadState, startTracking, stopTracking };
}
