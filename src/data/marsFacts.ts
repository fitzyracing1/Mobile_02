import { MarsFact } from '../types';

export const marsFacts: MarsFact[] = [
  // Atmosphere
  {
    id: 'atm-co2',
    category: 'Atmosphere',
    icon: '💨',
    title: 'Mostly Carbon Dioxide',
    shortFact: '95.3% CO₂ — unbreathable by humans',
    fullDetail:
      'Mars\'s atmosphere is 95.3% carbon dioxide, 2.7% nitrogen, and 1.6% argon, with trace amounts of oxygen (0.13%) and water vapor. Atmospheric pressure averages just 610 Pascals — less than 1% of Earth\'s 101,325 Pa. At that pressure, exposed liquid water instantly boils away. Astronauts will require full pressure suits outdoors at all times, unlike on the Moon where only radiation and vacuum are the concerns.',
  },
  {
    id: 'atm-thin',
    category: 'Atmosphere',
    icon: '🌬️',
    title: 'Dangerously Thin',
    shortFact: 'Pressure less than 1% of Earth — equivalent to 35 km altitude',
    fullDetail:
      'The atmospheric pressure on Mars (0.006 atm) is roughly equivalent to being at 35 kilometers altitude on Earth — far above where any aircraft can fly and where exposed human blood would boil at body temperature. Despite its thinness, the atmosphere is dense enough to cause significant aerodynamic heating during entry and to drive global dust storms. It also provides marginal protection from micrometeoroids.',
  },
  {
    id: 'atm-dust',
    category: 'Atmosphere',
    icon: '🌪️',
    title: 'Global Dust Storms',
    shortFact: 'Storms can envelop the entire planet for months',
    fullDetail:
      'Mars experiences regional and occasionally global dust storms that can obscure the entire planet for weeks or months. The 2018 global dust storm ended the Opportunity rover\'s mission by blocking sunlight from its solar panels. Dust on Mars is electrostatically charged, clinging to solar panels and equipment. Dust particle size (~1 micron) means storms travel high into the atmosphere. Future missions must account for dust accumulation on power systems and potential inhalation hazards if suit seals fail.',
  },
  {
    id: 'atm-temp',
    category: 'Atmosphere',
    icon: '🌡️',
    title: 'Extreme Temperature Range',
    shortFact: 'Average −60°C, ranging from −125°C to +20°C',
    fullDetail:
      'Mars has a dramatically variable temperature range. At the poles in winter, temperatures plunge to −125°C, cold enough to freeze CO₂ out of the atmosphere into dry ice deposits. Near the equator during summer days, surface temperatures can briefly reach +20°C. The average global temperature is approximately −60°C. Thin atmosphere means rapid temperature swings — a sunny afternoon might feel relatively warm, but temperatures can drop 100°C after sunset.',
  },
  {
    id: 'atm-5',
    category: 'Atmosphere',
    icon: '❄️',
    title: 'Dry Ice Polar Caps',
    shortFact: 'Mars has dry ice (CO₂) polar caps that grow and shrink with the seasons.',
    fullDetail:
      'Each Martian winter, CO₂ freezes out of the atmosphere and deposits as dry ice at the poles, growing caps hundreds of kilometres across. In summer, the caps sublimate back to gas — creating seasonal pressure changes of up to 30% in the Martian atmosphere and driving powerful wind patterns.',
  },
  {
    id: 'atm-6',
    category: 'Atmosphere',
    icon: '⚡',
    title: 'Static Electricity & Dust Devils',
    shortFact: 'Martian dust devils can tower up to 8 km tall — 10× taller than Earth counterparts.',
    fullDetail:
      'Mars hosts the solar system\'s most dramatic dust devils due to its thin atmosphere and strong surface heating. Electrostatic charges build up as dust particles collide, potentially damaging solar panels and electronics. Some dust devils have been observed spanning hundreds of meters in diameter by Mars orbiters and rovers.',
  },
  // Geography
  {
    id: 'geo-olympus',
    category: 'Geography',
    icon: '🌋',
    title: 'Olympus Mons',
    shortFact: 'Tallest volcano in the solar system — 21.9 km high',
    fullDetail:
      'Olympus Mons is a shield volcano on Mars that stands 21.9 kilometers above the surrounding plains — nearly three times the height of Mount Everest above sea level. Its base spans approximately 600 kilometers in diameter, larger than France. The volcano is so wide that if you stood at its center, the rim would be below the horizon due to Mars\'s curvature. Olympus Mons grew so tall because Mars lacks tectonic plate movement, so volcanic material has piled on the same spot for billions of years.',
  },
  {
    id: 'geo-valles',
    category: 'Geography',
    icon: '🏔️',
    title: 'Valles Marineris',
    shortFact: 'Canyon 4,000 km long, 7 km deep — dwarfs the Grand Canyon',
    fullDetail:
      'Valles Marineris is a vast canyon system stretching over 4,000 kilometers in length (roughly the width of the United States), up to 600 kilometers wide, and 7 kilometers deep. By comparison, the Grand Canyon is 446 km long and 1.6 km deep. Valles Marineris formed primarily through tectonic rifting and erosion. At its widest points, the canyon walls are too far apart to see from side to side. Scientists believe water once flowed through sections of this canyon system.',
  },
  {
    id: 'geo-water-ice',
    category: 'Geography',
    icon: '🧊',
    title: 'Water Ice Confirmed',
    shortFact: 'Enough polar ice to cover Mars in 35 meters of water',
    fullDetail:
      'Mars has confirmed water ice at both poles and in subsurface deposits at mid-latitudes. The north polar ice cap is primarily water ice covered by a seasonal layer of frozen CO₂. Scientists estimate the polar caps contain enough water ice that if melted it could cover the entire Martian surface in about 35 meters of water. MRO\'s SHARAD radar has detected extensive subsurface water ice deposits. In 2018, ESA\'s MARSIS radar reported evidence of a subglacial liquid water lake beneath the south polar ice, though this finding is debated.',
  },
  {
    id: 'geo-dichotomy',
    category: 'Geography',
    icon: '🌐',
    title: 'The Great Dichotomy',
    shortFact: 'North lowlands vs southern highlands — a mystery billions of years old',
    fullDetail:
      'Mars\'s surface is divided into two strikingly different hemispheres. The northern hemisphere consists largely of smooth, low-lying plains — possibly ancient ocean beds. The southern hemisphere is heavily cratered, geologically ancient highland terrain sitting several kilometers higher. This "Mars crustal dichotomy" is one of the great unsolved mysteries of planetary science. Leading theories include a massive impact early in Mars\'s history or an ancient convection pattern in the Martian mantle.',
  },
  {
    id: 'geo-5',
    category: 'Geography',
    icon: '💨',
    title: 'Hellas Planitia — Deepest Basin',
    shortFact: 'Hellas Planitia is a crater 2,300 km wide and 7 km deep — the deepest basin on Mars.',
    fullDetail:
      'Formed by a massive asteroid impact billions of years ago, Hellas Planitia has the highest atmospheric pressure on Mars due to its depth — about 1,155 Pa compared to the 610 Pa average. This makes it one of the few places where liquid water could theoretically exist on the Martian surface today, if temperatures were warm enough.',
  },
  {
    id: 'geo-6',
    category: 'Geography',
    icon: '🌊',
    title: 'Ancient Oceans',
    shortFact: 'Mars may have had a vast ocean covering its northern hemisphere ~3.7 billion years ago.',
    fullDetail:
      'Evidence from Mars orbiters shows ancient shoreline features, delta deposits, and mineral formations consistent with prolonged liquid water. The hypothetical ocean, sometimes called "Oceanus Borealis," may have covered about one-third of the Martian surface. Mars lost this water as its magnetic field collapsed and solar wind stripped the atmosphere over billions of years.',
  },
  {
    id: 'geo-7',
    category: 'Geography',
    icon: '🔴',
    title: 'Why Mars is Red',
    shortFact: 'Mars\'s red colour comes from iron oxide (rust) on its surface and in its dust.',
    fullDetail:
      'The Martian surface is covered in iron-rich dust containing iron oxide — the same compound that gives rust its colour. When ancient Mars had liquid water, iron-bearing rocks chemically weathered to form hematite and other rust-red minerals. This fine dust gets lofted into the atmosphere, giving the Martian sky its characteristic pinkish-tan hue.',
  },
  // Moons
  {
    id: 'moon-phobos',
    category: 'Moons',
    icon: '🌑',
    title: 'Phobos',
    shortFact: 'Orbits Mars so fast it rises in the west and sets in the east',
    fullDetail:
      'Phobos is the larger of Mars\'s two moons, measuring just 27 × 22 × 18 kilometers. It orbits Mars at only 6,000 km altitude — far closer than any other moon in the solar system relative to its planet. Phobos completes an orbit in just 7 hours 39 minutes, faster than Mars rotates, causing it to rise in the west and set in the east twice per Martian day. Tidal forces are slowly pulling Phobos closer; in roughly 50 million years it will either crash into Mars or break apart into a ring.',
  },
  {
    id: 'moon-deimos',
    category: 'Moons',
    icon: '🔵',
    title: 'Deimos',
    shortFact: 'Tiny moon so small it looks like a bright star from Mars',
    fullDetail:
      'Deimos is the smaller and more distant of Mars\'s two moons, measuring only 15 × 12 × 11 kilometers. Orbiting at 23,460 km, it takes 30.3 hours to complete one orbit — slightly longer than a Martian sol — making it drift slowly across the sky. From the Martian surface, Deimos appears only slightly larger than a bright star. Both moons were discovered by Asaph Hall in 1877 and are named after the Greek gods of Dread (Phobos) and Dread\'s twin brother Panic (Deimos). Their composition suggests they may be captured asteroids.',
  },
  {
    id: 'moon-3',
    category: 'Moons',
    icon: '🌑',
    title: 'Phobos is Doomed',
    shortFact: 'Phobos is spiralling inward and will crash into Mars or break apart in ~50 million years.',
    fullDetail:
      'Phobos orbits Mars faster than Mars rotates — the only moon in the solar system to do so. Tidal forces are gradually slowing Phobos\'s orbit, pulling it 1.8 cm closer to Mars every year. In roughly 50 million years, tidal forces will tear it apart, creating a ring system around Mars before the debris rains down on the surface.',
  },
  {
    id: 'moon-4',
    category: 'Moons',
    icon: '💫',
    title: 'Deimos — The Escape Artist',
    shortFact: 'Deimos is so small that if you ran fast enough on its surface, you could achieve escape velocity.',
    fullDetail:
      'Deimos is one of the smallest known moons in the solar system, measuring just 15 × 12 × 11 km. Its surface gravity is only 0.003 m/s² — about 3,000 times weaker than Earth\'s. A running human could achieve escape velocity (~5.6 m/s) and leave Deimos entirely. The moon\'s dark, heavily cratered surface suggests it is a captured C-type asteroid.',
  },
  // Comparison to Earth
  {
    id: 'comp-gravity',
    category: 'Comparison',
    icon: '⚖️',
    title: 'Martian Gravity',
    shortFact: '38% of Earth\'s — you\'d weigh about 113 lbs if you weigh 300 lbs on Earth',
    fullDetail:
      'Mars has a surface gravity of 3.72 m/s² — 38% of Earth\'s 9.81 m/s². A person weighing 70 kg on Earth would weigh about 26.6 kg on Mars. The lower gravity makes it easier to jump and carry loads, but causes significant physiological problems for long-duration residents: muscle atrophy, bone density loss, cardiovascular deconditioning, and potential vision problems from fluid redistribution. Current evidence from the ISS suggests these effects are manageable with exercise, but the permanence of partial gravity exposure over years is unknown.',
  },
  {
    id: 'comp-day',
    category: 'Comparison',
    icon: '🕐',
    title: 'The Martian Sol',
    shortFact: 'A Mars day is 24 hours, 37 minutes, 22 seconds',
    fullDetail:
      'A Martian solar day ("sol") is 24 hours, 37 minutes, and 22 seconds — conveniently close to Earth\'s 24 hours. Mars mission controllers use "sol" as their unit of time, and rover operations are planned sol by sol. The slight difference means mission teams on Earth gradually shift out of sync with local time, cycling through all hours of the day and night over weeks. The Martian year is 687 Earth days (668.6 sols). Mars has seasons much like Earth due to its 25.2° axial tilt (Earth tilts 23.5°).',
  },
  {
    id: 'comp-year',
    category: 'Comparison',
    icon: '📅',
    title: 'Martian Year',
    shortFact: 'A year on Mars is 687 Earth days — nearly twice as long',
    fullDetail:
      'Mars orbits the Sun once every 686.97 Earth days — approximately 1.88 Earth years. This longer orbital period, combined with Mars\'s elliptical orbit, means Martian seasons are of unequal length. Southern hemisphere summer occurs when Mars is closest to the Sun (perihelion), making southern summers warmer but shorter, and southern winters colder and longer. Mars has the most elliptical orbit of the terrestrial planets, with aphelion being 21% farther from the Sun than perihelion.',
  },
  {
    id: 'comp-size',
    category: 'Comparison',
    icon: '🔴',
    title: 'Size of Mars',
    shortFact: 'Mars is about half Earth\'s diameter — but has similar land area',
    fullDetail:
      'Mars has a diameter of 6,779 km — about 53% of Earth\'s 12,742 km. Its volume is about 15% of Earth\'s. However, because Mars has no oceans, its total land surface area (144.8 million km²) is roughly similar to Earth\'s land area (148.9 million km²). Mars has a mass of 6.39 × 10²³ kg — about 10.7% of Earth\'s. Its lower density (3,933 kg/m³ vs Earth\'s 5,515 kg/m³) suggests a smaller iron core, which is consistent with its lack of a global magnetic field.',
  },
  {
    id: 'comp-5',
    category: 'Comparison',
    icon: '🧲',
    title: 'No Global Magnetic Field',
    shortFact: 'Mars has no global magnetic field — its core cooled and solidified billions of years ago.',
    fullDetail:
      'Earth\'s liquid iron core generates a magnetic field that deflects harmful solar wind. Mars\'s smaller core cooled completely roughly 4 billion years ago, shutting down its dynamo. Without this shield, solar wind gradually stripped away the Martian atmosphere. Ancient crustal rocks show remnant magnetisation, proving Mars once had a powerful field during its first billion years.',
  },
  {
    id: 'comp-6',
    category: 'Comparison',
    icon: '☀️',
    title: 'Sunlight on Mars',
    shortFact: 'Sunlight on Mars is only about 43% as intense as on Earth due to its greater distance from the Sun.',
    fullDetail:
      'Mars orbits at 1.52 AU from the Sun — 52% farther than Earth. Solar intensity follows an inverse-square law, so Mars receives about 43% of the solar energy Earth does (590 W/m² vs 1,361 W/m²). This makes solar power viable but less efficient, and is why Mars missions often use RTGs (radioactive thermoelectric generators) for consistent power.',
  },
  {
    id: 'comp-7',
    category: 'Comparison',
    icon: '🌬️',
    title: 'Wind Speed Comparison',
    shortFact: 'Mars winds can reach 100 km/h but feel like a gentle breeze due to the thin atmosphere.',
    fullDetail:
      'Martian wind speeds can hit 100 km/h during dust storms, but the atmosphere is so thin (less than 1% of Earth\'s density) that the force exerted on objects is equivalent to a gentle 10-20 km/h Earth breeze. The famous "7 Minutes of Terror" during EDL still uses atmospheric drag effectively, despite the thin air, because of the spacecraft\'s high entry velocity (~20,000 km/h).',
  },
  {
    id: 'comp-8',
    category: 'Comparison',
    icon: '🏃',
    title: 'Human Weight on Mars',
    shortFact: 'A 70 kg person would weigh only 26.5 kg on Mars — you could jump nearly 3 times higher.',
    fullDetail:
      'Mars\'s surface gravity is 3.72 m/s² — 38% of Earth\'s 9.81 m/s². A person weighing 70 kg on Earth would weigh just 26.5 kg on Mars. You could jump about 2.5–3 times higher than on Earth. This lower gravity has profound implications for long-term human habitation: muscle atrophy is reduced compared to microgravity, but bone density loss is still a concern for multi-year stays.',
  },
];
