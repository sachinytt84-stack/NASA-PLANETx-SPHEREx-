export interface AIKnowledgeResponse {
  answer: string;
  simpleAnalogy: string;
  whyItMattersToHumans: string;
  quickFacts: string[];
}

export const PREINSTALLED_KNOWLEDGE_TOPICS: Array<{
  keywords: string[];
  response: AIKnowledgeResponse;
}> = [
  {
    keywords: ['time', 'orbit', 'day', 'calculate', 'launch', 'date', 'march 11', 'falcon', 'clock', 'duration'],
    response: {
      answer: "SPHEREx blasted off into space on March 11, 2025 at 23:15:00 UTC aboard a SpaceX Falcon 9 rocket from Vandenberg Space Force Base in California. In this application, the Time in Orbit is calculated manually right on your device by subtracting the launch timestamp from your current clock. No online servers or API keys are required—the code computes the exact days, hours, and seconds completely offline!",
      simpleAnalogy: "Like a stopwatch started the second the rocket engines ignited, counting every elapsed second without needing to phone home.",
      whyItMattersToHumans: "You get instantaneous, verified mission duration numbers with zero latency and zero risk of broken online connections.",
      quickFacts: [
        "Launch date: March 11, 2025 at 23:15 UTC from Vandenberg SLC-4E",
        "Orbits Earth every 97.4 minutes in a 650 km sun-synchronous polar orbit",
        "100% manually calculated in the app with zero external API key dependency"
      ]
    }
  },
  {
    keywords: ['umbrella', 'shield', 'cone', 'shape', 'cool', 'freeze', 'kelvin', 'temp', 'temperature'],
    response: {
      answer: "SPHEREx looks like three giant nested umbrellas or cones because it uses passive aluminum 'photon shields' to stay freezing cold. Because the telescope detects subtle infrared heat from distant galaxies, if the spacecraft were warm, it would blind itself with its own heat radiation. The three concentric shields bounce heat from the Sun and Earth out into dark space, keeping the telescope at -350°F (-210°C, or 80 Kelvin) forever without needing heavy tanks of liquid helium coolant.",
      simpleAnalogy: "Like holding three sun umbrellas at the beach: the outer layer takes the blazing sun, the middle layer stays cooler, and underneath the third layer it is ice-cold.",
      whyItMattersToHumans: "Passive cooling never runs dry, allowing NASA to build a lighter, more reliable space telescope for a fraction of the cost.",
      quickFacts: [
        "Three nested lightweight aluminum conical photon shields",
        "Maintains cryogenic 80 Kelvin (-350°F) completely passively",
        "Zero consumable liquid helium refrigerant needed"
      ]
    }
  },
  {
    keywords: ['water', 'ice', 'life', 'ocean', 'origin', 'biogenic', 'molecular', 'dust'],
    response: {
      answer: "Long before Earth formed 4.5 billion years ago, water molecules froze as thin coats of ice on microscopic specks of dust in interstellar clouds. SPHEREx maps where these frozen chemical building blocks hide across stellar nurseries in our Milky Way, measuring water ice, carbon dioxide, and methanol across thousands of young planetary systems.",
      simpleAnalogy: "Like snowflakes forming around dust particles in winter, water in space clings to interstellar dust grains waiting to be baked into future comets and oceans.",
      whyItMattersToHumans: "Every drop of water in our oceans and in your own body originated as ice on space dust; SPHEREx discovers how abundant water is throughout our galaxy.",
      quickFacts: [
        "Detects clear water ice absorption fingerprints at 3.0 microns",
        "Maps biogenic ices in dense molecular clouds and newborn solar systems",
        "Surveys the distribution of carbon monoxide, carbon dioxide, water, and organic compounds"
      ]
    }
  },
  {
    keywords: ['color', 'wavelength', '102', 'rainbow', 'filter', 'infrared', 'spectrum', 'spectro'],
    response: {
      answer: "Human eyes and normal digital cameras only detect 3 colors of light: Red, Green, and Blue. SPHEREx uses Linear Variable Filters to split invisible infrared heat into 102 distinct color channels! Because every chemical element and cosmic molecule absorbs and glows in very specific colors, SPHEREx reads the chemical barcode of stars, galaxies, and interstellar clouds.",
      simpleAnalogy: "Normal eyes see a 3-color paint set; SPHEREx has a 102-color set, turning blurry light into an exact chemical barcode for every object in the sky.",
      whyItMattersToHumans: "Astronomers can tell not only where a galaxy is located, but what it is made of, how fast it is moving, and how far away it is in 3D.",
      quickFacts: [
        "102 continuous spectral bands spanning 0.75 to 5.0 micrometers",
        "Linear Variable Filters create smooth rainbow gradients across the detectors",
        "Creates the first all-sky near-infrared 3D spectroscopic map in history"
      ]
    }
  },
  {
    keywords: ['webb', 'jwst', 'james webb', 'hubble', 'difference', 'compare', 'size'],
    response: {
      answer: "The James Webb Space Telescope is a giant 6.5-meter telescope built to zoom in on tiny pinpricks of the sky with extreme magnification. SPHEREx is a compact 20-centimeter wide-angle telescope designed to scan the entire 360-degree sky four times in two years. SPHEREx creates the grand all-sky atlas, finding rare cosmic gems for Webb and Hubble to inspect in high resolution.",
      simpleAnalogy: "James Webb is like a high-power microscope staring at an individual ant; SPHEREx is like a wide-angle drone mapping the entire forest.",
      whyItMattersToHumans: "They work together as NASA's ultimate cosmic team: SPHEREx finds the needles in the haystack across the whole sky.",
      quickFacts: [
        "SPHEREx surveys 100% of the sky every 6 months; Webb views narrow deep fields",
        "SPHEREx aperture is 20 cm; Webb's primary mirror is 6.5 meters",
        "SPHEREx maps 450 million galaxies to test cosmic inflation"
      ]
    }
  },
  {
    keywords: ['transit', 'dim', 'dimming', 'brighten', 'planet', 'exoplanet', 'star', 'trappist'],
    response: {
      answer: "When an exoplanet orbits in front of its parent star, it blocks a tiny fraction of the star's light, causing a temporary dimming dip. Once the planet finishes crossing, the star brightens back to normal. By comparing older baseline brightness data with new SPHEREx 102-color observations, scientists can detect planets and even analyze whether water or atmospheres exist around them!",
      simpleAnalogy: "Like a tiny moth flying in front of a bright porch light: the light dims by a tiny fraction of a percent for a couple of hours.",
      whyItMattersToHumans: "This 'transit method' is the primary way humanity has discovered over 5,500 planets orbiting other stars, some of which may harbor liquid oceans.",
      quickFacts: [
        "Transit depth tells scientists the physical size of the planet relative to the star",
        "102 infrared colors reveal if the planet's atmosphere contains water vapor or clouds",
        "Featured in our interactive Planet Transit Lab for TRAPPIST-1, TOI-700, and more"
      ]
    }
  },
  {
    keywords: ['big bang', 'inflation', 'genesis', 'beginning', 'cosmic', 'expansion', 'galaxy', '450'],
    response: {
      answer: "In the first split-second after the Big Bang, our universe underwent an exponential burst of growth called Cosmic Inflation. This violent stretching left subtle ripples in how matter clumped together. By cataloging the 3D positions of 450 million galaxies across the whole sky, SPHEREx tests whether inflation was driven by a single quantum field or multiple fields.",
      simpleAnalogy: "Like baking a loaf of raisin bread: as the dough inflates rapidly, the raisins spread out in patterns that reveal how the dough was mixed.",
      whyItMattersToHumans: "It helps answer humanity's deepest philosophical question: What physical laws governed the very creation of our universe?",
      quickFacts: [
        "Measures the 3D coordinates of 450 million galaxies",
        "Tests non-Gaussianity in the distribution of primordial matter",
        "Probes energy scales trillions of times higher than the Large Hadron Collider"
      ]
    }
  }
];

