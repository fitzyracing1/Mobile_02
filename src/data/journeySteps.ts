import { JourneyStep } from '../types';

export const journeySteps: JourneyStep[] = [
  {
    id: 'launch-window',
    stepNumber: 1,
    icon: '🪟',
    title: 'The Launch Window',
    subtitle: 'Timing is everything',
    description:
      'You cannot launch for Mars whenever you want. Earth and Mars orbit the Sun at different speeds — Earth takes 365.25 days while Mars takes 686.97 days. Every 26 months, the planets align in a configuration where a spacecraft can reach Mars using the least amount of propellant. Miss the window, and you wait another 26 months. This alignment is called a "synodic period" and dictates the entire cadence of Mars exploration. The next favorable window opens in late 2026.',
    keyFacts: [
      { label: 'Window frequency', value: 'Every ~26 months' },
      { label: 'Next opportunity', value: 'Late 2026' },
      { label: 'Window duration', value: '~30 days' },
      { label: 'Mars synodic period', value: '779.94 Earth days' },
    ],
    durationLabel: 'Pre-mission',
  },
  {
    id: 'launch',
    stepNumber: 2,
    icon: '🚀',
    title: 'Launch',
    subtitle: "Escaping Earth's gravity",
    description:
      "A Mars-bound spacecraft must first escape Earth's gravity well, requiring a velocity of about 11.2 km/s (escape velocity). Modern rockets burn for roughly 8–10 minutes to reach low Earth orbit, then perform a second burn called a Trans-Mars Injection (TMI) to leave Earth orbit entirely. With SpaceX's Starship, the spacecraft reaches orbit first, then refuels from a tanker vehicle before igniting for Mars. The launch itself is only minutes long — but it is the bottleneck everything else depends on.",
    keyFacts: [
      { label: 'Escape velocity', value: '11.2 km/s' },
      { label: 'Time to orbit', value: '~8-10 minutes' },
      { label: 'TMI delta-v', value: '~3.6 km/s' },
      { label: 'Departure speed', value: '~30,000 km/h' },
    ],
    durationLabel: '~10 minutes',
  },
  {
    id: 'transit',
    stepNumber: 3,
    icon: '🛸',
    title: 'The Transit',
    subtitle: 'Hohmann transfer orbit — 7 months in space',
    description:
      "The journey to Mars follows a Hohmann transfer orbit — an elliptical path around the Sun that connects Earth's orbit to Mars's orbit. This is the most fuel-efficient trajectory but also the slowest. The spacecraft coasts for approximately 7 months with minimal engine use. During transit, the crew will face microgravity-induced muscle and bone loss, radiation from cosmic rays and solar particle events, and psychological stress from isolation. Exercise, shielding, and careful mission planning mitigate these risks. The spacecraft will be traveling at speeds relative to Earth of 20,000–30,000 km/h.",
    keyFacts: [
      { label: 'Transit duration', value: '~7 months (210 days)' },
      { label: 'Distance traveled', value: '~750 million km' },
      { label: 'Trajectory type', value: 'Hohmann transfer ellipse' },
      { label: 'Communication delay', value: '3–22 minutes one-way' },
    ],
    durationLabel: '~7 months',
  },
  {
    id: 'edl',
    stepNumber: 4,
    icon: '🔥',
    title: 'Entry, Descent & Landing',
    subtitle: '"Seven Minutes of Terror"',
    description:
      "Mars EDL is one of the most challenging feats in spaceflight. The spacecraft enters the thin Martian atmosphere at ~20,000 km/h and must slow to zero in about 7 minutes — too fast for parachutes alone, too slow for pure engine braking to be efficient. Engineers use a sequence of systems: a heat shield to shed 99% of velocity through aerodynamic friction, a supersonic parachute to slow to ~400 km/h, then rockets for final descent. For heavy vehicles like Starship, the entire descent is powered. The '7 minutes of terror' refers to the time between atmospheric entry and landing — during which the spacecraft must autonomously handle everything, as the communication delay makes real-time intervention impossible.",
    keyFacts: [
      { label: 'Entry speed', value: '~20,000 km/h' },
      { label: 'Peak heating', value: '~2,100°C on heat shield' },
      { label: 'EDL duration', value: '~7 minutes' },
      { label: 'Atmosphere density', value: "1% of Earth's — thin but present" },
    ],
    durationLabel: '7 minutes',
  },
  {
    id: 'surface',
    stepNumber: 5,
    icon: '🏕️',
    title: 'Surface Operations',
    subtitle: 'Living and working on Mars',
    description:
      "Once landed, a crew faces a Mars environment that is profoundly hostile to human life. Atmospheric pressure is less than 1% of Earth's, making the air breathable neither in pressure nor composition (95% CO₂). Temperatures range from −125°C at the poles in winter to +20°C at the equator in summer. Radiation exposure without a magnetic field is ~700 mSv per year — vs 3 mSv average on Earth. Dust storms can last months. Yet resources exist: water ice is confirmed at the poles and mid-latitudes, CO₂ can be converted to oxygen and fuel, and solar or nuclear power can sustain a habitat.",
    keyFacts: [
      { label: 'Surface stay', value: '~500 days (wait for next window)' },
      { label: 'Gravity', value: '3.72 m/s² (38% of Earth)' },
      { label: 'Radiation (surface)', value: '~700 mSv/year' },
      { label: 'Martian sol', value: '24 hours 37 minutes 22 seconds' },
    ],
    durationLabel: '~500 days',
  },
  {
    id: 'return',
    stepNumber: 6,
    icon: '🌍',
    title: 'The Return Journey',
    subtitle: 'Waiting for alignment — then home',
    description:
      'The crew cannot simply leave Mars whenever they choose. They must wait on the surface for approximately 500 days until Earth and Mars realign for a favorable return window. The return trip mirrors the outbound journey — another Hohmann transfer orbit of roughly 7 months. Total mission duration: about 900 days (2.5 years). For Starship missions, the return fuel — methane and liquid oxygen — will be manufactured on Mars from atmospheric CO₂ and subsurface water ice using the Sabatier reaction. This in-situ resource utilization (ISRU) is the cornerstone of making Mars missions economically viable.',
    keyFacts: [
      { label: 'Surface wait', value: '~500 days for return window' },
      { label: 'Return transit', value: '~7 months' },
      { label: 'Total mission', value: '~900 days (~2.5 years)' },
      { label: 'Return fuel source', value: 'Produced on Mars via ISRU' },
    ],
    durationLabel: '~7 months',
  },
];
