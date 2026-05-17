/**
 * Calculates the approximate current Earth-Mars distance.
 *
 * Uses simplified Keplerian orbital mechanics:
 * - Earth orbital period: 365.25 days, semi-major axis: 1.000 AU
 * - Mars orbital period: 686.971 days, semi-major axis: 1.524 AU
 * - Earth orbital eccentricity: 0.0167
 * - Mars orbital eccentricity: 0.0934
 *
 * Reference epoch: Jan 1, 2000 (J2000.0)
 * Earth mean longitude at J2000: 100.46°
 * Mars mean longitude at J2000: 355.45°
 *
 * 1 AU = 149.597870691 million km
 */

const AU_KM = 149.597870691; // million km per AU

// Orbital parameters
const EARTH = {
  period: 365.25, // days
  sma: 1.0, // AU (semi-major axis)
  ecc: 0.0167,
  meanLonAtJ2000: 100.46, // degrees
  perihelionLon: 102.94, // degrees (longitude of perihelion)
};

const MARS = {
  period: 686.971,
  sma: 1.524,
  ecc: 0.0934,
  meanLonAtJ2000: 355.45,
  perihelionLon: 336.04,
};

const J2000 = new Date('2000-01-01T12:00:00Z').getTime();

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Solve Kepler's equation M = E - e*sin(E) iteratively.
 * M = mean anomaly, e = eccentricity
 * Returns eccentric anomaly in radians.
 */
function solveKepler(M: number, e: number): number {
  let E = M;
  for (let i = 0; i < 50; i++) {
    const dE = (M - (E - e * Math.sin(E))) / (1 - e * Math.cos(E));
    E += dE;
    if (Math.abs(dE) < 1e-10) break;
  }
  return E;
}

/**
 * Get the heliocentric position [x, y] in AU for a planet at a given date.
 */
function getPlanetPosition(
  planet: typeof EARTH,
  daysSinceJ2000: number,
): { x: number; y: number } {
  // Mean motion (degrees/day)
  const n = 360 / planet.period;

  // Mean longitude at date
  const L = ((planet.meanLonAtJ2000 + n * daysSinceJ2000) % 360 + 360) % 360;

  // Mean anomaly
  const M_deg = ((L - planet.perihelionLon) % 360 + 360) % 360;
  const M = toRad(M_deg);

  // Eccentric anomaly
  const E = solveKepler(M, planet.ecc);

  // True anomaly
  const nu =
    2 *
    Math.atan2(
      Math.sqrt(1 + planet.ecc) * Math.sin(E / 2),
      Math.sqrt(1 - planet.ecc) * Math.cos(E / 2),
    );

  // Heliocentric distance
  const r = planet.sma * (1 - planet.ecc * Math.cos(E));

  // Ecliptic longitude
  const theta = ((nu * 180) / Math.PI + planet.perihelionLon + 360) % 360;

  return {
    x: r * Math.cos(toRad(theta)),
    y: r * Math.sin(toRad(theta)),
  };
}

export function calculateMarsDistance(date: Date = new Date()): {
  distanceKm: number;
  distanceAU: number;
  lightMinutes: number;
  isNear: boolean;
} {
  const daysSinceJ2000 = (date.getTime() - J2000) / (1000 * 60 * 60 * 24);

  const earth = getPlanetPosition(EARTH, daysSinceJ2000);
  const mars = getPlanetPosition(MARS, daysSinceJ2000);

  const dx = mars.x - earth.x;
  const dy = mars.y - earth.y;
  const distanceAU = Math.sqrt(dx * dx + dy * dy);
  const distanceKm = distanceAU * AU_KM;

  // Light travels ~299,792 km/s, so time in minutes:
  const lightMinutes = (distanceAU * AU_KM * 1e6) / (299792 * 60);

  return {
    distanceKm,
    distanceAU,
    lightMinutes,
    isNear: distanceAU < 1.0, // closer than 1 AU = relatively near
  };
}

export function formatDistance(km: number): string {
  if (km >= 1000) {
    return `${(km).toFixed(1)}M km`;
  }
  return `${km.toFixed(1)}M km`;
}

export function formatLightTime(minutes: number): string {
  if (minutes < 1) {
    return `${(minutes * 60).toFixed(0)} seconds`;
  }
  if (minutes < 60) {
    return `${minutes.toFixed(1)} minutes`;
  }
  const hours = minutes / 60;
  return `${hours.toFixed(1)} hours`;
}
