import { MissionTelemetry } from '../types';

// Official SPHEREx Launch Timestamp
// Launched on a SpaceX Falcon 9 rocket from Vandenberg Space Force Base, Space Launch Complex 4E (SLC-4E)
// Launch Date: March 11, 2025 at 23:15:00 UTC
export const SPHEREX_LAUNCH_TIMESTAMP_MS = new Date("2025-03-11T23:15:00Z").getTime();
export const SPHEREX_LAUNCH_DATE_STRING = "March 11, 2025 at 23:15 UTC";
export const ORBIT_PERIOD_MINUTES = 97.4; // 97.4 minutes per low-Earth sun-synchronous polar orbit
export const ORBIT_ALTITUDE_KM = 650;
export const ORBITAL_SPEED_KM_S = 7.53; // ~7.53 km/s in 650km orbit
export const DAILY_EXPOSURES = 3600; // ~3,600 scientific exposures every 24 hours
export const DAYS_PER_ALL_SKY_SURVEY = 180; // ~6 months (180 days) for one complete 360-degree sky map

export interface ManualTimeCalculation {
  launchDateFormatted: string;
  launchTimestampMs: number;
  currentTimestampMs: number;
  diffMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  fractionalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  totalOrbitsCompleted: number;
  totalDistanceTraveledKm: number;
  totalExposuresEstimated: number;
  currentSurveyRound: number;
  surveyProgressPercent: number;
  surveyDaysInRound: number;
  formula: {
    definition: string;
    millisecondsElapsed: number;
    daysExactMath: string;
    isPreInstalledLocal: boolean;
  };
}

/**
 * Manually calculates the exact time in orbit and associated mission metrics
 * directly from the SPHEREx launch date without any external API keys or network calls.
 */
export function calculateManualTimeInOrbit(targetDate: Date = new Date()): ManualTimeCalculation {
  const currentMs = targetDate.getTime();
  const diffMs = Math.max(0, currentMs - SPHEREX_LAUNCH_TIMESTAMP_MS);

  const MS_PER_SECOND = 1000;
  const MS_PER_MINUTE = 60 * MS_PER_SECOND;
  const MS_PER_HOUR = 60 * MS_PER_MINUTE;
  const MS_PER_DAY = 24 * MS_PER_HOUR;

  const days = Math.floor(diffMs / MS_PER_DAY);
  const hours = Math.floor((diffMs % MS_PER_DAY) / MS_PER_HOUR);
  const minutes = Math.floor((diffMs % MS_PER_HOUR) / MS_PER_MINUTE);
  const seconds = Math.floor((diffMs % MS_PER_MINUTE) / MS_PER_SECOND);

  const totalHours = Math.floor(diffMs / MS_PER_HOUR);
  const totalMinutes = Math.floor(diffMs / MS_PER_MINUTE);
  const totalSeconds = Math.floor(diffMs / MS_PER_SECOND);
  const fractionalDays = Number((diffMs / MS_PER_DAY).toFixed(5));

  // Orbits completed around Earth: (diffMs / (97.4 minutes * 60,000 ms))
  const orbitDurationMs = ORBIT_PERIOD_MINUTES * MS_PER_MINUTE;
  const totalOrbitsCompleted = Math.floor(diffMs / orbitDurationMs);

  // Approximate distance traveled in orbit at ~7.53 km/s
  const totalDistanceTraveledKm = Math.floor(totalSeconds * ORBITAL_SPEED_KM_S);

  // Total exposures: ~3,600 scientific exposures every 24 hours
  const totalExposuresEstimated = Math.floor((diffMs / MS_PER_DAY) * DAILY_EXPOSURES);

  // Commissioning took ~50 days (March 11 to May 1, 2025). Science survey started May 1, 2025.
  const commissioningDays = 51;
  const scienceDays = Math.max(0, days - commissioningDays);
  const currentSurveyRound = Math.floor(scienceDays / DAYS_PER_ALL_SKY_SURVEY) + 1;
  const surveyDaysInRound = scienceDays % DAYS_PER_ALL_SKY_SURVEY;
  const surveyProgressPercent = Math.min(100, Math.round((surveyDaysInRound / DAYS_PER_ALL_SKY_SURVEY) * 100));

  return {
    launchDateFormatted: SPHEREX_LAUNCH_DATE_STRING,
    launchTimestampMs: SPHEREX_LAUNCH_TIMESTAMP_MS,
    currentTimestampMs: currentMs,
    diffMs,
    days,
    hours,
    minutes,
    seconds,
    fractionalDays,
    totalHours,
    totalMinutes,
    totalSeconds,
    totalOrbitsCompleted,
    totalDistanceTraveledKm,
    totalExposuresEstimated,
    currentSurveyRound: Math.min(4, currentSurveyRound),
    surveyProgressPercent,
    surveyDaysInRound,
    formula: {
      definition: "Days in Orbit = Math.floor((Current_Device_Time_ms - SPHEREx_Launch_Time_ms) / 86,400,000 ms)",
      millisecondsElapsed: diffMs,
      daysExactMath: `${diffMs.toLocaleString()} ms ÷ 86,400,000 ms/day = ${(diffMs / MS_PER_DAY).toFixed(4)} days`,
      isPreInstalledLocal: true,
    },
  };
}

/**
 * Returns complete MissionTelemetry constructed locally using manual calculation.
 * 100% pre-installed and offline-ready with zero external API calls or keys.
 */
export function getPreInstalledTelemetry(targetDate: Date = new Date()): MissionTelemetry {
  const calc = calculateManualTimeInOrbit(targetDate);

  let currentPhase = "Active All-Sky Science Survey (Survey Round 2)";
  if (calc.days < 51) {
    currentPhase = "In-Orbit Checkout & Cryogenic Commissioning";
  } else if (calc.currentSurveyRound === 1) {
    currentPhase = "All-Sky Survey 1 of 4 (Complete Cosmic Map)";
  } else if (calc.currentSurveyRound === 2) {
    currentPhase = "All-Sky Survey 2 of 4 (Active Infrared Verification)";
  } else if (calc.currentSurveyRound === 3) {
    currentPhase = "All-Sky Survey 3 of 4 (Extended Deep Map)";
  } else {
    currentPhase = "All-Sky Survey 4 of 4 (Final Synthesis Map)";
  }

  return {
    launchDate: "March 11, 2025",
    missionDurationDays: calc.days,
    currentPhase,
    orbitAltitudeKm: ORBIT_ALTITUDE_KM,
    orbitPeriodMinutes: ORBIT_PERIOD_MINUTES,
    orbitType: "Sun-Synchronous Low Earth Polar Orbit",
    dailyImagesTaken: DAILY_EXPOSURES,
    totalImagesEstimated: Math.max(1200000, calc.totalExposuresEstimated),
    colorsSurveyed: 102,
    galaxiesTargetedMillions: 450,
    telescopeTemperatureKelvin: 80, // -315°F (-193°C)
    missionHealth: "NOMINAL",
    skyCoveragePercent: calc.surveyProgressPercent,
    currentSurveyRound: calc.currentSurveyRound,
  };
}
