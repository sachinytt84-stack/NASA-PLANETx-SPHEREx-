import { PlainEnglishConcept } from '../types';

export const SPHEREX_CONCEPTS: PlainEnglishConcept[] = [
  {
    id: 'three-pillars-1',
    title: 'How Was the Universe Born? (Cosmic Inflation)',
    subtitle: 'Looking for ripples left behind from the first fraction of a second',
    icon: 'Sparkles',
    simpleAnalogy: 'Imagine baking raisin bread: as the dough inflates rapidly in the oven, the raisins get pushed apart in distinct patterns.',
    commonManExplanation: 'Cosmologists believe that in the first trillionth of a trillionth of a second after the Big Bang, the universe exploded outward faster than the speed of light. This super-fast stretch, called "inflation", left microscopic ripples that later clumped together to form stars and galaxies. By mapping the exact 3D positions of 450 million galaxies, SPHEREx is measuring those ripples to test what force caused the Big Bang.',
    whyItMattersToUs: 'It helps us answer humanity\'s oldest and biggest question: "Where did everything come from?" and tests the fundamental laws of physics.',
    technicalJargonTranslated: [
      {
        term: 'Cosmic Inflation',
        translation: 'The split-second super-expansion at the beginning of time that stretched our universe from microscopic to astronomical size.'
      },
      {
        term: 'Non-Gaussianity',
        translation: 'Subtle irregularities in how galaxies cluster together, which reveal what type of energy caused cosmic inflation.'
      },
      {
        term: 'Large-Scale Structure',
        translation: 'The giant cosmic web pattern formed by billions of galaxies strung across outer space.'
      }
    ]
  },
  {
    id: 'three-pillars-2',
    title: 'The Cosmic Dawn: First Starlight',
    subtitle: 'When the first stars and baby galaxies flipped on the cosmic lights',
    icon: 'Sun',
    simpleAnalogy: 'Like walking through thick morning fog when suddenly the sun peeks out and burns through the haze, letting light travel freely.',
    commonManExplanation: 'Hundreds of millions of years after the Big Bang, space was a dark, cold fog of neutral hydrogen gas. When the very first generation of stars ignited, their intense ultraviolet radiation stripped electrons from the hydrogen atoms (a process called "reionization"), making the universe transparent. SPHEREx measures the faint collective glow of all these ancient first stars together.',
    whyItMattersToUs: 'Without this cosmic dawn, the universe would still be a pitch-black gas cloud with no solar systems, no Earth, and no people.',
    technicalJargonTranslated: [
      {
        term: 'Epoch of Reionization (EoR)',
        translation: 'The historic era when the first stars burned away the cold hydrogen fog and lit up the dark universe.'
      },
      {
        term: 'Extragalactic Background Light (EBL)',
        translation: 'The soft, diffuse background glow created by all the starlight and glowing gas ever emitted throughout cosmic history.'
      },
      {
        term: 'Redshift',
        translation: 'As the universe expands, light waves from distant stars stretch out and turn redder, shifting into invisible infrared.'
      }
    ]
  },
  {
    id: 'three-pillars-3',
    title: 'The Origin of Water: Cosmic Ices',
    subtitle: 'Tracing the recipe of oceans and life before solar systems exist',
    icon: 'Droplets',
    simpleAnalogy: 'Imagine snowflakes forming on specks of dust in winter air. In deep space, water freezes onto cosmic dust grains, waiting to be swept into future oceans.',
    commonManExplanation: 'Before a planet like Earth forms, the raw ingredients—water, carbon monoxide, carbon dioxide, and methanol—freeze as thin layers of ice on tiny grains of interstellar dust. As these clouds collapse to form stars and rocky planets, the ice gets baked into comets, asteroids, and young worlds. SPHEREx maps where these frozen chemical building blocks hide across our entire Milky Way galaxy.',
    whyItMattersToUs: 'Every sip of water you drink might have originated in interstellar ice clouds billions of years before our Sun was born. SPHEREx shows us how common the ingredients for oceans and life are around other stars.',
    technicalJargonTranslated: [
      {
        term: 'Biogenic Ices',
        translation: 'Frozen molecules essential for life (water H2O, carbon dioxide CO2, methanol CH3OH, and ammonia NH3) floating in space.'
      },
      {
        term: 'Protoplanetary Disk',
        translation: 'A spinning pancake of dust and gas surrounding a newborn star where new planets are cooking.'
      },
      {
        term: 'Absorption Spectroscopy',
        translation: 'A technique that detects chemicals by checking which specific colors of light get swallowed by molecules.'
      }
    ]
  },
  {
    id: 'how-it-works-1',
    title: '102 Infrared Colors: The Cosmic Rainbow',
    subtitle: 'Why 102 colors give SPHEREx superhuman vision',
    icon: 'Eye',
    simpleAnalogy: 'Human eyes only have 3 color sensors (Red, Green, Blue). Imagine having eyes with 102 distinct color receptors—you could instantly identify every chemical simply by looking at it!',
    commonManExplanation: 'Human eyes and regular consumer cameras only capture visible light in red, green, and blue. But most secrets in the universe radiate in infrared (heat radiation), which is invisible to humans. SPHEREx divides infrared light into 102 precise bands. Because every chemical element and molecule absorbs and shines at distinct wavelengths, SPHEREx gets a chemical fingerprint of everything it observes.',
    whyItMattersToUs: 'It turns a pretty picture into actual science data: we can tell not just where a star is, but what it\'s made of, how fast it\'s moving, and how far away it is.',
    technicalJargonTranslated: [
      {
        term: 'Spectro-Photometer',
        translation: 'A specialized camera that measures both the brightness and the exact color wavelength of light simultaneously.'
      },
      {
        term: 'Linear Variable Filter (LVF)',
        translation: 'A glass filter that gently fades from one infrared shade to another across the sensor chip, like an optical gradient.'
      },
      {
        term: 'Wavelength Range (0.75 - 5.0 µm)',
        translation: 'The infrared light spectrum SPHEREx sees, spanning from just beyond visible red light to warm thermal heat rays.'
      }
    ]
  },
  {
    id: 'how-it-works-2',
    title: 'The Triple Umbrellas: Freezing Without Freezers',
    subtitle: 'How SPHEREx stays at -350°F without running out of liquid coolant',
    icon: 'Shield',
    simpleAnalogy: 'Like holding three nesting sun umbrellas at the beach: the top one absorbs the sun, the middle one stays cooler, and under the third umbrella it stays freezing cold.',
    commonManExplanation: 'To spot faint cosmic heat, a telescope must be ice-cold itself, otherwise its own warmth creates blinding glare. Past missions used heavy tanks of liquid helium, but once the coolant boiled away in a year, the telescope went blind. SPHEREx uses three nested cone-shaped aluminum photon shields. Heat bounces off the cone angles straight into the cold emptiness of space, naturally chilling the telescope to -350°F (-210°C) forever without any coolant tanks!',
    whyItMattersToUs: 'Saves millions of dollars, makes the spacecraft much lighter, and means SPHEREx won\'t run out of refrigerant fluid.',
    technicalJargonTranslated: [
      {
        term: 'Passive Cryogenic Cooling',
        translation: 'Cooling down to hundreds of degrees below zero purely by bouncing heat away into deep space, with zero pumps or moving parts.'
      },
      {
        term: 'V-Groove Radiators',
        translation: 'Special V-shaped metal fins that bounce thermal photons directly out into cold space like mirrors.'
      },
      {
        term: 'Photon Shields',
        translation: 'Lightweight cone-shaped barriers that shield delicate sensors from Sun glare and Earth heat.'
      }
    ]
  },
  {
    id: 'spherex-vs-webb',
    title: 'SPHEREx vs. James Webb: What\'s the Difference?',
    subtitle: 'The wide-angle forest camera vs. the high-power microscope',
    icon: 'Telescope',
    simpleAnalogy: 'James Webb is like a super-powerful microscope that stares deeply at a single leaf; SPHEREx is a wide-angle drone that photographs every tree in the entire forest.',
    commonManExplanation: 'NASA\'s James Webb Space Telescope has a giant 6.5-meter mirror designed to zoom in with extreme detail on tiny, specific patches of the universe. In contrast, SPHEREx has a compact 20-centimeter telescope designed with an ultra-wide field of view. SPHEREx maps the entire sky four times in two years, creating a comprehensive cosmic treasure map of hundreds of millions of objects that larger telescopes can later inspect in detail.',
    whyItMattersToUs: 'They work as a dynamic space duo: SPHEREx finds rare, surprising cosmic objects across the whole sky, and Webb zooms in to study them up close.',
    technicalJargonTranslated: [
      {
        term: 'All-Sky Survey',
        translation: 'Scanning 100% of the entire sphere of the sky from North Pole to South Pole, rather than just single targets.'
      },
      {
        term: 'Field of View (FOV)',
        translation: 'How wide of a scene the telescope can photograph at one time (SPHEREx captures huge swaths of sky in every frame).'
      },
      {
        term: 'Pointed Observatory',
        translation: 'A telescope that points and stares at one specific star or galaxy for hours (like Hubble or James Webb).'
      }
    ]
  }
];
