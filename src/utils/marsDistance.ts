const AU_KM = 149.597870691;

const EARTH = { period: 365.25, sma: 1.0, ecc: 0.0167, meanLonAtJ2000: 100.46, perihelionLon: 102.94 };
const MARS = { period: 686.971, sma: 1.524, ecc: 0.0934, meanLonAtJ2000: 355.45, perihelionLon: 336.04 };
const J2000 = new Date('2000-01-01T12:00:00Z').getTime();

function toRad(deg: number): number { return (deg * Math.PI) / 180; }

function solveKepler(M: number, e: number): number {
  let E = M;
  for (let i = 0; i < 50; i++) {
    const dE = (M - (E - e * Math.sin(E))) / (1 - e * Math.cos(E));
    E += dE;
    if (Math.abs(dE) < 1e-10) break;
  }
  return E;
}

function getPlanetPosition(planet: typeof EARTH, daysSinceJ2000: number): { x: number; y: number } {
  const n = 360 / planet.period;
  const L = ((planet.meanLonAtJ2000 + n * daysSinceJ2000) % 360 + 360) % 360;
  const M_deg = ((L - planet.perihelionLon) % 360 + 360) % 360;
  const M = toRad(M_deg);
  const E = solveKepler(M, planet.ecc);
  const nu = 2 * Math.atan2(Math.sqrt(1 + planet.ecc) * Math.sin(E / 2), Math.sqrt(1 - planet.ecc) * Math.cos(E / 2));
  const r = planet.sma * (1 - planet.ecc * Math.cos(E));
  const theta = ((nu * 180) / Math.PI + planet.perihelionLon + 360) % 360;
  return { x: r * Math.cos(toRad(theta)), y: r * Math.sin(toRad(theta)) };
}

export function calculateMarsDistance(date: Date = new Date()): { distanceKm: number; distanceAU: number; lightMinutes: number; isNear: boolean } {
  const daysSinceJ2000 = (date.getTime() - J2000) / (1000 * 60 * 60 * 24);
  const earth = getPlanetPosition(EARTH, daysSinceJ2000);
  const mars = getPlanetPosition(MARS, daysSinceJ2000);
  const dx = mars.x - earth.x;
  const dy = mars.y - earth.y;
  const distanceAU = Math.sqrt(dx * dx + dy * dy);
  const distanceKm = distanceAU * AU_KM;
  const lightMinutes = (distanceAU * AU_KM * 1e6) / (299792 * 60);
  return { distanceKm, distanceAU, lightMinutes, isNear: distanceAU < 1.0 };
}

export function formatLightTime(minutes: number): string {
  if (minutes < 1) return `${(minutes * 60).toFixed(0)} seconds`;
  if (minutes < 60) return `${minutes.toFixed(1)} minutes`;
  return `${(minutes / 60).toFixed(1)} hours`;
}
