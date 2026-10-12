import React, { useState, useEffect } from 'react';
import {
  Clock,
  Calculator,
  Calendar,
  Globe,
  Radio,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Sliders,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Info,
  Zap,
} from 'lucide-react';
import {
  calculateManualTimeInOrbit,
  ManualTimeCalculation,
  SPHEREX_LAUNCH_DATE_STRING,
  SPHEREX_LAUNCH_TIMESTAMP_MS,
  ORBIT_PERIOD_MINUTES,
  ORBITAL_SPEED_KM_S,
  DAILY_EXPOSURES,
} from '../data/orbitCalculator';

interface TimeInOrbitSectionProps {
  plainEnglishMode: boolean;
}

export const TimeInOrbitSection: React.FC<TimeInOrbitSectionProps> = ({ plainEnglishMode }) => {
  // Live manual calculation state
  const [calculation, setCalculation] = useState<ManualTimeCalculation>(() => calculateManualTimeInOrbit());
  const [showFormulaDetails, setShowFormulaDetails] = useState<boolean>(true);
  const [simulatedDate, setSimulatedDate] = useState<string>(''); // Empty means live current time
  const [isLiveClock, setIsLiveClock] = useState<boolean>(true);

  // Update manual calculation live every second when in live mode
  useEffect(() => {
    if (!isLiveClock) return;

    const interval = setInterval(() => {
      setCalculation(calculateManualTimeInOrbit(new Date()));
    }, 1000);

    return () => clearInterval(interval);
  }, [isLiveClock]);

  // Handle simulation changes
  const handleSimulateDate = (dateStr: string) => {
    if (!dateStr) {
      setIsLiveClock(true);
      setSimulatedDate('');
      setCalculation(calculateManualTimeInOrbit(new Date()));
      return;
    }

    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      setIsLiveClock(false);
      setSimulatedDate(dateStr);
      setCalculation(calculateManualTimeInOrbit(d));
    }
  };

  const handleResetToLive = () => {
    setIsLiveClock(true);
    setSimulatedDate('');
    setCalculation(calculateManualTimeInOrbit(new Date()));
  };

  return (
    <div id="time-in-orbit-section" className="space-y-6">
      {/* Main Container */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden p-6 sm:p-8 lg:p-10 relative">
        {/* Soft background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-100/30 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 space-y-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% PRE-INSTALLED MANUAL CALCULATION • ZERO ONLINE API KEYS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 tracking-tight flex items-center gap-3">
                <Clock className="w-8 h-8 text-sky-600" />
                <span>Time in Orbit & Mission Clock</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-3xl leading-relaxed">
                {plainEnglishMode
                  ? "Instead of relying on online servers or secret API keys, this section manually counts the exact number of days, hours, and seconds from the moment SPHEREx blasted off into space on March 11, 2025."
                  : "Autonomous client-side orbital chronometry. Computes mission elapsed time (MET) directly from the Vandenberg Space Force Base launch epoch using UTC differential arithmetic."}
              </p>
            </div>

            {/* Live Indicator or Sim Status */}
            <div className="flex items-center gap-2 self-start md:self-center shrink-0">
              {isLiveClock ? (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
                  </span>
                  <span>LIVE REAL-TIME TICKER</span>
                </div>
              ) : (
                <button
                  onClick={handleResetToLive}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold hover:bg-amber-100 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                  <span>SIMULATED EPOCH (CLICK TO RESET)</span>
                </button>
              )}
            </div>
          </div>

          {/* Primary Calculated Time Display */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Massive Days Counter */}
            <div className="lg:col-span-7 bg-slate-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-sky-400 font-bold flex items-center gap-1.5">
                    <Calculator className="w-4 h-4" />
                    Manually Calculated from Launch Date
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Launch: Mar 11, 2025
                  </span>
                </div>

                {/* Big Days Number */}
                <div className="space-y-1">
                  <div className="text-6xl sm:text-7xl font-black font-mono tracking-tight text-white flex items-baseline gap-3">
                    <span>{calculation.days.toLocaleString()}</span>
                    <span className="text-2xl sm:text-3xl text-sky-400 font-bold font-sans">
                      Days
                    </span>
                  </div>
                  <div className="text-sm font-mono text-slate-300">
                    Fractional value: <span className="text-sky-300 font-semibold">{calculation.fractionalDays}</span> total days in space
                  </div>
                </div>

                {/* Sub-counters: Hours, Minutes, Seconds */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800">
                  <div className="bg-slate-900/80 rounded-2xl p-3 border border-slate-800 text-center">
                    <div className="text-2xl sm:text-3xl font-mono font-black text-white">
                      {String(calculation.hours).padStart(2, '0')}
                    </div>
                    <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">
                      Hours
                    </div>
                  </div>

                  <div className="bg-slate-900/80 rounded-2xl p-3 border border-slate-800 text-center">
                    <div className="text-2xl sm:text-3xl font-mono font-black text-white">
                      {String(calculation.minutes).padStart(2, '0')}
                    </div>
                    <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">
                      Minutes
                    </div>
                  </div>

                  <div className="bg-slate-900/80 rounded-2xl p-3 border border-slate-800 text-center">
                    <div className="text-2xl sm:text-3xl font-mono font-black text-emerald-400">
                      {String(calculation.seconds).padStart(2, '0')}
                    </div>
                    <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">
                      Seconds
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Launch Info */}
              <div className="pt-6 mt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 relative z-10">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-sky-400" />
                  <span>Launch Epoch: <strong>2025-03-11 23:15 UTC</strong> (Falcon 9)</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Pure Device Calculation • 0 Network Latency</span>
                </div>
              </div>
            </div>

            {/* Derived Orbital Physics Cards */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
              {/* Orbits Completed */}
              <div className="bg-sky-50/70 border border-sky-100 rounded-3xl p-4 sm:p-5 flex flex-col justify-between shadow-2xs">
                <div>
                  <span className="text-xs font-bold text-sky-900 uppercase tracking-wider block">
                    Orbits of Earth
                  </span>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-slate-950 mt-2">
                    {calculation.totalOrbitsCompleted.toLocaleString()}
                  </div>
                </div>
                <div className="text-xs text-slate-600 mt-3 pt-2 border-t border-sky-100">
                  {plainEnglishMode
                    ? "Completed laps around Earth at 97.4 minutes per circle."
                    : `Evaluated at T = ${ORBIT_PERIOD_MINUTES} min per sun-sync polar revolution.`}
                </div>
              </div>

              {/* Total Science Exposures */}
              <div className="bg-indigo-50/70 border border-indigo-100 rounded-3xl p-4 sm:p-5 flex flex-col justify-between shadow-2xs">
                <div>
                  <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider block">
                    Pictures Taken
                  </span>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-slate-950 mt-2">
                    ~{(calculation.totalExposuresEstimated / 1000000).toFixed(2)}M
                  </div>
                </div>
                <div className="text-xs text-slate-600 mt-3 pt-2 border-t border-indigo-100">
                  {plainEnglishMode
                    ? "Calculated at ~3,600 scientific exposures captured each day."
                    : `Linear product: ${DAILY_EXPOSURES.toLocaleString()} exposures × ${calculation.days} days.`}
                </div>
              </div>

              {/* Distance Traveled */}
              <div className="bg-emerald-50/70 border border-emerald-100 rounded-3xl p-4 sm:p-5 flex flex-col justify-between shadow-2xs">
                <div>
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">
                    Orbital Distance
                  </span>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-slate-950 mt-2">
                    {(calculation.totalDistanceTraveledKm / 1000000).toFixed(1)}M km
                  </div>
                </div>
                <div className="text-xs text-slate-600 mt-3 pt-2 border-t border-emerald-100">
                  {plainEnglishMode
                    ? "Zipping around the planet at 7.5 kilometers per second!"
                    : `Velocity integration: ${ORBITAL_SPEED_KM_S} km/s × ${calculation.totalSeconds.toLocaleString()} s.`}
                </div>
              </div>

              {/* All-Sky Survey Progress */}
              <div className="bg-amber-50/70 border border-amber-100 rounded-3xl p-4 sm:p-5 flex flex-col justify-between shadow-2xs">
                <div>
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
                    All-Sky Survey Round
                  </span>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-slate-950 mt-2">
                    Round {calculation.currentSurveyRound} of 4
                  </div>
                </div>
                <div className="text-xs text-slate-600 mt-3 pt-2 border-t border-amber-100">
                  <div className="flex justify-between items-center mb-1">
                    <span>Survey Progress:</span>
                    <span className="font-bold font-mono">{calculation.surveyProgressPercent}%</span>
                  </div>
                  <div className="w-full bg-amber-200/60 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-amber-600 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${calculation.surveyProgressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Calculation Inspector / Formula Explanation */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6 space-y-4">
            <button
              onClick={() => setShowFormulaDetails(!showFormulaDetails)}
              className="w-full flex items-center justify-between text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center">
                  <Info className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-950 group-hover:text-sky-700 transition-colors">
                    Exact Mathematical Calculation Breakdown
                  </span>
                  <span className="text-xs text-slate-500 block">
                    Inspect step-by-step how the days are calculated from the launch timestamp
                  </span>
                </div>
              </div>
              <div className="text-slate-400 group-hover:text-slate-700">
                {showFormulaDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </button>

            {showFormulaDetails && (
              <div className="space-y-4 pt-3 border-t border-slate-200 text-xs sm:text-sm text-slate-700">
                {/* Mathematical Formula Banner */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 font-mono text-xs overflow-x-auto shadow-2xs">
                  <div className="text-slate-500 text-[11px] uppercase tracking-wider font-sans font-bold mb-1">
                    The Exact Mathematical Formula Used:
                  </div>
                  <code className="text-sky-900 font-bold">
                    Days in Orbit = Math.floor((Current_Device_Timestamp - 1,741,734,900,000) / 86,400,000)
                  </code>
                </div>

                {/* 4 Calculation Steps */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                    <div className="text-[11px] font-bold text-slate-500 uppercase">Step 1: Launch Epoch</div>
                    <div className="font-mono font-bold text-slate-900 text-xs">
                      1,741,734,900,000 ms
                    </div>
                    <div className="text-[11px] text-slate-500">
                      March 11, 2025 at 23:15:00 UTC
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                    <div className="text-[11px] font-bold text-slate-500 uppercase">Step 2: Current Time</div>
                    <div className="font-mono font-bold text-slate-900 text-xs">
                      {calculation.currentTimestampMs.toLocaleString()} ms
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Evaluated live on your device
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                    <div className="text-[11px] font-bold text-slate-500 uppercase">Step 3: Difference (Δt)</div>
                    <div className="font-mono font-bold text-indigo-700 text-xs">
                      {calculation.diffMs.toLocaleString()} ms
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {calculation.totalHours.toLocaleString()} total hours
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                    <div className="text-[11px] font-bold text-slate-500 uppercase">Step 4: Division Result</div>
                    <div className="font-mono font-bold text-emerald-700 text-xs">
                      {calculation.days} Days + {calculation.hours}h {calculation.minutes}m
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Divided by 86.4M ms/day
                    </div>
                  </div>
                </div>

                {/* Verification Guarantee */}
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center gap-2.5 text-xs text-emerald-950">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Zero External API Keys:</strong> All values are computed directly inside your browser using native JavaScript UTC time math. The counter never stalls, never fails from network timeouts, and works even with no internet connection.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Date Time Machine Simulator */}
          <div className="pt-2 border-t border-slate-200/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-600 font-bold flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-sky-600" />
                Test the Manual Calculation with Other Dates:
              </span>
              {!isLiveClock && (
                <button
                  onClick={handleResetToLive}
                  className="text-xs text-sky-600 hover:text-sky-800 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Return to Live Current Time
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleResetToLive}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isLiveClock
                    ? 'bg-slate-950 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                }`}
              >
                ● Live Local Time
              </button>

              <button
                onClick={() => handleSimulateDate('2025-06-19T23:15:00Z')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  simulatedDate === '2025-06-19T23:15:00Z'
                    ? 'bg-slate-950 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                }`}
              >
                Day 100 in Space (June 19, 2025)
              </button>

              <button
                onClick={() => handleSimulateDate('2025-11-01T00:00:00Z')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  simulatedDate === '2025-11-01T00:00:00Z'
                    ? 'bg-slate-950 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                }`}
              >
                Survey 1 Finished (~Day 235)
              </button>

              <button
                onClick={() => handleSimulateDate('2026-03-11T23:15:00Z')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  simulatedDate === '2026-03-11T23:15:00Z'
                    ? 'bg-slate-950 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                }`}
              >
                1-Year Anniversary (March 11, 2026)
              </button>

              <button
                onClick={() => handleSimulateDate('2027-03-11T23:15:00Z')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  simulatedDate === '2027-03-11T23:15:00Z'
                    ? 'bg-slate-950 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                }`}
              >
                2-Year Prime Mission Complete (730 Days)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
