/**
 * tripLocationApi.test.ts
 *
 * Test suite for the typed TripLocationApi client and TripLocationUploader.
 */

import { Platform } from 'react-native';
import {
  DEFAULT_ANDROID_BASE_URL,
  DEFAULT_IOS_BASE_URL,
  getApiBaseUrl,
  isTransientError,
  setApiBaseUrl,
  TripLocationUploader,
  uploadTripLocation,
  validateCoordinatesPayload,
} from '../src/services/tripLocationApi';
import { LocationCoordinates } from '../src/types/driver';

declare const global: typeof globalThis;



const validCoordinates: LocationCoordinates = {
  latitude: 26.8678,
  longitude: 75.7965,
  accuracy: 4.5,
  altitude: null,
  heading: null,
  speed: null,
  timestamp: 1700000000000,
};

async function flushMicrotasks(count = 10): Promise<void> {
  for (let i = 0; i < count; i++) {
    await Promise.resolve();
  }
}

describe('tripLocationApi', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    setApiBaseUrl(null);
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.useRealTimers();
    setApiBaseUrl(null);
  });

  describe('Base URL and Environment Configuration', () => {
    it('defaults to 10.0.2.2:5000 on Android and localhost:5000 on iOS', () => {
      Platform.OS = 'android';
      expect(getApiBaseUrl()).toBe(DEFAULT_ANDROID_BASE_URL);

      Platform.OS = 'ios';
      expect(getApiBaseUrl()).toBe(DEFAULT_IOS_BASE_URL);
    });

    it('respects programmatic URL override', () => {
      setApiBaseUrl('http://192.168.1.100:5000');
      expect(getApiBaseUrl()).toBe('http://192.168.1.100:5000');
    });
  });

  describe('Coordinate Payload Validation', () => {
    it('passes for valid WGS-84 coordinates', () => {
      expect(validateCoordinatesPayload(26.8678, 75.7965, 5, Date.now())).toBeNull();
      expect(validateCoordinatesPayload(-90, -180, 0, new Date().toISOString())).toBeNull();
      expect(validateCoordinatesPayload(90, 180, undefined, Date.now())).toBeNull();
    });

    it('rejects invalid latitude values', () => {
      expect(validateCoordinatesPayload(91, 75.7965, 5, Date.now())).toContain('Latitude');
      expect(validateCoordinatesPayload(-91, 75.7965, 5, Date.now())).toContain('Latitude');
      expect(validateCoordinatesPayload(NaN, 75.7965, 5, Date.now())).toContain('Latitude');
    });

    it('rejects invalid longitude values', () => {
      expect(validateCoordinatesPayload(26.8678, 181, 5, Date.now())).toContain('Longitude');
      expect(validateCoordinatesPayload(26.8678, -181, 5, Date.now())).toContain('Longitude');
      expect(validateCoordinatesPayload(26.8678, Infinity, 5, Date.now())).toContain('Longitude');
    });

    it('rejects negative accuracy or non-numeric accuracy', () => {
      expect(validateCoordinatesPayload(26.8678, 75.7965, -1, Date.now())).toContain('Accuracy');
      expect(validateCoordinatesPayload(26.8678, 75.7965, NaN, Date.now())).toContain('Accuracy');
    });

    it('rejects missing or invalid timestamps', () => {
      expect(validateCoordinatesPayload(26.8678, 75.7965, 5, undefined)).toContain('Timestamp');
      expect(validateCoordinatesPayload(26.8678, 75.7965, 5, 'invalid-date')).toContain('Invalid timestamp');
    });
  });

  describe('Transient vs Permanent Error Classification', () => {
    it('classifies network errors, 5xx, 408, 429 as transient', () => {
      expect(isTransientError(undefined)).toBe(true);
      expect(isTransientError(500)).toBe(true);
      expect(isTransientError(502)).toBe(true);
      expect(isTransientError(503)).toBe(true);
      expect(isTransientError(408)).toBe(true);
      expect(isTransientError(429)).toBe(true);
    });

    it('classifies 400, 401, 403, 404, 409 as permanent non-retryable', () => {
      expect(isTransientError(400)).toBe(false);
      expect(isTransientError(401)).toBe(false);
      expect(isTransientError(403)).toBe(false);
      expect(isTransientError(404)).toBe(false);
      expect(isTransientError(409)).toBe(false);
    });
  });

  describe('uploadTripLocation() network function', () => {
    it('successfully uploads coordinates with Bearer token', async () => {
      const mockResponse = {
        success: true,
        message: 'Trip location updated successfully',
        data: {
          tripId: '6ad90873078dc055e14277ee',
          status: 'active',
          currentLocation: {
            latitude: validCoordinates.latitude,
            longitude: validCoordinates.longitude,
            accuracy: validCoordinates.accuracy,
            recordedAt: new Date(validCoordinates.timestamp).toISOString(),
          },
        },
      };

      const fetchMock = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });
      global.fetch = fetchMock;

      const result = await uploadTripLocation({
        tripId: '6ad90873078dc055e14277ee',
        coordinates: validCoordinates,
        authToken: 'valid_driver_jwt_token',
        baseUrl: 'http://10.0.2.2:5000',
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, requestOptions] = fetchMock.mock.calls[0];
      expect(url).toBe('http://10.0.2.2:5000/api/trips/6ad90873078dc055e14277ee/location');
      expect(requestOptions.method).toBe('POST');
      expect((requestOptions.headers as Record<string, string>).Authorization).toBe('Bearer valid_driver_jwt_token');

      const body = JSON.parse(requestOptions.body);
      expect(body.latitude).toBe(validCoordinates.latitude);
      expect(body.longitude).toBe(validCoordinates.longitude);
      expect(body.accuracy).toBe(validCoordinates.accuracy);
      expect(result).toEqual(mockResponse);
    });

    it('rejects without network call when auth token is missing', async () => {
      const fetchMock = jest.fn();
      global.fetch = fetchMock;

      await expect(
        uploadTripLocation({
          tripId: '6ad90873078dc055e14277ee',
          coordinates: validCoordinates,
          authToken: '',
        }),
      ).rejects.toThrow('Authentication token is required');

      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('rejects without network call when coordinates are invalid', async () => {
      const fetchMock = jest.fn();
      global.fetch = fetchMock;

      await expect(
        uploadTripLocation({
          tripId: '6ad90873078dc055e14277ee',
          coordinates: { ...validCoordinates, latitude: 999 },
          authToken: 'token123',
        }),
      ).rejects.toThrow('Latitude must be a valid number between -90 and 90');

      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('does NOT retry permanent HTTP errors (400, 401, 403, 404, 409)', async () => {
      const fetchMock = jest.fn().mockResolvedValue({
        ok: false,
        status: 403,
        json: async () => ({
          success: false,
          message: 'You are not authorized to update location for this trip',
        }),
      });
      global.fetch = fetchMock;

      await expect(
        uploadTripLocation({
          tripId: '6ad90873078dc055e14277ee',
          coordinates: validCoordinates,
          authToken: 'other_driver_token',
          maxRetries: 3,
        }),
      ).rejects.toThrow('You are not authorized to update location for this trip');

      // Only 1 attempt made: zero retries on 403 Forbidden
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('performs bounded retry with exponential backoff on transient 500 error', async () => {
      let callCount = 0;
      const fetchMock = jest.fn().mockImplementation(async () => {
        callCount++;
        if (callCount < 3) {
          return {
            ok: false,
            status: 503,
            json: async () => ({ message: 'Service temporarily unavailable' }),
          };
        }
        return {
          ok: true,
          status: 200,
          json: async () => ({
            success: true,
            message: 'Trip location updated successfully',
          }),
        };
      });
      global.fetch = fetchMock;

      const onRetry = jest.fn();

      const uploadPromise = uploadTripLocation({
        tripId: '6ad90873078dc055e14277ee',
        coordinates: validCoordinates,
        authToken: 'token123',
        maxRetries: 3,
        initialDelayMs: 200,
        backoffFactor: 2,
        onRetry,
      });

      // First call fails, waiting for delay (200ms)
      await flushMicrotasks();
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(onRetry).toHaveBeenCalledWith(1, 200, expect.any(Error));

      // Advance first retry delay
      await jest.advanceTimersByTimeAsync(200);
      await flushMicrotasks();
      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(onRetry).toHaveBeenCalledWith(2, 400, expect.any(Error));

      // Advance second retry delay
      await jest.advanceTimersByTimeAsync(400);
      await flushMicrotasks();
      expect(fetchMock).toHaveBeenCalledTimes(3);

      const result = await uploadPromise;
      expect(result.success).toBe(true);
    });

    it('exhausts bounded retries on continuous network failure', async () => {
      const fetchMock = jest.fn().mockRejectedValue(new TypeError('Network request failed'));
      global.fetch = fetchMock;

      const onRetry = jest.fn();

      const uploadPromise = uploadTripLocation({
        tripId: '6ad90873078dc055e14277ee',
        coordinates: validCoordinates,
        authToken: 'token123',
        maxRetries: 2,
        initialDelayMs: 100,
        onRetry,
      });

      let errorThrown: Error | null = null;
      uploadPromise.catch((err: Error) => {
        errorThrown = err;
      });

      // Initial call + 2 retries
      await flushMicrotasks();
      await jest.advanceTimersByTimeAsync(100);
      await flushMicrotasks();
      await jest.advanceTimersByTimeAsync(200);
      await flushMicrotasks();

      expect(errorThrown).not.toBeNull();
      expect((errorThrown as Error | null)?.message).toContain('Network request failed');
      expect(fetchMock).toHaveBeenCalledTimes(3); // 1 initial + 2 retries
      expect(onRetry).toHaveBeenCalledTimes(2);
    });

    it('aborts cleanly when AbortSignal triggers during in-flight request', async () => {
      const abortController = new AbortController();

      const fetchMock = jest.fn().mockImplementation((_url, options) => {
        return new Promise((_resolve, reject) => {
          options.signal.addEventListener('abort', () => {
            const err = new Error('Upload aborted');
            err.name = 'AbortError';
            reject(err);
          });
        });
      });
      global.fetch = fetchMock;

      const uploadPromise = uploadTripLocation({
        tripId: '6ad90873078dc055e14277ee',
        coordinates: validCoordinates,
        authToken: 'token123',
        signal: abortController.signal,
      });

      abortController.abort();

      await expect(uploadPromise).rejects.toMatchObject({ name: 'AbortError' });
    });
  });

  describe('TripLocationUploader Queue & Lifecycle', () => {
    it('manages non-overlapping sequential uploads and prefers latest coordinate', async () => {
      const uploader = new TripLocationUploader();

      let resolveFetch!: (value: unknown) => void;
      const fetchMock = jest.fn().mockImplementation(() => {
        return new Promise(resolve => {
          resolveFetch = resolve;
        });
      });
      global.fetch = fetchMock;

      uploader.start({
        tripId: '6ad90873078dc055e14277ee',
        authToken: 'driver_jwt_123',
        uploadIntervalMs: 5000,
      });

      const coord1 = { ...validCoordinates, latitude: 26.8680 };
      const coord2 = { ...validCoordinates, latitude: 26.8690 };
      const coord3 = { ...validCoordinates, latitude: 26.8700 };

      // Enqueue first coordinate -> starts upload immediately
      uploader.enqueueLocation(coord1);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(JSON.parse(fetchMock.mock.calls[0][1].body).latitude).toBe(26.8680);
      expect(uploader.getState().status).toBe('uploading');

      // While coord1 is uploading, enqueue coord2, then coord3
      uploader.enqueueLocation(coord2);
      uploader.enqueueLocation(coord3);

      // Concurrency must remain 1 (no overlapping requests)
      expect(fetchMock).toHaveBeenCalledTimes(1);

      // Complete coord1 upload
      resolveFetch({
        ok: true,
        status: 200,
        json: async () => ({ success: true, message: 'Updated' }),
      });
      await flushMicrotasks();

      // Now coord3 (the latest!) must be dispatched, skipping coord2
      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(JSON.parse(fetchMock.mock.calls[1][1].body).latitude).toBe(26.8700);

      // Complete coord3 upload
      resolveFetch({
        ok: true,
        status: 200,
        json: async () => ({ success: true, message: 'Updated' }),
      });
      await flushMicrotasks();

      expect(uploader.getState().status).toBe('synced');
      expect(uploader.getState().lastSuccessfulUpload?.latitude).toBe(26.8700);
    });

    it('clears pending timers, cancels in-flight requests, and ignores late callbacks on stop()', async () => {
      const uploader = new TripLocationUploader();

      let aborted = false;
      const fetchMock = jest.fn().mockImplementation((_url, options) => {
        options.signal.addEventListener('abort', () => {
          aborted = true;
        });
        return new Promise(() => {}); // never resolves
      });
      global.fetch = fetchMock;

      uploader.start({
        tripId: '6ad90873078dc055e14277ee',
        authToken: 'token123',
        uploadIntervalMs: 5000,
      });

      uploader.enqueueLocation(validCoordinates);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(uploader.getState().status).toBe('uploading');

      // Trip stops or user logs out
      uploader.stop();

      expect(aborted).toBe(true);
      expect(uploader.getState().status).toBe('idle');

      // Late location arrival must be ignored after stop()
      uploader.enqueueLocation({ ...validCoordinates, latitude: 27.0 });
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('handles 409 Conflict (stale fix) gracefully without marking error', async () => {
      const uploader = new TripLocationUploader();

      const fetchMock = jest.fn().mockResolvedValue({
        ok: false,
        status: 409,
        json: async () => ({
          success: false,
          message: 'Stale location update',
        }),
      });
      global.fetch = fetchMock;

      uploader.start({
        tripId: '6ad90873078dc055e14277ee',
        authToken: 'token123',
      });

      uploader.enqueueLocation(validCoordinates);
      await flushMicrotasks();

      expect(uploader.getState().status).toBe('synced');
      expect(uploader.getState().errorMessage).toBeNull();
    });
  });
});
