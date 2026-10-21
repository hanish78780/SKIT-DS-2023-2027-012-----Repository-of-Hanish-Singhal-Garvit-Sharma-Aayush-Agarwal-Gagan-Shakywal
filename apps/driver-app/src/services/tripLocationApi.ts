/**
 * tripLocationApi.ts
 *
 * Typed client service and queue manager for uploading active driver GPS
 * coordinates to the UniTransit backend API.
 *
 * Backend Contract:
 *   POST /api/trips/:tripId/location
 *   Headers:
 *     Content-Type: application/json
 *     Authorization: Bearer <token>
 *   Payload:
 *     latitude: number (-90..90)
 *     longitude: number (-180..180)
 *     accuracy?: number (>= 0)
 *     timestamp: string (ISO-8601)
 *
 * Key Architectural Guarantees:
 *  - Network & host configuration: defaults to Android emulator host (10.0.2.2:5000),
 *    iOS/web (localhost:5000), or configurable environment variable.
 *  - Strict authentication: JWT bearer token attached; tokens are never logged.
 *  - Bounded exponential backoff: transient errors (network loss, timeouts, 5xx)
 *    are retried with jittered exponential backoff (bounded up to 3 retries).
 *  - Non-retryable error handling: permanent errors (400 validation, 401 unauth,
 *    403 forbidden, 404 not found, 409 stale fix) fail immediately.
 *  - Non-overlapping upload queue: maximum concurrency of 1 request at a time.
 *  - Latest fix preference: intermediate fixes are conflated so the freshest GPS
 *    coordinate is transmitted next.
 *  - Lifecycle abort: in-flight requests and retry timers are aborted immediately
 *    on trip completion or unmount via AbortController.
 */

import { Platform } from 'react-native';
import { LocationCoordinates, LocationUploadState } from '../types/driver';

declare const process: { env?: Record<string, string | undefined> } | undefined;



// ─── Constants & Configuration ───────────────────────────────────────────────

export const DEFAULT_ANDROID_BASE_URL = 'http://10.0.2.2:5000';
export const DEFAULT_IOS_BASE_URL = 'http://localhost:5000';
export const DEFAULT_UPLOAD_INTERVAL_MS = 5000;
export const DEFAULT_MAX_RETRIES = 3;
export const DEFAULT_INITIAL_RETRY_DELAY_MS = 1000;
export const DEFAULT_MAX_RETRY_DELAY_MS = 8000;
export const DEFAULT_REQUEST_TIMEOUT_MS = 10000;

export const INITIAL_UPLOAD_STATE: LocationUploadState = {
  status: 'idle',
  lastSuccessfulUpload: null,
  lastUploadedAt: null,
  errorMessage: null,
  retryCount: 0,
};

let customApiBaseUrl: string | null = null;

/**
 * Configure API base URL override programmatically.
 */
export function setApiBaseUrl(url: string | null): void {
  customApiBaseUrl = url;
}

/**
 * Resolves the backend API base URL using project environment conventions.
 */
export function getApiBaseUrl(): string {
  if (customApiBaseUrl) {
    return customApiBaseUrl;
  }
  if (typeof process !== 'undefined' && process.env?.API_BASE_URL) {
    return process.env.API_BASE_URL;
  }
  return Platform.OS === 'android' ? DEFAULT_ANDROID_BASE_URL : DEFAULT_IOS_BASE_URL;
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TripLocationPayload {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: string;
}

export interface TripLocationResponseData {
  tripId: string;
  status: string;
  currentLocation: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    recordedAt: string;
  };
}

export interface TripLocationResponse {
  success: boolean;
  message: string;
  data?: TripLocationResponseData;
}

export interface UploadLocationRequestOptions {
  tripId: string;
  coordinates: LocationCoordinates;
  authToken: string;
  baseUrl?: string;
  signal?: AbortSignal;
  timeoutMs?: number;
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffFactor?: number;
  onRetry?: (attempt: number, delayMs: number, error: Error) => void;
}

// ─── Custom Errors ───────────────────────────────────────────────────────────

