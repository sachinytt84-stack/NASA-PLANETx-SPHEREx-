export type MissionPhase = 'concept' | 'development' | 'testing' | 'launch' | 'operations' | 'future';

export interface NasaFeedItem {
  id: string;
  nasaId: string;
  title: string;
  date: string;
  description: string;
  plainEnglishSummary: string;
  plainEnglishKeyTakeaway: string;
  category: 'Science & Cosmos' | 'Spacecraft & Engineering' | 'Testing & Prep' | 'Launch & Operations';
  thumbnailUrl: string;
  fullImageUrl: string;
  origImageUrl?: string;
  center: string;
  keywords: string[];
  simplifiedLevel?: 'beginner' | 'intermediate' | 'expert';
}

export interface MissionMilestone {
  id: string;
  phase: MissionPhase;
  phaseLabel: string;
  title: string;
  date: string;
  displayDate: string;
  status: 'completed' | 'current' | 'upcoming';
  headline: string;
  summary: string;
  plainEnglishWhatHappened: string;
  whyItMattersToYou: string;
  imageUrl: string;
  nasaId?: string;
  location?: string;
  funFact?: string;
  technicalDetails?: string;
}

export interface MissionTelemetry {
  launchDate: string;
  missionDurationDays: number;
  currentPhase: string;
  orbitAltitudeKm: number;
  orbitPeriodMinutes: number;
  orbitType: string;
  dailyImagesTaken: number;
  totalImagesEstimated: number;
  colorsSurveyed: number;
  galaxiesTargetedMillions: number;
  telescopeTemperatureKelvin: number;
  missionHealth: 'NOMINAL' | 'ACTIVE_SCIENCE' | 'CALIBRATION';
  skyCoveragePercent: number;
  currentSurveyRound: number;
}

export interface PlainEnglishConcept {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  simpleAnalogy: string;
  commonManExplanation: string;
  whyItMattersToUs: string;
  technicalJargonTranslated: {
    term: string;
    translation: string;
  }[];
}

export interface TransitDataPoint {
  timeHours: number; // -8 to +8 hours around transit center
  brightnessOld: number; // 0-100% normalized flux in old baseline observation
  brightnessNew: number; // 0-100% normalized flux in new SPHEREx/follow-up observation
  uncertaintyOld?: number;
  uncertaintyNew?: number;
}

export interface ExoplanetInfo {
  name: string;
  radiusEarthRatio: number;
  orbitalPeriodDays: number;
  semiMajorAxisAU: number;
  planetType: 'Terrestrial Rocky' | 'Super-Earth' | 'Sub-Neptune' | 'Gas Giant / Hot Jupiter' | 'Ice Giant';
  habitableZoneStatus: 'Inside Habitable Zone' | 'Too Hot / Scorching' | 'Too Cold / Frozen';
  atmosphereFeatures?: string[];
  plainEnglishDescription: string;
}

export interface StellarSystemTransit {
  id: string;
  name: string;
  alternateName?: string;
  constellation: string;
  distanceLightYears: number;
  starType: string;
  starClassification: string;
  starColorHex: string;
  starGlowHex: string;
  starRadiusSunRatio: number;
  starTemperatureKelvin: number;
  hasPlanets: boolean;
  planetCount: number;
  planets: ExoplanetInfo[];
  detectionVerdict: 'CONFIRMED_PLANETS' | 'NO_TRANSIT_DETECTED' | 'SOLO_STAR_BASELINE' | 'CANDIDATE_ANOMALY';
  verdictTitle: string;
  verdictSummary: string;
  plainEnglishExplanation: string;
  everydayAnalogy: string;
  oldDataSurveyName: string;
  oldDataDate: string;
  oldDataNotes: string;
  newDataSurveyName: string;
  newDataDate: string;
  newDataNotes: string;
  maxTransitDipPercent: number; // e.g. 1.25%
  transitDurationHours: number; // e.g. 3.2 hours
  infraredAtmosphereNote?: string;
  dataPoints: TransitDataPoint[];
}