export function getPreInstalledAnswer(query: string): AIKnowledgeResponse {
  const q = query.toLowerCase().trim();

  // Find best matching topic by counting keyword hits
  let bestMatch = PREINSTALLED_KNOWLEDGE_TOPICS[0];
  let highestScore = 0;

  for (const topic of PREINSTALLED_KNOWLEDGE_TOPICS) {
    let score = 0;
    for (const kw of topic.keywords) {
      if (q.includes(kw)) {
        score += kw.length;
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestMatch = topic;
    }
  }

  // If score is high, return the curated topic response
  if (highestScore > 0) {
    return bestMatch.response;
  }

  // Default intelligent synthesized answer for any general SPHEREx question
  return {
    answer: `NASA's SPHEREx (Spectro-Photometer for the History of the Universe, Epoch of Reionization and Ices Explorer) is a premier space observatory launched in March 2025. Unlike ordinary telescopes that see 3 colors, SPHEREx sees 102 infrared colors to map 450 million galaxies, locate cosmic water ice, and study the Big Bang. Everything in this explorer is 100% pre-installed and runs locally on your device with no API keys needed!`,
    simpleAnalogy: "Think of SPHEREx as a super-advanced camera that takes a 102-color panoramic portrait of the entire universe every 6 months.",
    whyItMattersToHumans: "It reveals where the ingredients for planetary oceans came from and unlocks the secrets of cosmic birth.",
    quickFacts: [
      "Launched March 11, 2025 on a SpaceX Falcon 9 rocket",
      "Surveys 100% of the night sky across 102 infrared colors",
      "Completely pre-installed with zero external API key requirements"
    ]
  };
}