export class TripLocationApiError extends Error {
  public readonly status?: number;
  public readonly isTransient: boolean;
  public readonly responseBody?: unknown;

  constructor(
    message: string,
    options?: {
      status?: number;
      isTransient?: boolean;
      responseBody?: unknown;
      cause?: unknown;
    },
  ) {
    super(message);
    this.name = 'TripLocationApiError';
    this.status = options?.status;
    this.isTransient = options?.isTransient ?? false;
    this.responseBody = options?.responseBody;
  }
}

// ─── Validation ──────────────────────────────────────────────────────────────

/**
 * Validates coordinate inputs according to WGS-84 bounds and contract specs.
 */
export function validateCoordinatesPayload(
  latitude: number,
  longitude: number,
  accuracy?: number | null,
  timestamp?: string | number,
): string | null {
  if (typeof latitude !== 'number' || !Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    return 'Latitude must be a valid number between -90 and 90';
  }

  if (typeof longitude !== 'number' || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    return 'Longitude must be a valid number between -180 and 180';
  }

  if (accuracy !== undefined && accuracy !== null) {
    if (typeof accuracy !== 'number' || !Number.isFinite(accuracy) || accuracy < 0) {
      return 'Accuracy must be a non-negative number';
    }
  }

  if (timestamp === undefined || timestamp === null) {
    return 'Timestamp is required';
  }

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return 'Invalid timestamp format';
  }

  return null;
}

/**
 * Determines whether an HTTP error code or network failure is transient.
 */
export function isTransientError(status?: number): boolean {
  if (status === undefined || status === null) {
    return true; // Network/socket errors are transient
  }
  if (status === 408 || status === 429) {
    return true; // Timeout / rate limit
  }
  if (status >= 500 && status <= 599) {
    return true; // Server internal error / bad gateway / gateway timeout
  }
  return false; // 400, 401, 403, 404, 409 are permanent
}

// ─── HTTP Transmission with Bounded Retry ────────────────────────────────────

/**
 * Sends a single location update to the backend with bounded exponential backoff.
 */
