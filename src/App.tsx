import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StatusHUD } from './components/StatusHUD';
import { InteractiveTimeline } from './components/InteractiveTimeline';
import { NasaFeeds } from './components/NasaFeeds';
import { PlainEnglishGuide } from './components/PlainEnglishGuide';
import { TelescopeVisualizer } from './components/TelescopeVisualizer';
import { AskSpherexAI } from './components/AskSpherexAI';
import { ImageModal } from './components/ImageModal';
import { SolarSystemTransitLab } from './components/SolarSystemTransitLab';
import { SpherexPhotoArchive } from './components/SpherexPhotoArchive';
import { MissionTelemetry, MissionMilestone, NasaFeedItem, PlainEnglishConcept } from './types';
import { SPHEREX_MILESTONES } from './data/milestonesData';
import { SPHEREX_CONCEPTS } from './data/conceptsData';
import { PREINSTALLED_NASA_FEEDS } from './data/nasaFeedsData';
import { getPreInstalledTelemetry } from './data/orbitCalculator';
import { Telescope, Radio, Clock, Sparkles, BookOpen, ExternalLink, ShieldCheck, Heart, Orbit, ArrowRight, Image as ImageIcon } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'feeds' | 'photos' | 'transit' | 'guide' | 'assistant'>('overview');
  const [plainEnglishMode, setPlainEnglishMode] = useState<boolean>(true); // Default to true for the common man
  // 100% pre-installed telemetry calculated manually from March 11, 2025 launch epoch
  const [telemetry, setTelemetry] = useState<MissionTelemetry>(() => getPreInstalledTelemetry());
  const [milestones, setMilestones] = useState<MissionMilestone[]>(SPHEREX_MILESTONES);
  const [feedItems, setFeedItems] = useState<NasaFeedItem[]>(PREINSTALLED_NASA_FEEDS);
  const [concepts, setConcepts] = useState<PlainEnglishConcept[]>(SPHEREX_CONCEPTS);
  const [isFeedLoading, setIsFeedLoading] = useState<boolean>(false);
  const [selectedModalItem, setSelectedModalItem] = useState<NasaFeedItem | MissionMilestone | null>(null);
  const [assistantInitialTopic, setAssistantInitialTopic] = useState<string>('');

  // Update manually calculated mission telemetry dynamically
  useEffect(() => {
    setTelemetry(getPreInstalledTelemetry());
    const interval = setInterval(() => {
      setTelemetry(getPreInstalledTelemetry());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadFeed = async () => {
    // All 159 photos are pre-installed; immediately load from bundled dataset
    setFeedItems(PREINSTALLED_NASA_FEEDS);
    setIsFeedLoading(false);
  };

  const handleOpenAssistantWithTopic = (topic: string) => {
    setAssistantInitialTopic(`Can you explain "${topic}" in simple everyday words?`);
    setActiveTab('assistant');
  };

  const handleAskAiAboutFeedItem = (item: NasaFeedItem) => {
    setAssistantInitialTopic(`Can you explain the NASA SPHEREx release "${item.title}" in everyday words? What does it show and why does it matter?`);
    setActiveTab('assistant');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      {/* Top Header & Ticker */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        telemetry={telemetry}
        plainEnglishMode={plainEnglishMode}
        setPlainEnglishMode={setPlainEnglishMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-12">
            <StatusHUD
              telemetry={telemetry}
              plainEnglishMode={plainEnglishMode}
              onExploreTimeline={() => setActiveTab('timeline')}
              onExploreFeeds={() => setActiveTab('feeds')}
              onExploreGuide={() => setActiveTab('guide')}
            />

            <TelescopeVisualizer plainEnglishMode={plainEnglishMode} />

            {/* Exoplanet Transit Photometry Feature Card */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-semibold">
                  <Orbit className="w-3.5 h-3.5 text-sky-400" />
                  <span>New Feature: Exoplanet Transit Photometry Lab</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Does a Star Have Planets? Check by Comparing Old & New Brightness Data
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  When alien worlds pass in front of their host stars, the stars momentarily dim and then brighten back up. Compare historic baseline surveys with new SPHEREx 102-color infrared observations for TRAPPIST-1, TOI-700, and more to uncover hidden planetary families.
                </p>
              </div>

              <div className="relative z-10 shrink-0">
                <button
                  onClick={() => setActiveTab('transit')}
                  className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer group"
                >
                  <Orbit className="w-4 h-4 text-sky-600 group-hover:rotate-45 transition-transform" />
                  <span>Launch Planet Transit Lab</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Milestones Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-sky-600" />
                  <h3 className="text-xl font-bold text-slate-900">
                    Major Mission Milestones
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('timeline')}
                  className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
                >
                  View All {milestones.length} Milestones →
                </button>
              </div>

              <InteractiveTimeline
                milestones={milestones.slice(0, 6)}
                plainEnglishMode={plainEnglishMode}
                onSelectMilestoneImage={m => setSelectedModalItem(m)}
              />
            </div>

            {/* Quick NASA Feeds Preview */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Radio className="w-5 h-5 text-sky-600" />
                  <h3 className="text-xl font-bold text-slate-900">
                    Latest NASA Releases & Images
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab('photos')}
                    className="text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-sky-600" />
                    <span>View All {feedItems.length} Photos →</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('feeds')}
                    className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
                  >
                    Browse Releases →
                  </button>
                </div>
              </div>

              <NasaFeeds
                items={feedItems.slice(0, 6)}
                isLoading={isFeedLoading}
                onRefresh={loadFeed}
                plainEnglishMode={plainEnglishMode}
                onSelectImage={item => setSelectedModalItem(item)}
                onAskAiAboutItem={handleAskAiAboutFeedItem}
                onViewAllPhotos={() => setActiveTab('photos')}
              />
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <InteractiveTimeline
            milestones={milestones}
            plainEnglishMode={plainEnglishMode}
            onSelectMilestoneImage={m => setSelectedModalItem(m)}
          />
        )}

        {activeTab === 'feeds' && (
          <NasaFeeds
            items={feedItems}
            isLoading={isFeedLoading}
            onRefresh={loadFeed}
            plainEnglishMode={plainEnglishMode}
            onSelectImage={item => setSelectedModalItem(item)}
            onAskAiAboutItem={handleAskAiAboutFeedItem}
            onViewAllPhotos={() => setActiveTab('photos')}
          />
        )}

        {activeTab === 'photos' && (
          <SpherexPhotoArchive
            items={feedItems}
            isLoading={isFeedLoading}
            onRefresh={loadFeed}
            plainEnglishMode={plainEnglishMode}
            onSelectImage={item => setSelectedModalItem(item)}
            onAskAiAboutItem={handleAskAiAboutFeedItem}
          />
        )}

        {activeTab === 'transit' && (
          <SolarSystemTransitLab
            plainEnglishMode={plainEnglishMode}
            onAskAiAboutSystem={handleOpenAssistantWithTopic}
          />
        )}

        {activeTab === 'guide' && (
          <PlainEnglishGuide
            concepts={concepts}
            onOpenAssistantWithTopic={handleOpenAssistantWithTopic}
          />
        )}

        {activeTab === 'assistant' && (
          <AskSpherexAI initialTopic={assistantInitialTopic} />
        )}
      </main>

      {/* High-Resolution NASA Image Modal */}
      <ImageModal
        item={selectedModalItem}
        onClose={() => setSelectedModalItem(null)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-slate-50/80 py-8 px-4 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2 text-slate-900 font-semibold">
              <Telescope className="w-4 h-4 text-sky-600" />
              <span>NASA SPHEREx Mission Explorer</span>
              <span className="text-slate-300">|</span>
              <span className="text-amber-800 text-[11px] font-mono bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Accessible Edition for Everyone</span>
            </div>
            <p className="text-slate-500">
              Feeds, imagery, and mission information sourced from the NASA Image and Video Library, NASA Jet Propulsion Laboratory (JPL), and California Institute of Technology (Caltech).
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-600">
            <a
              href="https://www.jpl.nasa.gov/missions/spherex"
              target="_blank"
              rel="noreferrer"
              className="hover:text-sky-600 flex items-center gap-1 transition-colors font-medium"
            >
              <span>NASA JPL SPHEREx</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://spherex.caltech.edu"
              target="_blank"
              rel="noreferrer"
              className="hover:text-sky-600 flex items-center gap-1 transition-colors font-medium"
            >
              <span>Caltech SPHEREx</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://images.nasa.gov"
              target="_blank"
              rel="noreferrer"
              className="hover:text-sky-600 flex items-center gap-1 transition-colors font-medium"
            >
              <span>NASA Images API</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
