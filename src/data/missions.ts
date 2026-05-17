import { Mission } from '../types';

export const missions: Mission[] = [
  {
    id: 'viking-1',
    name: 'Viking 1',
    agency: 'NASA',
    year: 1976,
    type: 'lander',
    status: 'completed',
    description:
      'Viking 1 was the first spacecraft to successfully land on Mars and conduct long-term science operations. It touched down on Chryse Planitia on July 20, 1976 — seven years to the day after Apollo 11 landed on the Moon. Viking 1 returned the first detailed color images of the Martian surface and conducted biology experiments searching for signs of life, yielding ambiguous results that are still debated today.',
    highlights: [
      'First successful Mars landing',
      'Operated for 6 years, 116 days on the surface',
      'Returned over 50,000 images',
      'Detected no definitive signs of life in soil samples',
    ],
  },
  {
    id: 'mars-pathfinder',
    name: 'Mars Pathfinder',
    agency: 'NASA',
    year: 1997,
    type: 'rover',
    status: 'completed',
    description:
      "Mars Pathfinder and its tiny Sojourner rover demonstrated a novel airbag landing system and proved that low-cost Mars missions were feasible. Landing in Ares Vallis on July 4, 1997, it became the first Mars rover mission and captured the world's imagination. Sojourner traveled about 100 meters total, analyzing rocks and soil chemistry while the lander station relayed weather data and panoramic images.",
    highlights: [
      'First Mars rover: Sojourner (10.6 kg)',
      'Pioneered airbag landing technology',
      'Analyzed 16 rock and soil targets',
      'Returned 2.3 billion bits of data',
    ],
  },
  {
    id: 'spirit-opportunity',
    name: 'Spirit & Opportunity',
    agency: 'NASA',
    year: 2004,
    type: 'rover',
    status: 'completed',
    description:
      "Twin rovers Spirit and Opportunity landed on opposite sides of Mars in January 2004, tasked with 90-day surface missions. Spirit operated until 2010 after becoming stuck in soft soil. Opportunity shattered all records, traveling 45.16 km over nearly 15 years before a global dust storm ended contact in June 2018. Together they provided overwhelming evidence that liquid water once flowed on Mars, fundamentally changing our understanding of the planet's history.",
    highlights: [
      'Opportunity traveled 45.16 km — Mars distance record',
      'Discovered strong evidence of ancient liquid water',
      "Opportunity's mission lasted 55x its planned duration",
      'Spirit found silica deposits hinting at ancient hot springs',
    ],
  },
  {
    id: 'mars-reconnaissance-orbiter',
    name: 'Mars Reconnaissance Orbiter',
    agency: 'NASA',
    year: 2006,
    type: 'orbiter',
    status: 'active',
    description:
      'MRO has been orbiting Mars since March 2006, conducting the most detailed global survey of Mars ever performed. Its HiRISE camera can resolve objects as small as a dinner table from orbit. MRO has transmitted more data back to Earth than all other interplanetary missions combined and serves as a critical communications relay for surface missions. It has imaged recurring slope lineae, seasonal ice caps, and potential sites for future human landing zones.',
    highlights: [
      'HiRISE camera resolves features ~25 cm across from orbit',
      'Transmitted over 400 terabits of data',
      'Acts as relay satellite for Curiosity and Perseverance',
      'Detected subsurface water-ice deposits',
    ],
  },
  {
    id: 'curiosity',
    name: 'Curiosity',
    agency: 'NASA',
    year: 2012,
    type: 'rover',
    status: 'active',
    description:
      'Curiosity rover landed in Gale Crater on August 6, 2012 using an entirely new "sky crane" descent system — a rocket-powered hover platform that lowered the rover on cables. Car-sized at 900 kg, Curiosity is a rolling laboratory with 17 cameras and 10 science instruments. It has confirmed ancient Mars was habitable, detecting organic molecules, methane fluctuations, and a complex lake environment that existed billions of years ago in Gale Crater.',
    highlights: [
      'Confirmed ancient habitable environment in Gale Crater',
      'Detected complex organic molecules in mudstone',
      'Used sky-crane landing system pioneered for heavy rovers',
      'Traveled over 32 km as of 2024, still operating',
    ],
  },
  {
    id: 'ingenuity',
    name: 'Ingenuity Helicopter',
    agency: 'NASA',
    year: 2021,
    type: 'rover',
    status: 'completed',
    description:
      "Ingenuity was the first powered aircraft to fly on another planet. Deployed from Perseverance, it was designed for just five technology-demonstration flights. Instead, it completed 72 flights over nearly three years, pioneering aerial exploration of Mars. Its final flight in January 2024 damaged a rotor blade on landing, but by then it had validated rotorcraft as a new tool for planetary exploration. Mars's thin atmosphere (1% of Earth's) made flight extraordinarily challenging, requiring blades spinning at ~2,500 RPM.",
    highlights: [
      'First powered flight on another planet (April 19, 2021)',
      'Completed 72 flights — planned for just 5',
      'Reached top speed of 19.8 km/h and altitude of 24 m',
      'Proved aerial Mars exploration is feasible',
    ],
  },
  {
    id: 'perseverance',
    name: 'Perseverance',
    agency: 'NASA',
    year: 2021,
    type: 'rover',
    status: 'active',
    description:
      "Perseverance landed in Jezero Crater on February 18, 2021 — an ancient river delta considered one of the best places to search for fossilized microbial life. It is NASA's most scientifically sophisticated Mars rover, carrying the MOXIE instrument that successfully produced oxygen from the Martian atmosphere — a key demonstration for future human missions. Perseverance has been collecting and caching rock core samples for eventual return to Earth, part of the Mars Sample Return campaign.",
    highlights: [
      'MOXIE produced oxygen from CO₂ — first on Mars',
      'Collecting rock cores for eventual Earth return',
      'Jezero Crater is an ancient river delta',
      'Deployed and supported Ingenuity helicopter',
    ],
  },
  {
    id: 'tianwen-1',
    name: 'Tianwen-1',
    agency: 'CNSA (China)',
    year: 2021,
    type: 'rover',
    status: 'active',
    description:
      "China's Tianwen-1 mission made China only the second country to successfully operate a rover on Mars. The mission comprised an orbiter, lander, and Zhurong rover, all launched together on a single rocket. Zhurong landed on Utopia Planitia on May 15, 2021 and operated for about a year before entering hibernation mode due to a dust-laden winter. The mission demonstrated China's rapid emergence as a major spacefaring power in planetary science.",
    highlights: [
      "China's first Mars mission — orbiter, lander & rover in one",
      'Zhurong rover explored Utopia Planitia lowlands',
      'Detected evidence of ancient water in landing region',
      'Made China the second nation to land and operate a Mars rover',
    ],
  },
  {
    id: 'spacex-starship-uncrewed',
    name: 'SpaceX Starship (Uncrewed)',
    agency: 'SpaceX',
    year: 2026,
    type: 'lander',
    status: 'planned',
    description:
      'SpaceX plans to send one or more uncrewed Starship vehicles to Mars during the 2026 launch window to demonstrate precision landing and prove hardware survival in the Martian environment. These missions will test propellant production from the atmosphere, power generation, and surface systems needed for future crewed missions. Starship stands 121 meters tall fully stacked and is designed to be fully reusable — the key economic enabler for affordable Mars colonization.',
    highlights: [
      'First Starship Mars missions planned for 2026 window',
      'Will test in-situ resource utilization (ISRU)',
      'Starship can carry ~100 tonnes to Mars surface',
      'Reusability aims to reduce cost to ~$10M per launch',
    ],
  },
  {
    id: 'spacex-starship-crewed',
    name: 'SpaceX Starship (Crewed)',
    agency: 'SpaceX',
    year: 2028,
    type: 'crewed',
    status: 'planned',
    description:
      "SpaceX's crewed Mars missions are targeted for the 2028 launch window, contingent on successful uncrewed landings in 2026. Elon Musk's long-term vision is a self-sustaining city of one million people on Mars. The first crewed missions would carry a small crew to establish a permanent presence, using propellant generated on Mars from water ice and atmospheric CO₂ to fuel the return journey. This mission would mark the most significant human exploration milestone since Apollo 11.",
    highlights: [
      'First humans to Mars — potentially 2028 or 2030',
      'Crew of 4–10 for initial surface missions',
      'Return fuel to be produced on Mars via Sabatier process',
      'Part of plan for 1,000,000-person Martian city by 2050s',
    ],
  },
  {
    id: 'nasa-mars-sample-return',
    name: 'Mars Sample Return',
    agency: 'NASA / ESA',
    year: 2033,
    type: 'sample-return',
    status: 'planned',
    description:
      'The Mars Sample Return campaign is a joint NASA/ESA effort to retrieve the rock core samples being collected by Perseverance and return them to Earth for detailed laboratory analysis. The campaign involves a Sample Retrieval Lander, a Mars Ascent Vehicle that would be the first rocket launch from another planet, and an Earth Return Orbiter. Samples will be examined in a BSL-4 containment facility. This mission could definitively answer whether Mars ever hosted life.',
    highlights: [
      'Would be first rocket launch from another planet',
      'Samples returned to Earth ~2033 (estimated)',
      'Joint NASA & ESA architecture',
      'Could answer whether Mars ever hosted life',
    ],
  },
  {
    id: 'esa-exomars',
    name: 'ESA ExoMars Rosalind Franklin',
    agency: 'ESA',
    year: 2028,
    type: 'rover',
    status: 'planned',
    description:
      "The Rosalind Franklin rover was originally planned as a joint ESA-Roscosmos mission but Russia's 2022 invasion of Ukraine caused ESA to terminate the partnership. ESA is now rebuilding the mission with a new landing system and launch vehicle, targeting the 2028 window. Rosalind Franklin's key instrument is a 2-meter drill — the deepest ever sent to Mars — designed to access subsurface layers shielded from ultraviolet radiation where ancient organic molecules and potential biosignatures may be preserved.",
    highlights: [
      'Carries 2-meter drill to access protected subsurface',
      'Searching for past or present microbial life',
      'Rescheduled after Russia partnership terminated in 2022',
      'Named after DNA structure co-discoverer Rosalind Franklin',
    ],
  },
];