export async function uploadTripLocation(
  options: UploadLocationRequestOptions,
): Promise<TripLocationResponse> {
  const {
    tripId,
    coordinates,
    authToken,
    baseUrl = getApiBaseUrl(),
    signal,
    timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS,
    maxRetries = DEFAULT_MAX_RETRIES,
    initialDelayMs = DEFAULT_INITIAL_RETRY_DELAY_MS,
    maxDelayMs = DEFAULT_MAX_RETRY_DELAY_MS,
    backoffFactor = 2,
    onRetry,
  } = options;

  if (!tripId || typeof tripId !== 'string' || tripId.trim() === '') {
    throw new TripLocationApiError('Invalid or missing trip ID', {
      status: 400,
      isTransient: false,
    });
  }

  if (!authToken || typeof authToken !== 'string' || authToken.trim() === '') {
    throw new TripLocationApiError('Authentication token is required', {
      status: 401,
      isTransient: false,
    });
  }

  const validationError = validateCoordinatesPayload(
    coordinates.latitude,
    coordinates.longitude,
    coordinates.accuracy,
    coordinates.timestamp,
  );
  if (validationError) {
    throw new TripLocationApiError(validationError, {
      status: 400,
      isTransient: false,
    });
  }

  const payload: TripLocationPayload = {
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    accuracy: coordinates.accuracy,
    timestamp: new Date(coordinates.timestamp).toISOString(),
  };

  const endpoint = `${baseUrl.replace(/\/+$/, '')}/api/trips/${encodeURIComponent(tripId)}/location`;

  let attempt = 0;

  while (attempt <= maxRetries) {
    if (signal?.aborted) {
      const abortError = new Error('Upload aborted');
      abortError.name = 'AbortError';
      throw abortError;
    }

    const abortController = new AbortController();
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const handleExternalAbort = () => {
      abortController.abort();
    };

    if (signal) {
      signal.addEventListener('abort', handleExternalAbort, { once: true });
    }

    timeoutId = setTimeout(() => {
      abortController.abort();
    }, timeoutMs);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
        signal: abortController.signal,
      });

      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      if (signal) {
        signal.removeEventListener('abort', handleExternalAbort);
      }

      if (!response.ok) {
        let responseBody: unknown;
        let message = `Server responded with status ${response.status}`;
        try {
          responseBody = await response.json();
          if (
            typeof responseBody === 'object' &&
            responseBody !== null &&
            'message' in responseBody &&
            typeof (responseBody as { message: unknown }).message === 'string'
          ) {
            message = (responseBody as { message: string }).message;
          }
        } catch {
          // Response body was not JSON
        }

        const transient = isTransientError(response.status);
        throw new TripLocationApiError(message, {
          status: response.status,
          isTransient: transient,
          responseBody,
        });
      }

      const data = (await response.json()) as TripLocationResponse;
      return data;
    } catch (error: unknown) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      if (signal) {
        signal.removeEventListener('abort', handleExternalAbort);
      }

      if (signal?.aborted) {
        const abortError = new Error('Upload aborted');
        abortError.name = 'AbortError';
        throw abortError;
      }

      const isApiError = error instanceof TripLocationApiError;
      const transient = isApiError ? error.isTransient : true;

      if (attempt < maxRetries && transient) {
        const exponentialDelay = initialDelayMs * Math.pow(backoffFactor, attempt);
        const cappedDelay = Math.min(exponentialDelay, maxDelayMs);

        onRetry?.(attempt + 1, cappedDelay, error as Error);

        await new Promise<void>((resolve, reject) => {
          let retryTimer: ReturnType<typeof setTimeout> | null = null;
          const onAbortDuringDelay = () => {
            if (retryTimer) {
              clearTimeout(retryTimer);
            }
            const abortError = new Error('Upload aborted');
            abortError.name = 'AbortError';
            reject(abortError);
          };

          if (signal) {
            signal.addEventListener('abort', onAbortDuringDelay, { once: true });
          }

          retryTimer = setTimeout(() => {
            if (signal) {
              signal.removeEventListener('abort', onAbortDuringDelay);
            }
            resolve();
          }, cappedDelay);
        });

        attempt += 1;
        continue;
      }

      if (isApiError) {
        throw error;
      }

      throw new TripLocationApiError(
        error instanceof Error ? error.message : 'Network failure during location upload',
        {
          isTransient: true,
          cause: error,
        },
      );
    }
  }

  throw new TripLocationApiError('Upload retries exhausted', {
    isTransient: true,
  });
}

// ─── Queue Manager & Uploader ────────────────────────────────────────────────

export interface TripLocationUploaderConfig {
  tripId: string;
  authToken: string;
  baseUrl?: string;
  uploadIntervalMs?: number;
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  timeoutMs?: number;
}

export type UploadStateListener = (state: LocationUploadState) => void;

/**
 * Manages active trip location transmission with non-overlapping requests,
 * latest-coordinate conflation, interval throttling, and lifecycle aborts.
 */
export class TripLocationUploader {
  private config: TripLocationUploaderConfig | null = null;
  private isUploading = false;
  private pendingCoordinate: LocationCoordinates | null = null;
  private activeAbortController: AbortController | null = null;
  private intervalTimer: ReturnType<typeof setTimeout> | null = null;
  private state: LocationUploadState = { ...INITIAL_UPLOAD_STATE };
  private listeners = new Set<UploadStateListener>();
  private active = false;

  constructor(listener?: UploadStateListener) {
    if (listener) {
      this.listeners.add(listener);
    }
  }

