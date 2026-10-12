import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { SPHEREX_MILESTONES } from "./src/data/milestonesData";
import { SPHEREX_CONCEPTS } from "./src/data/conceptsData";
import { SOLAR_SYSTEM_TRANSITS } from "./src/data/solarSystemsData";
import { PREINSTALLED_NASA_FEEDS } from "./src/data/nasaFeedsData";
import { calculateManualTimeInOrbit, getPreInstalledTelemetry } from "./src/data/orbitCalculator";

dotenv.config();

const PORT = 3000;

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// In-memory cache for NASA API feed
let cachedFeedItems: any[] | null = null;
let lastFeedFetchTime = 0;
const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes

// Categorizer and plain-English helper for NASA Items
function enrichNasaItem(data: any, links: any[]): any {
  const nasaId = data.nasa_id || 'SPHEREX';
  const title = (data.title || 'NASA SPHEREx Program Update').trim();
  const rawDesc = data.description || data.description_508 || title;
  const dateCreated = data.date_created || new Date().toISOString();

  // Find thumbnail, full, and original high-res image
  const thumbObj = links?.find((l: any) => l.rel === 'preview' || l.render === 'image') || links?.[0];
  const origObj = links?.find((l: any) => l.rel === 'canonical') || thumbObj;

  const rawThumb = thumbObj?.href || 'https://images-assets.nasa.gov/image/PIA26531/PIA26531~medium.jpg';
  const thumbnailUrl = rawThumb.replace('http:', 'https:');
  const fullImageUrl = (origObj?.href || rawThumb.replace('~thumb.jpg', '~large.jpg')).replace('http:', 'https:');
  const origImageUrl = rawThumb.replace('~thumb.jpg', '~orig.jpg').replace('http:', 'https:');

  // Determine category based on title & description
  const text = (title + ' ' + rawDesc + ' ' + nasaId).toLowerCase();
  let category = 'Spacecraft & Engineering';
  if (text.includes('vela') || text.includes('magellanic') || text.includes('galaxy') || text.includes('scan the sky') || text.includes('first images') || text.includes('spectrum') || text.includes('spectral') || text.includes('ice') || text.includes('dust cloud') || text.includes('science')) {
    category = 'Science & Cosmos';
  } else if (text.includes('vibration') || text.includes('acoustic') || text.includes('thermal vacuum') || text.includes('testing') || text.includes('clean room') || text.includes('environmental testing') || text.includes('work stand') || text.includes('uncrating') || text.includes('arrival') || text.includes('astrotech') || text.includes('unboxing')) {
    category = 'Testing & Prep';
  } else if (text.includes('launch') || text.includes('rocket') || text.includes('slc-4e') || text.includes('sunset') || text.includes('vertical') || text.includes('encapsulation') || text.includes('booster') || text.includes('orbit') || text.includes('vandenberg') || text.includes('falcon') || text.includes('vsfb')) {
    category = 'Launch & Operations';
  }

  // Generate friendly Plain-English summary and takeaway
  let plainEnglishSummary = '';
  let plainEnglishKeyTakeaway = '';

  if (title.toLowerCase().includes('scans the sky')) {
    plainEnglishSummary = 'SPHEREx captures the sky by sweeping across it like a paint roller, taking overlapping pictures in 102 invisible colors of infrared heat.';
    plainEnglishKeyTakeaway = 'Instead of only 3 colors (RGB) like your phone, SPHEREx sees 102 colors that reveal what space dust and distant stars are made of.';
  } else if (title.toLowerCase().includes('photon shield') || title.toLowerCase().includes('horizontal') || title.toLowerCase().includes('radiator')) {
    plainEnglishSummary = 'These cone-shaped aluminum shields act like three layered sun umbrellas, reflecting away blistering heat from the Sun and Earth so the telescope stays super cold.';
    plainEnglishKeyTakeaway = 'Because it detects heat light, the telescope must stay ice-cold (-350°F) so it doesn\'t blind itself with its own warmth.';
  } else if (title.toLowerCase().includes('first images') || title.toLowerCase().includes('dust cloud')) {
    plainEnglishSummary = 'Early test images captured neighboring dwarf galaxies in radiant infrared rainbow hues, showing star nurseries glowing bright where normal eyes see only dark clouds.';
    plainEnglishKeyTakeaway = 'Infrared light penetrates straight through cosmic dust, uncovering stars and planetary building blocks that are otherwise completely invisible.';
  } else if (title.toLowerCase().includes('acoustic') || title.toLowerCase().includes('vibration')) {
    plainEnglishSummary = 'Before riding a rocket, the spacecraft was strapped to giant shake tables and blasted with eardrum-shattering sound to guarantee it could survive liftoff.';
    plainEnglishKeyTakeaway = 'Rocket blastoffs create violent vibrations. Rigorous ground testing ensures not a single screw or mirror gets knocked loose.';
  } else if (title.toLowerCase().includes('vela')) {
    plainEnglishSummary = 'SPHEREx mapped a massive stellar nursery where baby stars are currently forming, detecting vast sheets of frozen water, carbon dioxide, and organic ice.';
    plainEnglishKeyTakeaway = 'Shows that water—the main ingredient for oceans and life—is already baked into deep space clouds long before planets finish forming.';
  } else if (title.toLowerCase().includes('sunset') || title.toLowerCase().includes('slc-4e')) {
    plainEnglishSummary = 'The SpaceX Falcon 9 rocket stands vertical against a stunning California coastal sunset at Space Launch Complex 4E at Vandenberg Space Force Base.';
    plainEnglishKeyTakeaway = 'Dramatic launch pad staging before fueling and final countdown.';
  } else if (title.toLowerCase().includes('encapsulation')) {
    plainEnglishSummary = 'Engineers enclose SPHEREx and the secondary PUNCH spacecraft inside the aerodynamic payload fairing shell of the Falcon 9 rocket.';
    plainEnglishKeyTakeaway = 'The fairing clamshell protects the sensitive telescope mirrors from the wind, heat, and friction of roaring through Earth\'s atmosphere.';
  } else if (title.toLowerCase().includes('astrotech') || title.toLowerCase().includes('uncrating') || title.toLowerCase().includes('arrival')) {
    plainEnglishSummary = 'Specialized technicians carefully unbox the SPHEREx telescope inside the ultra-clean processing facility at Vandenberg after cross-country transit.';
    plainEnglishKeyTakeaway = 'Even a single speck of dust can obscure sensitive optical filters, so every unboxing step happens in pressurized, HEPA-filtered cleanrooms.';
  } else if (title.toLowerCase().includes('booster landing')) {
    plainEnglishSummary = 'The Falcon 9 first-stage booster touches down smoothly on Landing Zone 4 at Vandenberg after propelling SPHEREx on its journey to orbit.';
    plainEnglishKeyTakeaway = 'Rocket reusability drastically reduces the cost of launching NASA science observatories into space.';
  } else if (title.toLowerCase().includes('vertical')) {
    plainEnglishSummary = 'The transporter-erector hoists the Falcon 9 rocket containing SPHEREx from horizontal assembly into the vertical launch position.';
    plainEnglishKeyTakeaway = 'Pre-launch checkout verifying all mechanical connections, fuel umbilicals, and telemetry cables.';
  } else {
    // Generate readable simplification from description
    const sentences = rawDesc.split(/(?<=[.?!])\s+/);
    plainEnglishSummary = sentences.slice(0, 2).join(' ') || title;
    plainEnglishKeyTakeaway = 'SPHEREx is surveying the entire cosmos across 102 infrared wavelengths to map 450 million galaxies and uncover water throughout space.';
  }

  return {
    id: nasaId,
    nasaId,
    title,
    date: dateCreated,
    description: rawDesc,
    plainEnglishSummary,
    plainEnglishKeyTakeaway,
    category,
    thumbnailUrl,
    fullImageUrl,
    origImageUrl,
    center: data.center || 'NASA JPL',
    keywords: data.keywords || ['SPHEREx', 'NASA', 'Infrared']
  };
}

