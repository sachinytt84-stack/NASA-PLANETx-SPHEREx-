import React from 'react';
import { Telescope, Radio, Clock, Sparkles, BookOpen, Layers, Orbit, Image as ImageIcon } from 'lucide-react';
import { MissionTelemetry } from '../types';

interface NavbarProps {
  activeTab: 'overview' | 'timeline' | 'feeds' | 'photos' | 'transit' | 'guide' | 'assistant';
  setActiveTab: (tab: 'overview' | 'timeline' | 'feeds' | 'photos' | 'transit' | 'guide' | 'assistant') => void;
  telemetry: MissionTelemetry | null;
  plainEnglishMode: boolean;
  setPlainEnglishMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  telemetry,
  plainEnglishMode,
  setPlainEnglishMode,
}) => {
  return (
    <header id="main-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Telemetry Bar */}
      <div className="bg-slate-50 border-b border-slate-200/80 px-4 py-1.5 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              MISSION ACTIVE: {telemetry ? telemetry.currentPhase : 'All-Sky Survey Phase'}
            </span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="hidden sm:flex items-center gap-1 text-slate-500 font-medium">
              <Radio className="w-3.5 h-3.5 text-sky-600" />
              650 km Sun-Synchronous Polar Orbit
            </span>
          </div>

          <div className="flex items-center gap-3">
            {telemetry && (
              <>
                <span
                  title="Calculated manually from March 11, 2025 launch epoch: (Current Time - Launch) / 86,400,000"
                  className="font-mono text-slate-800 bg-white px-2.5 py-0.5 rounded-md border border-slate-200 shadow-2xs font-semibold text-[11px] flex items-center gap-1 cursor-default"
                >
                  <span className="text-emerald-600">⚡</span>
                  <span>DAY {telemetry.missionDurationDays} IN SPACE</span>
                  <span className="text-[9px] text-slate-400 font-sans hidden sm:inline">(MANUAL CALC)</span>
                </span>
                <span className="hidden md:inline text-slate-500 text-[11px]">
                  ~{telemetry.dailyImagesTaken.toLocaleString()} exposures/day
                </span>
                <span className="font-mono text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 font-semibold text-[11px]">
                  159 PRE-INSTALLED PHOTOS
                </span>
                <span className="font-mono text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200 font-semibold text-[11px] hidden lg:inline">
                  ZERO ONLINE API KEYS NEEDED
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Identity */}
          <button
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-3 group text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-white shadow-sm group-hover:bg-slate-800 transition-colors">
              <Telescope className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-950 tracking-tight text-lg">
                  NASA <span className="text-sky-600 font-black">SPHEREx</span>
                </span>
                <span className="bg-slate-100 text-slate-700 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded tracking-wider border border-slate-200">
                  Mission Explorer
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                All-Sky Infrared Cosmic Survey & Official Feeds
              </p>
            </div>
          </button>

          {/* Navigation Items */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/90">
            <button
              id="nav-overview"
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-white text-slate-950 font-bold shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              Overview & Status
            </button>

            <button
              id="nav-timeline"
              onClick={() => setActiveTab('timeline')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'timeline'
                  ? 'bg-white text-slate-950 font-bold shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
              }`}
            >
              <Clock className="w-4 h-4" />
              Mission Timeline
            </button>

            <button
              id="nav-feeds"
              onClick={() => setActiveTab('feeds')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'feeds'
                  ? 'bg-white text-slate-950 font-bold shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
              }`}
            >
              <Radio className="w-4 h-4" />
              NASA Feeds & Gallery
            </button>

            <button
              id="nav-photos"
              onClick={() => setActiveTab('photos')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'photos'
                  ? 'bg-white text-slate-950 font-bold shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-sky-600" />
              <span>All SPHEREx Photos</span>
            </button>

            <button
              id="nav-transit"
              onClick={() => setActiveTab('transit')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'transit'
                  ? 'bg-white text-slate-950 font-bold shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
              }`}
            >
              <Orbit className="w-4 h-4 text-sky-600" />
              <span>Planet Transit Lab</span>
              <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-1.5 py-0.5 rounded-full">New</span>
            </button>

            <button
              id="nav-guide"
              onClick={() => setActiveTab('guide')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'guide'
                  ? 'bg-white text-slate-950 font-bold shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Plain English Guide
            </button>

            <button
              id="nav-assistant"
              onClick={() => setActiveTab('assistant')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'assistant'
                  ? 'bg-white text-slate-950 font-bold shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Ask SPHEREx
            </button>
          </nav>

          {/* Plain English Mode Toggle */}
          <div className="flex items-center gap-2">
            <button
              id="toggle-plain-english"
              onClick={() => setPlainEnglishMode(!plainEnglishMode)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                plainEnglishMode
                  ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
              title="Toggle between everyday plain language and technical NASA terminology"
            >
              <Sparkles className={`w-3.5 h-3.5 ${plainEnglishMode ? 'text-amber-600 fill-amber-600/20' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">Plain English:</span>
              <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${plainEnglishMode ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {plainEnglishMode ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex lg:hidden overflow-x-auto py-2.5 gap-1.5 border-t border-slate-200/80 no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'overview' ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'timeline' ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Milestone Timeline
          </button>
          <button
            onClick={() => setActiveTab('feeds')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'feeds' ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            NASA Feeds
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors flex items-center gap-1 ${
              activeTab === 'photos' ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ImageIcon className="w-3 h-3 text-sky-400" />
            <span>All Photos</span>
          </button>
          <button
            onClick={() => setActiveTab('transit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors flex items-center gap-1 ${
              activeTab === 'transit' ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Orbit className="w-3 h-3 text-sky-400" />
            <span>Transit Lab</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'guide' ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Plain English Guide
          </button>
          <button
            onClick={() => setActiveTab('assistant')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'assistant' ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Ask AI
          </button>
        </div>
      </div>
    </header>
  );
};