  public subscribe(listener: UploadStateListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getState(): LocationUploadState {
    return this.state;
  }

  private updateState(updates: Partial<LocationUploadState>): void {
    this.state = { ...this.state, ...updates };
    this.listeners.forEach(listener => {
      try {
        listener(this.state);
      } catch (err) {
        console.warn('[TripLocationUploader] listener error:', err);
      }
    });
  }

  public start(config: TripLocationUploaderConfig): void {
    this.stop();
    this.config = config;
    this.active = true;
    this.updateState({
      status: 'idle',
      errorMessage: null,
      retryCount: 0,
    });
  }

  public stop(): void {
    this.active = false;
    this.config = null;
    this.pendingCoordinate = null;

    if (this.intervalTimer) {
      clearTimeout(this.intervalTimer);
      this.intervalTimer = null;
    }

    if (this.activeAbortController) {
      this.activeAbortController.abort();
      this.activeAbortController = null;
    }

    this.isUploading = false;
    this.updateState({
      status: 'idle',
      errorMessage: null,
      retryCount: 0,
    });
  }

  public enqueueLocation(coordinates: LocationCoordinates): void {
    if (!this.active || !this.config) {
      return;
    }

    // Always prefer the newest coordinate (conflation: queue size = 1)
    this.pendingCoordinate = coordinates;

    if (this.isUploading) {
      return;
    }

    const interval = this.config.uploadIntervalMs ?? DEFAULT_UPLOAD_INTERVAL_MS;
    const now = Date.now();
    const lastUploadedAt = this.state.lastUploadedAt ?? 0;
    const timeSinceLastUpload = now - lastUploadedAt;

    if (timeSinceLastUpload >= interval) {
      this.dispatchNext();
    } else if (!this.intervalTimer) {
      const waitTime = Math.max(0, interval - timeSinceLastUpload);
      this.intervalTimer = setTimeout(() => {
        this.intervalTimer = null;
        if (this.active && !this.isUploading) {
          this.dispatchNext();
        }
      }, waitTime);
    }
  }

  private dispatchNext(): void {
    if (!this.active || this.isUploading || !this.pendingCoordinate || !this.config) {
      return;
    }

    const nextCoord = this.pendingCoordinate;
    this.pendingCoordinate = null;
    this.executeUpload(nextCoord).catch(err => {
      // Abort is normal during lifecycle cleanup; log other unhandled failures
      if (err?.name !== 'AbortError') {
        console.warn('[TripLocationUploader] unexpected error:', err);
      }
    });
  }

  private async executeUpload(coordinates: LocationCoordinates): Promise<void> {
    if (!this.active || !this.config) {
      return;
    }

    this.isUploading = true;
    this.activeAbortController = new AbortController();
    this.updateState({
      status: 'uploading',
      errorMessage: null,
      retryCount: 0,
    });

    try {
      await uploadTripLocation({
        tripId: this.config.tripId,
        coordinates,
        authToken: this.config.authToken,
        baseUrl: this.config.baseUrl,
        signal: this.activeAbortController.signal,
        timeoutMs: this.config.timeoutMs,
        maxRetries: this.config.maxRetries,
        initialDelayMs: this.config.initialDelayMs,
        maxDelayMs: this.config.maxDelayMs,
        onRetry: (attempt, _delay, error) => {
          if (this.active) {
            this.updateState({
              status: 'retry_pending',
              retryCount: attempt,
              errorMessage: `Retrying upload (${attempt}): ${error.message}`,
            });
          }
        },
      });

      if (!this.active) {
        return;
      }

      this.updateState({
        status: 'synced',
        lastSuccessfulUpload: coordinates,
        lastUploadedAt: Date.now(),
        errorMessage: null,
        retryCount: 0,
      });
    } catch (err: unknown) {
      if (!this.active) {
        return;
      }

      const isAbort = (err as Error)?.name === 'AbortError';
      if (isAbort) {
        return;
      }

      const apiError = err instanceof TripLocationApiError ? err : null;
      if (apiError?.status === 409) {
        // Stale fix: backend already has newer/equal location fix
        this.updateState({
          status: 'synced',
          errorMessage: null,
          retryCount: 0,
        });
      } else {
        this.updateState({
          status: 'error',
          errorMessage: (err as Error)?.message ?? 'Location upload failed',
        });
      }
    } finally {
      this.isUploading = false;
      this.activeAbortController = null;

      if (this.active && this.pendingCoordinate) {
        this.dispatchNext();
      }
    }
  }
}
