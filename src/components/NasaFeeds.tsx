import React, { useState, useMemo } from 'react';
import { NasaFeedItem } from '../types';
import { Search, RefreshCw, Radio, Sparkles, ZoomIn, Calendar, Building, BookOpen, Image as ImageIcon, ArrowRight, CheckCircle2 } from 'lucide-react';

interface NasaFeedsProps {
  items: NasaFeedItem[];
  isLoading: boolean;
  onRefresh: () => void;
  plainEnglishMode: boolean;
  onSelectImage: (item: NasaFeedItem) => void;
  onAskAiAboutItem?: (item: NasaFeedItem) => void;
  onViewAllPhotos?: () => void;
}

export const NasaFeeds: React.FC<NasaFeedsProps> = ({
  items,
  isLoading,
  onRefresh,
  plainEnglishMode,
  onSelectImage,
  onAskAiAboutItem,
  onViewAllPhotos,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showRawDescription, setShowRawDescription] = useState<Record<string, boolean>>({});

  const categories = ['All', 'Science & Cosmos', 'Spacecraft & Engineering', 'Testing & Prep', 'Launch & Operations'];

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCat;

      const matchesSearch =
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.plainEnglishSummary.toLowerCase().includes(q) ||
        item.nasaId.toLowerCase().includes(q) ||
        item.keywords.some(k => k.toLowerCase().includes(q));

      return matchesCat && matchesSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  const toggleRawDesc = (id: string) => {
    setShowRawDescription(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-6" id="nasa-official-feeds-section">
      {/* Feed Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            PRE-INSTALLED ARCHIVE • ALL 159 NASA PHOTOS BUNDLED • OFFLINE READY
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            Official NASA SPHEREx Imagery & Releases
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            {plainEnglishMode
              ? "All official photos and releases from NASA and JPL are pre-installed into the app with clear everyday English explanations—no waiting for live network feeds."
              : "Pre-installed complete archive from NASA's official media repository, spanning initial assembly, cleanroom acoustics, Falcon 9 launch, and all-sky observations."}
          </p>
        </div>

        {/* Action button */}
        <div className="flex flex-wrap items-center gap-2">
          {onViewAllPhotos && (
            <button
              onClick={onViewAllPhotos}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
              <span>Browse All {items.length} Photos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-200 shadow-2xs transition-colors cursor-pointer"
            title="Reset filters and reload pre-installed archive"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
            <span>Reset View</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search */}
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search NASA feed by keyword, topic (e.g. Vela, Shield, Falcon)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-950 focus:ring-1 focus:ring-slate-950 shadow-2xs"
          />
        </div>

        {/* Categories */}
        <div className="md:col-span-7 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-950 hover:bg-slate-50 border border-slate-200 shadow-2xs'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Feeds Count & Metadata */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Showing {filteredItems.length} official NASA releases</span>
        <span className="flex items-center gap-1.5 font-medium text-amber-800">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          Plain-English summaries active by default
        </span>
      </div>

      {/* Grid of Feed Items */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
          <Radio className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-950">No items match your search</h3>
          <p className="text-sm text-slate-500">Try clearing the search query or selecting a different category.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-semibold hover:bg-slate-50 shadow-2xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => {
            const isRaw = showRawDescription[item.id];

            return (
              <div
                key={item.id}
                className="rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 hover:shadow-md transition-all flex flex-col overflow-hidden shadow-xs group"
              >
                {/* NASA Photo Container */}
                <div className="relative aspect-video bg-slate-100 overflow-hidden border-b border-slate-200">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* Badges on Image */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-white/95 text-slate-900 border border-slate-200 shadow-2xs backdrop-blur">
                      {item.nasaId}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-900/90 text-white backdrop-blur">
                      {item.category}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectImage(item)}
                    className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-slate-950/90 hover:bg-slate-950 text-white border border-slate-700 text-xs font-medium flex items-center gap-1 shadow cursor-pointer transition-colors"
                    title="View full resolution NASA photo"
                  >
                    <ZoomIn className="w-3.5 h-3.5 text-sky-400" />
                    <span className="text-[11px] pr-1">Full Image</span>
                  </button>
                </div>

                {/* Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {new Date(item.date).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building className="w-3 h-3 text-slate-400" />
                        {item.center}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-950 text-base leading-snug group-hover:text-sky-800 transition-colors">
                      {item.title}
                    </h3>

                    {/* Explanatory Block */}
                    {isRaw ? (
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block font-bold">
                          Official NASA Archive Description:
                        </span>
                        <p className="text-xs text-slate-600 leading-relaxed max-h-36 overflow-y-auto pr-1">
                          {item.description}
                        </p>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200/80 text-amber-950 space-y-2 shadow-2xs">
                        <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            Plain English Breakdown:
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed text-amber-950">
                          {item.plainEnglishSummary}
                        </p>
                        <div className="pt-1.5 border-t border-amber-200 text-[11px] text-amber-900 font-medium">
                          <strong>Why it matters:</strong> {item.plainEnglishKeyTakeaway}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Controls */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => toggleRawDesc(item.id)}
                      className="text-slate-600 hover:text-slate-950 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      {isRaw ? 'Show Plain English' : 'Show Technical Text'}
                    </button>

                    {onAskAiAboutItem && (
                      <button
                        onClick={() => onAskAiAboutItem(item)}
                        className="text-indigo-700 hover:text-indigo-900 font-semibold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        Explain with AI
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