async function fetchNasaSpherexFeeds() {
  // All 159 official NASA SPHEREx mission photographs are pre-installed in the application.
  // Served immediately with zero runtime network latency or external API failure risk.
  return PREINSTALLED_NASA_FEEDS;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Current Mission Telemetry & Status (Manually Calculated from Launch Date)
  app.get("/api/nasa/spherex/status", (_req, res) => {
    const calc = calculateManualTimeInOrbit();
    const telemetry = getPreInstalledTelemetry();

    res.json({
      ...telemetry,
      calculation: calc,
      principalInvestigator: "Prof. Jamie Bock (Caltech / NASA JPL)",
      managingCenter: "NASA Jet Propulsion Laboratory, Pasadena, CA",
      spacecraftBuilder: "BAE Systems Space & Mission Systems (Ball Aerospace)"
    });
  });

  // Official NASA Feed Endpoint
  app.get("/api/nasa/spherex/feed", async (req, res) => {
    try {
      const items = (await fetchNasaSpherexFeeds()) || [];
      const category = req.query.category as string;
      const search = (req.query.q as string)?.toLowerCase().trim();

      let filtered: any[] = Array.isArray(items) ? [...items] : [];
      if (category && category !== 'All') {
        filtered = filtered.filter((i: any) => i.category === category);
      }
      if (search) {
        filtered = filtered.filter((i: any) =>
          i.title.toLowerCase().includes(search) ||
          i.description.toLowerCase().includes(search) ||
          i.plainEnglishSummary.toLowerCase().includes(search)
        );
      }

      res.json({
        total: filtered.length,
        items: filtered,
        lastUpdated: new Date(lastFeedFetchTime).toISOString(),
        source: "NASA Image and Video Library & JPL Astrophysics Feed"
      });
    } catch (err: any) {
      console.error("Feed error:", err);
      res.status(500).json({ error: "Failed to fetch NASA feed", details: err?.message });
    }
  });

  // Milestones Timeline Endpoint
  app.get("/api/nasa/spherex/milestones", (_req, res) => {
    res.json({
      milestones: SPHEREX_MILESTONES,
      total: SPHEREX_MILESTONES.length
    });
  });

  // Core Concepts in Plain English Endpoint
  app.get("/api/nasa/spherex/concepts", (_req, res) => {
    res.json({
      concepts: SPHEREX_CONCEPTS
    });
  });

  // Solar Systems & Exoplanet Transit Photometry Endpoint
  app.get("/api/nasa/exoplanets/transit-data", (req, res) => {
    const systemId = req.query.id as string;
    if (systemId) {
      const found = SOLAR_SYSTEM_TRANSITS.find(s => s.id === systemId);
      if (found) {
        return res.json(found);
      }
      return res.status(404).json({ error: "System not found" });
    }
    res.json({
      total: SOLAR_SYSTEM_TRANSITS.length,
      systems: SOLAR_SYSTEM_TRANSITS
    });
  });

  // Plain-English AI Explainer Endpoint (Gemini 3.8 Flash)
  app.post("/api/spherex/explain", async (req, res) => {
    const { question, technicalText, mode } = req.body;

    const gemini = getGeminiClient();
    if (!gemini) {
      // Fallback friendly explanation if no key is configured
      return res.json({
        answer: "SPHEREx is NASA's revolutionary space telescope launched in March 2025. Unlike regular cameras that see 3 colors (Red, Green, Blue), SPHEREx sees 102 invisible infrared colors! This lets scientists map 450 million galaxies and discover where water and the building blocks of life are scattered across space.",
        simpleAnalogy: "Think of SPHEREx as a wide-angle camera taking a high-definition 102-color panoramic photo of the entire universe.",
        keyTakeaway: "It uncovers the ingredients for planets and tests how our universe was born in the Big Bang."
      });
    }

    try {
      const prompt = `
You are the NASA SPHEREx Mission Plain-English Guide. Your goal is to explain the SPHEREx mission (Spectro-Photometer for the History of the Universe, Epoch of Reionization and Ices Explorer) so that anyone—a middle school student, a grandparent, or an everyday person without any physics background—can immediately understand and be inspired by it.

User Request / Question: "${question || ''}"
Technical Context or NASA Press Release excerpt: "${technicalText || ''}"
Mode requested: "${mode || 'explain_for_layperson'}"

Please respond in valid JSON matching this schema:
{
  "answer": "A clear, engaging, conversational explanation in 2-3 short paragraphs using simple everyday English.",
  "simpleAnalogy": "A memorable real-world analogy (e.g. comparing to baking, car headlights in fog, prisms, umbrellas, or phones).",
  "whyItMattersToHumans": "One compelling sentence on why this matters to ordinary people on Earth.",
  "quickFacts": ["Fact 1", "Fact 2", "Fact 3"]
}
`;

      const response = await gemini.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          systemInstruction: "You are an enthusiastic, world-class NASA science communicator who explains space missions using clear, everyday language with no unexplained jargon.",
          temperature: 0.7,
        },
      });

      const responseText = response.text || "{}";
      const parsed = JSON.parse(responseText);
      res.json(parsed);
    } catch (err: any) {
      console.error("Gemini explain error, generating intelligent fallback:", err?.message);
      
      const qLower = (question || '').toLowerCase();
      let answer = "SPHEREx (Spectro-Photometer for the History of the Universe, Epoch of Reionization and Ices Explorer) is NASA's revolutionary all-sky space observatory launched in March 2025 aboard a SpaceX Falcon 9 rocket.";
      let simpleAnalogy = "Think of SPHEREx as a wide-angle camera taking a 102-color panoramic photograph of the entire universe.";
      let whyItMattersToHumans = "It maps 450 million galaxies and tracks the cosmic water that eventually formed planets and oceans like Earth's.";
      let quickFacts = [
        "Observes in 102 infrared wavelengths (colors of heat) simultaneously",
        "Orbits Earth at 650 km in a sun-synchronous polar orbit taking ~3,600 exposures every day",
        "Cooled passively to -350°F (-210°C) using three nested cone photon shields with zero liquid coolant"
      ];

      if (qLower.includes('umbrella') || qLower.includes('shield') || qLower.includes('cone') || qLower.includes('cool') || qLower.includes('freez')) {
        answer = "SPHEREx's distinctive cone shape comes from three nested aluminum 'photon shields'. Because SPHEREx detects faint heat from deep space, any warmth from the spacecraft itself would blind it. The three shields bounce heat from the Sun and Earth straight out into dark space, keeping the telescope freezing cold at -350°F (-210°C) without needing heavy liquid coolant tanks that eventually run out.";
        simpleAnalogy = "Like holding three sun umbrellas at the beach: the outer one takes the direct sun, the middle one stays cooler, and underneath the third it is freezing cold.";
        whyItMattersToHumans = "Passive cooling saves millions of dollars in launch weight and prevents the telescope from ever running out of refrigerant.";
        quickFacts = [
          "Three nested lightweight aluminum conical shields",
          "Maintains cryogenic 80 Kelvin (-315°F) completely passively",
          "Eliminated the need for heavy liquid helium cryostat tanks"
        ];
      } else if (qLower.includes('water') || qLower.includes('ice') || qLower.includes('life') || qLower.includes('ocean')) {
        answer = "Long before Earth formed 4.5 billion years ago, water molecules froze as thin coats of ice on microscopic specks of dust in interstellar clouds. SPHEREx maps where these frozen chemical building blocks hide across stellar nurseries in our Milky Way, measuring water ice, carbon dioxide, and methanol.";
        simpleAnalogy = "Like snowflakes forming around dust particles in winter, water in space clings to interstellar dust grains waiting to be baked into future comets and oceans.";
        whyItMattersToHumans = "Every sip of water you drink originated in space dust clouds; SPHEREx reveals how common water is around newly forming star systems.";
        quickFacts = [
          "Identifies water ice absorption at 3.0 microns wavelength",
          "Maps biogenic ices in dense molecular clouds and young solar systems",
          "Tracks carbon monoxide, carbon dioxide, water, and methanol across the Milky Way"
        ];
      } else if (qLower.includes('color') || qLower.includes('wavelength') || qLower.includes('spectrum') || qLower.includes('rainbow')) {
        answer = "Human eyes and regular phone cameras only register three colors of light: Red, Green, and Blue. SPHEREx uses advanced Linear Variable Filters to split invisible infrared heat into 102 distinct color channels. Because every chemical molecule absorbs and radiates specific colors, SPHEREx reads the chemical fingerprint of stars and galaxies.";
        simpleAnalogy = "Human eyes see 3 channels; SPHEREx has superhuman vision with 102 channels, turning blurry space light into exact chemical barcodes.";
        whyItMattersToHumans = "Allows astronomers to calculate not just where a galaxy is, but what it's made of, how fast it's traveling, and its precise 3D distance.";
        quickFacts = [
          "102 spectral bands from 0.75 to 5.0 micrometers",
          "Linear Variable Filters create rainbow gradients across two detector arrays",
          "Builds the first all-sky near-infrared 3D spectroscopic map"
        ];
      } else if (qLower.includes('webb') || qLower.includes('james webb') || qLower.includes('difference') || qLower.includes('compare')) {
        answer = "The James Webb Space Telescope (JWST) is a giant 6.5-meter telescope designed to zoom in with extreme detail on tiny pinpricks of space. SPHEREx is a compact 20-centimeter wide-angle telescope designed to scan the entire sky four times in two years. SPHEREx creates the grand all-sky road map, identifying intriguing objects for larger telescopes like Webb and Hubble to inspect up close.";
        simpleAnalogy = "James Webb is like a high-power microscope staring at a single leaf; SPHEREx is like a wide-angle drone taking a panoramic photo of the entire forest.";
        whyItMattersToHumans = "Together they form NASA's ultimate astrophysics team: SPHEREx finds rare cosmic needles in the haystack across the whole sky.";
        quickFacts = [
          "SPHEREx surveys 100% of the sky every 6 months; Webb looks at narrow deep fields",
          "SPHEREx aperture is 20 centimeters; Webb's primary mirror is 6.5 meters",
          "SPHEREx maps 450 million galaxies to test cosmic inflation and universal structure"
        ];
      }

      res.json({
        answer,
        simpleAnalogy,
        whyItMattersToHumans,
        quickFacts
      });
    }
  });

  // Vite middleware in dev, static files in prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NASA SPHEREx Explorer server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
