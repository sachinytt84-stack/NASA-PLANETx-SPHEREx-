import { StellarSystemTransit, TransitDataPoint } from '../types';

// Helper to generate realistic light curve with limb darkening and realistic photometric noise
function generateTransitCurve(
  transitDepthPercent: number,
  transitDurationHours: number,
  transitCenterHours: number = 0,
  noiseOld: number = 0.04,
  noiseNew: number = 0.02,
  secondaryDepthPercent: number = 0,
  secondaryCenterHours: number = 0,
  secondaryDurationHours: number = 0
): TransitDataPoint[] {
  const points: TransitDataPoint[] = [];
  const start = -6.0;
  const end = 6.0;
  const step = 0.25;

  for (let t = start; t <= end + 0.001; t += step) {
    const timeHours = Math.round(t * 100) / 100;
    
    // Seeded pseudo-random noise for determinism
    const seed = Math.sin(timeHours * 12.9898 + 78.233) * 43758.5453;
    const randOld = (seed - Math.floor(seed) - 0.5) * 2;
    const seed2 = Math.sin(timeHours * 39.346 + 11.123) * 24634.63;
    const randNew = (seed2 - Math.floor(seed2) - 0.5) * 2;

    // Old data: out of transit or baseline without transit
    const oldFlux = 100.0 + (randOld * noiseOld);

    // Primary transit calculation (U-shape / trapezoidal transit profile)
    let dip = 0;
    const dt = Math.abs(timeHours - transitCenterHours);
    const halfDur = transitDurationHours / 2;
    const ingressDur = halfDur * 0.25;

    if (dt < halfDur) {
      if (dt < (halfDur - ingressDur)) {
        // Flat bottom with limb-darkening curvature
        const limb = 1 - 0.05 * Math.pow(dt / (halfDur - ingressDur), 2);
        dip = transitDepthPercent * limb;
      } else {
        // Ingress / egress slope
        const fraction = (halfDur - dt) / ingressDur;
        dip = transitDepthPercent * fraction;
      }
    }

    // Secondary transit if present (multi-planet)
    if (secondaryDepthPercent > 0 && secondaryDurationHours > 0) {
      const dt2 = Math.abs(timeHours - secondaryCenterHours);
      const halfDur2 = secondaryDurationHours / 2;
      const ingress2 = halfDur2 * 0.25;
      if (dt2 < halfDur2) {
        if (dt2 < (halfDur2 - ingress2)) {
          dip += secondaryDepthPercent;
        } else {
          dip += secondaryDepthPercent * ((halfDur2 - dt2) / ingress2);
        }
      }
    }

    const newFlux = 100.0 - dip + (randNew * noiseNew);

    points.push({
      timeHours,
      brightnessOld: Math.round(oldFlux * 1000) / 1000,
      brightnessNew: Math.round(newFlux * 1000) / 1000,
      uncertaintyOld: noiseOld,
      uncertaintyNew: noiseNew
    });
  }

  return points;
}

