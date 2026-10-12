import React, { useState, useEffect, useRef, useId } from 'react';
import {
  Orbit,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  ArrowRight,
  TrendingDown,
  Info,
  Sliders,
  Eye,
  Radio,
  ExternalLink,
  ChevronRight,
  Atom,
  ChevronDown
} from 'lucide-react';
import { StellarSystemTransit, TransitDataPoint } from '../types';
import { SOLAR_SYSTEM_TRANSITS } from '../data/solarSystemsData';

interface SolarSystemTransitLabProps {
  plainEnglishMode: boolean;
  onAskAiAboutSystem?: (topic: string) => void;
}

export const SolarSystemTransitLab: React.FC<SolarSystemTransitLabProps> = ({
  plainEnglishMode,
  onAskAiAboutSystem,
}) => {
  const [systems] = useState<StellarSystemTransit[]>(SOLAR_SYSTEM_TRANSITS);
  const [selectedSystemId, setSelectedSystemId] = useState<string>('trappist-1');
  const [currentTimeHours, setCurrentTimeHours] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [comparisonMode, setComparisonMode] = useState<'side-by-side' | 'overlay' | 'difference'>('overlay');
  const [wavelengthMode, setWavelengthMode] = useState<'optical' | 'infrared'>('infrared');
  const [hoveredPoint, setHoveredPoint] = useState<TransitDataPoint | null>(null);
  const [showHowItWorks, setShowHowItWorks] = useState<boolean>(false);
  const [showSandbox, setShowSandbox] = useState<boolean>(false);

  // Sandbox State
  const [sandboxStarSize, setSandboxStarSize] = useState<'red_dwarf' | 'sun_like' | 'blue_giant'>('red_dwarf');
  const [sandboxPlanetSize, setSandboxPlanetSize] = useState<'earth' | 'neptune' | 'jupiter'>('earth');
  const [sandboxOrbitTilt, setSandboxOrbitTilt] = useState<number>(0); // 0 = transiting (edge-on), 60 = tilted (no transit)

  const selectedSystem = systems.find(s => s.id === selectedSystemId) || systems[0];

  // Unique IDs for SVG gradients and clip paths
  const componentId = useId().replace(/:/g, '');
  const starGlowId = `star-glow-${componentId}`;
  const starGradId = `star-grad-${componentId}`;
  const oldFillGradId = `old-fill-grad-${componentId}`;
  const newFillGradId = `new-fill-grad-${componentId}`;
  const diffFillGradId = `diff-fill-grad-${componentId}`;

  // Animation frame loop
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    const loop = (now: number) => {
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      if (isPlaying) {
        setCurrentTimeHours(prev => {
          let next = prev + delta * 1.5 * playbackSpeed;
          if (next > 6.0) next = -6.0;
          return next;
        });
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    lastTimeRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, playbackSpeed]);

  // Current interpolated brightness for the animated time
  const getCurrentInterpolatedFlux = () => {
    const points = selectedSystem.dataPoints;
    if (!points || points.length === 0) return { oldFlux: 100, newFlux: 100 };

    // Find closest points
    let p1 = points[0];
    let p2 = points[points.length - 1];

    for (let i = 0; i < points.length - 1; i++) {
      if (currentTimeHours >= points[i].timeHours && currentTimeHours <= points[i + 1].timeHours) {
        p1 = points[i];
        p2 = points[i + 1];
        break;
      }
    }

    const tSpan = p2.timeHours - p1.timeHours;
    const factor = tSpan > 0 ? (currentTimeHours - p1.timeHours) / tSpan : 0;
    const oldFlux = p1.brightnessOld + (p2.brightnessOld - p1.brightnessOld) * factor;
    let newFlux = p1.brightnessNew + (p2.brightnessNew - p1.brightnessNew) * factor;

    // SPHEREx IR mode enhancement: atmospheric absorption dip if applicable
    if (wavelengthMode === 'infrared' && selectedSystem.infraredAtmosphereNote && selectedSystem.maxTransitDipPercent > 0) {
      const dt = Math.abs(currentTimeHours);
      if (dt < selectedSystem.transitDurationHours / 2) {
        newFlux -= 0.08; // Slight additional infrared absorption from water vapor/atmosphere
      }
    }

    return { oldFlux, newFlux };
  };

  const { oldFlux, newFlux } = getCurrentInterpolatedFlux();
  const currentDimmingPercent = Math.max(0, oldFlux - newFlux);

  // SVG Chart Dimensions
  const chartWidth = 720;
  const chartHeight = 220;
  const padding = { top: 20, right: 30, bottom: 35, left: 55 };
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;

  // Chart Y-axis range
  const minDip = selectedSystem.maxTransitDipPercent > 0 ? 100 - selectedSystem.maxTransitDipPercent * 1.25 : 99.7;
  const yMin = Math.min(97.0, minDip);
  const yMax = 100.25;

  const getX = (t: number) => padding.left + ((t - (-6)) / (6 - (-6))) * plotWidth;
  const getY = (flux: number) => padding.top + ((yMax - flux) / (yMax - yMin)) * plotHeight;

  // Generate SVG path for Old and New data
  const oldPathData = selectedSystem.dataPoints.map((p, idx) => {
    const x = getX(p.timeHours);
    const y = getY(p.brightnessOld);
    return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');

  const newPathData = selectedSystem.dataPoints.map((p, idx) => {
    const x = getX(p.timeHours);
    const y = getY(p.brightnessNew);
    return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');

  // Shaded delta path between old and new
  const diffAreaPath = (() => {
    if (selectedSystem.maxTransitDipPercent <= 0) return '';
    const forward = selectedSystem.dataPoints.map((p, idx) => {
      const x = getX(p.timeHours);
      const y = getY(p.brightnessOld);
      return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');

    const backward = [...selectedSystem.dataPoints].reverse().map(p => {
      const x = getX(p.timeHours);
      const y = getY(p.brightnessNew);
      return `L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');

    return `${forward} ${backward} Z`;
  })();

  // Calculate Sandbox values
  const sandboxStarRadius = sandboxStarSize === 'red_dwarf' ? 0.2 : sandboxStarSize === 'sun_like' ? 1.0 : 2.5;
  const sandboxPlanetRadius = sandboxPlanetSize === 'earth' ? 0.01 : sandboxPlanetSize === 'neptune' ? 0.04 : 0.10;
  const isSandboxTransiting = Math.abs(sandboxOrbitTilt) < 15;
  const sandboxDipPercent = isSandboxTransiting
    ? Math.round(Math.pow(sandboxPlanetRadius / sandboxStarRadius, 2) * 10000) / 100
    : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Section Header */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-sky-50 via-indigo-50/30 to-transparent rounded-full -mr-24 -mt-24 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200/80 text-sky-800 text-xs font-semibold">
              <Orbit className="w-3.5 h-3.5 text-sky-600 animate-spin-slow" />
              <span>Solar System Transit Photometry Lab</span>
              <span className="text-slate-300">•</span>
              <span className="font-mono text-sky-700">SPHEREx Infrared Method</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Compare Old & New Star Data to Detect Planets
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              How do NASA scientists know if a distant solar system has planets? When an unseen world crosses in front of its home star, the star <span className="font-semibold text-slate-900 underline decoration-sky-400 decoration-2 underline-offset-2">momentarily dims</span> and then <span className="font-semibold text-slate-900 underline decoration-amber-400 decoration-2 underline-offset-2">brightens back up</span>. Compare past baseline records with new SPHEREx infrared surveys to see the proof yourself.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowHowItWorks(!showHowItWorks)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                showHowItWorks
                  ? 'bg-amber-100 text-amber-950 border border-amber-300 shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>How It Works for Beginners</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showHowItWorks ? 'rotate-180' : ''}`} />
            </button>

            <button
              onClick={() => setShowSandbox(!showSandbox)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                showSandbox
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs'
              }`}
            >
              <Sliders className="w-4 h-4 text-sky-500" />
              <span>{showSandbox ? 'Close Star Sandbox' : 'Try Custom Star Sandbox'}</span>
            </button>
          </div>
        </div>

        {/* Beginner How It Works Drawer */}
        {showHowItWorks && (
          <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-700 animate-in fade-in duration-200">
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-950">
                <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px]">1</span>
                <span>The Star at Full Glow (Old Baseline)</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                When no planet is in front, the star beams at 100% full brightness. Past surveys established this steady reference baseline.
              </p>
            </div>

            <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-950">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px]">2</span>
                <span>The Planet Crosses & Star Dims</span>
              </div>
              <p className="text-amber-900/90 leading-relaxed">
                As the exoplanet passes between the star and our telescope, it blocks a fraction of the starlight. The star dims slightly (like a fly passing a flashlight).
              </p>
            </div>

            <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-950">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">3</span>
                <span>Planet Exits & Star Brightens</span>
              </div>
              <p className="text-emerald-900/90 leading-relaxed">
                Once the planet moves past, the star instantly brightens back to 100%. Comparing Old vs New data confirms the repeating U-shape dip!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Custom Sandbox Drawer */}
      {showSandbox && (
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-800 space-y-6 animate-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider">
                <Sliders className="w-4 h-4" />
                <span>Interactive Stellar Dimming Simulator</span>
              </div>
              <h2 className="text-xl font-extrabold text-white mt-1">
                Build a Custom Solar System & Test Star Dimming
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Adjust star size, planet size, and orbit alignment to see the exact percentage the star will dim.
              </p>
            </div>
            <div className="bg-slate-800/90 border border-slate-700 px-4 py-2 rounded-xl text-right">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Calculated Dimming Depth</div>
              <div className="text-2xl font-black font-mono text-sky-400">
                {sandboxDipPercent.toFixed(2)}%
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1: Star Size */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 space-y-3">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>1. Select Star Size</span>
                <span className="font-mono text-amber-400 text-[11px]">{sandboxStarRadius}x Sun</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSandboxStarSize('red_dwarf')}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer ${
                    sandboxStarSize === 'red_dwarf'
                      ? 'bg-red-500/20 border-2 border-red-500 text-red-200'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-red-500 mx-auto mb-1"></div>
                  <span>Red Dwarf</span>
                  <div className="text-[10px] text-slate-400">Tiny Star</div>
                </button>

                <button
                  onClick={() => setSandboxStarSize('sun_like')}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer ${
                    sandboxStarSize === 'sun_like'
                      ? 'bg-yellow-500/20 border-2 border-yellow-500 text-yellow-200'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-yellow-400 mx-auto mb-1"></div>
                  <span>Sun-like</span>
                  <div className="text-[10px] text-slate-400">Medium Star</div>
                </button>

                <button
                  onClick={() => setSandboxStarSize('blue_giant')}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer ${
                    sandboxStarSize === 'blue_giant'
                      ? 'bg-blue-500/20 border-2 border-blue-500 text-blue-200'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-sky-300 mx-auto mb-1"></div>
                  <span>Giant Star</span>
                  <div className="text-[10px] text-slate-400">Huge Star</div>
                </button>
              </div>
            </div>

            {/* Step 2: Planet Size */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 space-y-3">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>2. Select Planet Size</span>
                <span className="font-mono text-sky-400 text-[11px]">
                  {sandboxPlanetSize === 'earth' ? '1x Earth' : sandboxPlanetSize === 'neptune' ? '4x Earth' : '11x Earth'}
                </span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSandboxPlanetSize('earth')}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer ${
                    sandboxPlanetSize === 'earth'
                      ? 'bg-sky-500/20 border-2 border-sky-400 text-sky-200'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700'
                  }`}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-sky-400 mx-auto mb-2"></div>
                  <span>Earth</span>
                  <div className="text-[10px] text-slate-400">Rocky World</div>
                </button>

                <button
                  onClick={() => setSandboxPlanetSize('neptune')}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer ${
                    sandboxPlanetSize === 'neptune'
                      ? 'bg-indigo-500/20 border-2 border-indigo-400 text-indigo-200'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-indigo-400 mx-auto mb-1"></div>
                  <span>Neptune</span>
                  <div className="text-[10px] text-slate-400">Ice Giant</div>
                </button>

                <button
                  onClick={() => setSandboxPlanetSize('jupiter')}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer ${
                    sandboxPlanetSize === 'jupiter'
                      ? 'bg-amber-500/20 border-2 border-amber-400 text-amber-200'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-amber-400 mx-auto mb-1"></div>
                  <span>Jupiter</span>
                  <div className="text-[10px] text-slate-400">Gas Giant</div>
                </button>
              </div>
            </div>

            {/* Step 3: Orbit Alignment */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 space-y-3">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>3. Orbital View Angle</span>
                <span className="font-mono text-emerald-400 text-[11px]">
                  {isSandboxTransiting ? 'Edge-on (Transits)' : 'Tilted (No Transit)'}
                </span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSandboxOrbitTilt(0)}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer ${
                    isSandboxTransiting
                      ? 'bg-emerald-500/20 border-2 border-emerald-400 text-emerald-200'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700'
                  }`}
                >
                  <span>Direct Line of Sight</span>
                  <div className="text-[10px] text-emerald-300 font-bold mt-1">Crosses Star (Dims)</div>
                </button>

                <button
                  onClick={() => setSandboxOrbitTilt(60)}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer ${
                    !isSandboxTransiting
                      ? 'bg-rose-500/20 border-2 border-rose-400 text-rose-200'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700'
                  }`}
                >
                  <span>Tilted Orbit (60°)</span>
                  <div className="text-[10px] text-rose-300 font-bold mt-1">Misses Star (No Dip)</div>
                </button>
              </div>
            </div>
          </div>

          {/* Sandbox Physics Lesson */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <Atom className="w-5 h-5 text-sky-400 shrink-0" />
              <div>
                <span className="font-bold text-white">The Common Man Physics Formula: </span>
                <span className="text-slate-300">
                  Dimming Depth = (Planet Radius ÷ Star Radius)². A small star (Red Dwarf) dimmed by a Jupiter drops by over 25%! An Earth transiting a Sun only dims it by 0.01%.
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                setShowSandbox(false);
                setSelectedSystemId(sandboxDipPercent > 1.0 ? 'hd-209458' : sandboxDipPercent > 0.3 ? 'trappist-1' : 'toi-700');
              }}
              className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shrink-0 cursor-pointer"
            >
              Find Real NASA Match →
            </button>
          </div>
        </div>
      )}

      {/* System Selector Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
            <Search className="w-4 h-4 text-sky-600" />
            <span>Select a Solar System to Compare Old vs New Data</span>
          </div>
          <span className="text-xs text-slate-500">
            {systems.length} Target Systems in Database
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
          {systems.map(sys => {
            const isSelected = sys.id === selectedSystemId;
            return (
              <button
                key={sys.id}
                onClick={() => {
                  setSelectedSystemId(sys.id);
                  setCurrentTimeHours(0);
                }}
                className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-slate-950 text-white border-slate-950 shadow-md ring-2 ring-sky-400/40 ring-offset-2'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-2xs hover:border-slate-300'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span
                      className="w-3.5 h-3.5 rounded-full inline-block shrink-0 shadow-2xs"
                      style={{ backgroundColor: sys.starColorHex }}
                    />
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                      isSelected
                        ? sys.hasPlanets ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-300'
                        : sys.hasPlanets ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {sys.planetCount > 0 ? `${sys.planetCount} Worlds` : '0 Planets'}
                    </span>
                  </div>

                  <div className="font-extrabold text-xs leading-tight line-clamp-1">
                    {sys.name.split(' ')[0]}
                  </div>

                  <div className={`text-[11px] truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {sys.starType.split(' ')[0]}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/40 text-[10px] font-mono flex items-center justify-between">
                  <span className={isSelected ? 'text-sky-300' : 'text-sky-600 font-semibold'}>
                    {sys.maxTransitDipPercent > 0 ? `-${sys.maxTransitDipPercent}%` : 'Flat 0.0%'}
                  </span>
                  <span className={isSelected ? 'text-slate-400' : 'text-slate-400'}>
                    {sys.distanceLightYears} ly
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Stage: Live Star Visualizer + Dimming Readout */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Stellar Status Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs"
              style={{ backgroundColor: `${selectedSystem.starColorHex}22`, border: `2px solid ${selectedSystem.starColorHex}` }}
            >
              <div
                className="w-6 h-6 rounded-full animate-pulse"
                style={{ backgroundColor: selectedSystem.starColorHex }}
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-950">
                  {selectedSystem.name}
                </h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                  {selectedSystem.starClassification}
                </span>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <span>Constellation: <strong className="text-slate-800">{selectedSystem.constellation}</strong></span>
                <span>•</span>
                <span>Distance: <strong className="text-slate-800">{selectedSystem.distanceLightYears} light-years</strong></span>
                <span>•</span>
                <span>Star Temp: <strong className="text-slate-800">{selectedSystem.starTemperatureKelvin.toLocaleString()} K</strong></span>
              </div>
            </div>
          </div>

          {/* Detection Verdict Pill */}
          <div className="flex items-center gap-2">
            <div className={`px-4 py-2 rounded-2xl border flex items-center gap-2 text-xs font-bold ${
              selectedSystem.detectionVerdict === 'CONFIRMED_PLANETS'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : selectedSystem.detectionVerdict === 'CANDIDATE_ANOMALY'
                ? 'bg-sky-50 border-sky-200 text-sky-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              {selectedSystem.hasPlanets ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600" />
              )}
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider opacity-70">Detection Status</div>
                <div>{selectedSystem.verdictTitle}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Visualizer: Star & Orbiting Planet Simulation */}
        <div className="relative bg-slate-950 rounded-2xl overflow-hidden border border-slate-900 p-4 sm:p-6 shadow-inner">
          {/* Distant space stars background effect */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

          {/* Live Brightness Readout Overlay */}
          <div className="absolute top-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white shadow-lg">
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Live Stellar Flux (Brightness)
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="font-mono text-xl sm:text-2xl font-black text-sky-400">
                {newFlux.toFixed(3)}%
              </span>
              <span className={`text-[11px] font-mono font-bold ${currentDimmingPercent > 0.05 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {currentDimmingPercent > 0.01 ? `▼ -${currentDimmingPercent.toFixed(3)}% DIM` : '▲ 100% FULL GLOW'}
              </span>
            </div>
          </div>

          {/* Simulation SVG Canvas */}
          <div className="w-full h-48 sm:h-64 flex items-center justify-center relative">
            <svg
              className="w-full h-full max-w-3xl"
              viewBox="0 0 800 240"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <radialGradient id={starGlowId} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={selectedSystem.starColorHex} stopOpacity="1" />
                  <stop offset="70%" stopColor={selectedSystem.starColorHex} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={selectedSystem.starColorHex} stopOpacity="0" />
                </radialGradient>

                <radialGradient id={starGradId} cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                  <stop offset="35%" stopColor={selectedSystem.starColorHex} stopOpacity="1" />
                  <stop offset="100%" stopColor={selectedSystem.starColorHex} stopOpacity="0.6" />
                </radialGradient>
              </defs>

              {/* Orbital plane guide line */}
              <line
                x1="60"
                y1={selectedSystem.id === 'proxima-centauri' ? 70 : 120}
                x2="740"
                y2={selectedSystem.id === 'proxima-centauri' ? 70 : 120}
                stroke="#334155"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* Tilted orbit angle annotation for Proxima */}
              {selectedSystem.id === 'proxima-centauri' && (
                <text x="400" y="55" fill="#f87171" fontSize="11" textAnchor="middle" fontWeight="bold">
                  ⚠️ Planet orbit is tilted by ~60° (Passes above star disk - never blocks starlight!)
                </text>
              )}

              {/* Star Outer Corona Glow */}
              <circle
                cx="400"
                cy="120"
                r={selectedSystem.starRadiusSunRatio < 0.2 ? 65 : selectedSystem.starRadiusSunRatio > 1.0 ? 95 : 80}
                fill={`url(#${starGlowId})`}
                opacity="0.75"
              />

              {/* Star Main Disk */}
              <circle
                cx="400"
                cy="120"
                r={selectedSystem.starRadiusSunRatio < 0.2 ? 40 : selectedSystem.starRadiusSunRatio > 1.0 ? 65 : 52}
                fill={`url(#${starGradId})`}
                filter="drop-shadow(0 0 15px rgba(255,255,255,0.4))"
              />

              {/* Subtle Convective Granules on Star Disk */}
              <circle cx="385" cy="115" r="4" fill="#ffffff" opacity="0.3" />
              <circle cx="415" cy="128" r="6" fill="#ffffff" opacity="0.25" />
              <circle cx="395" cy="135" r="5" fill="#ffffff" opacity="0.2" />

              {/* Planet Silhouette & Orbiting Motion */}
              {selectedSystem.hasPlanets && (
                (() => {
                  // Planet X position mapped from currentTimeHours (-6 to +6)
                  const planetX = 400 + (currentTimeHours / 6) * 320;
                  const planetY = 120;
                  const planetRadius = selectedSystem.maxTransitDipPercent > 1.5 ? 15 : selectedSystem.maxTransitDipPercent > 0.5 ? 9 : 5;
                  const starRadius = selectedSystem.starRadiusSunRatio < 0.2 ? 40 : selectedSystem.starRadiusSunRatio > 1.0 ? 65 : 52;
                  const isOverlappingStar = Math.abs(planetX - 400) < starRadius;

                  return (
                    <g transform={`translate(${planetX}, ${planetY})`}>
                      {/* Planetary transit shadow outline */}
                      <circle
                        cx="0"
                        cy="0"
                        r={planetRadius}
                        fill="#090d16"
                        stroke={isOverlappingStar ? '#38bdf8' : '#64748b'}
                        strokeWidth="1.5"
                      />
                      {/* Atmosphere thin halo in infrared */}
                      {isOverlappingStar && selectedSystem.infraredAtmosphereNote && (
                        <circle
                          cx="0"
                          cy="0"
                          r={planetRadius + 3}
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="1"
                          strokeDasharray="2 2"
                          opacity="0.8"
                        />
                      )}
                      {/* Planet Label */}
                      <text
                        x="0"
                        y={planetRadius + 14}
                        fill="#e2e8f0"
                        fontSize="10"
                        textAnchor="middle"
                        fontWeight="bold"
                      >
                        {selectedSystem.planets[0]?.name || 'Exoplanet'}
                      </text>
                    </g>
                  );
                })()
              )}

              {/* Proxima Centauri Tilted Planet Demo */}
              {selectedSystem.id === 'proxima-centauri' && (
                (() => {
                  const planetX = 400 + (currentTimeHours / 6) * 320;
                  const planetY = 70; // High above star!
                  return (
                    <g transform={`translate(${planetX}, ${planetY})`}>
                      <circle cx="0" cy="0" r="7" fill="#1e293b" stroke="#f87171" strokeWidth="1.5" />
                      <text x="0" y="20" fill="#fca5a5" fontSize="10" textAnchor="middle" fontWeight="bold">
                        Proxima b (Misses Star)
                      </text>
                    </g>
                  );
                })()
              )}

              {/* Transit Ingress & Egress Boundaries */}
              {selectedSystem.maxTransitDipPercent > 0 && (
                <>
                  <line
                    x1={400 - (selectedSystem.transitDurationHours / 12) * 320}
                    y1="190"
                    x2={400 - (selectedSystem.transitDurationHours / 12) * 320}
                    y2="205"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                  />
                  <line
                    x1={400 + (selectedSystem.transitDurationHours / 12) * 320}
                    y1="190"
                    x2={400 + (selectedSystem.transitDurationHours / 12) * 320}
                    y2="205"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                  />
                  <text
                    x={400}
                    y="218"
                    fill="#94a3b8"
                    fontSize="10"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    Transit Window: {selectedSystem.transitDurationHours} hrs across star face
                  </text>
                </>
              )}
            </svg>
          </div>

          {/* Interactive Playback and Scrubber Bar */}
          <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-9 h-9 rounded-xl bg-white hover:bg-slate-200 text-slate-950 flex items-center justify-center transition-colors cursor-pointer"
                title={isPlaying ? 'Pause transit motion' : 'Play transit motion'}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950 ml-0.5" />}
              </button>

              <button
                onClick={() => {
                  setCurrentTimeHours(-6);
                  setIsPlaying(true);
                }}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                title="Restart from beginning"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setCurrentTimeHours(0);
                  setIsPlaying(false);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-sky-950/80 hover:bg-sky-900 border border-sky-800 text-sky-300 text-xs font-semibold cursor-pointer"
              >
                Jump to Mid-Transit Dip (0h)
              </button>
            </div>

            {/* Time Scrubber Slider */}
            <div className="flex-1 min-w-[200px] flex items-center gap-3">
              <span className="text-[11px] font-mono text-slate-400">-6h</span>
              <input
                type="range"
                min="-6"
                max="6"
                step="0.05"
                value={currentTimeHours}
                onChange={e => {
                  setCurrentTimeHours(parseFloat(e.target.value));
                  setIsPlaying(false);
                }}
                className="flex-1 accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[11px] font-mono text-slate-400">+6h</span>
            </div>

            {/* Speed Selector */}
            <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl text-xs font-mono text-slate-300">
              {[0.5, 1, 2, 4].map(spd => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                    playbackSpeed === spd ? 'bg-sky-500 text-white font-bold' : 'hover:bg-slate-700'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* COMPARISON CONTROLS & TOGGLES */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          <div>
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-sky-600" />
              <span>Old Data vs New Data Photometric Comparison</span>
            </div>
            <p className="text-xs text-slate-500">
              Inspect how the star's measured flux changed between past archive recordings and SPHEREx's latest observations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Selector */}
            <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center gap-1 text-xs">
              <button
                onClick={() => setComparisonMode('overlay')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  comparisonMode === 'overlay'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Overlay & Delta (Δ)
              </button>
              <button
                onClick={() => setComparisonMode('side-by-side')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  comparisonMode === 'side-by-side'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Side-by-Side View
              </button>
            </div>

            {/* Wavelength Filter Toggle */}
            <button
              onClick={() => setWavelengthMode(wavelengthMode === 'infrared' ? 'optical' : 'infrared')}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                wavelengthMode === 'infrared'
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-900'
                  : 'bg-white border-slate-200 text-slate-700'
              }`}
              title="Toggle between standard optical light and SPHEREx 102-color infrared channels"
            >
              <Radio className="w-3.5 h-3.5 text-indigo-600" />
              <span>SPHEREx IR Channel: {wavelengthMode === 'infrared' ? 'ON (Atmosphere Sensitive)' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* COMPARISON VIEW 1: OVERLAY & DELTA (Scientific overlay graph) */}
        {comparisonMode === 'overlay' && (
          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-4">
              {/* Legend & Current Hover Readout */}
              <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-0.5 bg-slate-400 border border-slate-400 border-dashed" />
                    <span className="font-semibold text-slate-600">Old Data:</span>
                    <span className="text-slate-500">{selectedSystem.oldDataSurveyName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-3 h-1 bg-sky-600 rounded-full" />
                    <span className="font-semibold text-slate-950">New Data:</span>
                    <span className="text-sky-700 font-medium">{selectedSystem.newDataSurveyName}</span>
                  </div>

                  {selectedSystem.maxTransitDipPercent > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-amber-400/30 border border-amber-400/60 rounded" />
                      <span className="text-amber-800 font-semibold">Shaded Area = Blocked Starlight (ΔFlux)</span>
                    </div>
                  )}
                </div>

                {/* Point Readout */}
                <div className="font-mono text-[11px] bg-white px-3 py-1 rounded-lg border border-slate-200 text-slate-700 shadow-2xs">
                  {hoveredPoint ? (
                    <span>
                      Time: <strong>{hoveredPoint.timeHours > 0 ? `+${hoveredPoint.timeHours}` : hoveredPoint.timeHours}h</strong> | Old: <strong>{hoveredPoint.brightnessOld}%</strong> | New: <strong>{hoveredPoint.brightnessNew}%</strong>
                    </span>
                  ) : (
                    <span>
                      Current Frame: <strong>{currentTimeHours > 0 ? `+${currentTimeHours.toFixed(2)}` : currentTimeHours.toFixed(2)}h</strong> | New Flux: <strong className="text-sky-600">{newFlux.toFixed(3)}%</strong>
                    </span>
                  )}
                </div>
              </div>

              {/* Main SVG Light Curve Chart */}
              <div className="w-full overflow-x-auto no-scrollbar">
                <svg
                  className="w-full min-w-[600px] h-60"
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <linearGradient id={diffFillGradId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  {[100.0, 99.5, 99.0, 98.5, 98.0, 97.5].map(val => {
                    if (val < yMin || val > yMax) return null;
                    const y = getY(val);
                    return (
                      <g key={val}>
                        <line
                          x1={padding.left}
                          y1={y}
                          x2={chartWidth - padding.right}
                          y2={y}
                          stroke="#e2e8f0"
                          strokeWidth="1"
                        />
                        <text
                          x={padding.left - 8}
                          y={y + 4}
                          fill="#64748b"
                          fontSize="10"
                          textAnchor="end"
                          fontFamily="monospace"
                        >
                          {val.toFixed(1)}%
                        </text>
                      </g>
                    );
                  })}

                  {/* Vertical Time Grid lines */}
                  {[-6, -4, -2, 0, 2, 4, 6].map(t => {
                    const x = getX(t);
                    return (
                      <g key={t}>
                        <line
                          x1={x}
                          y1={padding.top}
                          x2={x}
                          y2={chartHeight - padding.bottom}
                          stroke="#e2e8f0"
                          strokeWidth="1"
                        />
                        <text
                          x={x}
                          y={chartHeight - padding.bottom + 16}
                          fill="#64748b"
                          fontSize="10"
                          textAnchor="middle"
                          fontFamily="monospace"
                        >
                          {t > 0 ? `+${t}h` : `${t}h`}
                        </text>
                      </g>
                    );
                  })}

                  {/* Mid-Transit vertical marker at 0h */}
                  <line
                    x1={getX(0)}
                    y1={padding.top}
                    x2={getX(0)}
                    y2={chartHeight - padding.bottom}
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />

                  {/* Shaded Area between Old and New data (blocked light) */}
                  {diffAreaPath && (
                    <path
                      d={diffAreaPath}
                      fill={`url(#${diffFillGradId})`}
                    />
                  )}

                  {/* Old Data Curve (Slate dotted) */}
                  <path
                    d={oldPathData}
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />

                  {/* New Data Curve (Sky solid vibrant line) */}
                  <path
                    d={newPathData}
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="2.5"
                  />

                  {/* Animated Live Time Cursor Line */}
                  <line
                    x1={getX(currentTimeHours)}
                    y1={padding.top}
                    x2={getX(currentTimeHours)}
                    y2={chartHeight - padding.bottom}
                    stroke="#0f172a"
                    strokeWidth="2"
                  />
                  <circle
                    cx={getX(currentTimeHours)}
                    cy={getY(newFlux)}
                    r="5"
                    fill="#0284c7"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />

                  {/* Hover interactive overlay markers */}
                  {selectedSystem.dataPoints.map(p => (
                    <circle
                      key={p.timeHours}
                      cx={getX(p.timeHours)}
                      cy={getY(p.brightnessNew)}
                      r="7"
                      fill="transparent"
                      className="cursor-pointer hover:fill-sky-400/40"
                      onMouseEnter={() => setHoveredPoint(p)}
                      onMouseLeave={() => setHoveredPoint(null)}
                      onClick={() => {
                        setCurrentTimeHours(p.timeHours);
                        setIsPlaying(false);
                      }}
                    />
                  ))}
                </svg>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>← Hours before transit ingress</span>
                <span className="font-semibold text-sky-700">0h = Center of Transit (Maximum Dimming)</span>
                <span>Hours after transit egress →</span>
              </div>
            </div>
          </div>
        )}

        {/* COMPARISON VIEW 2: SIDE-BY-SIDE (Old vs New separate side-by-side cards) */}
        {comparisonMode === 'side-by-side' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Old Data Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Old Data Baseline (Archive)
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  {selectedSystem.oldDataDate}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="text-slate-500 font-medium">Instrument / Mission:</div>
                <div className="font-bold text-slate-900">{selectedSystem.oldDataSurveyName}</div>
              </div>

              <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200/80">
                {selectedSystem.oldDataNotes}
              </p>

              {/* Old Data Mini Chart */}
              <div className="bg-white border border-slate-200 rounded-xl p-3 h-36 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 300 100">
                  <line x1="20" y1="50" x2="280" y2="50" stroke="#cbd5e1" strokeDasharray="3 3" />
                  <path
                    d={selectedSystem.dataPoints.map((p, idx) => {
                      const x = 20 + ((p.timeHours + 6) / 12) * 260;
                      const y = 50 + (100 - p.brightnessOld) * 15;
                      return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="2"
                  />
                  <text x="25" y="25" fill="#64748b" fontSize="10" fontFamily="monospace">
                    Mean Flux: 100.00% (No Dip)
                  </text>
                </svg>
              </div>

              <div className="text-[11px] text-slate-500 flex items-center gap-1 font-semibold">
                <Info className="w-3.5 h-3.5 text-slate-400" />
                <span>Reference epoch: Star remained at steady baseline.</span>
              </div>
            </div>

            {/* New Data Card */}
            <div className="bg-sky-50/50 border border-sky-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-sky-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
                  <h3 className="text-sm font-extrabold text-slate-900">
                    New Data (SPHEREx Re-Survey)
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-sky-800 font-bold">
                  {selectedSystem.newDataDate}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="text-slate-500 font-medium">Instrument / Mission:</div>
                <div className="font-bold text-sky-950">{selectedSystem.newDataSurveyName}</div>
              </div>

              <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-sky-100">
                {selectedSystem.newDataNotes}
              </p>

              {/* New Data Mini Chart */}
              <div className="bg-white border border-sky-200 rounded-xl p-3 h-36 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 300 100">
                  <line x1="20" y1="25" x2="280" y2="25" stroke="#e2e8f0" strokeDasharray="3 3" />
                  <path
                    d={selectedSystem.dataPoints.map((p, idx) => {
                      const x = 20 + ((p.timeHours + 6) / 12) * 260;
                      const y = 25 + (100 - p.brightnessNew) * 25;
                      return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="2.5"
                  />
                  <text x="25" y="85" fill="#0284c7" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    {selectedSystem.maxTransitDipPercent > 0
                      ? `Transit Dip: -${selectedSystem.maxTransitDipPercent}% Detected!`
                      : 'Flat Baseline: 0.00% Dip'}
                  </text>
                </svg>
              </div>

              <div className="text-[11px] text-sky-800 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                <span>
                  {selectedSystem.maxTransitDipPercent > 0
                    ? `Transit signature confirmed: Star dimmed for ${selectedSystem.transitDurationHours} hours.`
                    : 'Confirmed: Flat baseline, no planetary crossing.'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* METRIC BADGES: Key Photometric Parameters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Stellar Baseline</div>
            <div className="text-base font-black font-mono text-slate-900 mt-0.5">100.000%</div>
            <div className="text-[10px] text-slate-500">Normal brightness</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Transit Dip Depth</div>
            <div className={`text-base font-black font-mono mt-0.5 ${selectedSystem.maxTransitDipPercent > 0 ? 'text-sky-600' : 'text-slate-600'}`}>
              {selectedSystem.maxTransitDipPercent > 0 ? `-${selectedSystem.maxTransitDipPercent}%` : '0.00%'}
            </div>
            <div className="text-[10px] text-slate-500">Max starlight blocked</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Transit Duration</div>
            <div className="text-base font-black font-mono text-slate-900 mt-0.5">
              {selectedSystem.transitDurationHours > 0 ? `${selectedSystem.transitDurationHours} hrs` : 'N/A'}
            </div>
            <div className="text-[10px] text-slate-500">Ingress to egress</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Confirmed Planets</div>
            <div className="text-base font-black font-mono text-emerald-700 mt-0.5">
              {selectedSystem.planetCount} {selectedSystem.planetCount === 1 ? 'World' : 'Worlds'}
            </div>
            <div className="text-[10px] text-slate-500">In this system</div>
          </div>
        </div>

        {/* PLAIN ENGLISH SCIENTIFIC BREAKDOWN FOR THE COMMON MAN */}
        <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-extrabold text-slate-950 uppercase tracking-wider">
              Plain English Explanation: What the Dimming Means
            </h3>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">
            {selectedSystem.plainEnglishExplanation}
          </p>

          {/* Everyday Analogy Box */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-950">
            <span className="text-lg">💡</span>
            <div>
              <strong className="block font-bold mb-0.5">Everyday Real-Life Analogy:</strong>
              <p className="text-amber-900/90 leading-relaxed">
                {selectedSystem.everydayAnalogy}
              </p>
            </div>
          </div>

          {/* SPHEREx Infrared Superpower Note */}
          {selectedSystem.infraredAtmosphereNote && (
            <div className="bg-indigo-50/80 border border-indigo-200 rounded-xl p-4 flex items-start gap-3 text-xs text-indigo-950">
              <Radio className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold mb-0.5 text-indigo-950">SPHEREx 102-Color Infrared Bonus Discovery:</strong>
                <p className="text-indigo-900/90 leading-relaxed">
                  {selectedSystem.infraredAtmosphereNote}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* LIST OF EXOPLANETS IN THIS SYSTEM */}
        {selectedSystem.planets.length > 0 && (
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Orbit className="w-4 h-4 text-sky-600" />
              <span>Planets Revealed by the Dimming ({selectedSystem.planets.length})</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedSystem.planets.map(planet => (
                <div
                  key={planet.name}
                  className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 hover:border-slate-300 transition-colors shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-950">{planet.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      planet.habitableZoneStatus === 'Inside Habitable Zone'
                        ? 'bg-emerald-100 text-emerald-800'
                        : planet.habitableZoneStatus === 'Too Hot / Scorching'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {planet.habitableZoneStatus}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center gap-3 font-mono">
                    <span>Size: <strong>{planet.radiusEarthRatio}x Earth</strong></span>
                    <span>•</span>
                    <span>Year: <strong>{planet.orbitalPeriodDays} days</strong></span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {planet.plainEnglishDescription}
                  </p>

                  {planet.atmosphereFeatures && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {planet.atmosphereFeatures.map(feat => (
                        <span key={feat} className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                          {feat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ask AI about this system button */}
        {onAskAiAboutSystem && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => onAskAiAboutSystem(`Can you explain the transit light curve and planets of ${selectedSystem.name} in simple everyday terms?`)}
              className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Ask AI About {selectedSystem.name}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
