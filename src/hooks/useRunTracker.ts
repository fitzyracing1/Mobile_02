import { useState, useRef, useCallback, useEffect } from 'react';
import * as Location from 'expo-location';
import { RunState, RunStatus, Coordinate } from '../types';
import { calculatePace } from '../utils/formatters';

/**
 * Haversine formula: calculate distance between two coordinates in meters
 */
function haversineDistance(coord1: Coordinate, coord2: Coordinate): number {
  const R = 6371000; // Earth's radius in meters
  const lat1 = (coord1.latitude * Math.PI) / 180;
  const lat2 = (coord2.latitude * Math.PI) / 180;
  const deltaLat = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const deltaLon = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const INITIAL_RUN_STATE: RunState = {
  status: 'idle',
  elapsed: 0,
  distance: 0,
  coordinates: [],
  currentPace: 0,
  avgPace: 0,
};

// Minimum distance threshold to filter GPS noise (meters)
const MIN_DISTANCE_THRESHOLD = 5;

export interface UseRunTrackerReturn {
  runState: RunState;
  startRun: () => Promise<void>;
  pauseRun: () => void;
  resumeRun: () => void;
  stopRun: () => RunState;
  resetRun: () => void;
  locationPermission: Location.PermissionStatus | null;
  requestPermission: () => Promise<boolean>;
}

export function useRunTracker(): UseRunTrackerReturn {
  const [runState, setRunState] = useState<RunState>(INITIAL_RUN_STATE);
  const [locationPermission, setLocationPermission] =
    useState<Location.PermissionStatus | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const locationSubscriptionRef = useRef<Location.LocationSubscription | null>(null);
  const runStateRef = useRef<RunState>(INITIAL_RUN_STATE);

  // Keep ref in sync with state for use inside callbacks
  useEffect(() => {
    runStateRef.current = runState;
  }, [runState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer();
      stopLocationTracking();
    };
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stopLocationTracking = useCallback(async () => {
    if (locationSubscriptionRef.current) {
      locationSubscriptionRef.current.remove();
      locationSubscriptionRef.current = null;
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status);
      return status === Location.PermissionStatus.GRANTED;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setRunState((prev) => {
        if (prev.status !== 'active') return prev;
        const newElapsed = prev.elapsed + 1;
        const avgPace = calculatePace(prev.distance, newElapsed);
        return { ...prev, elapsed: newElapsed, avgPace };
      });
    }, 1000);
  }, [stopTimer]);

  const startLocationTracking = useCallback(async () => {
    await stopLocationTracking();

    locationSubscriptionRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 5,
      },
      (location) => {
        const newCoord: Coordinate = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          altitude: location.coords.altitude,
          timestamp: location.timestamp,
        };

        setRunState((prev) => {
          if (prev.status !== 'active') return prev;

          const updatedCoords = [...prev.coordinates, newCoord];
          let addedDistance = 0;

          if (prev.coordinates.length > 0) {
            const lastCoord = prev.coordinates[prev.coordinates.length - 1];
            const segmentDistance = haversineDistance(lastCoord, newCoord);

            // Filter out GPS noise
            if (segmentDistance >= MIN_DISTANCE_THRESHOLD) {
              addedDistance = segmentDistance;
            }
          }

          const newDistance = prev.distance + addedDistance;
          const avgPace = calculatePace(newDistance, prev.elapsed);

          // Calculate current pace from recent movement
          let currentPace = prev.currentPace;
          if (addedDistance > 0 && prev.coordinates.length > 0) {
            const lastCoord = prev.coordinates[prev.coordinates.length - 1];
            if (lastCoord.timestamp && newCoord.timestamp) {
              const timeDiff = (newCoord.timestamp - lastCoord.timestamp) / 1000;
              if (timeDiff > 0) {
                currentPace = calculatePace(addedDistance, timeDiff);
              }
            }
          }

          return {
            ...prev,
            coordinates: updatedCoords,
            distance: newDistance,
            avgPace,
            currentPace,
          };
        });
      }
    );
  }, [stopLocationTracking]);

  const startRun = useCallback(async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) {
      throw new Error('Location permission not granted');
    }

    const freshState: RunState = {
      status: 'active',
      elapsed: 0,
      distance: 0,
      coordinates: [],
      currentPace: 0,
      avgPace: 0,
    };

    setRunState(freshState);
    runStateRef.current = freshState;

    startTimer();
    await startLocationTracking();
  }, [requestPermission, startTimer, startLocationTracking]);

  const pauseRun = useCallback(() => {
    stopTimer();
    stopLocationTracking();
    setRunState((prev) => ({ ...prev, status: 'paused' }));
  }, [stopTimer, stopLocationTracking]);

  const resumeRun = useCallback(async () => {
    setRunState((prev) => ({ ...prev, status: 'active' }));
    startTimer();
    await startLocationTracking();
  }, [startTimer, startLocationTracking]);

  const stopRun = useCallback((): RunState => {
    stopTimer();
    stopLocationTracking();
    const finalState = { ...runStateRef.current, status: 'stopped' as RunStatus };
    setRunState(finalState);
    return finalState;
  }, [stopTimer, stopLocationTracking]);

  const resetRun = useCallback(() => {
    stopTimer();
    stopLocationTracking();
    setRunState(INITIAL_RUN_STATE);
    runStateRef.current = INITIAL_RUN_STATE;
  }, [stopTimer, stopLocationTracking]);

  return {
    runState,
    startRun,
    pauseRun,
    resumeRun,
    stopRun,
    resetRun,
    locationPermission,
    requestPermission,
  };
}
