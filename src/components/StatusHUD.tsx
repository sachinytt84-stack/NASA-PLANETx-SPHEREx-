import React, { useState, useEffect } from 'react';
import { Telescope, Globe, Sparkles, Droplets, Sun, Compass, Radio, ArrowRight, ShieldCheck, ThermometerSnowflake, Calculator } from 'lucide-react';
import { MissionTelemetry } from '../types';
import { TimeInOrbitSection } from './TimeInOrbitSection';
import { calculateManualTimeInOrbit } from '../data/orbitCalculator';

interface StatusHUDProps {
  telemetry: MissionTelemetry | null;
  plainEnglishMode: boolean;
  onExploreTimeline: () => void;
  onExploreFeeds: () => void;
  onExploreGuide: () => void;
}

export const StatusHUD: React.FC<StatusHUDProps> = ({
  telemetry,
  plainEnglishMode,
  onExploreTimeline,
  onExploreFeeds,
  onExploreGuide,
}) => {
  // Compute manual time in orbit live right here
  const [manualCalc, setManualCalc] = useState(() => calculateManualTimeInOrbit());

  useEffect(() => {
    const timer = setInterval(() => {
      setManualCalc(calculateManualTimeInOrbit());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollToTimeInOrbit = () => {
    const el = document.getElementById('time-in-orbit-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-10">
      {/* Hero Banner / Status Intro */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 lg:p-10 shadow-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-100/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-50/60 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Hero Text */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              OFFICIAL NASA ASTROPHYSICS MISSION • LAUNCHED MARCH 2025
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 leading-tight">
              Mapping the Cosmos in <br />
              <span className="text-sky-700">
                102 Invisible Colors
              </span>
            </h1>

            {plainEnglishMode ? (
              <div className="p-5 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-amber-950 space-y-2 shadow-2xs">
                <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  What is SPHEREx in Everyday Words?
                </div>
                <p className="text-sm sm:text-base leading-relaxed text-amber-900/90">
                  Imagine a special space camera in orbit around Earth that doesn't just photograph normal visible light, but maps the entire night sky in <strong>102 different shades of invisible heat</strong>. It is surveying <strong>450 million galaxies</strong>, searching for frozen water and the raw ingredients of life in deep space, and revealing how our universe puffed up like a balloon in the first moments of the Big Bang!
                </p>
              </div>
            ) : (
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                NASA's <strong>SPHEREx</strong> (Spectro-Photometer for the History of the Universe, Epoch of Reionization, and Ices Explorer) is executing an unprecedented near-infrared all-sky spectral survey. Operating from a 650-kilometer sun-synchronous polar orbit, it captures spectrophotometric data from 0.75 to 5.0 microns across four complete sky maps over its prime mission.
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreTimeline}
                className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-semibold text-sm shadow-xs flex items-center gap-2 transition-all cursor-pointer group"
              >
                <span>Explore Mission Milestones</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreFeeds}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-200 shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <Radio className="w-4 h-4 text-sky-600" />
                <span>Pre-Installed Photos & Feeds</span>
              </button>

              <button
                onClick={onExploreGuide}
                className="px-5 py-2.5 rounded-xl bg-amber-50/80 hover:bg-amber-100/70 text-amber-900 font-semibold text-sm border border-amber-200/80 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Plain English Guide</span>
              </button>
            </div>
          </div>

          {/* Quick Real-Time Status Card */}
          <div className="lg:col-span-5 bg-slate-50/80 rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-600 flex items-center gap-1.5 font-bold">
                <Globe className="w-4 h-4 text-sky-600" />
                Orbital Mission Telemetry
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Systems Nominal
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Manually Calculated Time in Orbit Card */}
              <button
                onClick={scrollToTimeInOrbit}
                className="bg-white p-3.5 rounded-xl border border-slate-200/80 hover:border-sky-300 shadow-2xs text-left cursor-pointer transition-all group"
                title="Click to view detailed manual calculation breakdown"
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-500 font-medium">Time in Orbit</div>
                  <Calculator className="w-3.5 h-3.5 text-sky-600 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-2xl font-black text-slate-950 font-mono mt-1">
                  {manualCalc.days} <span className="text-xs font-normal text-slate-500">days</span>
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                  <span>✓ Manual Calculation</span>
                </div>
              </button>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                <div className="text-xs text-slate-500 font-medium">All-Sky Progress</div>
                <div className="text-2xl font-black text-slate-950 font-mono mt-1">
                  Round {manualCalc.currentSurveyRound}
                </div>
                <div className="text-[11px] text-indigo-700 font-semibold mt-1">
                  {manualCalc.surveyProgressPercent}% of Round {manualCalc.currentSurveyRound}
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                <div className="text-xs text-slate-500 font-medium">Daily Pictures</div>
                <div className="text-xl font-black text-slate-950 font-mono mt-1">
                  ~3,600
                </div>
                <div className="text-[11px] text-slate-500 mt-1">~{(manualCalc.totalExposuresEstimated / 1000000).toFixed(1)}M taken</div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                <div className="text-xs text-slate-500 font-medium">Passive Temp</div>
                <div className="text-xl font-black text-sky-700 font-mono mt-1 flex items-center gap-1">
                  <ThermometerSnowflake className="w-4 h-4 text-sky-600" />
                  -350°F
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Cryogenic 80 Kelvin</div>
              </div>
            </div>

            {/* Orbit & Scanning summary */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 text-xs text-slate-700 space-y-1.5 shadow-2xs">
              <div className="flex justify-between font-mono">
                <span className="text-slate-500">Orbit Altitude:</span>
                <span className="text-slate-900 font-semibold">650 km (Sun-Synchronous)</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-slate-500">Orbital Period:</span>
                <span className="text-slate-900 font-semibold">97.4 minutes per lap</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-slate-500">Primary Partner:</span>
                <span className="text-slate-900 font-semibold">Caltech / NASA JPL / BAE Systems</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pre-Installed Manual Calculation Feature Section */}
      <TimeInOrbitSection plainEnglishMode={plainEnglishMode} />

      {/* The 3 Big Scientific Questions */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-950 flex items-center gap-2">
              <Compass className="w-6 h-6 text-sky-600" />
              The 3 Big Questions SPHEREx Answers
            </h2>
            <p className="text-sm text-slate-600">
              {plainEnglishMode
                ? "Here is what this $250 million NASA observatory means for ordinary people:"
                : "The primary science goals of the NASA SPHEREx Medium Explorer investigation:"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Pillar 1 */}
          <div className="rounded-2xl bg-white border border-slate-200/90 p-6 space-y-4 hover:border-slate-300 hover:shadow-md transition-all group shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold uppercase text-amber-800 tracking-wider">
                Pillar 1 • The Beginning of Time
              </div>
              <h3 className="text-lg font-bold text-slate-950 mt-1">
                How Did the Big Bang Happen?
              </h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {plainEnglishMode
                ? "In the first split-second after the Big Bang, the universe stretched faster than light. SPHEREx maps 450 million galaxies to find the fossil ripples left behind by that explosion."
                : "Measuring primordial non-Gaussianity to test inflationary physics and determine whether cosmic inflation was driven by single-field or multi-field mechanics."}
            </p>
            <div className="pt-3 border-t border-slate-100 text-xs text-amber-800 font-medium">
              Everyday takeaway: Explaining why galaxies exist at all instead of empty space.
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="rounded-2xl bg-white border border-slate-200/90 p-6 space-y-4 hover:border-slate-300 hover:shadow-md transition-all group shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 group-hover:scale-105 transition-transform">
              <Sun className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold uppercase text-sky-800 tracking-wider">
                Pillar 2 • The Cosmic Dawn
              </div>
              <h3 className="text-lg font-bold text-slate-950 mt-1">
                When Did the First Stars Turn On?
              </h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {plainEnglishMode
                ? "The early universe was cold, dark, and foggy. When the very first stars sparked to life, their light burned through the fog, lighting up the entire cosmos for the first time."
                : "Probing the Epoch of Reionization (EoR) by isolating spatial fluctuations in the Extragalactic Background Light across 102 near-infrared wavelengths."}
            </p>
            <div className="pt-3 border-t border-slate-100 text-xs text-sky-800 font-medium">
              Everyday takeaway: Watching the universe switch on its very first light bulbs.
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="rounded-2xl bg-white border border-slate-200/90 p-6 space-y-4 hover:border-slate-300 hover:shadow-md transition-all group shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 group-hover:scale-105 transition-transform">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold uppercase text-indigo-800 tracking-wider">
                Pillar 3 • Life & Water
              </div>
              <h3 className="text-lg font-bold text-slate-950 mt-1">
                Where Did Earth's Water Come From?
              </h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {plainEnglishMode
                ? "Every glass of water you drink might have come from space! SPHEREx surveys our galaxy to find giant frozen clouds of water, carbon dioxide, and methanol where planets form."
                : "Quantifying the abundance and distribution of biogenic ices (H2O, CO2, CO, CH3OH) across millions of interstellar clouds, dense cores, and protoplanetary disks."}
            </p>
            <div className="pt-3 border-t border-slate-100 text-xs text-indigo-800 font-medium">
              Everyday takeaway: Discovering if the recipe for oceans is common around other stars.
            </div>
          </div>
        </div>
      </div>

      {/* How SPHEREx Works in 3 Everyday Analogies */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Telescope className="w-5 h-5 text-sky-600" />
            <h3 className="text-lg font-bold text-slate-950">How SPHEREx Works: 3 Simple Inventions</h3>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline font-medium">Crafted by Caltech & NASA JPL</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-900 font-bold flex items-center justify-center shrink-0 shadow-2xs">
              1
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-950 text-sm">Three Giant Umbrellas</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Three shiny aluminum cone shields bounce away heat from the Sun and Earth, keeping the optics at -350°F (-210°C) without heavy liquid helium coolant tanks!
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-900 font-bold flex items-center justify-center shrink-0 shadow-2xs">
              2
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-950 text-sm">102 Rainbow Filters</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rather than standard red, green, and blue, special gradient glass filters sort heat rays into 102 distinct colors, reading the unique chemical fingerprint of every star.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-900 font-bold flex items-center justify-center shrink-0 shadow-2xs">
              3
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-950 text-sm">Four Full Sky Scans</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Like a paint roller covering a wall, SPHEREx sweeps across the entire sky every 6 months, generating a full 360° 3D cosmic map four times over its two-year mission.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