export const SOLAR_SYSTEM_TRANSITS: StellarSystemTransit[] = [
  {
    id: 'trappist-1',
    name: 'TRAPPIST-1 System',
    alternateName: '2MASS J23062928-0502285',
    constellation: 'Aquarius',
    distanceLightYears: 39.5,
    starType: 'Ultra-Cool Red Dwarf',
    starClassification: 'M8V',
    starColorHex: '#f87171', // Warm reddish
    starGlowHex: 'rgba(248, 113, 113, 0.4)',
    starRadiusSunRatio: 0.12, // ~12% size of our Sun
    starTemperatureKelvin: 2566,
    hasPlanets: true,
    planetCount: 7,
    maxTransitDipPercent: 0.73,
    transitDurationHours: 1.8,
    detectionVerdict: 'CONFIRMED_PLANETS',
    verdictTitle: '7 Confirmed Rocky Earth-Sized Exoplanets',
    verdictSummary: 'Comparison of Old baseline data against New survey passes reveals deep, rhythmic dimming of 0.73%. Because TRAPPIST-1 is a tiny red dwarf star, Earth-sized planets block a large fraction of its light, creating unmistakable dips.',
    plainEnglishExplanation: 'Imagine an ultra-dim campfire the size of Jupiter. When a tiny marble (an Earth-sized rocky world) flies right between your eye and the flame, it blocks almost 1% of the fire\'s total light. Looking at the Old data, the star was at 100% steady brightness. In the New data, the star dips sharply every few hours, proving a family of 7 worlds circles this star!',
    everydayAnalogy: 'Like holding a coin 10 feet away from a candle flame: every time the coin circles around, the candle visibly flickers dimmer and then brightens back to full glow.',
    oldDataSurveyName: '2MASS All-Sky Infrared Baseline (Pre-Transit Epoch)',
    oldDataDate: 'October 2015 Archive Data',
    oldDataNotes: 'Continuous single-epoch reference measurement showing steady stellar flux at 100.00% without transit event.',
    newDataSurveyName: 'SPHEREx Survey Round 2 & TESS High-Cadence Re-Survey',
    newDataDate: 'Current Active Mission Data (2025/2026)',
    newDataNotes: '102-band infrared spectrophotometry capturing full ingress, bottom transit, and egress at 2.4-micron band.',
    infraredAtmosphereNote: 'SPHEREx multi-wavelength scanning detects slight transmission filtering at 2.7-3.2 microns, suggesting potential atmospheric volatiles or carbon dioxide on planets TRAPPIST-1e and 1f.',
    planets: [
      {
        name: 'TRAPPIST-1b',
        radiusEarthRatio: 1.12,
        orbitalPeriodDays: 1.51,
        semiMajorAxisAU: 0.011,
        planetType: 'Terrestrial Rocky',
        habitableZoneStatus: 'Too Hot / Scorching',
        atmosphereFeatures: ['Dense rocky core', 'Possible volatile haze'],
        plainEnglishDescription: 'The innermost planet; completes an entire year in just 36 hours. Scorchingly hot like an oven.'
      },
      {
        name: 'TRAPPIST-1c',
        radiusEarthRatio: 1.10,
        orbitalPeriodDays: 2.42,
        semiMajorAxisAU: 0.016,
        planetType: 'Terrestrial Rocky',
        habitableZoneStatus: 'Too Hot / Scorching',
        atmosphereFeatures: ['Heavy rock', 'Thin carbon dioxide envelope'],
        plainEnglishDescription: 'Venus-like rocky world receiving twice the stellar heat that Earth receives from our Sun.'
      },
      {
        name: 'TRAPPIST-1d',
        radiusEarthRatio: 0.79,
        orbitalPeriodDays: 4.05,
        semiMajorAxisAU: 0.022,
        planetType: 'Terrestrial Rocky',
        habitableZoneStatus: 'Inside Habitable Zone',
        atmosphereFeatures: ['Moderate surface temperature', 'Possible liquid water reservoir'],
        plainEnglishDescription: 'Inner edge of the habitable zone; slightly smaller than Earth with pleasant balmy temperatures.'
      },
      {
        name: 'TRAPPIST-1e',
        radiusEarthRatio: 0.92,
        orbitalPeriodDays: 6.10,
        semiMajorAxisAU: 0.029,
        planetType: 'Terrestrial Rocky',
        habitableZoneStatus: 'Inside Habitable Zone',
        atmosphereFeatures: ['Earth-like density', 'Iron-nickel core', 'Potential oceans'],
        plainEnglishDescription: 'The prime candidate for life! Receives 66% of Earth\'s sunlight with ideal temperatures for liquid water lakes and oceans.'
      },
      {
        name: 'TRAPPIST-1f',
        radiusEarthRatio: 1.04,
        orbitalPeriodDays: 9.21,
        semiMajorAxisAU: 0.038,
        planetType: 'Terrestrial Rocky',
        habitableZoneStatus: 'Inside Habitable Zone',
        atmosphereFeatures: ['Rich water-ice mantle', 'Steam or ice clouds'],
        plainEnglishDescription: 'A cooler water-world planet located right in the sweet spot of the star\'s habitable goldilocks zone.'
      },
      {
        name: 'TRAPPIST-1g',
        radiusEarthRatio: 1.13,
        orbitalPeriodDays: 12.35,
        semiMajorAxisAU: 0.047,
        planetType: 'Terrestrial Rocky',
        habitableZoneStatus: 'Inside Habitable Zone',
        atmosphereFeatures: ['Volatile rich', 'Thick icy mantle'],
        plainEnglishDescription: 'A frosty rocky planet slightly larger than Earth, blanketed in ice or deep cold seas.'
      },
      {
        name: 'TRAPPIST-1h',
        radiusEarthRatio: 0.77,
        orbitalPeriodDays: 18.77,
        semiMajorAxisAU: 0.062,
        planetType: 'Terrestrial Rocky',
        habitableZoneStatus: 'Too Cold / Frozen',
        atmosphereFeatures: ['Frozen surface ice', 'Nitrogen frost'],
        plainEnglishDescription: 'The outermost sister planet, a deep-frozen snowball world orbiting on the frigid frontier.'
      }
    ],
    dataPoints: generateTransitCurve(0.73, 1.8, 0, 0.03, 0.015)
  },
  {
    id: 'toi-700',
    name: 'TOI-700 System',
    alternateName: '2MASS J06282325-5534440',
    constellation: 'Dorado',
    distanceLightYears: 101.4,
    starType: 'Quiet Red Dwarf',
    starClassification: 'M2V',
    starColorHex: '#fb923c', // Warm orange-red
    starGlowHex: 'rgba(251, 146, 60, 0.4)',
    starRadiusSunRatio: 0.42, // ~42% size of our Sun
    starTemperatureKelvin: 3480,
    hasPlanets: true,
    planetCount: 4,
    maxTransitDipPercent: 0.085,
    transitDurationHours: 2.4,
    detectionVerdict: 'CONFIRMED_PLANETS',
    verdictTitle: 'Confirmed 4 Planets (Including Earth-Size TOI-700 d & e)',
    verdictSummary: 'Comparing Old baseline data with New precision infrared observations reveals a subtle 0.085% transit dip. While tiny, SPHEREx\'s ultra-stable infrared detectors track the drop with pinpoint precision, confirming Earth-sized planets in the star\'s habitable zone.',
    plainEnglishExplanation: 'TOI-700 is a calm, quiet star that does not throw violent solar flares. Because it is larger than TRAPPIST-1, an Earth-sized world only blocks a mere 0.08% of its light (like an ant walking across a motorcycle headlight). In the Old survey, this tiny flicker was buried in noise. In the New data, the dip repeats like clockwork every 37 days!',
    everydayAnalogy: 'Like noticing a street lamp dim by less than 1/1,000th of a second when a tiny moth flutters across the glass.',
    oldDataSurveyName: 'Initial Optical Sky Survey (Broadband Filter)',
    oldDataDate: 'August 2018 Baseline Record',
    oldDataNotes: 'Optical broadband data with atmospheric scintillation; transit dip was close to detection threshold.',
    newDataSurveyName: 'SPHEREx Multi-Band Infrared Survey (Survey Pass 1 & 2)',
    newDataDate: 'Late 2025 Calibrated Infrared Epoch',
    newDataNotes: 'Low-noise infrared integration showing 0.085% drop across 102 discrete wavelength channels.',
    infraredAtmosphereNote: 'Infrared flatline across 1.5 to 3.5 microns indicates a clear or cloud-shielded rocky atmosphere on TOI-700 d without runaway greenhouse heating.',
    planets: [
      {
        name: 'TOI-700 b',
        radiusEarthRatio: 0.91,
        orbitalPeriodDays: 9.98,
        semiMajorAxisAU: 0.068,
        planetType: 'Terrestrial Rocky',
        habitableZoneStatus: 'Too Hot / Scorching',
        atmosphereFeatures: ['Baked silicate crust', 'No thick atmosphere'],
        plainEnglishDescription: 'Earth-sized rocky planet whipping around the star every 10 days; surface is desert hot.'
      },
      {
        name: 'TOI-700 c',
        radiusEarthRatio: 2.60,
        orbitalPeriodDays: 16.05,
        semiMajorAxisAU: 0.093,
        planetType: 'Sub-Neptune',
        habitableZoneStatus: 'Too Hot / Scorching',
        atmosphereFeatures: ['Hydrogen-helium envelope', 'Superheated steam'],
        plainEnglishDescription: 'A mini-gas planet two-and-a-half times the size of Earth, shrouded in thick clouds.'
      },
      {
        name: 'TOI-700 d',
        radiusEarthRatio: 1.14,
        orbitalPeriodDays: 37.42,
        semiMajorAxisAU: 0.163,
        planetType: 'Terrestrial Rocky',
        habitableZoneStatus: 'Inside Habitable Zone',
        atmosphereFeatures: ['Temperate atmosphere', 'Liquid water potential', 'Stable climate'],
        plainEnglishDescription: 'NASA\'s superstar Earth-sized discovery! Resides in the star\'s sweet spot where water can form tranquil seas and clouds.'
      },
      {
        name: 'TOI-700 e',
        radiusEarthRatio: 0.95,
        orbitalPeriodDays: 27.84,
        semiMajorAxisAU: 0.134,
        planetType: 'Terrestrial Rocky',
        habitableZoneStatus: 'Inside Habitable Zone',
        atmosphereFeatures: ['Rocky mantle', 'Mild greenhouse balance'],
        plainEnglishDescription: 'Discovered between planets c and d, this Earth-sized cousin receives 127% of Earth\'s energy.'
      }
    ],
    dataPoints: generateTransitCurve(0.085, 2.4, 0, 0.015, 0.007)
  },
  {
    id: 'hd-209458',
    name: 'HD 209458 System ("Osiris")',
    alternateName: 'V354 Pegasi',
    constellation: 'Pegasus',
    distanceLightYears: 159.0,
    starType: 'Yellow Dwarf (Sun-Like)',
    starClassification: 'G0V',
    starColorHex: '#facc15', // Radiant yellow
    starGlowHex: 'rgba(250, 204, 21, 0.45)',
    starRadiusSunRatio: 1.19, // ~19% larger than our Sun
    starTemperatureKelvin: 6092,
    hasPlanets: true,
    planetCount: 1,
    maxTransitDipPercent: 1.54,
    transitDurationHours: 3.1,
    detectionVerdict: 'CONFIRMED_PLANETS',
    verdictTitle: '1 Confirmed "Hot Jupiter" Giant with Water in Atmosphere',
    verdictSummary: 'Old baseline data shows the star beaming at full 100% luminosity. New survey data captures a massive 1.54% brightness blackout lasting over 3 hours as the gas giant planet crosses the star\'s disk.',
    plainEnglishExplanation: 'This is the legendary first exoplanet ever caught transiting its star! The planet is a monstrous gas ball like Jupiter, but orbiting so close that a year lasts only 3.5 days. Because it is gigantic, it blocks a massive 1.5% of the star\'s light. Even cooler: SPHEREx\'s 102 infrared colors reveal the planet\'s atmosphere absorbs extra light at 3.0 microns, proving water vapor is floating in its alien skies!',
    everydayAnalogy: 'Like an orange flying directly in front of a halogen searchlight: you can easily see the spotlight dim with the naked eye.',
    oldDataSurveyName: 'Hipparcos Space Astrometry Archive',
    oldDataDate: '1997 Reference Baseline',
    oldDataNotes: 'Standard stellar brightness baseline recorded at 100.00% flux with no detected periodicity.',
    newDataSurveyName: 'SPHEREx All-Sky Infrared Spectroscopic Survey Pass',
    newDataDate: 'Current Orbit Observation',
    newDataNotes: 'Massive 1.54% transit dip captured with high signal-to-noise ratio in infrared channel bands 1 through 6.',
    infraredAtmosphereNote: 'SPHEREx detects a distinct absorption excess at 2.6-3.1 micrometers: Water (H2O) vapor signature in the hot planet\'s upper atmospheric haze!',
    planets: [
      {
        name: 'HD 209458 b ("Osiris")',
        radiusEarthRatio: 15.6,
        orbitalPeriodDays: 3.52,
        semiMajorAxisAU: 0.047,
        planetType: 'Gas Giant / Hot Jupiter',
        habitableZoneStatus: 'Too Hot / Scorching',
        atmosphereFeatures: ['Water vapor (H2O)', 'Carbon monoxide (CO)', 'Evaporating hydrogen comet tail'],
        plainEnglishDescription: 'A bloated giant world heated to 1,800°F (1,000°C) with an evaporating hydrogen tail trailing behind it like a comet!'
      }
    ],
    dataPoints: generateTransitCurve(1.54, 3.1, 0, 0.05, 0.02)
  },
  {
    id: 'kepler-90',
    name: 'Kepler-90 System',
    alternateName: 'KOI-351 / KIC 11442793',
    constellation: 'Draco',
    distanceLightYears: 2840.0,
    starType: 'Yellow-White Dwarf',
    starClassification: 'G0V',
    starColorHex: '#fef08a', // Pale yellow-white
    starGlowHex: 'rgba(254, 240, 138, 0.45)',
    starRadiusSunRatio: 1.20,
    starTemperatureKelvin: 6080,
    hasPlanets: true,
    planetCount: 8,
    maxTransitDipPercent: 0.82,
    transitDurationHours: 3.4,
    detectionVerdict: 'CONFIRMED_PLANETS',
    verdictTitle: '8 Confirmed Planets (A Cosmic Twin to Our Solar System)',
    verdictSummary: 'Kepler-90 holds the record alongside our Solar System for the most planets orbiting a single star! Comparing old single-window data with new multi-epoch infrared surveys reveals multiple superimposed transit dips.',
    plainEnglishExplanation: 'Just like our Solar System has 8 planets (Mercury through Neptune), Kepler-90 has 8 known planets! However, all 8 are crammed into an orbit tighter than Earth\'s distance to the Sun. In the Old data, only one dip was visible. In the New data, you can see two planets transiting within the same 12-hour window: a small inner rocky world causing a 0.04% dip, followed by a giant outer world causing a 0.82% dip!',
    everydayAnalogy: 'Like watching two people walk past a window at the same time: a toddler walks past first (small dip), followed shortly by a tall basketball player (big dip).',
    oldDataSurveyName: 'Kepler Primary Mission (Single Light Curve Slice)',
    oldDataDate: '2013 Archived Baseline',
    oldDataNotes: 'Raw flux baseline showing single planet signature without resolving resonant inner orbit companions.',
    newDataSurveyName: 'SPHEREx Multi-Epoch Sky Pass & Machine Learning Synthesis',
    newDataDate: '2025 Calibrated Infrared Resurvey',
    newDataNotes: 'Superimposed dual transit signatures resolved: Kepler-90i (0.04% dip) and Kepler-90h (0.82% dip).',
    infraredAtmosphereNote: 'Spectroscopic fingerprint confirms giant planet Kepler-90h has methane and carbon monoxide in its upper atmosphere.',
    planets: [
      {
        name: 'Kepler-90b',
        radiusEarthRatio: 1.31,
        orbitalPeriodDays: 7.0,
        semiMajorAxisAU: 0.074,
        planetType: 'Terrestrial Rocky',
        habitableZoneStatus: 'Too Hot / Scorching',
        atmosphereFeatures: ['Molten rock crust'],
        plainEnglishDescription: 'Innermost rocky world, baking hot in a 7-day orbit.'
      },
      {
        name: 'Kepler-90c',
        radiusEarthRatio: 1.18,
        orbitalPeriodDays: 8.7,
        semiMajorAxisAU: 0.089,
        planetType: 'Terrestrial Rocky',
        habitableZoneStatus: 'Too Hot / Scorching',
        atmosphereFeatures: ['Rocky surface'],
        plainEnglishDescription: 'Second rocky world in a tight gravitational dance.'
      },
      {
        name: 'Kepler-90i',
        radiusEarthRatio: 1.32,
        orbitalPeriodDays: 14.4,
        semiMajorAxisAU: 0.123,
        planetType: 'Super-Earth',
        habitableZoneStatus: 'Too Hot / Scorching',
        atmosphereFeatures: ['Discovered with AI neural networks'],
        plainEnglishDescription: 'Famous world discovered using Google AI neural networks searching Kepler data; 800°F surface.'
      },
      {
        name: 'Kepler-90h',
        radiusEarthRatio: 11.32,
        orbitalPeriodDays: 331.6,
        semiMajorAxisAU: 1.01,
        planetType: 'Gas Giant / Hot Jupiter',
        habitableZoneStatus: 'Inside Habitable Zone',
        atmosphereFeatures: ['Massive gas envelope', 'Possible large rocky moons'],
        plainEnglishDescription: 'A giant gas world orbiting at the exact same distance Earth orbits our Sun! Might have habitable moons.'
      }
    ],
    // Primary dip of 0.82% at 0h, and secondary mini-dip of 0.06% at -3.0h (multi-planet transit!)
    dataPoints: generateTransitCurve(0.82, 3.4, 0, 0.04, 0.018, 0.06, -3.0, 1.4)
  },
  {
    id: 'proxima-centauri',
    name: 'Proxima Centauri System',
    alternateName: 'Alpha Centauri C',
    constellation: 'Centaurus',
    distanceLightYears: 4.24,
    starType: 'Flaring Red Dwarf',
    starClassification: 'M5.5Ve',
    starColorHex: '#ef4444', // Fiery red
    starGlowHex: 'rgba(239, 68, 68, 0.45)',
    starRadiusSunRatio: 0.15,
    starTemperatureKelvin: 3042,
    hasPlanets: false, // Has planets via Radial Velocity, but NO TRANSIT from Earth's line of sight!
    planetCount: 0,
    maxTransitDipPercent: 0.00,
    transitDurationHours: 0,
    detectionVerdict: 'NO_TRANSIT_DETECTED',
    verdictTitle: 'No Transit Detected (Orbital Plane Tilted From Earth)',
    verdictSummary: 'Old Data and New Data both show NO planetary transit dips! While astronomers know Proxima has planets (discovered by the gravitational wobble method), their orbits are tilted by ~60° relative to Earth. The planets never cross between our telescope and the star.',
    plainEnglishExplanation: 'This is a crucial scientific lesson! A star only dims if the planet\'s orbit lines up like a bullseye directly between the star and Earth. Proxima Centauri is our closest cosmic neighbor, just 4 light years away. It has confirmed planets (like Proxima b), but from Earth\'s vantage point, the planets orbit above and below the star, never casting a shadow toward us. The Old and New data match perfectly at 100% brightness (with random solar flares, but zero planet dips)!',
    everydayAnalogy: 'Imagine someone wearing a hula hoop. If you look at them from above, the hoop is around their waist, but it never blocks your view of their face.',
    oldDataSurveyName: 'All-Sky Automated Survey (ASAS) Historical Monitor',
    oldDataDate: '2016 Stellar Monitoring Archive',
    oldDataNotes: 'Flat stellar baseline around 100% with typical magnetic flare spikes, but no periodic transit dip.',
    newDataSurveyName: 'SPHEREx Multi-Band Infrared Calibration Baseline',
    newDataDate: '2025/2026 Infrared Baseline',
    newDataNotes: 'Infrared flux remains at 100.00% ±0.03%. No ingress or egress transit shape detected.',
    infraredAtmosphereNote: 'Infrared monitoring confirms active stellar magnetic flares without planetary transit occlusion.',
    planets: [],
    dataPoints: generateTransitCurve(0.00, 0, 0, 0.04, 0.02)
  },
  {
    id: 'barnards-star',
    name: "Barnard's Star (Control Baseline)",
    alternateName: 'GJ 699 / V2500 Ophiuchi',
    constellation: 'Ophiuchus',
    distanceLightYears: 5.96,
    starType: 'Quiet Ancient Red Dwarf',
    starClassification: 'M4V',
    starColorHex: '#f97316',
    starGlowHex: 'rgba(249, 115, 22, 0.35)',
    starRadiusSunRatio: 0.20,
    starTemperatureKelvin: 3134,
    hasPlanets: false,
    planetCount: 0,
    maxTransitDipPercent: 0.00,
    transitDurationHours: 0,
    detectionVerdict: 'SOLO_STAR_BASELINE',
    verdictTitle: 'Solo Star Baseline (Zero Planetary Dimming)',
    verdictSummary: 'Serves as NASA\'s ideal astronomical calibration star. Both Old and New observations demonstrate a perfectly steady 100.00% stellar brightness line with zero dimming, verifying instrument calibration.',
    plainEnglishExplanation: 'Astronomers need "control stars" to make sure their space telescopes aren\'t hallucinating! Barnard\'s Star is an ancient, calm red dwarf that has no large transiting planets. When we compare Old data from 10 years ago to New SPHEREx data today, the brightness line is completely flat and steady at 100%. If a star doesn\'t dim, it has no planets blocking its face.',
    everydayAnalogy: 'Like a steady nightlight in a hallway: you look at it yesterday, and you look at it today—the light is steady, calm, and unchanged.',
    oldDataSurveyName: 'Sloan Digital Sky Survey (SDSS) Red Dwarf Benchmark',
    oldDataDate: '2012 Deep Optical Reference Archive',
    oldDataNotes: 'Ultra-stable photometric reference line at 100.000% normalized flux.',
    newDataSurveyName: 'SPHEREx Calibration Standard Field 1',
    newDataDate: 'March 2026 Verification pass',
    newDataNotes: 'Unchanged 100.00% flux line confirming zero photometric drift in detectors.',
    planets: [],
    dataPoints: generateTransitCurve(0.00, 0, 0, 0.02, 0.01)
  },
  {
    id: 'spx-candidate-4491',
    name: 'SPX-4491 (New Mystery Target)',
    alternateName: 'SPHEREx-Candidate-4491 / Gaia DR3 429188',
    constellation: 'Cygnus',
    distanceLightYears: 420.0,
    starType: 'Orange K-Dwarf',
    starClassification: 'K2V',
    starColorHex: '#fbbf24',
    starGlowHex: 'rgba(251, 191, 36, 0.45)',
    starRadiusSunRatio: 0.78,
    starTemperatureKelvin: 4900,
    hasPlanets: true,
    planetCount: 1,
    maxTransitDipPercent: 2.15,
    transitDurationHours: 4.2,
    detectionVerdict: 'CANDIDATE_ANOMALY',
    verdictTitle: 'New Discovery: Massive 2.15% Dimming Detected!',
    verdictSummary: 'In Old survey data, this star showed a flat 100% baseline. But New SPHEREx observations revealed a huge 2.15% transit blackout lasting over 4 hours! High-resolution analysis confirms a newly discovered Super-Jupiter exoplanet with thick cloud decks.',
    plainEnglishExplanation: 'You are looking at a brand-new discovery! In the Old telescope survey from 2017, the star had no recorded transit because the telescope happened to look away during the crossing. But in SPHEREx\'s new survey, our infrared detectors caught a dramatic 2.15% drop in starlight. The star dimmed significantly for over 4 hours before brightening back to 100%. This proves a giant gas planet is orbiting this star!',
    everydayAnalogy: 'Like taking a photo of a lighthouse once every year: in the old photo, the beam was unobstructed; in the new photo, you caught an airplane passing directly across the beam.',
    oldDataSurveyName: 'Pan-STARRS 1 Historical Sky Survey',
    oldDataDate: 'June 2017 Sparse Baseline Survey',
    oldDataNotes: 'Flat baseline at 100% flux; no anomalous dips recorded during the sparse observation window.',
    newDataSurveyName: 'SPHEREx All-Sky Infrared Survey Round 2',
    newDataDate: 'Fresh Observation (2026)',
    newDataNotes: 'Massive 2.15% U-shaped transit dip discovered; confirmed across multiple infrared bands.',
    infraredAtmosphereNote: 'SPHEREx 3.4-micron band confirms methane (CH4) absorption, characteristic of cool Jovian gas giants.',
    planets: [
      {
        name: 'SPX-4491 b',
        radiusEarthRatio: 13.8,
        orbitalPeriodDays: 22.4,
        semiMajorAxisAU: 0.155,
        planetType: 'Gas Giant / Hot Jupiter',
        habitableZoneStatus: 'Inside Habitable Zone',
        atmosphereFeatures: ['Methane haze', 'Water ice clouds', 'Strong magnetic aurorae'],
        plainEnglishDescription: 'A newly detected gas giant world slightly larger than Jupiter, orbiting at the outer edge of its star\'s habitable region.'
      }
    ],
    dataPoints: generateTransitCurve(2.15, 4.2, 0, 0.04, 0.02)
  }
];
