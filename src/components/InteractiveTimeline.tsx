import React, { useState } from 'react';
import { MissionMilestone, MissionPhase } from '../types';
import { Clock, Calendar, CheckCircle2, AlertCircle, ChevronRight, Sparkles, MapPin, ZoomIn } from 'lucide-react';

interface InteractiveTimelineProps {
  milestones: MissionMilestone[];
  plainEnglishMode: boolean;
  onSelectMilestoneImage?: (milestone: MissionMilestone) => void;
}

export const InteractiveTimeline: React.FC<InteractiveTimelineProps> = ({
  milestones,
  plainEnglishMode,
  onSelectMilestoneImage,
}) => {
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [activeMilestoneId, setActiveMilestoneId] = useState<string>(
    milestones.find(m => m.status === 'current')?.id || milestones[0]?.id || ''
  );

  const filteredMilestones = milestones.filter(m => {
    if (selectedPhase === 'all') return true;
    return m.phase === selectedPhase;
  });

  const activeMilestone = milestones.find(m => m.id === activeMilestoneId) || milestones[0];

  const getPhaseBadge = (phase: MissionPhase) => {
    switch (phase) {
      case 'concept':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'development':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'testing':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'launch':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'operations':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'future':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-8" id="interactive-timeline-section">
      {/* Header & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold mb-2">
            <Clock className="w-3.5 h-3.5 text-sky-600" />
            CHRONOLOGICAL MISSION ARCHIVE • 2015 TO 2027
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            Interactive Mission Milestones
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            {plainEnglishMode
              ? "Follow the journey from an idea on paper in 2015, through building and shaking the spacecraft, to rocket launch and exploring the universe today."
              : "Comprehensive verification of NASA's lifecycle phases: proposal, formulation, hardware fabrication, environmental testing, orbital insertion, and nominal science operations."}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all', label: 'All Milestones' },
            { id: 'concept', label: 'Genesis & Selection' },
            { id: 'development', label: 'Hardware Assembly' },
            { id: 'testing', label: 'Extreme Testing' },
            { id: 'launch', label: 'Rocket Launch' },
            { id: 'operations', label: 'Active Science' },
            { id: 'future', label: 'Future Maps' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedPhase(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedPhase === tab.id
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:text-slate-950 hover:bg-slate-50 border border-slate-200 shadow-2xs'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Milestone Spotlight Box */}
      {activeMilestone && (
        <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Image Column */}
            <div className="lg:col-span-5 relative group rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video lg:aspect-4/3 shadow-2xs">
              <img
                src={activeMilestone.imageUrl}
                alt={activeMilestone.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                <span className="bg-white/95 backdrop-blur text-slate-900 px-2.5 py-1 rounded-md border border-slate-200 font-mono text-[11px] font-bold shadow-xs">
                  NASA ID: {activeMilestone.nasaId || 'JPL-SPHEREx'}
                </span>
                {onSelectMilestoneImage && (
                  <button
                    onClick={() => onSelectMilestoneImage(activeMilestone)}
                    className="flex items-center gap-1 bg-slate-950 hover:bg-slate-800 text-white px-2.5 py-1 rounded-md text-xs font-semibold shadow cursor-pointer transition-colors"
                  >
                    <ZoomIn className="w-3.5 h-3.5 text-sky-400" />
                    Enlarge Photo
                  </button>
                )}
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getPhaseBadge(activeMilestone.phase)}`}>
                  {activeMilestone.phaseLabel}
                </span>
                <span className="text-xs font-mono text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200 flex items-center gap-1 font-semibold">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  {activeMilestone.displayDate}
                </span>
                {activeMilestone.status === 'current' && (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    ACTIVE CURRENT STATUS
                  </span>
                )}
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
                {activeMilestone.title}
              </h3>
              <p className="text-sm font-semibold text-sky-800">
                {activeMilestone.headline}
              </p>

              {/* Plain English Highlight Card */}
              <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80 space-y-2 text-amber-950 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  In Plain English: What Happened?
                </div>
                <p className="text-sm leading-relaxed text-amber-950 font-normal">
                  {activeMilestone.plainEnglishWhatHappened}
                </p>
              </div>

              {/* Why It Matters To You */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <span className="font-bold text-slate-900 block">
                  Why This Matters to Everyday People:
                </span>
                <p className="text-slate-600 leading-relaxed">
                  {activeMilestone.whyItMattersToYou}
                </p>
              </div>

              {activeMilestone.location && (
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Location: {activeMilestone.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chronological Milestone Track */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-950 flex items-center gap-2">
          <span>All Major Mission Steps ({filteredMilestones.length})</span>
          <span className="text-xs font-normal text-slate-500">Click any step to inspect</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMilestones.map((m, idx) => {
            const isSelected = m.id === activeMilestoneId;

            return (
              <div
                key={m.id}
                onClick={() => setActiveMilestoneId(m.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 text-left ${
                  isSelected
                    ? 'bg-white border-slate-950 shadow-md ring-1 ring-slate-950'
                    : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-semibold">
                      {m.displayDate}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getPhaseBadge(m.phase)}`}>
                      {m.phaseLabel}
                    </span>
                  </div>

                  {/* Thumbnail and Title */}
                  <div className="flex gap-3 items-start">
                    <img
                      src={m.imageUrl}
                      alt={m.title}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100"
                      loading="lazy"
                    />
                    <div>
                      <h4 className="font-bold text-slate-950 text-sm leading-snug">
                        {m.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                        {plainEnglishMode ? m.plainEnglishWhatHappened : m.summary}
                      </p>
                    </div>
                  </div>

                  {/* Plain English Highlight snippet */}
                  <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/70 text-xs">
                    <span className="font-bold text-amber-900 block mb-0.5 text-[11px] flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      Takeaway:
                    </span>
                    <p className="text-[12px] text-slate-700 leading-relaxed">
                      {m.whyItMattersToYou}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono text-[11px]">
                    Step {idx + 1} of {filteredMilestones.length}
                  </span>
                  <span className={`font-semibold flex items-center gap-1 ${isSelected ? 'text-slate-950' : 'text-slate-500'}`}>
                    {isSelected ? 'Selected' : 'View Details'}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
