/**
 * Format a duration in seconds to MM:SS or H:MM:SS
 */
export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';

  const totalSeconds = Math.floor(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  const mm = String(minutes).padStart(2, '0');
  const ss = String(secs).padStart(2, '0');

  if (hours > 0) {
    return `${hours}:${mm}:${ss}`;
  }
  return `${mm}:${ss}`;
}

/**
 * Format distance in meters to km with 2 decimal places
 */
export function formatDistance(meters: number): string {
  if (isNaN(meters) || meters < 0) return '0.00';
  const km = meters / 1000;
  return km.toFixed(2);
}

/**
 * Format pace in seconds per km to "M:SS /km"
 */
export function formatPace(secondsPerKm: number): string {
  if (isNaN(secondsPerKm) || secondsPerKm <= 0 || !isFinite(secondsPerKm)) {
    return '--:-- /km';
  }

  const totalSeconds = Math.floor(secondsPerKm);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const ss = String(seconds).padStart(2, '0');

  return `${minutes}:${ss} /km`;
}

/**
 * Format an ISO date string to a readable date
 */
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format an ISO date string to time
 */
export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Calculate pace in seconds per km
 */
export function calculatePace(distanceMeters: number, durationSeconds: number): number {
  if (distanceMeters <= 0 || durationSeconds <= 0) return 0;
  const distanceKm = distanceMeters / 1000;
  return durationSeconds / distanceKm;
}
