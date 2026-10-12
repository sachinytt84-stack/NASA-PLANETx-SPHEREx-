import React, { useState } from 'react';
import { PlainEnglishConcept } from '../types';
import { Sparkles, BookOpen, Search } from 'lucide-react';

interface PlainEnglishGuideProps {
  concepts: PlainEnglishConcept[];
  onOpenAssistantWithTopic?: (topic: string) => void;
}

export const PlainEnglishGuide: React.FC<PlainEnglishGuideProps> = ({
  concepts,
  onOpenAssistantWithTopic,
}) => {
  const [activeConceptId, setActiveConceptId] = useState<string>(concepts[0]?.id || 'three-pillars-1');
  const [jargonFilter, setJargonFilter] = useState<string>('');

  const activeConcept = concepts.find(c => c.id === activeConceptId) || concepts[0];

  const allJargon = concepts.flatMap(c => c.technicalJargonTranslated);
  const filteredJargon = allJargon.filter(
    j =>
      j.term.toLowerCase().includes(jargonFilter.toLowerCase()) ||
      j.translation.toLowerCase().includes(jargonFilter.toLowerCase())
  );

  return (
    <div className="space-y-10" id="plain-english-guide-section">
      {/* Intro Header */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 space-y-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-50/60 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            ACCESSIBLE SCIENCE • NO PHYSICS DEGREE REQUIRED
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            SPHEREx in Plain English
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-3xl">
            NASA astrophysics is often full of Greek letters, wavelength formulas, and dense technical jargon. Here, we break down every core discovery and instrument feature into intuitive everyday analogies so anyone can appreciate what this space telescope accomplishes.
          </p>
        </div>
      </div>

      {/* Main Concept Tabs & Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Navigation of Concepts */}
        <div className="lg:col-span-4 space-y-2.5">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold block px-2 mb-2">
            Explore Core Concepts
          </span>
          {concepts.map(concept => {
            const isActive = concept.id === activeConceptId;
            return (
              <button
                key={concept.id}
                onClick={() => setActiveConceptId(concept.id)}
                className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                  isActive
                    ? 'bg-slate-950 border-slate-950 text-white shadow-md'
                    : 'bg-white border-slate-200/90 text-slate-900 hover:border-slate-300 hover:bg-slate-50/80 shadow-2xs'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isActive ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className={`font-bold text-sm leading-snug ${isActive ? 'text-white' : 'text-slate-950'}`}>
                    {concept.title}
                  </h4>
                  <p className={`text-xs mt-1 line-clamp-1 ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                    {concept.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Side: Detailed Concept Breakdown Card */}
        {activeConcept && (
          <div className="lg:col-span-8 rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="space-y-1.5">
              <span className="text-xs font-mono font-bold uppercase text-amber-800 tracking-wider">
                Common Sense Deep Dive
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
                {activeConcept.title}
              </h3>
              <p className="text-sm font-semibold text-sky-800">
                {activeConcept.subtitle}
              </p>
            </div>

            {/* Simple Analogy Box */}
            <div className="p-5 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-amber-950 space-y-2 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600" />
                The Simple Everyday Analogy
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-amber-950 italic font-medium">
                "{activeConcept.simpleAnalogy}"
              </p>
            </div>

            {/* In-depth explanation */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                How It Works:
              </h4>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                {activeConcept.commonManExplanation}
              </p>
            </div>

            {/* Why it matters */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 space-y-1">
              <span className="text-xs font-bold text-sky-800 uppercase tracking-wider block">
                Why this matters to you and humanity:
              </span>
              <p className="text-sm text-slate-600 leading-relaxed">
                {activeConcept.whyItMattersToUs}
              </p>
            </div>

            {/* Jargon Translation for this concept */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                Astronomer Jargon Translated into Simple Words:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeConcept.technicalJargonTranslated.map((j, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="text-xs font-bold text-slate-950 font-mono">
                      {j.term}
                    </div>
                    <div className="text-xs text-slate-600">
                      {j.translation}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ask AI about this topic button */}
            {onOpenAssistantWithTopic && (
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => onOpenAssistantWithTopic(activeConcept.title)}
                  className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  Ask AI to Explain More About This
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Jargon Decoder Section */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-950 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-sky-600" />
              NASA SPHEREx Jargon Decoder
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Quick translation dictionary of confusing space words commonly used in NASA press releases.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search jargon term..."
              value={jargonFilter}
              onChange={e => setJargonFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-950 focus:bg-white transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJargon.map((j, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-1.5 text-slate-950 font-bold text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                {j.term}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {j.translation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
